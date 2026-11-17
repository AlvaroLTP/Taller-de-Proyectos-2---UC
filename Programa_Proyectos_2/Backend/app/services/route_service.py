from time import perf_counter
from uuid import uuid4

from app.models import Route
from app.schemas.route import RouteResponse


class RouteService:
    def __init__(self, db, opt_service, val_service):
        self.db, self.opt_service, self.val_service = db, opt_service, val_service

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
