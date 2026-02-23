import { describe, it, expect } from 'vitest';
import { randomService } from '../RandomService';

describe('randomService', () => {
  it('is deterministic when seeded', () => {
    randomService.setSeed(123);
    const a = randomService.float();
    const b = randomService.int(1, 10);
    const c = randomService.bool(0.5);

    randomService.setSeed(123);
    expect(randomService.float()).toBe(a);
    expect(randomService.int(1, 10)).toBe(b);
    expect(randomService.bool(0.5)).toBe(c);
  });

  it('picks items and handles empty arrays', () => {
    randomService.setSeed(42);
    expect(randomService.pick([])).toBe(null);
    expect(randomService.pick(null)).toBe(null);
    expect(['a', 'b', 'c']).toContain(randomService.pick(['a', 'b', 'c']));
  });
});
