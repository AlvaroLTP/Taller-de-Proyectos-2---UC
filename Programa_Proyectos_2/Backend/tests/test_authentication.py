import asyncio
from uuid import UUID

import httpx
import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from app.core import security


@pytest.fixture
def provider(monkeypatch):
    monkeypatch.setattr(security.settings, "SUPABASE_URL", "https://issuer.invalid")
    monkeypatch.setattr(security.settings, "SUPABASE_ANON_KEY", "public-test-key")
    original = httpx.AsyncClient
    state = {
        "auth_status": 200,
        "profile_status": 200,
        "role": "admin",
        "driver_id": None,
        "requests": [],
        "profile_id": str(UUID(int=1)),
        "missing": False,
    }

    def handle(request):
        state["requests"].append(request)
        if request.url.path == "/auth/v1/user":
            return httpx.Response(
                state["auth_status"],
                json={"id": str(UUID(int=1)), "user_metadata": {"role": "admin"}},
            )
        assert request.url.path == "/rest/v1/profiles"
        return httpx.Response(
            state["profile_status"],
            json=[]
            if state["missing"]
            else [
                {
                    "id": state["profile_id"],
                    "role": state["role"],
                    "driver_id": state["driver_id"],
                }
            ],
        )

    monkeypatch.setattr(
        security.httpx,
        "AsyncClient",
        lambda **kwargs: original(transport=httpx.MockTransport(handle), **kwargs),
    )
    return state


def authenticate():
    return asyncio.run(
        security.get_current_user(
            HTTPAuthorizationCredentials(scheme="Bearer", credentials="test-token")
        )
    )


@pytest.mark.parametrize("role", ["admin", "operator", "driver"])
def test_verified_profile_supplies_role(provider, role):
    provider["role"] = role
    provider["driver_id"] = str(UUID(int=2)) if role == "driver" else None
    assert authenticate().role == role
    assert provider["requests"][0].headers["Authorization"] == "Bearer test-token"
    assert provider["requests"][1].url.params["id"] == "eq." + str(UUID(int=1))


@pytest.mark.parametrize("status", [401, 403])
def test_invalid_token_is_rejected_before_profile_lookup(provider, status):
    provider["auth_status"] = status
    with pytest.raises(HTTPException) as error:
        authenticate()
    assert error.value.status_code == 401
    assert len(provider["requests"]) == 1


@pytest.mark.parametrize(
    "changes,code",
    [
        ({"missing": True}, 403),
        ({"role": "driver"}, 403),
        ({"profile_id": str(UUID(int=9))}, 403),
        ({"auth_status": 500}, 503),
        ({"profile_status": 500}, 503),
        ({"role": "superadmin"}, 503),
    ],
)
def test_invalid_profiles_and_provider_failures_fail_closed(provider, changes, code):
    provider.update(changes)
    with pytest.raises(HTTPException) as error:
        authenticate()
    assert error.value.status_code == code


def test_unconfigured_auth_is_unavailable(monkeypatch):
    monkeypatch.setattr(security.settings, "SUPABASE_URL", "")
    with pytest.raises(HTTPException) as error:
        authenticate()
    assert error.value.status_code == 503
