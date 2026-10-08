from sqlalchemy import Column, String, Numeric, Integer, DateTime, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.models.base import Base

class Route(Base):
    __tablename__ = 'routes'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    code = Column(String, nullable=False)
    driver_id = Column(UUID(as_uuid=True), nullable=False)
    vehicle_id = Column(UUID(as_uuid=True), nullable=False)
    date = Column(String, nullable=False)
    total_distance_km = Column(Numeric, nullable=False, default=0)
    estimated_time_min = Column(Integer, nullable=False, default=0)
    departure_time = Column(String, nullable=False)
    estimated_arrival_time = Column(String, nullable=False)
    emissions_kg_co2 = Column(Numeric, nullable=False, default=0)
    status = Column(String, nullable=False, default='pending')
    completed_deliveries = Column(Integer, nullable=False, default=0)
    total_deliveries = Column(Integer, nullable=False, default=0)
    stops = Column(JSONB, nullable=False, server_default='[]')
    created_at = Column(DateTime(timezone=True), server_default=text('now()'))