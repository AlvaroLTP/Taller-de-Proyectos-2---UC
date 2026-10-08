from sqlalchemy import Column, String, Boolean, Numeric, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

class Vehicle(Base):
    __tablename__ = 'vehicles'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    code = Column(String, nullable=False)
    plate = Column(String, nullable=False)
    type = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    capacity_kg = Column(Numeric, nullable=False, default=0)
    capacity_m3 = Column(Numeric, nullable=False, default=0)
    consumption_km_per_l = Column(Numeric, nullable=False, default=0)
    fuel_type = Column(String, nullable=False, default='diesel')
    emissions_per_km = Column(Numeric, nullable=False, default=0)
    status = Column(String, nullable=False, default='available')
    available = Column(Boolean, nullable=False, default=True)
    driver_id = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text('now()'))