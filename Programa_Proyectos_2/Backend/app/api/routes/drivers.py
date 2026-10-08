from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverUpdate, DriverResponse
from typing import List
import uuid

router = APIRouter(prefix='/api/v1/drivers', tags=['drivers'])

@router.get('/', response_model=List[DriverResponse])
async def list_drivers(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Driver))
    return res.scalars().all()

@router.get('/{id}', response_model=DriverResponse)
async def get_driver(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    d = await db.get(Driver, id)
    if not d: raise HTTPException(404, 'Not found')
    return d

@router.post('/', response_model=DriverResponse, status_code=201)
async def create_driver(data: DriverCreate, db: AsyncSession = Depends(get_db)):
    d = Driver(**data.model_dump())
    db.add(d)
    await db.commit()
    await db.refresh(d)
    return d

@router.put('/{id}', response_model=DriverResponse)
async def update_driver(id: uuid.UUID, data: DriverUpdate, db: AsyncSession = Depends(get_db)):
    d = await db.get(Driver, id)
    if not d: raise HTTPException(404, 'Not found')
    for k,v in data.model_dump().items(): setattr(d,k,v)
    await db.commit()
    await db.refresh(d)
    return d

@router.delete('/{id}')
async def delete_driver(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    d = await db.get(Driver, id)
    if not d: raise HTTPException(404, 'Not found')
    await db.delete(d)
    await db.commit()
    return {'status':'deleted'}