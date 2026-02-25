import { tooManyRequests } from '../lib/httpError.js';

export function rateLimit({ windowMs, max }) {
  const requestCounts = new Map();

  // Simple cleanup every 10 minutes to prevent memory leaks
  const cleanupInterval = 600000;
  const intervalId = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requestCounts.entries()) {
      if (now - record.startTime > cleanupInterval) {
        requestCounts.delete(ip);
      }
    }
  }, cleanupInterval);

  // Allow process to exit even if interval is running
  if (intervalId.unref) intervalId.unref();

  return (req, res, next) => {
    // Check for IP address, falling back to connection remoteAddress
    // In a real production environment behind a proxy, you might need to check X-Forwarded-For
    // providing the app trusts the proxy.
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';

    // If we can't identify the IP, we might choose to allow or block.
    // Allowing is safer for usability, but risks abuse.
    // For now, we proceed.

    const currentTime = Date.now();
    let record = requestCounts.get(ip);

    if (!record) {
      record = { count: 0, startTime: currentTime };
      requestCounts.set(ip, record);
    }

    // Check if window has passed
    if (currentTime - record.startTime > windowMs) {
      record.count = 0;
      record.startTime = currentTime;
    }

    if (record.count >= max) {
      return next(tooManyRequests('Too many requests, please try again later.'));
    }

    record.count++;
    next();
  };
}
