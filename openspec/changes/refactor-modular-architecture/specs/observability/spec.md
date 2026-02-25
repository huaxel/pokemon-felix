## ADDED Requirements

### Requirement: Backend errors are handled consistently
The backend SHALL convert unexpected errors into a consistent JSON error response and MUST avoid leaking secrets or internal implementation details in responses.

#### Scenario: Unhandled error occurs in a route
- **WHEN** a backend route throws an error that is not explicitly handled
- **THEN** the backend returns a non-2xx status code with a consistent JSON error shape

### Requirement: Backend logging is structured and safe
The backend MUST provide a logger abstraction that supports log levels and MUST NOT log secrets (e.g., API keys, tokens).

#### Scenario: Backend logs a request failure
- **WHEN** a request fails due to an internal error
- **THEN** the backend logs the failure with a level of error and without including secrets

### Requirement: Frontend error reporting is centralized
The frontend SHALL provide a consistent mechanism to surface user-visible errors while keeping module errors structured for testing and debugging.

#### Scenario: User-facing operation fails
- **WHEN** a UI action fails due to a recoverable error
- **THEN** the user receives a consistent error message through the UI’s notification mechanism
