from uuid import uuid4

import pytest

from app.core.security import get_current_user
from app.main import app


@pytest.mark.parametrize(
    "resource",
    [
        "vehicles",
        "drivers",
        "clients",
        "orders",
        "routes",
        "parameters",
        "notifications",
    ],
)
def test_no_session_cannot_read(api, resource):
    # Exercise the real missing-token dependency, without touching Supabase.
    app.dependency_overrides.pop(get_current_user)
    api.headers.clear()
    response = api.get(f"/api/v1/{resource}/")
    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"


@pytest.mark.parametrize("resource", ["vehicles", "drivers", "clients", "orders"])
@pytest.mark.parametrize("method", ["post", "patch", "delete"])
def test_driver_cannot_manage_operational_resources(api, seed, resource, method):
    api.headers["Authorization"] = "Bearer driver"
    id = seed[
        {
            "vehicles": "vehicle",
            "drivers": "driver",
            "clients": "client",
            "orders": "order",
        }[resource]
    ]["id"]
    path = f"/api/v1/{resource}/" + ("" if method == "post" else id)
    kwargs = {} if method == "delete" else {"json": {}}
    assert getattr(api, method)(path, **kwargs).status_code == 403


def test_driver_cannot_plan_change_parameters_or_notifications(api, seed):
    api.headers["Authorization"] = "Bearer driver"
    for path in ("validate", "generate"):
        assert api.post("/api/v1/routes/" + path, json=seed["plan"]).status_code == 403
    assert api.put("/api/v1/parameters/", json={"max_weight_kg": 1}).status_code == 403
    assert api.put("/api/v1/notifications/read").status_code == 403


def test_driver_sees_only_assignments(api, seed):
    generated = api.post("/api/v1/routes/generate", json=seed["plan"]).json()
    route_id = generated["routes"][0]["id"]
    api.users["driver"].driver_id = uuid4()
    api.headers["Authorization"] = "Bearer driver"
    for resource in (
        "orders",
        "routes",
        "vehicles",
        "drivers",
        "clients",
        "notifications",
    ):
        assert api.get(f"/api/v1/{resource}/").json() == []
    assert api.get("/api/v1/orders/" + seed["order"]["id"]).status_code == 404
    assert (
        api.get("/api/v1/orders/" + seed["order"]["id"] + "/preferences").status_code
        == 404
    )
    assert (
        api.get("/api/v1/orders/" + seed["order"]["id"] + "/restrictions").status_code
        == 404
    )
    assert (
        api.put(
            "/api/v1/orders/" + seed["order"]["id"] + "/status",
            json={"status": "delivered"},
        ).status_code
        == 404
    )
    assert (
        api.put(
            "/api/v1/routes/" + route_id + "/status", json={"status": "in_route"}
        ).status_code
        == 404
    )


@pytest.mark.parametrize("role", ["admin", "operator"])
def test_staff_can_manage(api, seed, role):
    api.headers["Authorization"] = "Bearer " + role
    assert (
        api.patch(
            "/api/v1/vehicles/" + seed["vehicle"]["id"], json={"available": False}
        ).status_code
        == 200
    )


def test_cannot_inject_fields_or_assignments(api, seed):
    path = "/api/v1/orders/" + seed["order"]["id"]
    for body in (
        {"role": "admin"},
        {"driver_id": seed["driver"]["id"]},
        {"status": "delivered"},
        {"route_id": str(uuid4())},
    ):
        assert api.patch(path, json=body).status_code == 422


def test_sql_injection_payload_is_data(api, seed):
    payload = "'; DROP TABLE orders; --"
    assert (
        api.patch(
            "/api/v1/clients/" + seed["client"]["id"], json={"name": payload}
        ).status_code
        == 200
    )
    assert len(api.get("/api/v1/orders/").json()) == 1
    assert api.get("/api/v1/clients/").json()[0]["name"] == payload


def test_cors_and_security_headers(api):
    response = api.options(
        "/api/v1/orders/",
        headers={
            "Origin": "https://evil.invalid",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers
    good = api.options(
        "/api/v1/orders/",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert good.headers["access-control-allow-origin"] == "http://localhost:5173"
    assert api.get("/health").headers["x-content-type-options"] == "nosniff"
