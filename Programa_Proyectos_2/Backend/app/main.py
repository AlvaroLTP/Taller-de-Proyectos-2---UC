from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, vehicles, drivers, clients, orders, parameters, routes, traffic

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(health.router, tags=['health'])
app.include_router(vehicles.router, tags=['vehicles'])
app.include_router(drivers.router, tags=['drivers'])
app.include_router(clients.router, tags=['clients'])
app.include_router(orders.router, tags=['orders'])
app.include_router(parameters.router, tags=['parameters'])
app.include_router(routes.router, tags=['routes'])
app.include_router(traffic.router, tags=['traffic'])