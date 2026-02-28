export function createRateLimiter({ windowMs, max }) {
  const requests = new Map();

  // Auto-cleanup stale entries every windowMs
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requests.entries()) {
      if (now > data.resetTime) {
        requests.delete(ip);
      }
    }
  }, windowMs);

  return function rateLimiter(req, res, next) {
    const ip = req.ip || 'unknown';
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const data = requests.get(ip);

    if (now > data.resetTime) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    data.count++;

    if (data.count > max) {
      return res.status(429).json({
        error: 'Too many requests',
        requestId: req.id,
      });
    }

    next();
  };
}
