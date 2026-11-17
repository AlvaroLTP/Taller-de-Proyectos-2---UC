from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.helpers import get_record, save, scoped
from app.core.database import get_db
from app.core.security import CurrentUser, get_current_user, require_staff
from app.models import Order, Route
from app.schemas.route import (
    RouteGenerateRequest,
    RouteGenerateResponse,
    RouteResponse,
    RouteStatusUpdate,
    RouteValidationRequest,
    RouteValidationResponse,
)
from app.services.optimization_service import BasicOptimizationService
from app.services.route_service import RouteService
from app.services.route_validation_service import RouteValidationService

router = APIRouter(prefix="/api/v1/routes")


@router.post(
    "/validate",
    response_model=RouteValidationResponse,
    dependencies=[Depends(require_staff)],
)
async def validate(data: RouteValidationRequest, db: AsyncSession = Depends(get_db)):
    return await RouteValidationService(db).validate(
        data.order_ids, data.vehicle_ids, data.driver_ids, data.date
    )


@router.post(
    "/generate",
    response_model=RouteGenerateResponse,
    dependencies=[Depends(require_staff)],
)
async def generate(data: RouteGenerateRequest, db: AsyncSession = Depends(get_db)):
    return await RouteService(
        db, BasicOptimizationService(), RouteValidationService(db)
    ).generate(data.model_dump())


@router.get("/", response_model=list[RouteResponse])
async def list_routes(
    user: CurrentUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return (await db.execute(scoped(Route, user).order_by(Route.code))).scalars().all()


@router.get("/{id}", response_model=RouteResponse)
async def get_route(
    id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_record(db, Route, id, user)


@router.put("/{id}/status", response_model=RouteResponse)
async def update_status(
    id: UUID,
    data: RouteStatusUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    route = await get_record(db, Route, id, user, lock=True)
    transitions = {
        "pending": {"preparing", "in_route"},
        "preparing": {"in_route"},
        "in_route": {"finished", "with_incidents"},
    }
    if data.status != route.status and data.status not in transitions.get(
        route.status, set()
    ):
        raise HTTPException(409, "Transición de estado no permitida")
    orders = (
        (
            await db.execute(
                select(Order)
                .where(Order.route_id == str(id))
                .order_by(Order.id)
                .with_for_update()
            )
        )
        .scalars()
        .all()
    )
    if data.status in ("finished", "with_incidents"):
        if any(
            o.status not in ("delivered", "not_delivered", "cancelled") for o in orders
        ):
            raise HTTPException(409, "Quedan entregas pendientes")
        if data.status == "finished" and any(o.status != "delivered" for o in orders):
            raise HTTPException(409, "La ruta tiene incidencias")
    if data.status == "in_route":
        for order in orders:
            if order.status == "planned":
                order.status = "in_route"
    route.status = data.status
    statuses = {str(o.id): o.status for o in orders}
    route.stops = [
        {**s, "status": statuses.get(s["orderId"], s["status"])} for s in route.stops
    ]
    route.completed_deliveries = sum(o.status == "delivered" for o in orders)
    return await save(db, route)


@router.delete("/{id}", dependencies=[Depends(require_staff)])
async def delete(
    id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    route = await get_record(db, Route, id, user, lock=True)
    if route.status not in ("pending", "preparing"):
        raise HTTPException(409, "Solo se eliminan rutas sin iniciar")
    orders = (
        (
            await db.execute(
                select(Order).where(Order.route_id == str(id)).with_for_update()
            )
        )
        .scalars()
        .all()
    )
    for order in orders:
        order.status, order.route_id, order.driver_id, order.delivery_order = (
            "pending",
            None,
            None,
            None,
        )
    await db.delete(route)
    await db.commit()
    return {"status": "deleted"}
