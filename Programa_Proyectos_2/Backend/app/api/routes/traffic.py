from fastapi import APIRouter
from app.services.traffic_service import NoOpTrafficProvider
from app.schemas.traffic import TrafficStatus

router = APIRouter(prefix='/api/v1/traffic', tags=['traffic'])

@router.get('/status', response_model=TrafficStatus)
async def traffic_status():
    prov = NoOpTrafficProvider()
    return await prov.get_status()