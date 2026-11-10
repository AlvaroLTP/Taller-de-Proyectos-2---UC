from uuid import UUID

import pytest
from fastapi import Depends, HTTPException
from fastapi.testclient import TestClient
from sqlalchemy import event
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.core import database
from app.core.security import CurrentUser, bearer, get_current_user
from app.main import app
from app.models.base import Base


@pytest.fixture
def api(monkeypatch):
    engine = create_async_engine("sqlite+aiosqlite://", poolclass=StaticPool)

    @event.listens_for(engine.sync_engine, "connect")
    def foreign_keys(connection, _):
        connection.execute("PRAGMA foreign_keys=ON")

    factory = async_sessionmaker(engine, expire_on_commit=False)
    monkeypatch.setattr(database, "session_factory", lambda: factory)
    users = {
        "admin": CurrentUser(id=UUID(int=1), role="admin"),
        "operator": CurrentUser(id=UUID(int=2), role="operator"),
        "driver": CurrentUser(id=UUID(int=3), role="driver", driver_id=UUID(int=100)),
    }

    async def identity(credentials=Depends(bearer)):
        if not credentials or credentials.credentials not in users:
            raise HTTPException(401, "Sesión inválida")
        return users[credentials.credentials]

    app.dependency_overrides[get_current_user] = identity

    async def setup():
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)

    with TestClient(app) as client:
        client.portal.call(setup)
        client.headers["Authorization"] = "Bearer admin"
        client.users = users
        yield client
        client.portal.call(engine.dispose)
    app.dependency_overrides.clear()


@pytest.fixture
def seed(api):
    def create(resource, body):
        response = api.post("/api/v1/" + resource + "/", json=body)
        assert response.status_code == 201, response.text
        return response.json()

    client = create(
        "clients",
        {
            "name": "Cliente",
            "phone": "999111222",
            "street": "Av. Lima",
            "district": "Lima",
        },
    )
    driver = create(
        "drivers",
        {
            "name": "Conductor",
            "dni": "12345678",
            "phone": "999111222",
            "license": "LIC-001",
        },
    )
    vehicle = create(
        "vehicles",
        {
            "code": "V-1",
            "plate": "ABC-123",
            "type": "Van",
            "brand": "Test",
            "model": "M",
            "capacity_kg": 1000,
            "capacity_m3": 10,
            "consumption_km_per_l": 10,
            "emissions_per_km": 0.2,
        },
    )
    order = create(
        "orders",
        {
            "code": "P-1",
            "client_id": client["id"],
            "phone": "999111222",
            "street": "Av. Lima",
            "district": "Lima",
            "lat": -12.04,
            "lng": -77.03,
            "delivery_date": "2026-10-26",
            "time_window_start": "09:00",
            "time_window_end": "12:00",
            "weight_kg": 100,
            "volume_m3": 1,
        },
    )
    api.users["driver"].driver_id = UUID(driver["id"])
    return {
        "client": client,
        "driver": driver,
        "vehicle": vehicle,
        "order": order,
        "plan": {
            "date": "2026-10-26",
            "order_ids": [order["id"]],
            "vehicle_ids": [vehicle["id"]],
            "driver_ids": [driver["id"]],
        },
    }
