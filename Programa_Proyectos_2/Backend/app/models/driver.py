from sqlalchemy import Column, String, Boolean, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

class Driver(Base):
    __tablename__ = 'drivers'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    name = Column(String, nullable=False)
    dni = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    license = Column(String, nullable=False)
    license_type = Column(String, nullable=False, default='B-II')
    status = Column(String, nullable=False, default='available')
    available = Column(Boolean, nullable=False, default=True)
    vehicle_id = Column(UUID(as_uuid=True), nullable=True)
    shift_start = Column(String, nullable=False, default='08:00')
    shift_end = Column(String, nullable=False, default='16:00')
    avatar_initials = Column(String, nullable=False, default='XX')
    created_at = Column(DateTime(timezone=True), server_default=text('now()'))