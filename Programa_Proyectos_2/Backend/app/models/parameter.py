import uuid

from sqlalchemy import CheckConstraint, Column, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base


class Parameter(Base):
    __tablename__ = "parameters"
    __table_args__ = (
        CheckConstraint(
            "max_vehicle_capacity_kg > 0 AND max_weight_kg > 0 AND max_volume_m3 > 0 AND average_speed_km_h > 0 AND max_operation_time_h > 0 AND estimated_consumption_km_per_l > 0 AND emission_factor >= 0 AND max_distance_km > 0 AND max_deliveries_per_route > 0",
            name="parameter_limits",
        ),
    )
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    max_vehicle_capacity_kg = Column(Numeric, nullable=False, default=4500)
    max_weight_kg = Column(Numeric, nullable=False, default=4500)
    max_volume_m3 = Column(Numeric, nullable=False, default=20)
    average_speed_km_h = Column(Numeric, nullable=False, default=25)
    max_operation_time_h = Column(Numeric, nullable=False, default=8)
    estimated_consumption_km_per_l = Column(Numeric, nullable=False, default=9.5)
    emission_factor = Column(Numeric, nullable=False, default=2.68)
    fuel_type = Column(String, nullable=False, default="diesel")
    max_distance_km = Column(Numeric, nullable=False, default=120)
    max_deliveries_per_route = Column(Integer, nullable=False, default=15)
    depot_lat = Column(Numeric, nullable=True)
    depot_lng = Column(Numeric, nullable=True)
    electricity_emission_factor_kg_co2e_per_kwh = Column(Numeric, nullable=True)
