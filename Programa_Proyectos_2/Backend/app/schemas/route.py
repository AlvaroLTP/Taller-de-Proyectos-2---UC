from pydantic import BaseModel
from typing import List, Optional
import uuid

class RouteValidationRequest(BaseModel):
    order_ids: List[str] = []
    vehicle_ids: List[str] = []
    driver_ids: List[str] = []
    date: str

class RouteValidationResponse(BaseModel):
    valid: bool = True
    errors: List[str] = []
    warnings: List[str] = []

class RouteGenerateRequest(BaseModel):
    order_ids: List[str] = []
    vehicle_ids: List[str] = []
    driver_ids: List[str] = []
    date: str

class RouteGenerateResponse(BaseModel):
    routes: List[dict] = []
    generation_time_ms: int = 0
    valid: bool = True
    errors: List[str] = []

class RouteResponse(BaseModel):
    id: uuid.UUID
    code: str
    driver_id: uuid.UUID
    vehicle_id: uuid.UUID
    date: str
    total_distance_km: float
    estimated_time_min: int
    departure_time: str
    estimated_arrival_time: str
    emissions_kg_co2: float
    status: str
    completed_deliveries: int
    total_deliveries: int
    stops: List[dict] = []

    class Config:
        from_attributes = True