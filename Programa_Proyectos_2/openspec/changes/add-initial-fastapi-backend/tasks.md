## 1. Project Setup

- [ ] 1.1 Create Backend/ directory structure (app/core, app/api/routes, app/domain/interfaces, app/models, app/schemas, app/repositories, app/services, tests, alembic)
- [ ] 1.2 Add Python dependencies to requirements.txt (sqlalchemy, alembic, asyncpg) and ensure existing deps present
- [ ] 1.3 Create .env.example with DATABASE_URL, CORS_ORIGINS, APP_NAME, DEBUG settings
- [ ] 1.4 Create README.md explaining how to run backend, env setup, test, and endpoints
- [ ] 1.5 Initialize Alembic (alembic init alembic) and configure env.py for async SQLAlchemy with models

## 2. Core Infrastructure

- [ ] 2.1 Create core/config.py with Pydantic Settings loading from env (no hardcoded secrets)
- [ ] 2.2 Create core/database.py with async engine, sessionmaker, get_db dependency
- [ ] 2.3 Create core/exceptions.py for consistent error handling
- [ ] 2.4 Create models/base.py with declarative base
- [ ] 2.5 Create app/main.py with FastAPI app, CORS, exception handlers, health/router registration
- [ ] 2.6 Create api/routes/health.py with GET /health (include DB check without exposing sensitive info)

## 3. Models (SQLAlchemy) matching existing schema

- [ ] 3.1 Create models/vehicle.py (vehicles table: id uuid, code, plate, type, brand, model, capacity_kg/m3 numeric, consumption_km_per_l, fuel_type, emissions_per_km, status, available, driver_id, created_at)
- [ ] 3.2 Create models/driver.py (drivers: id, name, dni, phone, license, license_type, status, available, vehicle_id, shift_start/end, avatar_initials, created_at)
- [ ] 3.3 Create models/client.py (clients with address fields, priority, notes)
- [ ] 3.4 Create models/order.py (orders: client_id FK, address fields, time windows, weight/vol, preferences fields like pref_*, restrictions array, route_id text, etc.)
- [ ] 3.5 Create models/route.py (routes: driver_id, vehicle_id, date, metrics, status, stops jsonb, etc.)
- [ ] 3.6 Create models/parameter.py (parameters singleton row)
- [ ] 3.7 Create models/notification.py (notifications)
- [ ] 3.8 Update models/__init__.py to export models

## 4. Pydantic Schemas with validation

- [ ] 4.1 Create schemas/common.py (base response types)
- [ ] 4.2 Create schemas/vehicle.py (Create/Update/Response with validators for plate, capacity>0, emissions>=0, valid status)
- [ ] 4.3 Create schemas/driver.py (Create/Update/Response with validators for DNI/license/availability)
- [ ] 4.4 Create schemas/client.py (Create/Update/Response)
- [ ] 4.5 Create schemas/order.py (Create/Update/Response with validators for coords, weight>=0, volume>=0, valid time window, priority)
- [ ] 4.6 Create schemas/parameter.py
- [ ] 4.7 Create schemas/route.py (route validation/generation request/response, includes errors/warnings, generation_time_ms)
- [ ] 4.8 Create schemas/preferences.py and schemas/traffic.py as needed

## 5. Repositories (data access)

- [ ] 5.1 Create repositories/base.py (generic CRUD)
- [ ] 5.2 Create repositories/vehicle.py
- [ ] 5.3 Create repositories/driver.py
- [ ] 5.4 Create repositories/client.py
- [ ] 5.5 Create repositories/order.py
- [ ] 5.6 Create repositories/route.py
- [ ] 5.7 Create repositories/parameter.py
- [ ] 5.8 Create repositories/notification.py

## 6. Domain Interfaces (pluggable)

- [ ] 6.1 Create domain/interfaces/optimization.py - OptimizationService Protocol/ABC, OptimizationResult dataclass, clearly marked for swappability
- [ ] 6.2 Create domain/interfaces/traffic.py - TrafficProvider Protocol and TrafficStatus dataclass

## 7. Services (business logic)

- [ ] 7.1 Create services/validation_service.py (shared validators)
- [ ] 7.2 Create services/optimization_service.py - Default/Basic implementation clearly labeled as initial/demonstrative (not production optimization); implements OptimizationService
- [ ] 7.3 Create services/route_validation_service.py (US-014) - checks orders, coords, weight/vol, time windows, vehicles/drivers availability, capacity, restrictions; returns valid/errors/warnings
- [ ] 7.4 Create services/route_service.py - orchestrates validation + optimization + persistence; returns generation_time_ms
- [ ] 7.5 Create services/traffic_service.py - NoOpTrafficProvider implementation returning available=false, source="none"

## 8. API Routes (Sprint 1)

- [ ] 8.1 Create api/routes/__init__.py to register routers
- [ ] 8.2 Create api/routes/vehicles.py - GET/POST /api/v1/vehicles, GET/PUT/DELETE /api/v1/vehicles/{id}
- [ ] 8.3 Create api/routes/drivers.py - GET/POST /api/v1/drivers, GET/PUT/DELETE /api/v1/drivers/{id}
- [ ] 8.4 Create api/routes/clients.py - GET/POST /api/v1/clients, GET/PUT/DELETE /api/v1/clients/{id}
- [ ] 8.5 Create api/routes/orders.py - GET/POST /api/v1/orders, GET/PUT/DELETE /api/v1/orders/{id}
- [ ] 8.6 Create api/routes/parameters.py - GET/PUT /api/v1/parameters

## 9. API Routes (Sprint 2)

- [ ] 9.1 Add preferences endpoints in orders routes or separate: GET/PUT /api/v1/orders/{order_id}/preferences
- [ ] 9.2 Add restrictions endpoints: GET/PUT /api/v1/orders/{order_id}/restrictions
- [ ] 9.3 Create api/routes/routes.py - POST /api/v1/routes/validate, POST /api/v1/routes/generate (with generation_time_ms), GET /api/v1/routes, GET /api/v1/routes/{id}
- [ ] 9.4 Create api/routes/traffic.py - GET /api/v1/traffic/status using traffic provider abstraction
- [ ] 9.5 Register all routers in app/main.py

## 10. Testing (basic pytest)

- [ ] 10.1 Create tests/conftest.py with TestClient and fixtures
- [ ] 10.2 Create tests/test_health.py (/health)
- [ ] 10.3 Create tests/test_vehicles.py (list/create/validate)
- [ ] 10.4 Create tests/test_drivers.py (list/create)
- [ ] 10.5 Create tests/test_orders.py (list/create/validate)
- [ ] 10.6 Create tests/test_routes.py (validate/generate basic)
- [ ] 10.7 Create tests/test_traffic.py (/traffic/status returns available false when no provider)

## 11. Finalization & Verification

- [ ] 11.1 Update requirements.txt with all needed packages (fastapi, uvicorn, pydantic, pydantic-settings, sqlalchemy, alembic, asyncpg, psycopg2-binary, pytest, httpx)
- [ ] 11.2 Create alembic.ini and configure alembic/env.py to target models metadata
- [ ] 11.3 Ensure no SQLite usage, no mock data as DB substitute in runtime code, no microservices added, no US-015 implemented
- [ ] 11.4 Ensure secrets not in code, logging has no sensitive info, CORS configurable
- [ ] 11.5 Run lint/typecheck if available; run pytest; start uvicorn to verify /health and /docs work
- [ ] 11.6 Update README.md with clear run instructions and endpoint summary
