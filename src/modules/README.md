# Modules

Modules under `src/modules/` provide stable, reusable capabilities behind explicit public entry points.

## Conventions

- Each module exposes its public API from `src/modules/<module>/index.js`.
- Code outside a module imports from the module entry point only.
- Module internals may change without affecting callers, as long as the entry point contract remains stable.
