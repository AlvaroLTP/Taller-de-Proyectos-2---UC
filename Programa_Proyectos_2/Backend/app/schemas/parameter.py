from uuid import UUID

from pydantic import Field

from app.schemas.base import FuelType, InputModel, partial_model


class ParameterBase(InputModel):
    max_vehicle_capacity_kg: float = Field(default=4500, gt=0)
    max_weight_kg: float = Field(default=4500, gt=0)
    max_volume_m3: float = Field(default=20, gt=0)
    average_speed_km_h: float = Field(default=25, gt=0, le=150)
    max_operation_time_h: float = Field(default=8, gt=0, le=24)
    estimated_consumption_km_per_l: float = Field(default=9.5, gt=0)
    emission_factor: float = Field(default=2.68, ge=0)
    fuel_type: FuelType = "diesel"
    max_distance_km: float = Field(default=120, gt=0)
    max_deliveries_per_route: int = Field(default=15, ge=1, le=500)
    depot_lat: float | None = Field(default=None, ge=-90, le=90)
    depot_lng: float | None = Field(default=None, ge=-180, le=180)
    electricity_emission_factor_kg_co2e_per_kwh: float | None = Field(default=None, ge=0)


ParameterUpdate = partial_model("ParameterUpdate", ParameterBase)


class ParameterResponse(ParameterBase):
    id: UUID
