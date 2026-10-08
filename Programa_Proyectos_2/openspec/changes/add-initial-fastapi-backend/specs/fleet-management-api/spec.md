## ADDED Requirements

### Requirement: Vehicle CRUD operations
The system SHALL provide CRUD endpoints for vehicles under `/api/v1/vehicles` supporting GET (list), GET by id, POST (create), PUT (update), DELETE.

#### Scenario: List vehicles
- **WHEN** a GET request is made to `/api/v1/vehicles`
- **THEN** the system returns all vehicles with 200 status

#### Scenario: Create vehicle with valid data
- **WHEN** a POST request is made to `/api/v1/vehicles` with required valid vehicle data
- **THEN** the system creates the vehicle and returns 201 with created resource

#### Scenario: Get vehicle by id
- **WHEN** a GET request is made to `/api/v1/vehicles/{id}` for existing vehicle
- **THEN** the system returns 200 with vehicle details

#### Scenario: Update vehicle
- **WHEN** a PUT request is made to `/api/v1/vehicles/{id}` with valid updates
- **THEN** the system updates and returns 200 with updated vehicle

#### Scenario: Delete vehicle
- **WHEN** a DELETE request is made to `/api/v1/vehicles/{id}`
- **THEN** the system deletes the vehicle and returns appropriate success status

### Requirement: Vehicle backend validation
The system SHALL enforce backend validations for vehicles: plate is required/non-empty, capacity_kg > 0, capacity_m3 >= 0 (or as appropriate), consumption_km_per_l > 0 when applicable, emissions_per_km >= 0, status is valid enum value.

#### Scenario: Reject vehicle with missing plate
- **WHEN** creating/updating a vehicle without plate
- **THEN** the system returns 422 with validation error

#### Scenario: Reject vehicle with invalid capacity
- **WHEN** creating/updating a vehicle with capacity_kg <= 0
- **THEN** the system returns 422 with validation error

#### Scenario: Reject vehicle with invalid emissions
- **WHEN** creating/updating a vehicle with emissions_per_km < 0
- **THEN** the system returns 422 with validation error

### Requirement: Driver CRUD operations
The system SHALL provide CRUD endpoints for drivers under `/api/v1/drivers` supporting GET (list), GET by id, POST, PUT, DELETE.

#### Scenario: Manage drivers lifecycle
- **WHEN** performing standard CRUD operations on drivers
- **THEN** the system returns appropriate status codes and data

### Requirement: Driver backend validation
The system SHALL enforce backend validations for drivers: DNI required/non-empty, license required, license type valid, availability status valid; DNI format/basic validity enforced.

#### Scenario: Reject driver with missing DNI
- **WHEN** creating/updating a driver without DNI
- **THEN** the system returns 422 with validation error

#### Scenario: Reject driver with missing license
- **WHEN** creating/updating a driver without license information
- **THEN** the system returns 422 with validation error

#### Scenario: Reject driver with invalid availability state
- **WHEN** creating/updating a driver with invalid availability/status values
- **THEN** the system returns 422 with validation error
