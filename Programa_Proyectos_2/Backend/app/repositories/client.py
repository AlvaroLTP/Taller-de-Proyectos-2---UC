from app.repositories.base import BaseRepository
from app.models.client import Client

class ClientRepository(BaseRepository[Client]):
    def __init__(self, db):
        super().__init__(Client, db)

