import { describe, it, expect, vi } from 'vitest';
import { createLogger, toError, errorMessage } from '../index.js';

describe('observability module', () => {
  it('normalizes unknown values to Error', () => {
    expect(toError(new Error('x')).message).toBe('x');
    expect(toError('y').message).toBe('y');
    expect(errorMessage({ a: 1 })).toContain('a');
  });

  it('filters logs by level', () => {
    const sink = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const logger = createLogger({ level: 'warn', sink });

    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.error('e');

    expect(sink.debug).not.toHaveBeenCalled();
    expect(sink.info).not.toHaveBeenCalled();
    expect(sink.warn).toHaveBeenCalled();
    expect(sink.error).toHaveBeenCalled();
  });
});
