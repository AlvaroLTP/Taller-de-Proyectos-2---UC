from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse
from app.schemas.preferences import Preferences, Restrictions
from typing import List
import uuid

router = APIRouter(prefix='/api/v1/orders', tags=['orders'])

@router.get('/', response_model=List[OrderResponse])
async def list_orders(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Order)); return res.scalars().all()

@router.get('/{id}', response_model=OrderResponse)
async def get_order(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    o = await db.get(Order,id)
    if not o: raise HTTPException(404,'Not found')
    return o

@router.post('/', response_model=OrderResponse, status_code=201)
async def create_order(data: OrderCreate, db: AsyncSession = Depends(get_db)):
    o = Order(**data.model_dump()); db.add(o); await db.commit(); await db.refresh(o); return o

@router.put('/{id}', response_model=OrderResponse)
async def update_order(id: uuid.UUID, data: OrderUpdate, db: AsyncSession = Depends(get_db)):
    o = await db.get(Order,id)
    if not o: raise HTTPException(404,'Not found')
    for k,v in data.model_dump().items(): setattr(o,k,v)
    await db.commit(); await db.refresh(o); return o

@router.delete('/{id}')
async def delete_order(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    o = await db.get(Order,id)
    if not o: raise HTTPException(404,'Not found')
    await db.delete(o); await db.commit(); return {'status':'deleted'}

@router.get('/{id}/preferences')
async def get_prefs(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    o = await db.get(Order,id)
    if not o: raise HTTPException(404,'Not found')
    return {'preferred_time':o.preferred_time,'time_window_start':o.pref_time_window_start,'time_window_end':o.pref_time_window_end,'restrictions':o.restrictions or []}

@router.put('/{id}/preferences')
async def update_prefs(id: uuid.UUID, data: Preferences, db: AsyncSession = Depends(get_db)):
    o = await db.get(Order,id)
    if not o: raise HTTPException(404,'Not found')
    o.preferred_time = data.preferred_time
    o.pref_time_window_start = data.time_window_start
    o.pref_time_window_end = data.time_window_end
    o.restrictions = list(data.restrictions)
    o.requires_special_attention = data.requires_special_attention
    o.no_lunch_hours = data.no_lunch_hours
    o.requires_phone_coordination = data.requires_phone_coordination
    o.pref_observations = data.observations
    await db.commit(); await db.refresh(o)
    return {'status':'updated'}

@router.get('/{id}/restrictions')
async def get_restr(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    o = await db.get(Order,id)
    if not o: raise HTTPException(404,'Not found')
    return {'restrictions':o.restrictions or []}

@router.put('/{id}/restrictions')
async def update_restr(id: uuid.UUID, data: Restrictions, db: AsyncSession = Depends(get_db)):
    o = await db.get(Order,id)
    if not o: raise HTTPException(404,'Not found')
    o.restrictions = list(data.restrictions)
    await db.commit(); await db.refresh(o)
    return {'status':'updated'}