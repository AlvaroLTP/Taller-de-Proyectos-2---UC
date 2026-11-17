from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.helpers import get_record, save, scoped, validated_patch
from app.core.database import get_db
from app.core.security import CurrentUser, get_current_user, require_staff
from app.models import Order
from app.schemas.order import OrderBase, OrderCreate, OrderResponse, OrderUpdate

router = APIRouter(prefix="/api/v1/orders")


@router.get("/", response_model=list[OrderResponse])
async def list_records(
    user: CurrentUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return (await db.execute(scoped(Order, user).order_by(Order.id))).scalars().all()


@router.get("/{id}", response_model=OrderResponse)
async def get_one(
    id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_record(db, Order, id, user)


@router.post("/", response_model=OrderResponse, status_code=201)
async def create(
    data: OrderCreate,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    if data.status != "pending" or data.route_id or data.driver_id:
        raise HTTPException(
            422, "Los pedidos nuevos deben estar pendientes y sin asignar"
        )
    obj = Order(**data.model_dump())
    db.add(obj)
    return await save(db, obj)


@router.put("/{id}", response_model=OrderResponse)
@router.patch("/{id}", response_model=OrderResponse)
async def update(
    id: UUID,
    data: OrderUpdate,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    if {"status", "route_id", "driver_id", "delivery_order"} & data.model_fields_set:
        raise HTTPException(422, "Use los endpoints de planificación y estado")
    obj = await get_record(db, Order, id, user, lock=True)
    if obj.status != "pending":
        raise HTTPException(409, "Solo se editan pedidos pendientes")
    validated_patch(obj, data, OrderBase)
    return await save(db, obj)


@router.delete("/{id}")
async def delete(
    id: UUID,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    obj = await get_record(db, Order, id, user, lock=True)
    if obj.status != "pending" or obj.route_id:
        raise HTTPException(409, "No se elimina un pedido asignado o procesado")
    await db.delete(obj)
    await db.commit()
    return {"status": "deleted"}


from datetime import datetime, timezone

from app.models import Route
from app.schemas.order import OrderStatusUpdate
from app.schemas.preferences import Preferences, Restrictions


@router.put("/{id}/status", response_model=OrderResponse)
async def update_status(
    id: UUID,
    data: OrderStatusUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Match the route -> orders lock order used by dispatch and route deletion.
    snapshot = await get_record(db, Order, id, user)
    route = (
        await db.get(Route, UUID(snapshot.route_id), with_for_update=True)
        if snapshot.route_id
        else None
    )
    obj = await get_record(db, Order, id, user, lock=True)
    transitions = {
        "pending": {"cancelled"},
        "planned": {"in_route", "cancelled"},
        "in_route": {"delivered", "not_delivered"},
        "not_delivered": set(),
        "delivered": set(),
        "cancelled": set(),
    }
    if user.role == "driver" and data.status == "cancelled":
        raise HTTPException(403, "Solo operaciones puede cancelar pedidos")
    if data.status != obj.status and data.status not in transitions.get(
        obj.status, set()
    ):
        raise HTTPException(409, "Transición de estado no permitida")
    if data.status == "not_delivered" and not data.incident_reason:
        raise HTTPException(422, "Indique el motivo de la incidencia")
    obj.status = data.status
    if data.status == "delivered" and obj.delivered_at is None:
        obj.delivered_at = datetime.now(timezone.utc)
    obj.incident_reason = data.incident_reason
    obj.incident_notes = data.incident_notes
    if route:
        route.stops = [
            {**stop, "status": obj.status} if stop["orderId"] == str(obj.id) else stop
            for stop in route.stops
        ]
        route.completed_deliveries = sum(
            s["status"] == "delivered" for s in route.stops
        )
    return await save(db, obj)


@router.get("/{id}/preferences")
async def preferences(
    id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    obj = await get_record(db, Order, id, user)
    return {
        "preferred_time": obj.preferred_time,
        "time_window_start": obj.pref_time_window_start,
        "time_window_end": obj.pref_time_window_end,
        "priority": obj.priority,
        "restrictions": obj.restrictions,
        "requires_special_attention": obj.requires_special_attention,
        "no_lunch_hours": obj.no_lunch_hours,
        "requires_phone_coordination": obj.requires_phone_coordination,
        "observations": obj.pref_observations,
    }


@router.put("/{id}/preferences")
async def update_preferences(
    id: UUID,
    data: Preferences,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    obj = await get_record(db, Order, id, user, lock=True)
    if obj.status != "pending":
        raise HTTPException(409, "Solo se modifican preferencias de pedidos pendientes")
    mapping = {
        "time_window_start": "pref_time_window_start",
        "time_window_end": "pref_time_window_end",
        "observations": "pref_observations",
    }
    for key, value in data.model_dump().items():
        setattr(obj, mapping.get(key, key), value)
    await db.commit()
    return {"status": "updated"}


@router.get("/{id}/restrictions")
async def restrictions(
    id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    obj = await get_record(db, Order, id, user)
    return {"restrictions": obj.restrictions}


@router.put("/{id}/restrictions")
async def update_restrictions(
    id: UUID,
    data: Restrictions,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    obj = await get_record(db, Order, id, user, lock=True)
    if obj.status != "pending":
        raise HTTPException(
            409, "Solo se modifican restricciones de pedidos pendientes"
        )
    obj.restrictions = data.restrictions
    await db.commit()
    return {"status": "updated"}
