## 2024-05-23 - Unbounded LLM API Usage

**Vulnerability:** The `/api/chat/:trainer_id` endpoint directly called the Anthropic LLM API without rate limiting, exposing the project to denial-of-service and uncontrolled financial costs.
**Learning:** Backend endpoints often lack basic protections in prototype stages. In this monorepo structure, backend dependencies like `express` are not always available in the root test context, making integration tests harder to run than unit tests for pure logic.
**Prevention:** Implement a lightweight, dependency-free rate limiter for sensitive endpoints. Isolate logic into pure functions/middleware factories to enable unit testing without complex environment setup.
