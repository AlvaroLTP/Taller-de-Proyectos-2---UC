import uuid

from sqlalchemy import (
    JSON,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.models.base import Base


class Route(Base):
    __tablename__ = "routes"
    __table_args__ = (
        CheckConstraint(
            "total_distance_km >= 0 AND estimated_time_min >= 0 AND emissions_kg_co2 >= 0 AND completed_deliveries >= 0 AND completed_deliveries <= total_deliveries",
            name="route_metrics",
        ),
        CheckConstraint(
            "status IN ('pending','preparing','in_route','finished','with_incidents')",
            name="route_status",
        ),
    )
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String, nullable=False, unique=True)
    driver_id = Column(
        UUID(as_uuid=True),
        ForeignKey("drivers.id", ondelete="RESTRICT"),
        nullable=False,
    )
    vehicle_id = Column(
        UUID(as_uuid=True),
        ForeignKey("vehicles.id", ondelete="RESTRICT"),
        nullable=False,
    )
    date = Column(String, nullable=False)
    total_distance_km = Column(Numeric, nullable=False, default=0)
    estimated_time_min = Column(Integer, nullable=False, default=0)
    departure_time = Column(String, nullable=False)
    estimated_arrival_time = Column(String, nullable=False)
    emissions_kg_co2 = Column(Numeric, nullable=False, default=0)
    outbound_distance_km = Column(Numeric, nullable=True)
    return_distance_km = Column(Numeric, nullable=True)
    payload_tonne_km = Column(Numeric, nullable=True)
    energy_kwh = Column(Numeric, nullable=True)
    emissions_method = Column(String, nullable=True)
    emissions_source = Column(String, nullable=True)
    status = Column(String, nullable=False, default="pending")
    completed_deliveries = Column(Integer, nullable=False, default=0)
    total_deliveries = Column(Integer, nullable=False, default=0)
    stops = Column(
        JSON().with_variant(JSONB(), "postgresql"), nullable=False, default=list
    )
    created_at = Column(
        DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
