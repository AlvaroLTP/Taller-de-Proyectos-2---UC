from app.repositories.base import BaseRepository
from app.models.order import Order

class OrderRepository(BaseRepository[Order]):
    def __init__(self, db):
        super().__init__(Order, db)

