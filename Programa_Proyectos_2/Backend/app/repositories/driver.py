from app.repositories.base import BaseRepository
from app.models.driver import Driver

class DriverRepository(BaseRepository[Driver]):
    def __init__(self, db):
        super().__init__(Driver, db)

