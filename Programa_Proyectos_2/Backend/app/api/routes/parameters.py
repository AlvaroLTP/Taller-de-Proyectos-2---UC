from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.parameter import Parameter
from app.schemas.parameter import ParameterResponse, ParameterBase
from typing import List

router = APIRouter(prefix='/api/v1/parameters', tags=['parameters'])

@router.get('/', response_model=ParameterResponse)
async def get_params(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Parameter))
    params = res.scalars().first()
    if not params:
        params = Parameter()
        db.add(params)
        await db.commit()
        await db.refresh(params)
    return params

@router.put('/', response_model=ParameterResponse)
async def update_params(data: ParameterBase, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Parameter))
    params = res.scalars().first()
    if not params:
        params = Parameter(**data.model_dump())
        db.add(params)
    else:
        for k,v in data.model_dump().items(): setattr(params,k,v)
    await db.commit()
    await db.refresh(params)
    return params