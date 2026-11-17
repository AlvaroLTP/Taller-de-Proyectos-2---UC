from app.models.route import Route
from app.repositories.base import BaseRepository


class RouteRepository(BaseRepository[Route]):
    def __init__(self, db):
        super().__init__(Route, db)
