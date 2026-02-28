import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRateLimiter } from '../middleware/rateLimiter.js';

describe('rateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('allows requests under the limit', () => {
    const middleware = createRateLimiter({ windowMs: 1000, max: 2 });
    const req = { ip: '127.0.0.1' };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('blocks requests over the limit', () => {
    const middleware = createRateLimiter({ windowMs: 1000, max: 2 });
    const req = { ip: '127.0.0.1', id: '123' };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    middleware(req, res, next);
    middleware(req, res, next);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ error: 'Too many requests', requestId: '123' });
  });

  it('resets after windowMs', () => {
    const middleware = createRateLimiter({ windowMs: 1000, max: 1 });
    const req = { ip: '127.0.0.1' };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1001);

    middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);
  });
});
