## ADDED Requirements

### Requirement: Module public APIs are explicit
Each module SHALL expose a single public entry point at `src/modules/<module>/index.js`. Code outside the module SHALL import from this entry point only.

#### Scenario: Feature code imports a module API
- **WHEN** a UI feature needs a reusable capability owned by a module
- **THEN** it imports from `src/modules/<module>` (via the module’s `index.js`) and not from internal module files

### Requirement: Cross-module deep imports are prevented
The codebase MUST prevent importing internal module files across module boundaries (e.g., `src/modules/a/internal/...` from outside `src/modules/a`).

#### Scenario: Disallowed deep import is introduced
- **WHEN** a developer attempts to import a non-public module path from outside the module
- **THEN** linting or build-time checks fail with a boundary violation

### Requirement: Module responsibilities are documented
Each module MUST include module-level documentation describing responsibilities, public API surface, key invariants, and extension points (if any).

#### Scenario: New module is added
- **WHEN** a new module is introduced under `src/modules/<module>`
- **THEN** module documentation exists and describes the module’s contract and boundaries
