from app.models.vehicle import Vehicle
from app.repositories.base import BaseRepository


class VehicleRepository(BaseRepository[Vehicle]):
    def __init__(self, db):
        super().__init__(Vehicle, db)
