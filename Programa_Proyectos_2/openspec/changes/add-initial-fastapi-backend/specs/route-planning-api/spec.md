## ADDED Requirements

### Requirement: Order preferences management
The system SHALL provide GET and PUT endpoints for order preferences at `/api/v1/orders/{order_id}/preferences`.

#### Scenario: Get order preferences
- **WHEN** a GET request is made to `/api/v1/orders/{order_id}/preferences`
- **THEN** the system returns preferences for the order with 200 status

#### Scenario: Update order preferences
- **WHEN** a PUT request is made to `/api/v1/orders/{order_id}/preferences` with valid data
- **THEN** the system updates and returns 200 with updated preferences

### Requirement: Order restrictions management
The system SHALL provide GET and PUT endpoints for order restrictions at `/api/v1/orders/{order_id}/restrictions`.

#### Scenario: Get order restrictions
- **WHEN** a GET request is made to `/api/v1/orders/{order_id}/restrictions`
- **THEN** the system returns restrictions for the order with 200 status

#### Scenario: Update order restrictions
- **WHEN** a PUT request is made to `/api/v1/orders/{order_id}/restrictions` with valid data
- **THEN** the system updates and returns 200 with updated restrictions

### Requirement: Route planning validation (US-014)
The system SHALL provide POST `/api/v1/routes/validate` to validate planning data before route generation. The response MUST include `valid` (boolean) and a list of `errors`/`warnings`.

#### Scenario: Validate with valid planning data
- **WHEN** a POST request is made to `/api/v1/routes/validate` with valid orders, vehicles, drivers and coherent data
- **THEN** the system returns 200 with `valid: true` and possibly warnings

#### Scenario: Validate with insufficient capacity
- **WHEN** total weight/volume of selected orders exceeds available vehicle capacity
- **THEN** the system returns 200 with `valid: false` and descriptive error messages

#### Scenario: Validate with unavailable resources
- **WHEN** selected vehicles/drivers are not available or time windows conflict
- **THEN** the system returns 200 with `valid: false` and appropriate errors

#### Scenario: Validate checks basic constraints
- **WHEN** validating planning
- **THEN** the system checks valid orders, coordinates present, weight/volume >= 0, time windows coherent, vehicle/driver availability, capacity sufficiency, and coherent restrictions

### Requirement: Route generation with pluggable optimization (US-012)
The system SHALL provide POST `/api/v1/routes/generate` to generate routes. The optimization logic MUST be separated via an Optimization Service interface so it can be replaced later (OR-Tools). The initial implementation MUST be clearly marked as demonstrative/non-definitive.

#### Scenario: Generate routes from valid plan
- **WHEN** a POST request is made to `/api/v1/routes/generate` with valid planning parameters
- **THEN** the system returns 200 with generated routes (or appropriate response) including `generation_time_ms` metric

#### Scenario: Optimization service is pluggable
- **WHEN** the optimization service is swapped for an alternative implementation
- **THEN** the route generation logic continues to work without changes to API/service orchestration

#### Scenario: Initial implementation clearly marked
- **WHEN** inspecting the optimization service implementation
- **THEN** it is clearly documented as initial/demonstrative (not production optimization)

#### Scenario: Proper error handling on invalid plan
- **WHEN** generating routes with invalid data
- **THEN** the system returns appropriate HTTP status with explanation of the problem

### Requirement: Routes listing and retrieval
The system SHALL provide GET `/api/v1/routes` and GET `/api/v1/routes/{id}` to list and retrieve routes.

#### Scenario: List routes
- **WHEN** a GET request is made to `/api/v1/routes`
- **THEN** the system returns all routes with 200 status

#### Scenario: Get route by id
- **WHEN** a GET request is made to `/api/v1/routes/{id}` for existing route
- **THEN** the system returns 200 with route details

### Requirement: Performance instrumentation (EN-001)
The system SHALL measure and record route generation time and implement basic performance practices: async operations where appropriate, efficient queries, validation before optimization, configurable timeouts, logging, and returning `generation_time_ms`.

#### Scenario: Route generation returns timing metric
- **WHEN** routes are generated
- **THEN** the response/logging includes `generation_time_ms` indicating time taken

#### Scenario: Validation occurs before optimization
- **WHEN** generating routes
- **THEN** the system validates inputs before executing optimization logic

#### Scenario: Timeouts and logging configured
- **WHEN** the system processes route generation
- **THEN** it applies reasonable timeouts and logs appropriately without sensitive data
