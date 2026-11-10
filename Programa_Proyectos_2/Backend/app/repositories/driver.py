from app.models.driver import Driver
from app.repositories.base import BaseRepository


class DriverRepository(BaseRepository[Driver]):
    def __init__(self, db):
        super().__init__(Driver, db)
