import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getStat,
  calculateMaxHP,
  getEffectiveness,
  calculateDamage,
  calculateEnergyCost,
  combineMoves,
  calculateSmartDamage,
  getMoves,
  getTypeColor,
  chooseBestMove,
} from '../battle-logic';
import { randomService } from '../RandomService';

describe('getStat', () => {
  it('returns correct base_stat if exists', () => {
    const pokemon = { stats: [{ stat: { name: 'hp' }, base_stat: 50 }] };
    expect(getStat(pokemon, 'hp')).toBe(50);
  });

  it('returns 10 if stat not found', () => {
    const pokemon = { stats: [] };
    expect(getStat(pokemon, 'attack')).toBe(10);
  });

  it('returns 10 if pokemon or stats is null', () => {
    expect(getStat(null, 'hp')).toBe(10);
    expect(getStat({}, 'hp')).toBe(10);
  });
});

describe('calculateMaxHP', () => {
  it('calculates HP correctly based on formula (hp/4 + 10)', () => {
    const p1 = { stats: [{ stat: { name: 'hp' }, base_stat: 80 }] };
    expect(calculateMaxHP(p1)).toBe(30);

    const p2 = { stats: [{ stat: { name: 'hp' }, base_stat: 41 }] };
    expect(calculateMaxHP(p2)).toBe(20);
  });
});

describe('getEffectiveness', () => {
  it('returns correct multipliers for known interactions', () => {
    expect(getEffectiveness('fire', 'grass')).toBe(2);
    expect(getEffectiveness('fire', 'water')).toBe(0.5);
    expect(getEffectiveness('normal', 'ghost')).toBe(0);
    expect(getEffectiveness('normal', 'normal')).toBe(1);
  });

  it('returns 1 for unknown types or missing args', () => {
    expect(getEffectiveness('mystery', 'normal')).toBe(1);
    expect(getEffectiveness(null, 'normal')).toBe(1);
  });
});

describe('calculateDamage', () => {
  const attacker = { types: [{ type: { name: 'normal' } }] };
  const defender = { types: [{ type: { name: 'normal' } }] };

  it('calculates base damage correctly based on power', () => {
    expect(calculateDamage(attacker, defender, { power: 40, type: 'normal' }).baseDamage).toBe(1);
    expect(calculateDamage(attacker, defender, { power: 60, type: 'normal' }).baseDamage).toBe(2);
    expect(calculateDamage(attacker, defender, { power: 80, type: 'normal' }).baseDamage).toBe(3);
    expect(calculateDamage(attacker, defender, { power: 110, type: 'normal' }).baseDamage).toBe(4);
    expect(calculateDamage(attacker, defender, { power: 130, type: 'normal' }).baseDamage).toBe(5);
  });

  it('applies effectiveness modifiers', () => {
    const fireAttacker = { types: [{ type: { name: 'fire' } }] };
    const grassDefender = { types: [{ type: { name: 'grass' } }] };
    const fireMove = { power: 60, type: 'fire' };

    const res = calculateDamage(fireAttacker, grassDefender, fireMove);
    expect(res.effectiveness).toBe(2);
    expect(res.damage).toBe(3);
  });

  it('applies resistance modifiers', () => {
    const fireAttacker = { types: [{ type: { name: 'fire' } }] };
    const waterDefender = { types: [{ type: { name: 'water' } }] };
    const fireMove = { power: 60, type: 'fire' };

    const res = calculateDamage(fireAttacker, waterDefender, fireMove);
    expect(res.effectiveness).toBe(0.5);
    expect(res.damage).toBe(1);
  });

  it('handles immunity', () => {
    const normalAttacker = { types: [{ type: { name: 'normal' } }] };
    const ghostDefender = { types: [{ type: { name: 'ghost' } }] };
    const normalMove = { power: 60, type: 'normal' };

    const res = calculateDamage(normalAttacker, ghostDefender, normalMove);
    expect(res.effectiveness).toBe(0);
    expect(res.damage).toBe(0);
  });

  it('handles dual-type weakness (4x)', () => {
    const fireAttacker = { types: [{ type: { name: 'fire' } }] };
    // Paras: Bug/Grass (both weak to Fire)
    const parasDefender = { types: [{ type: { name: 'bug' } }, { type: { name: 'grass' } }] };
    const fireMove = { power: 60, type: 'fire' };

    const res = calculateDamage(fireAttacker, parasDefender, fireMove);
    // Effectiveness: 2 (Bug) * 2 (Grass) = 4
    expect(res.effectiveness).toBe(4);
    // Base Damage: 2 (Power 60)
    // Bonus: +1 (Super Effective) + 1 (Double Super Effective) = +2
    // Total: 4
    expect(res.damage).toBe(4);
  });

  it('handles dual-type resistance (0.25x)', () => {
    const fireAttacker = { types: [{ type: { name: 'fire' } }] };
    // Kingdra: Water/Dragon (both resist Fire)
    const kingdraDefender = { types: [{ type: { name: 'water' } }, { type: { name: 'dragon' } }] };
    const fireMove = { power: 60, type: 'fire' };

    const res = calculateDamage(fireAttacker, kingdraDefender, fireMove);
    // Effectiveness: 0.5 (Water) * 0.5 (Dragon) = 0.25
    expect(res.effectiveness).toBe(0.25);
    // Base Damage: 2
    // Penalty: -1 (Not Very Effective)
    // Total: 1
    expect(res.damage).toBe(1);
  });
});

describe('calculateEnergyCost', () => {
  it('returns correct cost based on damage', () => {
    expect(calculateEnergyCost(5)).toBe(4);
    expect(calculateEnergyCost(4)).toBe(3);
    expect(calculateEnergyCost(3)).toBe(2);
    expect(calculateEnergyCost(2)).toBe(2);
    expect(calculateEnergyCost(1)).toBe(1);
  });
});

describe('getMoves', () => {
  it('returns default moves if no types', () => {
    const moves = getMoves({});
    expect(moves.length).toBeGreaterThan(0);
    expect(moves[0].name).toBe('Tackle');
  });

  it('returns type specific moves', () => {
    const p = { types: [{ type: { name: 'fire' } }] };
    const moves = getMoves(p);
    const fireMove = moves.find(m => m.type === 'fire');
    expect(fireMove).toBeDefined();
  });

  it('ensures 4 moves are returned', () => {
    const p = { types: [{ type: { name: 'fire' } }] };
    const moves = getMoves(p);
    expect(moves.length).toBe(4);
  });
});

describe('combineMoves', () => {
  it('creates special fusion move for Fire+Water', () => {
    const m1 = { name: 'Ember', type: 'fire', power: 40 };
    const m2 = { name: 'Water Gun', type: 'water', power: 40 };
    const combo = combineMoves(m1, m2);
    expect(combo.name).toBe('Steam Eruption');
    expect(combo.isCombo).toBe(true);
  });

  it('creates base combo for same types', () => {
    const m1 = { name: 'Ember', type: 'fire', power: 40 };
    const m2 = { name: 'Flame Wheel', type: 'fire', power: 60 };
    const combo = combineMoves(m1, m2);
    expect(combo.name).toContain('MEGA');
    expect(combo.power).toBe(120);
  });
});

describe('calculateSmartDamage', () => {
  const attacker = { types: [{ type: { name: 'fire' } }] };
  const defender = { types: [{ type: { name: 'grass' } }] };
  const move = { name: 'Flame', power: 60, type: 'fire' };

  // Prevent random crits from affecting these tests
  beforeEach(() => {
    vi.spyOn(randomService, 'bool').mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles weakened state', () => {
    const res = calculateSmartDamage(attacker, defender, move, { isWeakened: true });
    expect(res.damage).toBe(5);
    expect(res.message).toContain('Debilitado');
  });

  it('applies STAB (Specialist) bonus', () => {
    const res = calculateSmartDamage(attacker, defender, move);
    // Base: 2 (Power 60) + 1 (Effectiveness) = 3
    // STAB: 3 * 1.5 = 4.5 -> 4
    expect(res.damage).toBe(4);
  });

  it('applies STAB for secondary type', () => {
    // Charizard: Fire/Flying using Wing Attack (Flying)
    const dualAttacker = { types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }] };
    const flyingMove = { name: 'Wing Attack', power: 60, type: 'flying' };
    // Defender Grass: Weak to Flying (2x)
    const grassDefender = { types: [{ type: { name: 'grass' } }] };

    const res = calculateSmartDamage(dualAttacker, grassDefender, flyingMove);
    // Base: 2 (Power 60) + 1 (Effectiveness) = 3
    // STAB: 3 * 1.5 = 4.5 -> 4
    expect(res.damage).toBe(4);
  });

  it('applies anti-spam penalty', () => {
    const res = calculateSmartDamage(attacker, defender, move, { lastMoveName: 'Flame' });
    expect(res.damage).toBe(2);
    expect(res.message).toContain('Repetitivo');
  });

  it('applies fatigue penalty', () => {
    const res = calculateSmartDamage(attacker, defender, move, { fatigue: 60 });
    expect(res.damage).toBe(3);
    expect(res.message).toContain('Cansado');
  });

  it('handles recoil split', () => {
    const recoilMove = { ...move, recoil: 0.5 };
    const res = calculateSmartDamage(attacker, defender, recoilMove);
    // Base: 4 (with STAB)
    // Recoil: 4 * 0.5 = 2
    // Final Damage: 4 - 2 = 2
    expect(res.damage).toBe(2);
    expect(res.recoilDamage).toBe(2);
    expect(res.message).toContain('Split');
  });

  it('applies critical hit multiplier', () => {
    // Mock randomService.bool to return true for crit check
    // We need to override the beforeEach mock
    vi.spyOn(randomService, 'bool').mockReturnValue(true);

    const res = calculateSmartDamage(attacker, defender, move);

    // Base (with STAB): 4
    // Crit: 4 * 1.5 = 6
    expect(res.isCrit).toBe(true);
    expect(res.damage).toBe(6);
    expect(res.message).toContain('CRÍTICO');
  });

  it('applies status effects when luck favors', () => {
    // Mock randomService.bool to return true
    vi.spyOn(randomService, 'bool').mockReturnValue(true);

    const statusMove = { ...move, status: 'burn', statusChance: 0.1 };
    const res = calculateSmartDamage(attacker, defender, statusMove);

    expect(res.appliedStatus).toBe('burn');
    expect(res.message).toContain('BURN');
  });

  it('reduces damage when attacker is burned', () => {
    const res = calculateSmartDamage(attacker, defender, move, { attackerStatus: 'burn' });
    // Base: 2 + 1 = 3
    // Burn: floor(3 * 0.5) = 1
    // STAB: floor(1 * 1.5) = 1
    expect(res.damage).toBe(1);
    expect(res.message).toContain('Quemado');
  });
});

describe('getTypeColor', () => {
  it('returns color for known type', () => {
    expect(getTypeColor('fire')).toBe('#ef4444');
  });
  it('returns default for unknown type', () => {
    expect(getTypeColor('mystery')).toBe('#64748b');
  });
});

describe('chooseBestMove', () => {
  const attacker = { types: [{ type: { name: 'fire' } }] };
  const defender = { types: [{ type: { name: 'grass' } }] };
  const moves = [
    { name: 'Weak', type: 'normal', power: 40, cost: 1 },
    { name: 'Strong', type: 'fire', power: 90, cost: 3 }, // SE (2x) + STAB
    { name: 'Expensive', type: 'fire', power: 150, cost: 5 },
  ];

  it('selects best move within energy budget', () => {
    // Can afford Strong (cost 3) but not Expensive (cost 5)
    const move = chooseBestMove(attacker, defender, moves, 4);
    expect(move.name).toBe('Strong');
  });

  it('returns null if no moves affordable', () => {
    const move = chooseBestMove(attacker, defender, moves, 0);
    expect(move).toBeNull();
  });

  it('prioritizes super effective moves', () => {
    const waterDefender = { types: [{ type: { name: 'water' } }] }; // Resists Fire
    const mixedMoves = [
      { name: 'Fire Move', type: 'fire', power: 60, cost: 2 }, // Resisted
      { name: 'Electric Move', type: 'electric', power: 60, cost: 2 }, // Super Effective vs Water
    ];

    // Mock randomService to avoid jitter affecting result
    const spy = vi.spyOn(randomService, 'float').mockReturnValue(0);

    const move = chooseBestMove(attacker, waterDefender, mixedMoves, 3);
    expect(move.name).toBe('Electric Move');

    spy.mockRestore();
  });
});
