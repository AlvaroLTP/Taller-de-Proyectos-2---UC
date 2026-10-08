from pydantic import BaseModel
import uuid

class ParameterBase(BaseModel):
    max_vehicle_capacity_kg: float = 4500
    max_weight_kg: float = 4500
    max_volume_m3: float = 20
    average_speed_km_h: float = 25
    max_operation_time_h: float = 8
    estimated_consumption_km_per_l: float = 9.5
    emission_factor: float = 2.68
    fuel_type: str = 'diesel'
    max_distance_km: float = 120
    max_deliveries_per_route: int = 15

class ParameterResponse(ParameterBase):
    id: uuid.UUID

    class Config:
        from_attributes = True