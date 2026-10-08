from app.repositories.base import BaseRepository
from app.models.route import Route

class RouteRepository(BaseRepository[Route]):
    def __init__(self, db):
        super().__init__(Route, db)

