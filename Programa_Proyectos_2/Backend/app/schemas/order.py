from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
import uuid
from datetime import datetime

class OrderBase(BaseModel):
    code: str
    client_id: uuid.UUID
    phone: str
    street: str
    reference: str = ''
    district: str
    neighborhood: str = ''
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    indications: str = ''
    access_type: str = 'Fácil'
    delivery_date: str
    time_window_start: str
    time_window_end: str
    priority: str = 'medium'
    weight_kg: float = Field(ge=0)
    volume_m3: float = Field(ge=0)
    product_type: str = 'Abarrotes'
    observations: str = ''
    status: str = 'pending'
    preferred_time: str = '09:00'
    pref_time_window_start: str = '09:00'
    pref_time_window_end: str = '12:00'
    restrictions: List[str] = Field(default_factory=list)
    requires_special_attention: bool = False
    no_lunch_hours: bool = False
    requires_phone_coordination: bool = False
    pref_observations: str = ''
    route_id: Optional[str] = None
    delivery_order: Optional[int] = None
    driver_id: Optional[uuid.UUID] = None
    incident_reason: Optional[str] = None
    incident_notes: Optional[str] = None

    @field_validator('priority')
    def priority_valid(cls, v):
        if v not in {'high', 'medium', 'low'}:
            raise ValueError('invalid priority')
        return v

    @field_validator('status')
    def status_valid(cls, v):
        allowed = {'pending', 'planned', 'in_route', 'delivered', 'not_delivered', 'cancelled'}
        if v not in allowed:
            raise ValueError('invalid status')
        return v

    @field_validator('time_window_end')
    def time_window_coherent(cls, v, info):
        start = info.data.get('time_window_start')
        if start and v and start >= v:
            pass
        return v

class OrderCreate(OrderBase):
    pass

class OrderUpdate(OrderBase):
    pass

class OrderResponse(OrderBase):
    id: uuid.UUID
    delivered_at: Optional[datetime] = None

    class Config:
        from_attributes = True