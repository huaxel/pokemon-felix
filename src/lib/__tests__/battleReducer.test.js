import { describe, it, expect } from 'vitest';
import { battleReducer, createInitialBattleState, BATTLE_ACTIONS } from '../battleReducer';

// Mock Pokemon for testing
const mockPokemon1 = {
    id: 25,
    name: 'pikachu',
    stats: [
        { stat: { name: 'hp' }, base_stat: 80 }
    ]
};

const mockPokemon2 = {
    id: 6,
    name: 'charizard',
    stats: [
        { stat: { name: 'hp' }, base_stat: 100 }
    ]
};

describe('battleReducer', () => {
    describe('createInitialBattleState', () => {
        it('should create initial state with correct structure', () => {
            const state = createInitialBattleState(mockPokemon1, mockPokemon2);
            
            expect(state).toHaveProperty('fighters');
            expect(state).toHaveProperty('turn');
            expect(state).toHaveProperty('winner');
            expect(state).toHaveProperty('battleLog');
            expect(state).toHaveProperty('cards');
            expect(state).toHaveProperty('ui');
        });
        
        it('should initialize fighters with correct HP', () => {
            const state = createInitialBattleState(mockPokemon1, mockPokemon2);
            
            expect(state.fighters.player.hp).toBeGreaterThan(0);
            expect(state.fighters.opponent.hp).toBeGreaterThan(0);
            expect(state.fighters.player.hp).toBe(state.fighters.player.maxHP);
        });
        
        it('should set initial energy to 3 by default', () => {
            const state = createInitialBattleState(mockPokemon1, mockPokemon2);
            
            expect(state.fighters.player.energy).toBe(3);
            expect(state.fighters.opponent.energy).toBe(3);
        });
        
        it('should set initial energy to 4 for cool outfit', () => {
            const state = createInitialBattleState(mockPokemon1, mockPokemon2, 'cool');
            
            expect(state.fighters.player.energy).toBe(4);
        });
    });
    
    describe('UPDATE_FIGHTER_HP', () => {
        it('should update fighter HP correctly', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP,
                fighter: 'player',
                hp: 10
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.fighters.player.hp).toBe(10);
        });
        
        it('should not allow HP above max', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP,
                fighter: 'player',
                hp: 9999
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.fighters.player.hp).toBe(initialState.fighters.player.maxHP);
        });
        
        it('should not allow HP below 0', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP,
                fighter: 'player',
                hp: -10
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.fighters.player.hp).toBe(0);
        });
    });
    
    describe('UPDATE_FIGHTER_ENERGY', () => {
        it('should update fighter energy correctly', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.UPDATE_FIGHTER_ENERGY,
                fighter: 'player',
                energy: 4
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.fighters.player.energy).toBe(4);
        });
        
        it('should not allow energy above 5', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.UPDATE_FIGHTER_ENERGY,
                fighter: 'player',
                energy: 10
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.fighters.player.energy).toBe(5);
        });
        
        it('should not allow energy below 0', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.UPDATE_FIGHTER_ENERGY,
                fighter: 'player',
                energy: -5
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.fighters.player.energy).toBe(0);
        });
    });
    
    describe('ADD_ENERGY and SPEND_ENERGY', () => {
        it('should add energy correctly', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.ADD_ENERGY,
                fighter: 'player',
                amount: 2
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.fighters.player.energy).toBe(5); // 3 + 2
        });
        
        it('should spend energy correctly', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.SPEND_ENERGY,
                fighter: 'player',
                amount: 1
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.fighters.player.energy).toBe(2); // 3 - 1
        });
    });
    
    describe('Battle flow actions', () => {
        it('should set turn correctly', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.SET_TURN,
                turn: 'opponent'
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.turn).toBe('opponent');
        });
        
        it('should set winner correctly', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.SET_WINNER,
                winner: 'player'
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.winner).toBe('player');
        });
        
        it('should add to battle log', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.ADD_TO_LOG,
                message: 'Pikachu used Thunder!'
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.battleLog).toContain('Pikachu used Thunder!');
            expect(newState.battleLog.length).toBe(1);
        });
    });
    
    describe('Card system actions', () => {
        it('should set hand correctly', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const newHand = [{ name: 'Thunder' }, { name: 'Quick Attack' }];
            const action = {
                type: BATTLE_ACTIONS.SET_HAND,
                hand: newHand
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.cards.hand).toEqual(newHand);
        });
        
        it('should select card by index', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.SELECT_CARD,
                index: 0
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.cards.selectedIndices).toContain(0);
        });
        
        it('should not select same card twice', () => {
            let state = createInitialBattleState(mockPokemon1, mockPokemon2);
            state = battleReducer(state, {
                type: BATTLE_ACTIONS.SELECT_CARD,
                index: 0
            });
            
            const newState = battleReducer(state, {
                type: BATTLE_ACTIONS.SELECT_CARD,
                index: 0
            });
            
            expect(newState.cards.selectedIndices.length).toBe(1);
        });
        
        it('should deselect card', () => {
            let state = createInitialBattleState(mockPokemon1, mockPokemon2);
            state = battleReducer(state, {
                type: BATTLE_ACTIONS.SELECT_CARD,
                index: 0
            });
            
            const newState = battleReducer(state, {
                type: BATTLE_ACTIONS.DESELECT_CARD,
                index: 0
            });
            
            expect(newState.cards.selectedIndices).not.toContain(0);
        });
        
        it('should clear all selections', () => {
            let state = createInitialBattleState(mockPokemon1, mockPokemon2);
            state = battleReducer(state, {
                type: BATTLE_ACTIONS.SELECT_CARD,
                index: 0
            });
            state = battleReducer(state, {
                type: BATTLE_ACTIONS.SELECT_CARD,
                index: 1
            });
            
            const newState = battleReducer(state, {
                type: BATTLE_ACTIONS.CLEAR_SELECTION
            });
            
            expect(newState.cards.selectedIndices).toEqual([]);
        });
    });
    
    describe('UI actions', () => {
        it('should set attacking fighter', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            const action = {
                type: BATTLE_ACTIONS.SET_ATTACKING_FIGHTER,
                fighter: 'player'
            };
            
            const newState = battleReducer(initialState, action);
            
            expect(newState.ui.attackingFighter).toBe('player');
        });
        
        it('should clear animations', () => {
            let state = createInitialBattleState(mockPokemon1, mockPokemon2);
            state.ui.attackingFighter = 'player';
            state.ui.damagedFighter = 'opponent';
            state.ui.effectivenessMsg = "It's super effective!";
            
            const newState = battleReducer(state, {
                type: BATTLE_ACTIONS.CLEAR_ANIMATIONS
            });
            
            expect(newState.ui.attackingFighter).toBeNull();
            expect(newState.ui.damagedFighter).toBeNull();
            expect(newState.ui.effectivenessMsg).toBeNull();
        });
        
        it('should toggle items panel', () => {
            const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
            
            const newState = battleReducer(initialState, {
                type: BATTLE_ACTIONS.TOGGLE_ITEMS
            });
            
            expect(newState.ui.showItems).toBe(true);
            
            const toggledBack = battleReducer(newState, {
                type: BATTLE_ACTIONS.TOGGLE_ITEMS
            });
            
            expect(toggledBack.ui.showItems).toBe(false);
        });
    });
    
    describe('RESET_BATTLE', () => {
        it('should reset to initial state', () => {
            let state = createInitialBattleState(mockPokemon1, mockPokemon2);
            
            // Modify state
            state = battleReducer(state, {
                type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP,
                fighter: 'player',
                hp: 5
            });
            state = battleReducer(state, {
                type: BATTLE_ACTIONS.SET_WINNER,
                winner: 'opponent'
            });
            
            // Reset
            const newState = battleReducer(state, {
                type: BATTLE_ACTIONS.RESET_BATTLE
            });
            
            expect(newState.fighters.player.hp).toBe(newState.fighters.player.maxHP);
            expect(newState.winner).toBeNull();
            expect(newState.battleLog).toEqual([]);
        });
    });
});
