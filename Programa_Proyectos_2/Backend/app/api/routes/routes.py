from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.route import Route
from app.schemas.route import RouteValidationRequest, RouteValidationResponse, RouteGenerateRequest, RouteGenerateResponse, RouteResponse
from app.services.route_validation_service import RouteValidationService
from app.services.route_service import RouteService
from app.services.optimization_service import BasicOptimizationService
from typing import List
import uuid

router = APIRouter(prefix='/api/v1/routes', tags=['routes'])

@router.post('/validate', response_model=RouteValidationResponse)
async def validate_routes(data: RouteValidationRequest, db: AsyncSession = Depends(get_db)):
    svc = RouteValidationService(db)
    return await svc.validate(data.order_ids, data.vehicle_ids, data.driver_ids, data.date)

@router.post('/generate', response_model=RouteGenerateResponse)
async def generate_routes(data: RouteGenerateRequest, db: AsyncSession = Depends(get_db)):
    val = RouteValidationService(db)
    opt = BasicOptimizationService()
    svc = RouteService(db, opt, val)
    return await svc.generate(data.model_dump())

@router.get('/', response_model=List[RouteResponse])
async def list_routes(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Route))
    return res.scalars().all()

@router.get('/{id}', response_model=RouteResponse)
async def get_route(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    r = await db.get(Route, id)
    if not r: raise HTTPException(404,'Not found')
    return r