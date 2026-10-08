from sqlalchemy import Column, String, Numeric, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

class Parameter(Base):
    __tablename__ = 'parameters'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default='gen_random_uuid()')
    max_vehicle_capacity_kg = Column(Numeric, nullable=False, default=4500)
    max_weight_kg = Column(Numeric, nullable=False, default=4500)
    max_volume_m3 = Column(Numeric, nullable=False, default=20)
    average_speed_km_h = Column(Numeric, nullable=False, default=25)
    max_operation_time_h = Column(Numeric, nullable=False, default=8)
    estimated_consumption_km_per_l = Column(Numeric, nullable=False, default=9.5)
    emission_factor = Column(Numeric, nullable=False, default=2.68)
    fuel_type = Column(String, nullable=False, default='diesel')
    max_distance_km = Column(Numeric, nullable=False, default=120)
    max_deliveries_per_route = Column(Integer, nullable=False, default=15)