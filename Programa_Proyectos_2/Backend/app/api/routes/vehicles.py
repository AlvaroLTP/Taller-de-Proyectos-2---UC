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
from app.models import Vehicle
from app.schemas.vehicle import (
    VehicleBase,
    VehicleCreate,
    VehicleResponse,
    VehicleUpdate,
)

router = APIRouter(prefix="/api/v1/vehicles")


@router.get("/", response_model=list[VehicleResponse])
async def list_records(
    user: CurrentUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return (
        (await db.execute(scoped(Vehicle, user).order_by(Vehicle.id))).scalars().all()
    )


@router.get("/{id}", response_model=VehicleResponse)
async def get_one(
    id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_record(db, Vehicle, id, user)


@router.post("/", response_model=VehicleResponse, status_code=201)
async def create(
    data: VehicleCreate,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    if data.driver_id:
        raise HTTPException(422, "Asigne el conductor después de crear el vehículo")
    obj = Vehicle(**data.model_dump())
    db.add(obj)
    return await save(db, obj)


@router.put("/{id}", response_model=VehicleResponse)
@router.patch("/{id}", response_model=VehicleResponse)
async def update(
    id: UUID,
    data: VehicleUpdate,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    if "driver_id" in data.model_fields_set:
        raise HTTPException(422, "Use el endpoint de asignación")
    obj = await get_record(db, Vehicle, id, user, lock=True)
    await ensure_resource_editable(db, obj)
    validated_patch(obj, data, VehicleBase)
    return await save(db, obj)


@router.delete("/{id}")
async def delete(
    id: UUID,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    obj = await get_record(db, Vehicle, id, user, lock=True)
    await db.delete(obj)
    await db.commit()
    return {"status": "deleted"}
