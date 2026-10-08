from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from typing import List
import uuid

router = APIRouter(prefix='/api/v1/vehicles', tags=['vehicles'])

@router.get('/', response_model=List[VehicleResponse])
async def list_vehicles(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Vehicle))
    return res.scalars().all()

@router.get('/{id}', response_model=VehicleResponse)
async def get_vehicle(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    v = await db.get(Vehicle, id)
    if not v:
        raise HTTPException(status_code=404, detail='Not found')
    return v

@router.post('/', response_model=VehicleResponse, status_code=201)
async def create_vehicle(data: VehicleCreate, db: AsyncSession = Depends(get_db)):
    v = Vehicle(**data.model_dump())
    db.add(v)
    await db.commit()
    await db.refresh(v)
    return v

@router.put('/{id}', response_model=VehicleResponse)
async def update_vehicle(id: uuid.UUID, data: VehicleUpdate, db: AsyncSession = Depends(get_db)):
    v = await db.get(Vehicle, id)
    if not v:
        raise HTTPException(status_code=404, detail='Not found')
    for k, val in data.model_dump().items():
        setattr(v, k, val)
    await db.commit()
    await db.refresh(v)
    return v

@router.delete('/{id}')
async def delete_vehicle(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    v = await db.get(Vehicle, id)
    if not v:
        raise HTTPException(status_code=404, detail='Not found')
    await db.delete(v)
    await db.commit()
    return {'status': 'deleted'}