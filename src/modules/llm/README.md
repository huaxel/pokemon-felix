# llm

## Responsibilities

- Provide an LLM provider contract and a registry for selecting implementations.
- Support plugin-like provider swapping via configuration and test-time injection.

## Public API

- `src/modules/llm/index.js` exports the provider contract and registry/factory.

## Dependencies

- Network client is injected through services (no hard dependency on `fetch`).

## Tests

- Unit tests validate provider selection and mock provider determinism.
