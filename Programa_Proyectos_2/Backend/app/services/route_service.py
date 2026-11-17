from datetime import datetime, timezone
from time import perf_counter
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy import select

from app.models import Client, Driver, Order, Parameter, Route, Vehicle
from app.schemas.parameter import ParameterBase
from app.schemas.route import RouteResponse


class RouteService:
    def __init__(self, db, opt_service, val_service):
        self.db, self.opt_service, self.val_service = db, opt_service, val_service

    async def populate_client_names(self, plans, orders):
        client_names = dict(
            (
                await self.db.execute(
                    select(Client.id, Client.name).where(
                        Client.id.in_({o.client_id for o in orders})
                    )
                )
            ).all()
        )
        names_by_order = {str(o.id): client_names.get(o.client_id, "") for o in orders}
        for plan in plans:
            for stop in plan["stops"]:
                stop["clientName"] = names_by_order.get(stop["orderId"], "")

    async def reoptimize(self, route_id, reason):
        snapshot = await self.db.get(Route, route_id)
        if snapshot is None:
            raise HTTPException(404, "Ruta no encontrada")
        # Match planning resource locks before taking the route and order locks.
        driver = await self.db.get(Driver, snapshot.driver_id, with_for_update=True)
        vehicle = await self.db.get(Vehicle, snapshot.vehicle_id, with_for_update=True)
        route = (
            await self.db.execute(
                select(Route)
                .where(Route.id == route_id)
                .with_for_update()
                .execution_options(populate_existing=True)
            )
        ).scalar_one_or_none()
        if route is None:
            raise HTTPException(404, "Ruta no encontrada")
        if route.status not in ("pending", "preparing"):
            raise HTTPException(409, "Solo se reoptimizan rutas sin iniciar")
        orders = list(
            (
                await self.db.execute(
                    select(Order)
                    .where(Order.route_id == str(route_id))
                    .order_by(Order.id)
                    .with_for_update()
                )
            ).scalars()
        )
        if not orders or any(o.status != "planned" for o in orders):
            raise HTTPException(
                409, "La ruta debe contener pedidos planificados sin procesar"
            )
        if not driver or not vehicle or not driver.available or not vehicle.available:
            raise HTTPException(409, "Los recursos de la ruta no están disponibles")
        if driver.status != "available" or vehicle.status != "available":
            raise HTTPException(409, "Los recursos de la ruta no están disponibles")
        if any(
            o.delivery_date != route.date
            or o.restrictions
            or o.requires_phone_coordination
            for o in orders
        ):
            raise HTTPException(
                409, "Los pedidos requieren revisión manual antes de reoptimizar"
            )
        params = (
            (await self.db.execute(select(Parameter).order_by(Parameter.id)))
            .scalars()
            .first()
        )
        result = await self.opt_service.generate_routes(
            {
                "date": route.date,
                "drivers": [driver],
                "vehicles": [vehicle],
                "orders": orders,
                "parameters": ParameterBase.model_validate(params)
                if params
                else ParameterBase(),
            }
        )
        if result.metrics["errors"] or len(result.routes) != 1:
            raise HTTPException(409, "No se encontró un plan factible para esta ruta")
        await self.populate_client_names(result.routes, orders)
        plan = result.routes[0]
        previous_distance, previous_emissions = (
            float(route.total_distance_km),
            float(route.emissions_kg_co2),
        )
        positions = {s["orderId"]: s["order"] for s in route.stops}
        reordered = sum(
            positions.get(s["orderId"]) != s["order"] for s in plan["stops"]
        )
        # Preserve route lifecycle state and identity while updating the plan atomically.
        for field, value in plan.items():
            if field != "status":
                setattr(route, field, value)
        sequence = {s["orderId"]: s["order"] for s in plan["stops"]}
        for order in orders:
            order.delivery_order = sequence[str(order.id)]
        await self.db.commit()
        return {
            "routeId": str(route.id),
            "routeCode": route.code,
            "previousDistance": previous_distance,
            "newDistance": float(route.total_distance_km),
            "distanceSaved": round(
                previous_distance - float(route.total_distance_km), 3
            ),
            "previousEmissions": previous_emissions,
            "newEmissions": float(route.emissions_kg_co2),
            "emissionsSaved": round(
                previous_emissions - float(route.emissions_kg_co2), 3
            ),
            "stopsReordered": reordered,
            "reason": reason,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    async def generate(self, payload):
        start = perf_counter()
        context = await self.val_service.load(
            payload["order_ids"],
            payload["vehicle_ids"],
            payload["driver_ids"],
            payload["date"],
            lock=True,
        )
        errors = context["errors"]
        plans = []
        if not errors:
            result = await self.opt_service.generate_routes(context)
            errors.extend(result.metrics["errors"])
            plans = result.routes
        saved = []
        if not errors:
            await self.populate_client_names(plans, context["orders"])
            orders = {str(o.id): o for o in context["orders"]}
            for plan in plans:
                uid = uuid4()
                route = Route(id=uid, code=f"R-{uid.hex.upper()}", **plan)
                self.db.add(route)
                driver = next(d for d in context["drivers"] if d.id == route.driver_id)
                vehicle = next(
                    v for v in context["vehicles"] if v.id == route.vehicle_id
                )
                driver.vehicle_id, vehicle.driver_id = vehicle.id, driver.id
                for stop in plan["stops"]:
                    order = orders[stop["orderId"]]
                    order.status, order.route_id = "planned", str(uid)
                    order.driver_id, order.delivery_order = (
                        route.driver_id,
                        stop["order"],
                    )
                saved.append(route)
            await self.db.commit()
        else:
            await self.db.rollback()
        return {
            "routes": [
                RouteResponse.model_validate(r).model_dump(mode="json") for r in saved
            ],
            "generation_time_ms": int((perf_counter() - start) * 1000),
            "valid": not errors,
            "errors": errors,
        }
