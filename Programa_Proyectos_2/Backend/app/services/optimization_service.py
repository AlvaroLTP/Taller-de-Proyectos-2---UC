from math import asin, ceil, cos, radians, sin, sqrt

from app.domain.interfaces.optimization import OptimizationResult
from app.services.validation_service import ValidationService


def minutes(value):
    h, m = map(int, value.split(":"))
    return h * 60 + m


def clock(value):
    return f"{value // 60:02d}:{value % 60:02d}"


def distance(a, b):
    lat1, lon1, lat2, lon2 = map(
        radians, [float(a.lat), float(a.lng), float(b.lat), float(b.lng)]
    )
    return (
        6371
        * 2
        * asin(
            min(
                1,
                sqrt(
                    sin((lat2 - lat1) / 2) ** 2
                    + cos(lat1) * cos(lat2) * sin((lon2 - lon1) / 2) ** 2
                ),
            )
        )
    )


def depot_distance(depot, order):
    class Point:
        def __init__(self, lat, lng):
            self.lat, self.lng = lat, lng

    return distance(Point(*depot), order)


def route_metrics(batch, vehicle, parameters, distance_without_return):
    depot = (
        (float(parameters.depot_lat), float(parameters.depot_lng))
        if parameters.depot_lat is not None and parameters.depot_lng is not None
        else None
    )
    outbound = depot_distance(depot, batch[0]) if depot else None
    return_distance = depot_distance(depot, batch[-1]) if depot else None
    total_distance = distance_without_return + (return_distance or 0)

    remaining_tonnes = sum(float(order.weight_kg) for order in batch) / 1000
    payload_tonne_km = 0
    previous = None
    for order in batch:
        leg = depot_distance(depot, order) if previous is None and depot else (
            distance(previous, order) if previous else 0
        )
        payload_tonne_km += leg * remaining_tonnes
        remaining_tonnes -= float(order.weight_kg) / 1000
        previous = order

    energy_per_km = getattr(vehicle, "energy_kwh_per_km", None)
    energy_kwh = total_distance * float(energy_per_km) if energy_per_km is not None else None
    if vehicle.fuel_type == "electric" and energy_kwh is not None and parameters.electricity_emission_factor_kg_co2e_per_kwh is not None:
        emissions = energy_kwh * float(parameters.electricity_emission_factor_kg_co2e_per_kwh)
        method = "energy_kwh_x_electricity_factor"
    else:
        emissions = total_distance * float(vehicle.emissions_per_km)
        method = "distance_km_x_vehicle_emissions_per_km"
    return {
        "outbound_distance_km": round(outbound, 3) if outbound is not None else None,
        "return_distance_km": round(return_distance, 3) if return_distance is not None else None,
        "total_distance_km": round(total_distance, 3),
        "payload_tonne_km": round(payload_tonne_km, 3),
        "energy_kwh": round(energy_kwh, 3) if energy_kwh is not None else None,
        "emissions_kg_co2": round(emissions, 3),
        "emissions_method": method,
        "emissions_source": getattr(vehicle, "emission_factor_source", None),
    }


class BasicOptimizationService:
    """Deterministic feasible greedy plan; distances are geographic estimates between stops."""

    async def generate_routes(self, context):
        p = context["parameters"]
        remaining = sorted(
            context["orders"],
            key=lambda o: (
                o.time_window_end,
                {"high": 0, "medium": 1, "low": 2}[o.priority],
                str(o.id),
            ),
        )
        vehicles = list(context["vehicles"])
        routes, errors = [], []
        for driver in context["drivers"]:
            vehicle = next(
                (
                    v
                    for v in vehicles
                    if (not driver.vehicle_id or driver.vehicle_id == v.id)
                    and (not v.driver_id or v.driver_id == driver.id)
                ),
                None,
            )
            if vehicle is None:
                continue
            vehicles.remove(vehicle)
            now = start = minutes(driver.shift_start)
            weight = volume = km = 0
            batch = []
            for order in list(remaining):
                if len(batch) >= p.max_deliveries_per_route:
                    break
                if weight + float(order.weight_kg) > min(
                    float(vehicle.capacity_kg),
                    p.max_weight_kg,
                    p.max_vehicle_capacity_kg,
                ):
                    continue
                if volume + float(order.volume_m3) > min(
                    float(vehicle.capacity_m3), p.max_volume_m3
                ):
                    continue
                if not ValidationService.validate_time_window(
                    order.time_window_start, order.time_window_end
                ):
                    continue
                depot = (
                    (float(p.depot_lat), float(p.depot_lng))
                    if p.depot_lat is not None and p.depot_lng is not None
                    else None
                )
                leg = (
                    distance(batch[-1], order)
                    if batch
                    else depot_distance(depot, order) if depot else 0
                )
                service = 20 if order.requires_special_attention else 10
                arrival = max(
                    now + ceil(leg / p.average_speed_km_h * 60),
                    minutes(order.time_window_start),
                    minutes(order.pref_time_window_start),
                )
                if (
                    order.no_lunch_hours
                    and arrival < 14 * 60
                    and arrival + service > 12 * 60
                ):
                    arrival = 14 * 60
                end = arrival + service
                if end > min(
                    minutes(order.time_window_end),
                    minutes(order.pref_time_window_end),
                    minutes(driver.shift_end),
                ):
                    continue
                projected_return = depot_distance(depot, order) if depot else 0
                if (
                    end - start > p.max_operation_time_h * 60
                    or end + ceil(projected_return / p.average_speed_km_h * 60)
                    > minutes(driver.shift_end)
                    or end + ceil(projected_return / p.average_speed_km_h * 60) - start
                    > p.max_operation_time_h * 60
                    or km + leg + projected_return > p.max_distance_km
                ):
                    continue
                now = end
                km += leg
                weight += float(order.weight_kg)
                volume += float(order.volume_m3)
                batch.append(order)
                remaining.remove(order)
            if batch:
                metrics = route_metrics(batch, vehicle, p, km)
                return_minutes = (
                    ceil((metrics["return_distance_km"] or 0) / p.average_speed_km_h * 60)
                    if metrics["return_distance_km"] is not None
                    else 0
                )
                routes.append(
                    {
                        "driver_id": driver.id,
                        "vehicle_id": vehicle.id,
                        "date": context["date"],
                        "departure_time": clock(start),
                        "estimated_arrival_time": clock(now + return_minutes),
                        "estimated_time_min": now + return_minutes - start,
                        **metrics,
                        "total_deliveries": len(batch),
                        "completed_deliveries": 0,
                        "status": "pending",
                        "stops": [
                            {
                                "orderId": str(o.id),
                                "order": i + 1,
                                "clientName": "",
                                "address": o.street,
                                "district": o.district,
                                "lat": float(o.lat),
                                "lng": float(o.lng),
                                "timeWindow": f"{o.time_window_start} - {o.time_window_end}",
                                "status": "planned",
                            }
                            for i, o in enumerate(batch)
                        ],
                    }
                )
        if remaining:
            errors.append(
                "No se encontró un plan factible con la capacidad, asignaciones y horarios seleccionados: "
                + ", ".join(o.code for o in remaining)
            )
        return OptimizationResult(
            routes=routes if not errors else [],
            metrics={"strategy": "greedy_geographic_estimate", "errors": errors},
        )
