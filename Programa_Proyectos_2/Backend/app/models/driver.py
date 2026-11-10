import uuid

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    String,
    text,
)
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base


class Driver(Base):
    __tablename__ = "drivers"
    __table_args__ = (
        CheckConstraint("shift_start < shift_end", name="driver_shift"),
        CheckConstraint(
            "status IN ('available','in_route','unavailable','resting')",
            name="driver_status",
        ),
    )
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    dni = Column(String, nullable=False, unique=True)
    phone = Column(String, nullable=False)
    license = Column(String, nullable=False, unique=True)
    license_type = Column(String, nullable=False, default="B-II")
    status = Column(String, nullable=False, default="available")
    available = Column(Boolean, nullable=False, default=True)
    vehicle_id = Column(
        UUID(as_uuid=True),
        ForeignKey("vehicles.id", ondelete="SET NULL"),
        nullable=True,
        unique=True,
    )
    shift_start = Column(String, nullable=False, default="08:00")
    shift_end = Column(String, nullable=False, default="16:00")
    avatar_initials = Column(String, nullable=False, default="XX")
    created_at = Column(
        DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
