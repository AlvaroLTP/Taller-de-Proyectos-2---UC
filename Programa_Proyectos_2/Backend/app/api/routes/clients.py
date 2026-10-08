from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate, ClientResponse
from typing import List
import uuid

router = APIRouter(prefix='/api/v1/clients', tags=['clients'])

@router.get('/', response_model=List[ClientResponse])
async def list_clients(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Client)); return res.scalars().all()

@router.get('/{id}', response_model=ClientResponse)
async def get_client(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    c = await db.get(Client,id); 
    if not c: raise HTTPException(404,'Not found')
    return c

@router.post('/', response_model=ClientResponse, status_code=201)
async def create_client(data: ClientCreate, db: AsyncSession = Depends(get_db)):
    c = Client(**data.model_dump()); db.add(c); await db.commit(); await db.refresh(c); return c

@router.put('/{id}', response_model=ClientResponse)
async def update_client(id: uuid.UUID, data: ClientUpdate, db: AsyncSession = Depends(get_db)):
    c = await db.get(Client,id); 
    if not c: raise HTTPException(404,'Not found')
    for k,v in data.model_dump().items(): setattr(c,k,v)
    await db.commit(); await db.refresh(c); return c

@router.delete('/{id}')
async def delete_client(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    c = await db.get(Client,id); 
    if not c: raise HTTPException(404,'Not found')
    await db.delete(c); await db.commit(); return {'status':'deleted'}