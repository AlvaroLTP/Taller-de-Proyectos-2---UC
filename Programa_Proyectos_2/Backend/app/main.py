from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    clients,
    drivers,
    health,
    notifications,
    orders,
    parameters,
    routes,
    traffic,
    vehicles,
)
from app.core.config import settings
from app.core.security import get_current_user

app = FastAPI(title=settings.APP_NAME, debug=False)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Cache-Control"] = "no-store"
    return response


app.include_router(health.router)
for module in (
    vehicles,
    drivers,
    clients,
    orders,
    parameters,
    routes,
    traffic,
    notifications,
):
    app.include_router(module.router, dependencies=[Depends(get_current_user)])
