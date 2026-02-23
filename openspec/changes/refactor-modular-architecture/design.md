## Context

The frontend is a Vite + React application with a feature-based directory layout (`src/features/**`) and shared logic under `src/lib/**`. Global state is primarily managed using React Context providers in `src/contexts/**` (e.g., economy, collection, progress). The backend is an Express server (`backend/server.js`) with SQLite access and a small service layer.

Pain points motivating this change:

- Cross-feature coupling via shared hooks/contexts/services makes changes ripple unexpectedly.
- Side effects are frequently “hard-wired” (direct `fetch`, `localStorage`, `console.*`, direct env usage), complicating testing and reuse.
- Extension points (notably LLM integrations) are not expressed as contracts, making swapping and testing difficult.
- Error handling and logging are inconsistent across layers.
- Tests exist, but there is no explicit module-focused testing strategy or coverage gate.

Constraints:

- Keep the app functional throughout the refactor via incremental migration and compatibility shims.
- Avoid introducing unnecessary new dependencies; introduce tooling deps only when they materially improve verification (e.g., coverage provider).

## Goals / Non-Goals

**Goals:**

- Establish clear module boundaries with explicit public APIs and enforceable import rules.
- Decouple modules from concrete side effects using dependency injection.
- Standardize error handling and logging mechanisms across frontend and backend.
- Provide a plugin/extension mechanism for LLM providers (and future similar integrations).
- Add module-level documentation and unit tests that support a coverage threshold (target ≥80%).
- Verify correctness via existing test suites plus new module-focused tests and basic integration checks.

**Non-Goals:**

- Redesign or rebalance gameplay systems (battle, economy, world, etc.).
- Large-scale UI/UX refresh or component library migration.
- Replacing React Context globally with a different state management framework.
- Database schema migrations beyond what is necessary for routing and service modularization.

## Decisions

### 1) Adopt a layered, module-first layout while keeping feature UI structure

**Decision:** Keep `src/features/**` as the primary UI/page layer, and introduce a dedicated module layer for reusable domain + infrastructure code.

Proposed frontend structure (incremental adoption):

- `src/app/`: application shell (routing, top-level providers, bootstrapping)
- `src/modules/`: domain and infrastructure modules with explicit public exports
  - `src/modules/<module>/index.js`: the only supported public entry point per module
  - `src/modules/<module>/{domain,infrastructure}/...`: internal implementation
- `src/shared/`: presentational/shared UI primitives (if needed), kept dependency-light

Rationale:

- Preserves existing feature-based navigation while carving out stable module contracts.
- Makes “what is reusable” explicit and supports gradual migration (features can adopt modules one by one).

Alternatives considered:

- Full “domains-only” restructure replacing `src/features`: rejected due to high churn and risk.
- Keep existing structure and only refactor internally: rejected because it doesn’t create enforceable boundaries.

### 2) Define module boundaries as explicit contracts + enforce via lint + conventions

**Decision:** Each module exposes a small public surface area via `src/modules/<name>/index.js`. Feature code may import from module index files only; internal module imports are prohibited outside the module.

Enforcement approach:

- Add ESLint import restriction rules to prevent deep imports across modules.
- Add documentation per module describing responsibilities, invariants, and public API.

Rationale:

- Prevents “gradual erosion” where internal helpers become de facto APIs.
- Makes refactoring safe by constraining blast radius.

Alternative considered:

- Rely on developer discipline only: rejected as the codebase already shows coupling drift patterns.

### 3) Introduce dependency injection via a Services container (frontend) and app factory (backend)

**Frontend DI decision:**

- Add a `ServicesProvider` that supplies an immutable service container to the app.
- Define interfaces for key side-effect providers (examples): `storage`, `http`, `logger`, `llmProvider`, `clock`, `random`.
- Modules and hooks accept these dependencies via parameters or through a `useServices()` hook (for UI-facing code).

**Backend DI decision:**

- Refactor backend entrypoint into `createApp({ db, llm, logger, config })` which wires routes and middleware.
- Keep `server.js` as a minimal bootstrap that creates dependencies and starts listening.

Rationale:

- Enables deterministic tests (swap `localStorage`/`fetch`/LLM) and supports plugin providers.
- Reduces global, hidden dependencies and moves side effects to the edges.

Alternatives considered:

- Manual prop-drilling dependencies: rejected as too invasive and noisy.
- Full DI framework: rejected as unnecessary complexity for this repo.

### 4) Standardize error handling and logging

**Backend:**

- Add a central error-handling middleware that converts errors to consistent JSON responses.
- Create a logger abstraction with levels and request correlation (at minimum: request id + path + status).
- Avoid logging secrets; ensure LLM and API keys are never logged.

**Frontend:**

- Create a lightweight logging interface; default implementation may use `console.*` with consistent formatting and environment gating.
- Centralize user-visible error reporting (e.g., via existing toast system) while keeping module-level errors typed/structured.

Rationale:

- Makes failures diagnosable without scattering `console.error` and ad-hoc `try/catch`.
- Improves observability for future scalability needs.

Alternative considered:

- Introduce a full telemetry stack: rejected as out of scope; leave room for later.

### 5) Implement an LLM provider plugin system as the first extension point

**Decision:** Define an LLM provider interface and a registry/factory that resolves the active provider based on configuration.

Design:

- `src/modules/llm-provider-plugins/` defines:
  - provider interface (contract)
  - registry (map of provider implementations)
  - selection logic (config-driven)
  - a `mock` provider for tests
- Backend mirrors the same pattern, allowing provider swapping and deterministic tests.

Rationale:

- This repo already contains multiple LLM touchpoints; treating this as a plugin boundary yields immediate benefit.

Alternatives considered:

- Keep provider logic embedded in current services: rejected due to testing and evolution pain.

### 6) Add coverage gates and module-focused unit tests

**Decision:** Enable coverage reporting for Vitest and enforce thresholds aligned with module boundaries.

Approach:

- Introduce a Vitest coverage provider dependency (V8-based preferred) and configure:
  - global thresholds (≥80% lines/statements/branches/functions)
  - include/exclude patterns to avoid non-source noise
- Add module unit tests that cover:
  - module public APIs
  - critical invariants and error cases
  - plugin selection behavior and DI wiring

Rationale:

- Makes modularization measurable and prevents regression during future refactors.

Alternative considered:

- Rely solely on existing tests: rejected because it doesn’t guarantee module contract stability.

## Risks / Trade-offs

- **Large refactor churn** → Migrate incrementally; keep compatibility adapters; avoid breaking import paths in one step.
- **Boundary enforcement fights existing patterns** → Add lint rules gradually with targeted suppressions; fix upstream imports module-by-module.
- **Coverage target not realistic for UI-heavy code** → Focus thresholds on modules and pure logic; keep UI integration tests separate.
- **DI adoption increases boilerplate** → Provide ergonomic helpers (e.g., `useServices()` and thin adapters) and keep interfaces minimal.
- **Plugin system overengineering** → Keep plugin interface small and implement only what’s needed for current LLM use cases.

## Migration Plan

1. Baseline verification: ensure build and tests are green; record current test/coverage baseline.
2. Create `src/modules/` scaffolding and define initial module boundaries + public export conventions.
3. Add frontend `ServicesProvider` + `useServices()` and introduce foundational services (`logger`, `storage`, `http`).
4. Extract and migrate LLM-related code behind the plugin interface; add `mock` provider for tests.
5. Refactor backend into `createApp` + routers + error middleware; introduce backend logger abstraction.
6. Gradually move shared domain logic out of `src/lib/**` into modules; update features to import through module indexes.
7. Add lint rules enforcing module boundary imports and naming conventions; address violations iteratively.
8. Add module docs and unit tests; enable coverage gates and iterate until thresholds are met.
9. Run full test suite and basic integration checks (frontend + backend startup and key API paths).

## Open Questions

- Which parts of `src/lib/**` should remain “shared utilities” vs. be owned by specific modules?
- Do we want path aliases (e.g., `@/modules/...`) for import clarity, or keep relative imports for now?
- Should the backend and frontend share a common LLM provider contract, or keep separate contracts aligned to each runtime?
