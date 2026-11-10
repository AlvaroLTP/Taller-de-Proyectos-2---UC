from datetime import datetime

from app.domain.interfaces.traffic import TrafficStatus


class NoOpTrafficProvider:
    async def get_status(self, **kwargs) -> TrafficStatus:
        return TrafficStatus(
            available=False,
            source="none",
            updated_at=datetime.utcnow(),
            congestion_level=None,
        )
