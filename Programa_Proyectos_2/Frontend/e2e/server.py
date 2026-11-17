"""Disposable E2E host. Never imported by the production application.

Runs the real FastAPI routes and real bearer verification against a local
Supabase-shaped identity fixture. SQL is isolated in memory; .env is ignored.
"""
import base64
import json
import os
import sys
import time
from contextlib import asynccontextmanager
from pathlib import Path
from uuid import UUID

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "Backend"))
os.environ.update(
    DATABASE_URL="",
    SUPABASE_URL="http://127.0.0.1:8011",
    SUPABASE_ANON_KEY="e2e-public-key",
    CORS_ORIGINS="http://127.0.0.1:5174",
)

from fastapi import HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import event
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.core import database
from app.main import app
from app.models import Driver
from app.models.base import Base

# The local identity fixture shares this host. Supabase's SDK adds these
# headers; production API CORS remains unchanged in app/main.py.
for middleware in app.user_middleware:
    if middleware.cls is CORSMiddleware:
        middleware.kwargs["allow_headers"] += [
            "apikey", "x-client-info", "x-supabase-api-version", "accept-profile"
        ]

DRIVER_ID = UUID("dddddddd-dddd-4ddd-8ddd-dddddddddddd")
engine = create_async_engine("sqlite+aiosqlite://", poolclass=StaticPool)
factory = async_sessionmaker(engine, expire_on_commit=False)
database.session_factory = lambda: factory


@event.listens_for(engine.sync_engine, "connect")
def foreign_keys(connection, _):
    connection.execute("PRAGMA foreign_keys=ON")


@asynccontextmanager
async def lifespan(_app):
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    async with factory() as session:
        session.add(Driver(id=DRIVER_ID, name="E2E Driver", dni="12345678",
                           phone="999111222", license="E2E-LIC", avatar_initials="ED"))
        await session.commit()
    yield
    await engine.dispose()


app.router.lifespan_context = lifespan
users = {
    role: {"id": str(UUID(int=index)), "aud": "authenticated", "role": "authenticated",
           "email": f"{role}@e2e.local", "app_metadata": {}, "user_metadata": {},
           "created_at": "2026-01-01T00:00:00Z"}
    for index, role in enumerate(("admin", "operator", "driver"), 1)
}
tokens = {}


def encode(value):
    return base64.urlsafe_b64encode(json.dumps(value).encode()).decode().rstrip("=")


def identity(request):
    token = request.headers.get("authorization", "").removeprefix("Bearer ")
    role = tokens.get(token)
    if not role:
        raise HTTPException(401, "Invalid token")
    return role


@app.post("/auth/v1/token")
async def token(request: Request):
    body = await request.json()
    role = body.get("email", "").split("@")[0]
    if role not in users or body.get("password") != "e2e-password":
        return Response(json.dumps({"error": "invalid_grant", "msg": "Invalid login credentials"}),
                        status_code=400, media_type="application/json")
    expires = int(time.time()) + 3600
    access = f"{encode({'alg': 'HS256', 'typ': 'JWT'})}.{encode({'sub': users[role]['id'], 'exp': expires, 'role': 'authenticated'})}.fixture"
    tokens[access] = role
    return {"access_token": access, "refresh_token": "fixture-refresh", "token_type": "bearer",
            "expires_in": 3600, "expires_at": expires, "user": users[role]}


@app.get("/auth/v1/user")
async def user(request: Request):
    return users[identity(request)]


@app.get("/rest/v1/profiles")
async def profiles(request: Request):
    role = identity(request)
    profile = {"id": users[role]["id"], "role": role, "name": f"E2E {role}",
               "driver_id": str(DRIVER_ID) if role == "driver" else None,
               "avatar_initials": "ET"}
    if request.query_params.get("id") != f"eq.{profile['id']}":
        return []
    return profile if "object+json" in request.headers.get("accept", "") else [profile]


@app.post("/auth/v1/logout", status_code=204)
async def logout():
    return Response(status_code=204)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8011, log_level="warning")
