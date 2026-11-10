import uuid

from sqlalchemy import (
    JSON,
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID

from app.models.base import Base


class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint("weight_kg >= 0 AND volume_m3 >= 0", name="order_load"),
        CheckConstraint(
            "lat BETWEEN -90 AND 90 AND lng BETWEEN -180 AND 180",
            name="order_coordinates",
        ),
        CheckConstraint(
            "time_window_start < time_window_end AND pref_time_window_start < pref_time_window_end",
            name="order_window",
        ),
        CheckConstraint(
            "status IN ('pending','planned','in_route','delivered','not_delivered','cancelled')",
            name="order_status",
        ),
    )
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String, nullable=False, unique=True)
    client_id = Column(
        UUID(as_uuid=True),
        ForeignKey("clients.id", ondelete="RESTRICT"),
        nullable=False,
    )
    phone = Column(String, nullable=False)
    street = Column(String, nullable=False)
    reference = Column(String, nullable=True, default="")
    district = Column(String, nullable=False)
    neighborhood = Column(String, nullable=True, default="")
    lat = Column(Numeric, nullable=False, default=0)
    lng = Column(Numeric, nullable=False, default=0)
    indications = Column(String, nullable=True, default="")
    access_type = Column(String, nullable=False, default="Fácil")
    delivery_date = Column(String, nullable=False)
    time_window_start = Column(String, nullable=False)
    time_window_end = Column(String, nullable=False)
    priority = Column(String, nullable=False, default="medium")
    weight_kg = Column(Numeric, nullable=False, default=0)
    volume_m3 = Column(Numeric, nullable=False, default=0)
    product_type = Column(String, nullable=False, default="Abarrotes")
    observations = Column(String, nullable=True, default="")
    status = Column(String, nullable=False, default="pending")
    preferred_time = Column(String, nullable=False, default="09:00")
    pref_time_window_start = Column(String, nullable=False, default="09:00")
    pref_time_window_end = Column(String, nullable=False, default="12:00")
    restrictions = Column(
        JSON().with_variant(ARRAY(String), "postgresql"), nullable=False, default=list
    )
    requires_special_attention = Column(Boolean, nullable=False, default=False)
    no_lunch_hours = Column(Boolean, nullable=False, default=False)
    requires_phone_coordination = Column(Boolean, nullable=False, default=False)
    pref_observations = Column(String, nullable=True, default="")
    route_id = Column(String, nullable=True)
    delivery_order = Column(Integer, nullable=True)
    driver_id = Column(
        UUID(as_uuid=True), ForeignKey("drivers.id", ondelete="RESTRICT"), nullable=True
    )
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    incident_reason = Column(String, nullable=True)
    incident_notes = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
