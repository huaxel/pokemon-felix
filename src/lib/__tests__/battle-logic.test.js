import { describe, it, expect } from 'vitest';
import {
  getStat,
  calculateMaxHP,
  getEffectiveness,
  calculateDamage,
  combineMoves,
  calculateSmartDamage
} from '../battle-logic';

describe('battle-logic basic behavior', () => {
  it('returns fallback stat when missing', () => {
    expect(getStat(null, 'hp')).toBe(10);
  });

  it('calculates max HP as a small number', () => {
    const p = { stats: [{ stat: { name: 'hp' }, base_stat: 80 }] };
    expect(calculateMaxHP(p)).toBeGreaterThanOrEqual(10);
  });

  it('effectiveness returns 1 for unknown types', () => {
    expect(getEffectiveness('mystery', 'ghost')).toBe(1);
  });

  it('calculateDamage respects effectiveness and power', () => {
    const attacker = { types: [{ type: { name: 'fire' } }] };
    const defender = { types: [{ type: { name: 'grass' } }] };
    const move = { power: 120, type: 'fire' };
    const res = calculateDamage(attacker, defender, move);
    expect(res.damage).toBeGreaterThanOrEqual(res.baseDamage);
    expect(res.effectiveness).toBeGreaterThan(1);
  });

  it('combineMoves produces a new move object', () => {
    const m1 = { name: 'Flame', type: 'fire', power: 60 };
    const m2 = { name: 'Blast', type: 'fire', power: 80 };
    const combo = combineMoves(m1, m2);
    expect(combo).toHaveProperty('power');
    expect(combo.isCombo).toBeTruthy();
  });

  it('calculateSmartDamage returns message for repeated moves', () => {
    const attacker = { types: [{ type: { name: 'fire' } }] };
    const defender = { types: [{ type: { name: 'grass' } }] };
    const move = { name: 'Flame', power: 60, type: 'fire' };
    const result = calculateSmartDamage(attacker, defender, move, { lastMoveName: 'Flame', fatigue: 0 });
    expect(result).toHaveProperty('damage');
    expect(result).toHaveProperty('message');
  });
});
