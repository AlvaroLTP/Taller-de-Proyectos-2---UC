from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TrafficStatus(BaseModel):
    available: bool = False
    congestion_level: Optional[str] = None
    updated_at: Optional[datetime] = None
    source: Optional[str] = None
