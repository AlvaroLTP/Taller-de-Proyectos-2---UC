from dataclasses import dataclass
from typing import Any, Dict, List, Protocol


@dataclass
class OptimizationResult:
    routes: List[Dict[str, Any]]
    metrics: Dict[str, Any]


class OptimizationService(Protocol):
    async def generate_routes(self, context: Dict[str, Any]) -> OptimizationResult: ...
