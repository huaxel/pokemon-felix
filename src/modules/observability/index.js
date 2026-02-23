const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

function isLogEnabled(configuredLevel, level) {
  return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(configuredLevel);
}

export function createLogger({ level = 'info', sink = console } = {}) {
  return {
    debug: (...args) => (isLogEnabled(level, 'debug') ? sink.debug(...args) : undefined),
    info: (...args) => (isLogEnabled(level, 'info') ? sink.info(...args) : undefined),
    warn: (...args) => (isLogEnabled(level, 'warn') ? sink.warn(...args) : undefined),
    error: (...args) => (isLogEnabled(level, 'error') ? sink.error(...args) : undefined),
  };
}

export function toError(value) {
  if (value instanceof Error) return value;
  if (typeof value === 'string') return new Error(value);
  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error('Unknown error');
  }
}

export function errorMessage(value) {
  return toError(value).message;
}
