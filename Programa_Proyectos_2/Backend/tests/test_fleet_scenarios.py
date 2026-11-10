import json
from pathlib import Path

from app.schemas.vehicle import VehicleCreate


def test_lima_fleet_scenarios_are_valid_vehicle_payloads():
    fixture = Path(__file__).parent / "fixtures" / "fleet_lima_scenarios.json"
    scenarios = json.loads(fixture.read_text(encoding="utf-8"))
    metadata = {"classification", "scenario", "purpose"}

    payloads = [
        VehicleCreate.model_validate(
            {key: value for key, value in scenario.items() if key not in metadata}
        )
        for scenario in scenarios
    ]

    assert len(payloads) == 5
    assert {vehicle.fuel_type for vehicle in payloads} == {
        "diesel",
        "electric",
        "gasoline",
    }
    electric = next(vehicle for vehicle in payloads if vehicle.fuel_type == "electric")
    assert electric.energy_kwh_per_km and electric.energy_kwh_per_km > 0
