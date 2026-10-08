from pydantic import BaseModel, Field, field_validator
from typing import Optional
import uuid

class DriverBase(BaseModel):
    name: str
    dni: str
    phone: str
    license: str
    license_type: str = 'B-II'
    status: str = 'available'
    available: bool = True
    vehicle_id: Optional[uuid.UUID] = None
    shift_start: str = '08:00'
    shift_end: str = '16:00'
    avatar_initials: str = 'XX'

    @field_validator('dni')
    def dni_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('dni required')
        return v.strip()

    @field_validator('license')
    def license_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('license required')
        return v.strip()

    @field_validator('status')
    def status_valid(cls, v):
        allowed = {'available', 'in_route', 'unavailable', 'resting'}
        if v not in allowed:
            raise ValueError('invalid status')
        return v

class DriverCreate(DriverBase):
    pass

class DriverUpdate(DriverBase):
    pass

class DriverResponse(DriverBase):
    id: uuid.UUID

    class Config:
        from_attributes = True