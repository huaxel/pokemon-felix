## 1. Baseline And Guardrails

- [x] 1.1 Verify no merge conflicts or unmerged paths exist
- [x] 1.2 Run existing frontend tests and ensure green baseline
- [x] 1.3 Run backend smoke checks for existing endpoints
- [x] 1.4 Add module boundary lint rules to prevent deep cross-module imports

## 2. Frontend Module Layer

 - [x] 2.1 Create initial `src/modules/` scaffolding with public `index.js` exports
- [x] 2.2 Add module documentation format and create docs for initial modules
- [x] 2.3 Migrate selected shared logic from `src/lib/` into modules behind public APIs

## 3. Frontend Dependency Injection

- [x] 3.1 Implement frontend services container and `ServicesProvider`
- [x] 3.2 Add `useServices()` hook and typed service interfaces (logger, storage, http)
- [x] 3.3 Refactor representative features/hooks to use injected services

## 4. Observability

- [x] 4.1 Implement frontend logger abstraction and integrate with existing UI error notifications
- [x] 4.2 Refactor backend to central error middleware and consistent JSON error responses
- [x] 4.3 Add backend logger abstraction with levels and request context

## 5. LLM Provider Plugin System

- [x] 5.1 Define LLM provider contract and provider registry/factory
- [x] 5.2 Implement OpenRouter provider adapter using existing frontend LLM integration
- [x] 5.3 Implement mock provider for deterministic unit tests
- [x] 5.4 Refactor chat feature to use the provider interface instead of direct network calls

## 6. Testing And Coverage Gates

- [x] 6.1 Enable Vitest coverage reporting and configure ≥80% thresholds
- [x] 6.2 Add unit tests for module boundaries and DI wiring behavior
- [x] 6.3 Add unit tests for LLM provider selection and mock provider behavior
- [x] 6.4 Add unit tests for observability behaviors (error handling and logging contracts)

## 7. Verification

- [x] 7.1 Run full frontend test suite with coverage and ensure thresholds pass
- [x] 7.2 Run backend integration checks for critical API routes
- [x] 7.3 Perform a boundary review to ensure imports follow module contracts
