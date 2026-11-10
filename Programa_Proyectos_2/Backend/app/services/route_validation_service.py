from sqlalchemy import or_, select

from app.models import Driver, Order, Parameter, Route, Vehicle
from app.schemas.parameter import ParameterBase


class RouteValidationService:
    def __init__(self, db):
        self.db = db

    async def load(self, order_ids, vehicle_ids, driver_ids, date, lock=False):
        context = {"date": date}
        # All callers take resource locks in the same order.
        for key, model, ids in [
            ("drivers", Driver, driver_ids),
            ("vehicles", Vehicle, vehicle_ids),
            ("orders", Order, order_ids),
        ]:
            stmt = select(model).where(model.id.in_(ids)).order_by(model.id)
            if lock:
                stmt = stmt.with_for_update()
            context[key] = list((await self.db.execute(stmt)).scalars().all())
        params = (
            (await self.db.execute(select(Parameter).order_by(Parameter.id)))
            .scalars()
            .first()
        )
        context["parameters"] = (
            ParameterBase.model_validate(params) if params else ParameterBase()
        )
        active = (
            (
                await self.db.execute(
                    select(Route).where(
                        Route.date == date,
                        Route.status.notin_(["finished", "with_incidents"]),
                        or_(
                            Route.driver_id.in_(driver_ids),
                            Route.vehicle_id.in_(vehicle_ids),
                        ),
                    )
                )
            )
            .scalars()
            .all()
        )
        errors = []
        for key, ids in [
            ("orders", order_ids),
            ("vehicles", vehicle_ids),
            ("drivers", driver_ids),
        ]:
            if not ids:
                errors.append(f"No se seleccionaron {key}")
            if len(ids) != len(set(ids)):
                errors.append(f"Identificadores duplicados en {key}")
            if len(context[key]) != len(ids):
                errors.append(f"Hay {key} inexistentes")
        if active:
            errors.append("Hay recursos asignados a otra ruta activa en esa fecha")
        for item in context["drivers"] + context["vehicles"]:
            if not item.available or item.status != "available":
                errors.append(f"Recurso no disponible: {item.id}")
        for order in context["orders"]:
            if order.status != "pending" or order.route_id:
                errors.append(
                    f"El pedido {order.code} ya está asignado o no está pendiente"
                )
            if order.delivery_date != date:
                errors.append(f"Fecha incompatible: {order.code}")
            if order.restrictions or order.requires_phone_coordination:
                errors.append(
                    f"{order.code}: las restricciones de texto o coordinación requieren revisión manual antes de planificar"
                )
        context["errors"] = errors
        return context

    async def validate(self, order_ids, vehicle_ids, driver_ids, date):
        from app.services.optimization_service import BasicOptimizationService

        context = await self.load(order_ids, vehicle_ids, driver_ids, date)
        if not context["errors"]:
            result = await BasicOptimizationService().generate_routes(context)
            context["errors"].extend(result.metrics["errors"])
        return {
            "valid": not context["errors"],
            "errors": context["errors"],
            "warnings": [],
        }
