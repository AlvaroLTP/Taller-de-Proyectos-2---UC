from app.models.parameter import Parameter
from app.repositories.base import BaseRepository


class ParameterRepository(BaseRepository[Parameter]):
    def __init__(self, db):
        super().__init__(Parameter, db)
