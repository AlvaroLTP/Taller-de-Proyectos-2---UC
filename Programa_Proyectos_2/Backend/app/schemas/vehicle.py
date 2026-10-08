from pydantic import BaseModel, Field, field_validator
from typing import Optional
import uuid

class VehicleBase(BaseModel):
    code: str
    plate: str
    type: str
    brand: str
    model: str
    capacity_kg: float = Field(ge=0)
    capacity_m3: float = Field(ge=0)
    consumption_km_per_l: float = Field(ge=0)
    fuel_type: str = 'diesel'
    emissions_per_km: float = Field(ge=0)
    status: str = 'available'
    available: bool = True
    driver_id: Optional[uuid.UUID] = None

    @field_validator('plate')
    def plate_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('plate required')
        return v.strip()

    @field_validator('status')
    def status_valid(cls, v):
        allowed = {'available', 'in_route', 'maintenance', 'unavailable'}
        if v not in allowed:
            raise ValueError('invalid status')
        return v

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: uuid.UUID

    class Config:
        from_attributes = True