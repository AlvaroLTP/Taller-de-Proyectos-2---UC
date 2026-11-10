from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.helpers import (
    ensure_resource_editable,
    get_record,
    save,
    scoped,
    validated_patch,
)
from app.core.database import get_db
from app.core.security import CurrentUser, get_current_user, require_staff
from app.models import Driver
from app.schemas.driver import DriverBase, DriverCreate, DriverResponse, DriverUpdate

router = APIRouter(prefix="/api/v1/drivers")


@router.get("/", response_model=list[DriverResponse])
async def list_records(
    user: CurrentUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return (await db.execute(scoped(Driver, user).order_by(Driver.id))).scalars().all()


@router.get("/{id}", response_model=DriverResponse)
async def get_one(
    id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_record(db, Driver, id, user)


@router.post("/", response_model=DriverResponse, status_code=201)
async def create(
    data: DriverCreate,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    if data.vehicle_id:
        raise HTTPException(422, "Asigne el vehículo después de crear el conductor")
    obj = Driver(**data.model_dump())
    db.add(obj)
    return await save(db, obj)


@router.put("/{id}", response_model=DriverResponse)
@router.patch("/{id}", response_model=DriverResponse)
async def update(
    id: UUID,
    data: DriverUpdate,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    if "vehicle_id" in data.model_fields_set:
        raise HTTPException(422, "Use el endpoint de asignación")
    obj = await get_record(db, Driver, id, user, lock=True)
    await ensure_resource_editable(db, obj)
    validated_patch(obj, data, DriverBase)
    return await save(db, obj)


@router.delete("/{id}")
async def delete(
    id: UUID,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    obj = await get_record(db, Driver, id, user, lock=True)
    await db.delete(obj)
    await db.commit()
    return {"status": "deleted"}


from sqlalchemy import or_, select

from app.models import Route, Vehicle
from app.schemas.base import InputModel


class VehicleAssignment(InputModel):
    vehicle_id: UUID


@router.put("/{id}/vehicle", response_model=DriverResponse)
async def assign_vehicle(
    id: UUID,
    data: VehicleAssignment,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    # Lock in a fixed order, including the old relationships.
    drivers = (
        (await db.execute(select(Driver).order_by(Driver.id).with_for_update()))
        .scalars()
        .all()
    )
    vehicles = (
        (await db.execute(select(Vehicle).order_by(Vehicle.id).with_for_update()))
        .scalars()
        .all()
    )
    driver = next((d for d in drivers if d.id == id), None)
    vehicle = next((v for v in vehicles if v.id == data.vehicle_id), None)
    if not driver or not vehicle:
        raise HTTPException(404, "Conductor o vehículo no encontrado")
    affected_drivers = {
        d.id for d in drivers if d.id == id or d.vehicle_id == vehicle.id
    }
    affected_vehicles = {
        v.id for v in vehicles if v.id == vehicle.id or v.driver_id == id
    }
    active = (
        await db.execute(
            select(Route.id).where(
                Route.status.notin_(["finished", "with_incidents"]),
                or_(
                    Route.driver_id.in_(affected_drivers),
                    Route.vehicle_id.in_(affected_vehicles),
                ),
            )
        )
    ).first()
    if active:
        raise HTTPException(409, "No se puede reasignar un recurso con ruta activa")
    for d in drivers:
        if d.vehicle_id == vehicle.id:
            d.vehicle_id = None
    for v in vehicles:
        if v.driver_id == id:
            v.driver_id = None
    # Release previous unique links before assigning the new pair.
    await db.flush()
    driver.vehicle_id = vehicle.id
    vehicle.driver_id = driver.id
    return await save(db, driver)
