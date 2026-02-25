# services

## Responsibilities

- Provide application-wide side-effect dependencies through a single service container.
- Enable deterministic tests by allowing mock service implementations.

## Public API

- `src/modules/services/index.js` exports the service container types and helpers.

## Dependencies

- React (provider and hook)

## Tests

- Unit tests validate DI wiring and mockability.
