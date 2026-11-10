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
                leg = distance(batch[-1], order) if batch else 0
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
                if (
                    end - start > p.max_operation_time_h * 60
                    or km + leg > p.max_distance_km
                ):
                    continue
                now = end
                km += leg
                weight += float(order.weight_kg)
                volume += float(order.volume_m3)
                batch.append(order)
                remaining.remove(order)
            if batch:
                routes.append(
                    {
                        "driver_id": driver.id,
                        "vehicle_id": vehicle.id,
                        "date": context["date"],
                        "departure_time": clock(start),
                        "estimated_arrival_time": clock(now),
                        "estimated_time_min": now - start,
                        "total_distance_km": round(km, 3),
                        "emissions_kg_co2": round(
                            km * float(vehicle.emissions_per_km), 3
                        ),
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
