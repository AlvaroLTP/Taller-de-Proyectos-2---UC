import time
from typing import Dict, Any

class RouteService:
    def __init__(self, db, opt_service, val_service):
        self.db = db
        self.opt_service = opt_service
        self.val_service = val_service

    async def generate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        start = time.time()
        v = await self.val_service.validate(payload['order_ids'], payload['vehicle_ids'], payload['driver_ids'], payload['date'])
        if not v['valid']:
            return {'routes': [], 'generation_time_ms': int(time.time()*1000 - int(start*1000)), 'valid': False, 'errors': v['errors']}
        res = await self.opt_service.generate_routes({'orders': [], 'vehicles': [], 'drivers': []})
        return {'routes': res.routes, 'generation_time_ms': int(time.time()*1000 - int(start*1000)), 'valid': True, 'errors': []}
