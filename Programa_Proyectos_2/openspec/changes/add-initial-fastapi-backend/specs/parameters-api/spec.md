## ADDED Requirements

### Requirement: Get operational parameters
The system SHALL expose GET `/api/v1/parameters` to retrieve current operational parameters.

#### Scenario: Retrieve parameters
- **WHEN** a GET request is made to `/api/v1/parameters`
- **THEN** the system returns current parameters with 200 status

### Requirement: Update operational parameters
The system SHALL expose PUT `/api/v1/parameters` to update operational parameters.

#### Scenario: Update parameters
- **WHEN** a PUT request is made to `/api/v1/parameters` with valid updates
- **THEN** the system updates and returns 200 with updated parameters
