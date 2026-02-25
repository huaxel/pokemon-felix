import crypto from 'crypto';

export function requestId(req, _res, next) {
  req.id = crypto.randomUUID();
  next();
}
