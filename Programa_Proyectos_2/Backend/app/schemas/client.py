from typing import Literal
from uuid import UUID

from pydantic import Field

from app.schemas.base import InputModel, partial_model


class ClientBase(InputModel):
    name: str = Field(min_length=1)
    phone: str = Field(min_length=1)
    email: str = ""
    street: str = Field(min_length=1)
    reference: str = ""
    district: str = Field(min_length=1)
    neighborhood: str = ""
    lat: float = Field(ge=-90, le=90, default=0)
    lng: float = Field(ge=-180, le=180, default=0)
    indications: str = ""
    access_type: str = "Fácil"
    priority: Literal["high", "medium", "low"] = "medium"
    notes: str = ""


class ClientCreate(ClientBase):
    pass


ClientUpdate = partial_model("ClientUpdate", ClientBase)


class ClientResponse(ClientBase):
    id: UUID
