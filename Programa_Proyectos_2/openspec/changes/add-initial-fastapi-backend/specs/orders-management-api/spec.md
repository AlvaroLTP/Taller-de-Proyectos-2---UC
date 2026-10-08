## ADDED Requirements

### Requirement: Client CRUD operations
The system SHALL provide CRUD endpoints for clients under `/api/v1/clients` supporting GET (list), GET by id, POST, PUT, DELETE.

#### Scenario: Manage clients lifecycle
- **WHEN** performing standard CRUD operations on clients
- **THEN** the system returns appropriate status codes and data

### Requirement: Order CRUD operations
The system SHALL provide CRUD endpoints for orders under `/api/v1/orders` supporting GET (list), GET by id, POST, PUT, DELETE.

#### Scenario: Manage orders lifecycle
- **WHEN** performing standard CRUD operations on orders
- **THEN** the system returns appropriate status codes and data

### Requirement: Order backend validation
The system SHALL enforce backend validations for orders: client reference valid, coordinates valid (lat/lng within reasonable ranges), weight_kg >= 0, volume_m3 >= 0, time window valid (time_window_start < time_window_end and coherent format), priority valid enum.

#### Scenario: Reject order with negative weight
- **WHEN** creating/updating an order with weight_kg < 0
- **THEN** the system returns 422 with validation error

#### Scenario: Reject order with invalid time window
- **WHEN** creating/updating an order where time window start is not before end
- **THEN** the system returns 422 with validation error

#### Scenario: Reject order with invalid coordinates
- **WHEN** creating/updating an order with invalid lat/lng values
- **THEN** the system returns 422 with validation error

#### Scenario: Reject order with invalid priority
- **WHEN** creating/updating an order with invalid priority value
- **THEN** the system returns 422 with validation error
