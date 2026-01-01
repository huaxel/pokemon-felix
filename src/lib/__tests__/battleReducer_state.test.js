import { describe, it, expect } from 'vitest';
import { createInitialBattleState, battleReducer, BATTLE_ACTIONS } from '../battleReducer';

const mockPokemon1 = { id: 25, name: 'pikachu', stats: [{ stat: { name: 'hp' }, base_stat: 80 }] };
const mockPokemon2 = { id: 6, name: 'charizard', stats: [{ stat: { name: 'hp' }, base_stat: 100 }] };

describe('battleReducer state', () => {
    it('should create initial state correctly', () => {
        const state = createInitialBattleState(mockPokemon1, mockPokemon2);
        expect(state).toHaveProperty('fighters');
        expect(state.fighters.player.hp).toBe(state.fighters.player.maxHP);
        expect(state.fighters.player.energy).toBe(3);
    });

    it('should handle HP updates', () => {
        const state = createInitialBattleState(mockPokemon1, mockPokemon2);
        const next = battleReducer(state, { type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP, fighter: 'player', hp: 10 });
        expect(next.fighters.player.hp).toBe(10);
    });

    it('should handle energy updates', () => {
        const state = createInitialBattleState(mockPokemon1, mockPokemon2);
        const next = battleReducer(state, { type: BATTLE_ACTIONS.UPDATE_FIGHTER_ENERGY, fighter: 'player', energy: 4 });
        expect(next.fighters.player.energy).toBe(4);
    });
});
