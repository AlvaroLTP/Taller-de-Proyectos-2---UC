## ADDED Requirements

### Requirement: FastAPI app boots successfully
The backend SHALL initialize a FastAPI application that starts without errors and exposes `/health` and `/docs`.

#### Scenario: Health check endpoint
- **WHEN** a GET request is made to `/health`
- **THEN** the system returns a 200 status with `{"status": "ok"}` (optionally including DB connectivity info without sensitive data)

#### Scenario: API docs available
- **WHEN** a GET request is made to `/docs`
- **THEN** the system returns the Swagger UI successfully

### Requirement: Configuration is environment-driven
The system SHALL load configuration from environment variables (via Pydantic Settings) including DATABASE_URL, CORS settings, and other required params; secrets must not be hardcoded.

#### Scenario: Missing required config fails fast
- **WHEN** required environment variables are missing or invalid
- **THEN** the application fails to start with clear validation errors

#### Scenario: CORS configured from environment
- **WHEN** CORS_ORIGINS is set in environment
- **THEN** the application applies those origins to CORS middleware

### Requirement: Database connectivity is configured securely
The system SHALL connect to PostgreSQL (Supabase) using async SQLAlchemy 2.0 with connection pooling and SSL as appropriate; DATABASE_URL must never be logged.

#### Scenario: DB session dependency available
- **WHEN** API routes need DB access
- **THEN** a properly scoped async session is provided via dependency injection

### Requirement: Structured error handling
The system SHALL handle errors consistently and avoid exposing stack traces or sensitive information in API responses.

#### Scenario: Validation error returns structured response
- **WHEN** a request fails Pydantic validation
- **THEN** the API returns a structured validation error (422) without internal implementation details
