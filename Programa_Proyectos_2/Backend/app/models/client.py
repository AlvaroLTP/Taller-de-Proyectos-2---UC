from sqlalchemy import Column, String, Boolean, Numeric, DateTime, text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from app.models.base import Base

class Client(Base):
    __tablename__ = 'clients'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True, default='')
    street = Column(String, nullable=False)
    reference = Column(String, nullable=True, default='')
    district = Column(String, nullable=False)
    neighborhood = Column(String, nullable=True, default='')
    lat = Column(Numeric, nullable=False, default=0)
    lng = Column(Numeric, nullable=False, default=0)
    indications = Column(String, nullable=True, default='')
    access_type = Column(String, nullable=False, default='Fácil')
    priority = Column(String, nullable=False, default='medium')
    notes = Column(String, nullable=True, default='')
    created_at = Column(DateTime(timezone=True), server_default=text('now()'))