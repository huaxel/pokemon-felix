import { HttpError } from '../lib/httpError.js';

export function errorHandler({ logger }) {
  return function handleError(err, req, res, _next) {
    const status = err instanceof HttpError ? err.status : 500;
    const message = err instanceof HttpError ? err.message : 'Internal server error';

    logger.error('request_error', {
      requestId: req.id,
      method: req.method,
      path: req.path,
      status,
      error: err?.message,
    });

    res.status(status).json({
      error: message,
      requestId: req.id,
    });
  };
}
