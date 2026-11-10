import uuid

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    text,
)
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"
    __table_args__ = (
        CheckConstraint("capacity_kg > 0 AND capacity_m3 > 0", name="vehicle_capacity"),
        CheckConstraint(
            "consumption_km_per_l >= 0 AND emissions_per_km >= 0",
            name="vehicle_consumption",
        ),
        CheckConstraint(
            "status IN ('available','in_route','maintenance','unavailable')",
            name="vehicle_status",
        ),
    )
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String, nullable=False, unique=True)
    plate = Column(String, nullable=False, unique=True)
    type = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    capacity_kg = Column(Numeric, nullable=False, default=0)
    capacity_m3 = Column(Numeric, nullable=False, default=0)
    consumption_km_per_l = Column(Numeric, nullable=False, default=0)
    fuel_type = Column(String, nullable=False, default="diesel")
    emissions_per_km = Column(Numeric, nullable=False, default=0)
    energy_kwh_per_km = Column(Numeric, nullable=True)
    emission_factor_source = Column(String, nullable=True)
    status = Column(String, nullable=False, default="available")
    available = Column(Boolean, nullable=False, default=True)
    driver_id = Column(
        UUID(as_uuid=True),
        ForeignKey("drivers.id", ondelete="SET NULL"),
        nullable=True,
        unique=True,
    )
    created_at = Column(
        DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
