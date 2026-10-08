from app.repositories.base import BaseRepository
from app.models.parameter import Parameter

class ParameterRepository(BaseRepository[Parameter]):
    def __init__(self, db):
        super().__init__(Parameter, db)

