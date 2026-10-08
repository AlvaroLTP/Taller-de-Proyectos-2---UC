from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TrafficStatus(BaseModel):
    available: bool = False
    congestion_level: Optional[str] = None
    updated_at: Optional[datetime] = None
    source: Optional[str] = None