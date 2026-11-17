from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import Field, field_validator, model_validator

from app.schemas.base import InputModel, TimeString, partial_model
from app.schemas.preferences import RestrictionList
from app.services.validation_service import ValidationService


class OrderBase(InputModel):
    code: str = Field(min_length=1, max_length=50)
    client_id: UUID
    phone: str = Field(min_length=1)
    street: str = Field(min_length=1)
    reference: str = ""
    district: str = Field(min_length=1)
    neighborhood: str = ""
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    indications: str = ""
    access_type: str = "Fácil"
    delivery_date: str
    time_window_start: TimeString
    time_window_end: TimeString
    priority: Literal["high", "medium", "low"] = "medium"
    weight_kg: float = Field(ge=0)
    volume_m3: float = Field(ge=0)
    product_type: str = "Abarrotes"
    observations: str = ""
    status: Literal[
        "pending", "planned", "in_route", "delivered", "not_delivered", "cancelled"
    ] = "pending"
    preferred_time: TimeString = "09:00"
    pref_time_window_start: TimeString = "09:00"
    pref_time_window_end: TimeString = "12:00"
    restrictions: RestrictionList = Field(default_factory=list)
    requires_special_attention: bool = False
    no_lunch_hours: bool = False
    requires_phone_coordination: bool = False
    pref_observations: str = ""
    route_id: str | None = None
    delivery_order: int | None = Field(default=None, ge=1)
    driver_id: UUID | None = None
    incident_reason: str | None = None
    incident_notes: str | None = None

    @field_validator("delivery_date")
    @classmethod
    def valid_date(cls, value):
        if date.fromisoformat(value).isoformat() != value:
            raise ValueError("Se requiere fecha YYYY-MM-DD")
        return value

    @model_validator(mode="after")
    def coherent_windows(self):
        for start, end in [
            (self.time_window_start, self.time_window_end),
            (self.pref_time_window_start, self.pref_time_window_end),
        ]:
            if (
                start is not None
                and end is not None
                and not ValidationService.validate_time_window(start, end)
            ):
                raise ValueError("El fin de la ventana debe ser posterior al inicio")
        return self


class OrderCreate(OrderBase):
    pass


OrderUpdate = partial_model("OrderUpdate", OrderBase)


class OrderStatusUpdate(InputModel):
    status: Literal["in_route", "delivered", "not_delivered", "cancelled"]
    incident_reason: str | None = None
    incident_notes: str | None = None


class OrderResponse(OrderBase):
    id: UUID
    delivered_at: datetime | None = None
