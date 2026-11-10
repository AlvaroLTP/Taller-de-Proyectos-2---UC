from uuid import uuid4

import pytest


def generate(api, seed):
    response = api.post("/api/v1/routes/generate", json=seed["plan"])
    assert response.status_code == 200, response.text
    return response.json()


def test_generate_persists_orders_and_route(api, seed):
    result = generate(api, seed)
    assert result["valid"] is True
    assert len(result["routes"]) == 1
    route = result["routes"][0]
    assert len(api.get("/api/v1/routes/").json()) == 1
    order = api.get("/api/v1/orders/" + seed["order"]["id"]).json()
    assert (
        order["route_id"],
        order["driver_id"],
        order["delivery_order"],
        order["status"],
    ) == (route["id"], seed["driver"]["id"], 1, "planned")
    assert route["stops"][0]["orderId"] == order["id"]
    api.headers["Authorization"] = "Bearer driver"
    assert api.get("/api/v1/vehicles/").json()[0]["id"] == seed["vehicle"]["id"]
    assert api.get("/api/v1/drivers/").json()[0]["vehicle_id"] == seed["vehicle"]["id"]


def test_empty_plan_returns_errors(api):
    result = api.post("/api/v1/routes/generate", json={"date": "2026-10-26"}).json()
    assert result["valid"] is False
    assert len(result["errors"]) == 3


@pytest.mark.parametrize("field", ["order_ids", "vehicle_ids", "driver_ids"])
def test_missing_selected_record(api, seed, field):
    seed["plan"][field] = [str(uuid4())]
    assert generate(api, seed)["valid"] is False
    assert api.get("/api/v1/routes/").json() == []


@pytest.mark.parametrize("field", ["order_ids", "vehicle_ids", "driver_ids"])
def test_duplicate_ids_rejected(api, seed, field):
    seed["plan"][field] *= 2
    assert api.post("/api/v1/routes/generate", json=seed["plan"]).status_code == 422


@pytest.mark.parametrize(
    "resource,key,updates",
    [
        ("vehicles", "vehicle", {"available": False}),
        ("vehicles", "vehicle", {"status": "maintenance"}),
        ("drivers", "driver", {"available": False}),
        ("drivers", "driver", {"status": "resting"}),
        ("orders", "order", {"weight_kg": 1001}),
        ("orders", "order", {"volume_m3": 11}),
        ("orders", "order", {"delivery_date": "2026-10-27"}),
        ("orders", "order", {"time_window_start": "17:00", "time_window_end": "18:00"}),
        ("orders", "order", {"restrictions": ["Acceso restringido"]}),
        ("orders", "order", {"requires_phone_coordination": True}),
    ],
)
def test_infeasible_plan_has_no_partial_writes(api, seed, resource, key, updates):
    assert (
        api.patch(f"/api/v1/{resource}/{seed[key]['id']}", json=updates).status_code
        == 200
    )
    assert generate(api, seed)["valid"] is False
    assert api.get("/api/v1/routes/").json() == []
    assert api.get("/api/v1/orders/").json()[0]["status"] == "pending"


def test_replanning_assigned_order_is_rejected(api, seed):
    assert generate(api, seed)["valid"]
    assert not generate(api, seed)["valid"]
    assert len(api.get("/api/v1/routes/").json()) == 1


def test_planned_orders_cannot_be_edited_or_deleted(api, seed):
    assert generate(api, seed)["valid"]
    path = "/api/v1/orders/" + seed["order"]["id"]
    assert api.patch(path, json={"weight_kg": 10000}).status_code == 409
    assert api.delete(path).status_code == 409


def test_dispatch_deliver_finish(api, seed):
    route = generate(api, seed)["routes"][0]
    api.headers["Authorization"] = "Bearer driver"
    url = "/api/v1/routes/" + route["id"] + "/status"
    assert api.put(url, json={"status": "in_route"}).status_code == 200
    assert api.put(url, json={"status": "finished"}).status_code == 409
    order_url = "/api/v1/orders/" + seed["order"]["id"] + "/status"
    assert api.put(order_url, json={"status": "delivered"}).status_code == 200
    assert api.get("/api/v1/orders/").json()[0]["delivered_at"]
    finished = api.put(url, json={"status": "finished"})
    assert finished.status_code == 200
    assert finished.json()["completed_deliveries"] == 1
    assert finished.json()["stops"][0]["status"] == "delivered"
    assert api.put(order_url, json={"status": "in_route"}).status_code == 409


def test_deleting_pending_route_unassigns_orders(api, seed):
    route = generate(api, seed)["routes"][0]
    assert api.delete("/api/v1/routes/" + route["id"]).status_code == 200
    order = api.get("/api/v1/orders/").json()[0]
    assert order["status"] == "pending"
    assert order["route_id"] is None and order["driver_id"] is None
    assert generate(api, seed)["valid"]


def test_validation_does_not_write(api, seed):
    result = api.post("/api/v1/routes/validate", json=seed["plan"])
    assert result.json()["valid"]
    assert api.get("/api/v1/routes/").json() == []
    assert api.get("/api/v1/orders/").json()[0]["status"] == "pending"
