from typing import Protocol, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class TrafficStatus:
    available: bool = False
    congestion_level: Optional[str] = None
    updated_at: Optional[datetime] = None
    source: Optional[str] = None

class TrafficProvider(Protocol):
    async def get_status(self, **kwargs) -> TrafficStatus:
        ...