from pydantic import BaseModel, Field, field_validator
from typing import Optional
import uuid

class ClientBase(BaseModel):
    name: str
    phone: str
    email: str = ''
    street: str
    reference: str = ''
    district: str
    neighborhood: str = ''
    lat: float = 0
    lng: float = 0
    indications: str = ''
    access_type: str = 'Fácil'
    priority: str = 'medium'
    notes: str = ''

    @field_validator('priority')
    def priority_valid(cls, v):
        if v not in {'high', 'medium', 'low'}:
            raise ValueError('invalid priority')
        return v

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: uuid.UUID

    class Config:
        from_attributes = True