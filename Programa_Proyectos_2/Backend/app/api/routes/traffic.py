from fastapi import APIRouter

from app.schemas.traffic import TrafficStatus
from app.services.traffic_service import NoOpTrafficProvider

router = APIRouter(prefix="/api/v1/traffic", tags=["traffic"])


@router.get("/status", response_model=TrafficStatus)
async def traffic_status():
    prov = NoOpTrafficProvider()
    return await prov.get_status()
