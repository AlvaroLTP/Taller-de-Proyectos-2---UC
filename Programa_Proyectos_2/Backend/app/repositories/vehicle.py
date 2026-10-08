from app.repositories.base import BaseRepository
from app.models.vehicle import Vehicle

class VehicleRepository(BaseRepository[Vehicle]):
    def __init__(self, db):
        super().__init__(Vehicle, db)

