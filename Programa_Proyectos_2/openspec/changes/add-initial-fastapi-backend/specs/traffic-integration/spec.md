## ADDED Requirements

### Requirement: Traffic status abstraction (US-016)
The system SHALL provide GET `/api/v1/traffic/status` to retrieve traffic information via an abstraction/adapter pattern. The implementation MUST NOT call external providers directly from API routes; the adapter interface allows future integration. If no provider is configured, the system SHALL return `available: false` and continue operating normally.

#### Scenario: No provider configured returns unavailable
- **WHEN** no traffic provider is configured
- **THEN** the system returns 200 with `available: false`, appropriate `source` (e.g., "none"), and other fields may be null/absent; no external network calls are made

#### Scenario: Traffic adapter is abstracted
- **WHEN** inspecting the traffic implementation
- **THEN** there is a clear provider interface/abstraction separating API from provider implementation

#### Scenario: System continues without traffic data
- **WHEN** traffic status is unavailable
- **THEN** the system operates normally using base/default data without errors

#### Scenario: Response includes required fields
- **WHEN** traffic status is returned
- **THEN** the response includes at least `available` (bool), `congestion_level` (nullable), `updated_at` (nullable), and `source` (nullable/string)

#### Scenario: No fabricated real traffic data
- **WHEN** no real provider is configured
- **THEN** the system does not invent or fabricate realistic traffic values; it returns unavailable state only
