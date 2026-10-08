## Context

The frontend (React/Vite, built with Bolt) currently connects directly to Supabase using the JS client. The DB schema is already defined and deployed in Supabase (tables: vehicles, drivers, clients, orders, routes, parameters, notifications with RLS). Backend directory exists but is empty. Requirements call for a FastAPI backend layer (React → FastAPI → PostgreSQL/Supabase) to provide proper validation, business logic separation, pluggable optimization engine, and independent testing.

Constraints from requirements: no SQLite/mock as substitute for DB, no Redis/microservices/K8s/OAuth external complexity, use PostgreSQL/Supabase, PostGIS when appropriate, async where applicable, keep simple and clean.

## Goals / Non-Goals

**Goals:**
- Create a functional FastAPI backend with clean layered architecture (API → Services → Repositories → Models/DB)
- Implement Sprint 1 CRUD endpoints with backend validation matching/enforcing business rules
- Implement Sprint 2 base endpoints with clear separation for optimization (pluggable), validation (US-014), traffic adapter (US-016)
- Connect to Supabase PostgreSQL via DATABASE_URL (not Supabase client), never hardcode secrets
- Provide `/health`, Swagger `/docs`, proper error handling, CORS config
- Include basic pytest tests and Alembic setup

**Non-Goals:**
- Implement US-015 (re-optimization) - explicitly excluded
- Build full production optimization engine (OR-Tools integration) - just pluggable interface with demonstrative impl
- External traffic provider integration - only abstraction with no-op
- Full JWT/RBAC implementation - architecture prep only if needed
- Modifying frontend code (build backend independently first)

## Decisions

### 1. Async stack (FastAPI + SQLAlchemy 2.0 + asyncpg)
- **Choice**: SQLAlchemy 2.0 with async sessions (`AsyncSession`), `asyncpg` driver, `postgresql+asyncpg://` URL
- **Rationale**: Better I/O concurrency for FastAPI, cleaner async/await, matches "operaciones async cuando corresponda" requirement
- **Alternatives considered**: Sync SQLAlchemy (simpler but less async-native); psycopg3/asyncpg both fine; chose asyncpg

### 2. Database connection to Supabase
- **Choice**: Direct PostgreSQL connection via `DATABASE_URL` (service/connection string from Supabase) with `sslmode=require`
- **Rationale**: Keeps backend decoupled from Supabase client SDK, works with standard ORMs, matches "PostgreSQL/Supabase" target
- **Alternatives considered**: Supabase REST API (loses ORM benefits, transaction control); direct is cleaner

### 3. Models match existing schema exactly
- **Choice**: Define SQLAlchemy models with explicit `__tablename__` matching Supabase migration; use UUID types, JSONB for `routes.stops`, ARRAY for `orders.restrictions`
- **Rationale**: DB already exists - avoid migrations conflicts; ensure compatibility
- **Alternatives considered**: Generate from DB (sqlacodegen) - acceptable, but explicit models give control

### 4. Layered architecture with repository pattern
- **Choice**: API (routes) → Services (business logic) → Repositories (data access) → Models/DB. Domain interfaces for pluggable components (optimization, traffic)
- **Rationale**: Clear separation per US-012 requirement, testability, swappable optimization service
- **Alternatives considered**: Services directly using sessions (simpler) - but repos improve testability

### 5. Optimization service as pluggable interface
- **Choice**: Define `OptimizationService` Protocol/ABC in `domain/interfaces/optimization.py`. `RouteService` depends on interface. Default `BasicOptimizationService` is demonstrative with clear docstrings labeling it as initial implementation.
- **Rationale**: Fulfills "El Optimization Service debe poder reemplazarse posteriormente por un algoritmo real como OR-Tools" and "claramente identificada como implementación inicial"
- **Alternatives considered**: Just inline logic in RouteService (harder to swap) - rejected

### 6. Traffic as adapter pattern
- **Choice**: `TrafficProvider` Protocol with `get_status()` returning `TrafficStatus(available=False, source="none", ...)` by default. No external calls; system continues if unavailable.
- **Rationale**: Meets US-016 exactly (abstraction, no external coupling from API, graceful degradation)
- **Alternatives considered**: Return mock data - explicitly rejected by requirement ("NO inventar tráfico real")

### 7. Route validation (US-014) as separate service
- **Choice**: `RouteValidationService` that checks orders validity, coords, weight/volume, time windows, vehicle/driver availability, capacity sufficiency, coherent restrictions. Returns structured dict with `valid`, `errors`, `warnings`.
- **Rationale**: Clear contract, reusable before generation, testable
- **Alternatives considered**: Inline in generation - but requirement says "servicio de validación antes de generar rutas"

### 8. API contract and response shapes
- **Choice**: Mirror logical operations; return Pydantic response models. Keep snake_case from DB mapping internally but API uses clear field names; align with frontend types where sensible. Document in Swagger.
- **Rationale**: Frontend will adapt later as stated; Swagger enables independent testing

### 9. Configuration via Pydantic Settings
- **Choice**: `core/config.py` with `pydantic-settings`, load from `.env`, include `DATABASE_URL`, `CORS_ORIGINS`, timeouts, etc.
- **Rationale**: Type-safe, validates env, easy to override

### 10. Testing strategy
- **Choice**: Pytest + FastAPI `TestClient`. Basic tests for health, CRUD, validation, route validation/generate. For DB, can use test DB or transaction rollback; keep simple for base version.
- **Rationale**: Meets "pruebas básicas" requirement

## Risks / Trade-offs

- **[Risk] RLS interaction with direct DB connection**: Supabase has RLS on tables (anon allowed). Connecting via service DB URL may bypass RLS depending on role; but policies are permissive for anon/authenticated as per schema. For backend service, we typically use connection with appropriate role. Mitigation: Document that backend uses direct connection; RLS is less relevant if backend controls access, but keep compatible with existing setup.
- **[Trade-off] route_id type (text in schema)**: Schema stores as `text`, frontend stores UUID. We’ll store as string (UUID str). Works but not ideal FK. Mitigation: Accept as-is for compatibility with existing schema.
- **[Risk] Alembic vs existing schema**: DB already exists in Supabase. Alembic env should be configured; for initial setup, models match schema. Mitigation: Generate initial migration or stamp if needed; focus on models matching existing schema.
- **[Trade-off] Demo optimization is simplistic**: Clearly label as initial/demonstrative to avoid confusion. Mitigation: Add prominent docstrings and maybe `generation_strategy: "demonstrative_initial"` in response/metadata.
- **[Risk] Missing deps installation**: Need to add sqlalchemy, alembic, asyncpg to requirements. Mitigation: Include in requirements.txt.