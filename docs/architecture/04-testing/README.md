# Testing Strategy

## Framework

- **Test Runner**: Vitest (compatible with Jest API, faster with Vite).
- **Environment**: `jsdom` (Simulates browser environment for React components).
- **Utilities**: `react-test-renderer` and `@testing-library/react`.

## Test Structure

Tests are located in:

1. `__tests__` directories near the code they test.
2. Co-located `*.test.jsx` or `*.spec.js` files.

## Running Tests

- `npm test`: Runs the test suite in watch mode.
- `npm run test:ui` (if configured): Opens Vitest UI.

## Scope

- **Unit Tests**: Focus on pure logic functions in `src/lib/` (e.g., damage calculation, reducers).
- **Component Tests**: Verify rendering and user interactions for key components.
