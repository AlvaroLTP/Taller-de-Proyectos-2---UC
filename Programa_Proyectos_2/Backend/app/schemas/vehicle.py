from typing import Literal
from uuid import UUID

from pydantic import Field

from app.schemas.base import FuelType, InputModel, partial_model


class VehicleBase(InputModel):
    code: str = Field(min_length=1, max_length=50)
    plate: str = Field(min_length=1, max_length=20)
    type: str = Field(min_length=1)
    brand: str = Field(min_length=1)
    model: str = Field(min_length=1)
    capacity_kg: float = Field(gt=0)
    capacity_m3: float = Field(gt=0)
    consumption_km_per_l: float = Field(ge=0)
    fuel_type: FuelType = "diesel"
    emissions_per_km: float = Field(ge=0)
    energy_kwh_per_km: float | None = Field(default=None, ge=0)
    emission_factor_source: str | None = Field(default=None, max_length=500)
    status: Literal["available", "in_route", "maintenance", "unavailable"] = "available"
    available: bool = True
    driver_id: UUID | None = None


class VehicleCreate(VehicleBase):
    pass


VehicleUpdate = partial_model("VehicleUpdate", VehicleBase)


class VehicleResponse(VehicleBase):
    id: UUID
