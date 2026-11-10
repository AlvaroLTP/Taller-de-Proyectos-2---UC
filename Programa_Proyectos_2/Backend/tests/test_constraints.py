import pytest
from pydantic import ValidationError

from app.schemas.parameter import ParameterBase
from app.schemas.preferences import Preferences
from app.schemas.vehicle import VehicleUpdate
from app.services.validation_service import ValidationService


@pytest.mark.parametrize(
    "start,end,valid",
    [
        ("08:00", "16:00", True),
        ("12:00", "12:00", False),
        ("17:00", "08:00", False),
        ("24:00", "25:00", False),
        ("08:60", "09:00", False),
        ("8:00", "09:00", False),
        ("bad", "09:00", False),
    ],
)
def test_time_validation(start, end, valid):
    assert ValidationService.validate_time_window(start, end) is valid


@pytest.mark.parametrize(
    "field,value",
    [
        ("capacity_kg", -1),
        ("capacity_kg", 0),
        ("capacity_m3", -1),
        ("consumption_km_per_l", -1),
        ("emissions_per_km", -1),
        ("plate", "  "),
        ("status", "unknown"),
    ],
)
def test_vehicle_invalid_values(api, seed, field, value):
    response = api.patch(
        "/api/v1/vehicles/" + seed["vehicle"]["id"], json={field: value}
    )
    assert response.status_code == 422


def test_partial_update_preserves_other_fields(api, seed):
    old = seed["vehicle"]
    result = api.patch(
        "/api/v1/vehicles/" + old["id"], json={"available": False}
    ).json()
    assert (
        result["plate"] == old["plate"] and result["capacity_kg"] == old["capacity_kg"]
    )
    assert result["status"] == old["status"]


def test_partial_window_validated_against_existing_values(api, seed):
    assert (
        api.patch(
            "/api/v1/drivers/" + seed["driver"]["id"], json={"shift_end": "07:00"}
        ).status_code
        == 422
    )
    assert (
        api.patch(
            "/api/v1/orders/" + seed["order"]["id"], json={"time_window_end": "08:00"}
        ).status_code
        == 422
    )


@pytest.mark.parametrize(
    "field",
    [
        "average_speed_km_h",
        "max_distance_km",
        "max_deliveries_per_route",
        "estimated_consumption_km_per_l",
    ],
)
def test_zero_parameters_rejected(field):
    with pytest.raises(ValidationError):
        ParameterBase(**{field: 0})


def test_nan_and_infinity_rejected():
    for value in (float("nan"), float("inf")):
        with pytest.raises(ValidationError):
            VehicleUpdate(capacity_kg=value)
    with pytest.raises(ValidationError):
        VehicleUpdate(plate=None)


def test_invalid_preferences():
    for values in (
        {"time_window_end": "08:00"},
        {"preferred_time": "14:00"},
        {"restrictions": [""]},
    ):
        with pytest.raises(ValidationError):
            Preferences(**values)


def test_duplicate_and_foreign_key_conflict_are_safe(api, seed):
    body = {k: v for k, v in seed["vehicle"].items() if k != "id"}
    body.pop("driver_id", None)
    response = api.post("/api/v1/vehicles/", json=body)
    assert response.status_code == 409
    assert "INSERT" not in response.text
    assert api.delete("/api/v1/clients/" + seed["client"]["id"]).status_code == 409
    assert len(api.get("/api/v1/orders/").json()) == 1


def test_assign_vehicle_atomic(api, seed):
    url = "/api/v1/drivers/" + seed["driver"]["id"] + "/vehicle"
    response = api.put(url, json={"vehicle_id": seed["vehicle"]["id"]})
    assert response.status_code == 200
    assert response.json()["vehicle_id"] == seed["vehicle"]["id"]
    assert api.get("/api/v1/vehicles/").json()[0]["driver_id"] == seed["driver"]["id"]
    api.post("/api/v1/routes/generate", json=seed["plan"])
    assert api.put(url, json={"vehicle_id": seed["vehicle"]["id"]}).status_code == 409


def test_reassign_vehicle_clears_both_previous_links(api, seed):
    other = api.post(
        "/api/v1/drivers/",
        json={
            "name": "Other",
            "dni": "87654321",
            "phone": "999111222",
            "license": "LIC-002",
        },
    ).json()
    first_url = "/api/v1/drivers/" + seed["driver"]["id"] + "/vehicle"
    second_url = "/api/v1/drivers/" + other["id"] + "/vehicle"
    assert (
        api.put(first_url, json={"vehicle_id": seed["vehicle"]["id"]}).status_code
        == 200
    )
    assert (
        api.put(second_url, json={"vehicle_id": seed["vehicle"]["id"]}).status_code
        == 200
    )
    first = api.get("/api/v1/drivers/" + seed["driver"]["id"]).json()
    assert first["vehicle_id"] is None
    assert (
        api.get("/api/v1/vehicles/" + seed["vehicle"]["id"]).json()["driver_id"]
        == other["id"]
    )
