## Why

The codebase has grown into a set of tightly coupled features (especially around shared state, services, and cross-feature utilities), which makes change risky, testing brittle, and extensions (e.g., LLM integrations) harder to evolve. A modular architecture with clear boundaries and dependency injection will improve maintainability, testability, and scalability.

## What Changes

- Resolve any remaining merge artifacts and ensure the working tree is consistent and buildable.
- Establish explicit module boundaries for both frontend and backend (clear public interfaces, no hidden cross-module imports).
- Extract tightly coupled logic into well-defined modules and adopt dependency injection for services and side effects.
- Standardize naming conventions and directory layout to make ownership and boundaries obvious.
- Add module-level documentation describing responsibilities, public APIs, and extension points.
- Introduce consistent error handling and logging mechanisms across frontend and backend.
- Add/expand unit tests per module and enforce a minimum 80% code coverage target.
- Implement a plugin/extension system where applicable (initially for LLM providers and similar integrations).
- Verify correctness via existing tests, new module tests, and integration checks.

## Capabilities

### New Capabilities

- `module-boundaries`: Define and enforce clear frontend/backend module boundaries with explicit public interfaces.
- `service-dependency-injection`: Provide DI patterns for frontend services and backend app composition to decouple modules from concrete implementations.
- `observability`: Standardize error handling and logging (structured logs on backend; consistent reporting/handling on frontend).
- `llm-provider-plugins`: Introduce a plugin system for LLM providers (e.g., OpenRouter/Anthropic/mock) to support swapping and testing.
- `test-coverage-gates`: Enforce coverage thresholds and add module-focused unit tests targeting ≥80% coverage.

### Modified Capabilities

- (none)

## Impact

- Frontend: `src/features/**`, `src/contexts/**`, `src/hooks/**`, `src/lib/**`, routing entry points, and shared UI/utilities.
- Backend: `backend/server.js`, `backend/services/**`, and database access in `backend/db/**`.
- Tooling: Vitest configuration and coverage reporting; potential ESLint rule additions to help enforce boundaries.
- Documentation: New module documentation under `docs/architecture/` and/or co-located module docs.
