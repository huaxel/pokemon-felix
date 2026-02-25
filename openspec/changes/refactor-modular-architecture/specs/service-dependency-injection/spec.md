## ADDED Requirements

### Requirement: Frontend provides a service container
The frontend application SHALL provide a service container that supplies side-effect dependencies (e.g., logging, storage, network, time) to modules and UI features.

#### Scenario: App bootstraps services
- **WHEN** the application starts
- **THEN** it constructs a service container with runtime implementations and makes it available to UI and modules

### Requirement: Modules do not hard-wire side effects
Module logic MUST NOT directly depend on global side-effect implementations (e.g., direct `localStorage`, `fetch`, or `console` usage) and SHALL instead consume these dependencies via the service container or explicit parameters.

#### Scenario: Module uses storage
- **WHEN** module logic needs to persist state
- **THEN** it uses an injected storage interface provided by the service container

### Requirement: Tests can replace dependencies
Unit tests SHALL be able to provide mock or fake implementations of service dependencies to validate module behavior deterministically.

#### Scenario: Test replaces network dependency
- **WHEN** a unit test executes module logic that would otherwise call the network
- **THEN** the test provides a mock network implementation and asserts behavior without real network calls
