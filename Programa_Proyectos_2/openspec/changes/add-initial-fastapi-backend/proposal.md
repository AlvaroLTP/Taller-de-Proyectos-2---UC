## Why

We need a functional FastAPI backend as the API layer between the existing React frontend and Supabase/PostgreSQL. The frontend is already built (Bolt) and connected to Supabase directly, but the requirements call for an architecture where React → FastAPI → PostgreSQL/Supabase. This provides a clean separation of concerns, enables proper validation/business logic, prepares for route optimization (pluggable engine), and allows independent backend testing before frontend integration.

## What Changes

- **Backend application structure**: Create organized FastAPI app with `app/` containing `api/routes/`, `core/`, `domain/`, `models/`, `schemas/`, `repositories/`, `services/` following the specified layered architecture
- **Database layer**: SQLAlchemy 2.0 async models matching the existing Supabase schema (vehicles, drivers, clients, orders, routes, parameters, notifications)
- **API endpoints (Sprint 1)**: CRUD for vehicles, drivers, orders, clients, and read/update for parameters at `/api/v1/*`
- **API endpoints (Sprint 2)**: Preferences/restrictions per order, routes validation/generate, routes listing, and traffic status with adapter pattern
- **Business logic**: Route validation service (US-014) with structured errors/warnings; route generation service with pluggable optimization interface (US-012); traffic provider abstraction (US-016); performance instrumentation (EN-001)
- **Configuration & infrastructure**: Environment-based config (.env.example), async DB session management, CORS, error handling, logging without sensitive data
- **Health & docs**: `/health` endpoint and automatic Swagger/OpenAPI at `/docs`
- **Tooling**: Alembic for migrations, requirements.txt with needed deps (SQLAlchemy, alembic, asyncpg), pytest test structure with basic tests

## Capabilities

### New Capabilities

- `backend-api-core`: Core FastAPI app setup with config, database, error handling, health checks, and OpenAPI documentation
- `fleet-management-api`: CRUD operations and validation for vehicles, drivers with proper Pydantic validation rules
- `orders-management-api`: CRUD operations and validation for orders and clients with time windows, coordinates, and constraints
- `parameters-api`: Operational parameters retrieval and updates
- `route-planning-api`: Route validation (pre-checks), route generation with pluggable optimization service, route listing, preferences and restrictions management
- `traffic-integration`: Traffic status abstraction with no-op provider that allows system to continue when no provider configured

### Modified Capabilities

None - these are new backend capabilities being introduced.

## Impact

- **New code**: `Backend/` directory populated with full FastAPI application (does not modify existing Frontend code)
- **Dependencies**: Need to add `sqlalchemy`, `alembic`, `asyncpg` to Python environment (already have fastapi, pydantic, pytest, httpx)
- **Configuration**: Requires `DATABASE_URL` (Supabase Postgres connection string) and CORS settings via environment variables
- **Architecture**: Establishes clear separation (API → Services → Repositories → DB) enabling future optimization engine swap (OR-Tools)
- **Integration path**: Frontend will be able to consume these REST endpoints later (independent backend first as specified)