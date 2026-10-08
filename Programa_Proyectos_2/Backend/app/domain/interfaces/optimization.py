from typing import Protocol, List, Dict, Any, Optional
from dataclasses import dataclass

@dataclass
class OptimizationResult:
    routes: List[Dict[str, Any]]
    metrics: Dict[str, Any]

class OptimizationService(Protocol):
    async def generate_routes(self, context: Dict[str, Any]) -> OptimizationResult:
        ...