## 2025-02-28 - [High] Prevent LLM API abuse and DoS with Rate Limiting
**Vulnerability:** Missing rate limiting on the `/api/chat/:trainer_id` POST endpoint which uses a paid LLM API.
**Learning:** Sensitive and computationally expensive endpoints that call external APIs require immediate protection. Unauthenticated or loosely authenticated routes are extremely susceptible to abuse without an enforced rate limit per IP.
**Prevention:** Always implement IP-based or session-based rate limiting via middleware for endpoints performing significant work or incurring API costs.
