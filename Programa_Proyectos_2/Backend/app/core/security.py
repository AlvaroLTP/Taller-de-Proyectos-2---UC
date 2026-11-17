from typing import Literal
from uuid import UUID

import httpx
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ValidationError

from app.core.config import settings

bearer = HTTPBearer(auto_error=False)


class CurrentUser(BaseModel):
    id: UUID
    role: Literal["admin", "operator", "driver"]
    driver_id: UUID | None = None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> CurrentUser:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            401, "Autenticación requerida", headers={"WWW-Authenticate": "Bearer"}
        )
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        raise HTTPException(503, "Autenticación no configurada")
    headers = {
        "apikey": settings.SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {credentials.credentials}",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/user", headers=headers
            )
            if response.status_code in (401, 403):
                raise HTTPException(
                    401,
                    "Sesión inválida o expirada",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            response.raise_for_status()
            uid = UUID(response.json()["id"])
            profile = await client.get(
                f"{settings.SUPABASE_URL.rstrip('/')}/rest/v1/profiles",
                headers=headers,
                params={"id": f"eq.{uid}", "select": "id,role,driver_id"},
            )
            profile.raise_for_status()
            rows = profile.json()
            if len(rows) != 1:
                raise HTTPException(403, "Perfil no autorizado")
            user = CurrentUser.model_validate(rows[0])
            if user.id != uid or (user.role == "driver" and not user.driver_id):
                raise HTTPException(403, "Perfil no autorizado")
            return user
    except (httpx.HTTPError, ValueError, KeyError, TypeError, ValidationError):
        raise HTTPException(503, "No se pudo verificar la sesión") from None


async def require_staff(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if user.role not in ("admin", "operator"):
        raise HTTPException(403, "Permiso insuficiente")
    return user


def ensure_owner(user: CurrentUser, driver_id):
    if user.role == "driver" and (
        not user.driver_id or str(user.driver_id) != str(driver_id)
    ):
        raise HTTPException(404, "No encontrado")
