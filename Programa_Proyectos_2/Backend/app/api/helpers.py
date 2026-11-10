from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy import select

from app.models import Client, Driver, Order, Route, Vehicle


def scoped(model, user):
    stmt = select(model)
    if user.role != "driver":
        return stmt
    if model is Driver:
        return stmt.where(Driver.id == user.driver_id)
    if model is Vehicle:
        return stmt.where(
            Vehicle.id.in_(select(Driver.vehicle_id).where(Driver.id == user.driver_id))
        )
    if model is Client:
        return stmt.where(
            Client.id.in_(
                select(Order.client_id).where(Order.driver_id == user.driver_id)
            )
        )
    return stmt.where(model.driver_id == user.driver_id)


async def get_record(db, model, id, user, lock=False):
    stmt = (
        scoped(model, user)
        .where(model.id == id)
        .execution_options(populate_existing=True)
    )
    if lock:
        stmt = stmt.with_for_update()
    obj = (await db.execute(stmt)).scalar_one_or_none()
    if obj is None:
        raise HTTPException(404, "No encontrado")
    return obj


def validated_patch(obj, data, schema):
    changes = data.model_dump(exclude_unset=True)
    merged = {key: getattr(obj, key) for key in schema.model_fields}
    merged.update(changes)
    try:
        schema.model_validate(merged)
    except ValidationError:
        raise HTTPException(
            422, "La actualización incumple las restricciones del registro"
        ) from None
    for key, value in changes.items():
        setattr(obj, key, value)
    return changes


async def save(db, obj):
    await db.commit()
    await db.refresh(obj)
    return obj


async def ensure_resource_editable(db, obj):
    condition = (
        Route.driver_id == obj.id
        if isinstance(obj, Driver)
        else Route.vehicle_id == obj.id
    )
    active = (
        await db.execute(
            select(Route.id).where(
                condition, Route.status.notin_(["finished", "with_incidents"])
            )
        )
    ).first()
    if active:
        raise HTTPException(409, "El recurso tiene una ruta activa")
