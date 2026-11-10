from datetime import date as Date
from typing import Literal
from uuid import UUID

from pydantic import Field, field_validator

from app.schemas.base import InputModel


class RouteValidationRequest(InputModel):
    order_ids: list[UUID] = Field(default_factory=list, max_length=500)
    vehicle_ids: list[UUID] = Field(default_factory=list, max_length=100)
    driver_ids: list[UUID] = Field(default_factory=list, max_length=100)
    date: str

    @field_validator("order_ids", "vehicle_ids", "driver_ids")
    @classmethod
    def unique_ids(cls, value):
        if len(set(value)) != len(value):
            raise ValueError("No se permiten identificadores duplicados")
        return value

    @field_validator("date")
    @classmethod
    def valid_date(cls, value):
        if Date.fromisoformat(value).isoformat() != value:
            raise ValueError("Se requiere fecha YYYY-MM-DD")
        return value


class RouteValidationResponse(InputModel):
    valid: bool
    errors: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class RouteGenerateRequest(RouteValidationRequest):
    pass


class RouteGenerateResponse(InputModel):
    routes: list[dict] = Field(default_factory=list)
    generation_time_ms: int = 0
    valid: bool
    errors: list[str] = Field(default_factory=list)


class RouteStatusUpdate(InputModel):
    status: Literal["preparing", "in_route", "finished", "with_incidents"]


class RouteResponse(InputModel):
    id: UUID
    code: str
    driver_id: UUID
    vehicle_id: UUID
    date: str
    total_distance_km: float
    estimated_time_min: int
    departure_time: str
    estimated_arrival_time: str
    emissions_kg_co2: float
    outbound_distance_km: float | None = None
    return_distance_km: float | None = None
    payload_tonne_km: float | None = None
    energy_kwh: float | None = None
    emissions_method: str | None = None
    emissions_source: str | None = None
    status: str
    completed_deliveries: int
    total_deliveries: int
    stops: list[dict] = Field(default_factory=list)
