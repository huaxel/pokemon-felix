import { describe, it, expect } from 'vitest';
import { createInitialBattleState, battleReducer, BATTLE_ACTIONS } from '../battleReducer';

const mockPokemon1 = { id: 25, name: 'pikachu', stats: [{ stat: { name: 'hp' }, base_stat: 80 }] };
const mockPokemon2 = {
  id: 6,
  name: 'charizard',
  stats: [{ stat: { name: 'hp' }, base_stat: 100 }],
};

describe('battleReducer actions', () => {
  it('should handle battle flow', () => {
    const state = createInitialBattleState(mockPokemon1, mockPokemon2);
    let s = battleReducer(state, { type: BATTLE_ACTIONS.SET_TURN, turn: 'opponent' });
    expect(s.turn).toBe('opponent');
    s = battleReducer(s, { type: BATTLE_ACTIONS.SET_WINNER, winner: 'player' });
    expect(s.winner).toBe('player');
  });

  it('should handle cards', () => {
    const state = createInitialBattleState(mockPokemon1, mockPokemon2);
    const s = battleReducer(state, { type: BATTLE_ACTIONS.SELECT_CARD, index: 0 });
    expect(s.cards.selectedIndices).toContain(0);
  });

  it('should handle UI', () => {
    const state = createInitialBattleState(mockPokemon1, mockPokemon2);
    const s = battleReducer(state, {
      type: BATTLE_ACTIONS.SET_ATTACKING_FIGHTER,
      fighter: 'player',
    });
    expect(s.ui.attackingFighter).toBe('player');
  });

  it('should handle reset', () => {
    const state = createInitialBattleState(mockPokemon1, mockPokemon2);
    const s = battleReducer(state, { type: BATTLE_ACTIONS.RESET_BATTLE });
    expect(s.winner).toBeNull();
  });
});
