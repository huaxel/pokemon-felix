import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimit } from '../middleware/rateLimiter.js';

describe('rateLimit middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      ip: '127.0.0.1',
      connection: { remoteAddress: '127.0.0.1' }
    };
    res = {};
    next = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should allow requests under the limit', () => {
    const limiter = rateLimit({ windowMs: 60000, max: 2 });

    limiter(req, res, next);
    expect(next).toHaveBeenCalledWith(); // success
    next.mockClear();

    limiter(req, res, next);
    expect(next).toHaveBeenCalledWith(); // success
  });

  it('should block requests over the limit', () => {
    const limiter = rateLimit({ windowMs: 60000, max: 2 });

    limiter(req, res, next);
    next.mockClear();
    limiter(req, res, next);
    next.mockClear();

    limiter(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 429 }));
  });

  it('should reset limit after window passes', () => {
    const limiter = rateLimit({ windowMs: 60000, max: 1 });

    limiter(req, res, next); // 1st request (allowed)
    next.mockClear();

    limiter(req, res, next); // 2nd request (blocked)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 429 }));
    next.mockClear();

    // Advance time by 61 seconds
    vi.advanceTimersByTime(61000);

    limiter(req, res, next); // 3rd request (should be allowed because window reset)
    expect(next).toHaveBeenCalledWith();
  });

  it('should handle different IPs independently', () => {
    const limiter = rateLimit({ windowMs: 60000, max: 1 });
    const req1 = { ip: '1.1.1.1' };
    const req2 = { ip: '2.2.2.2' };

    limiter(req1, res, next); // allowed
    next.mockClear();

    limiter(req2, res, next); // allowed (different IP)
    expect(next).toHaveBeenCalledWith();
    next.mockClear();

    limiter(req1, res, next); // blocked (same IP as first)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 429 }));
  });
});
