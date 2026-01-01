/**
 * Battle state reducer for simplified state management
 * Replaces 20+ separate useState calls with organized, predictable state updates
 */

import { calculateMaxHP } from './battle-logic';
import { BATTLE_CONFIG } from './constants';

// Action Types
export const BATTLE_ACTIONS = {
    // Fighter state
    UPDATE_FIGHTER_HP: 'UPDATE_FIGHTER_HP',
    UPDATE_FIGHTER_ENERGY: 'UPDATE_FIGHTER_ENERGY',
    ADD_ENERGY: 'ADD_ENERGY',
    SPEND_ENERGY: 'SPEND_ENERGY',
    
    // Battle flow
    SET_TURN: 'SET_TURN',
    SET_WINNER: 'SET_WINNER',
    ADD_TO_LOG: 'ADD_TO_LOG',
    
    // Cards
    SET_HAND: 'SET_HAND',
    SET_DECK: 'SET_DECK',
    SELECT_CARD: 'SELECT_CARD',
    DESELECT_CARD: 'DESELECT_CARD',
    CLEAR_SELECTION: 'CLEAR_SELECTION',
    SET_OPPONENT_MOVES: 'SET_OPPONENT_MOVES',
    
    // UI state
    SET_ATTACKING_FIGHTER: 'SET_ATTACKING_FIGHTER',
    SET_DAMAGED_FIGHTER: 'SET_DAMAGED_FIGHTER',
    SET_EFFECTIVENESS_MSG: 'SET_EFFECTIVENESS_MSG',
    SET_COMBO_MSG: 'SET_COMBO_MSG',
    CLEAR_ANIMATIONS: 'CLEAR_ANIMATIONS',
    
    // Other
    SET_LAST_MOVE: 'SET_LAST_MOVE',
    TOGGLE_ITEMS: 'TOGGLE_ITEMS',
    RESET_BATTLE: 'RESET_BATTLE',
};

/**
 * Initial state factory
 */
export function createInitialBattleState(fighter1, fighter2, outfitId = 'default') {
    const initialEnergy = outfitId === 'cool' ? 4 : BATTLE_CONFIG?.INITIAL_ENERGY || 3;
    
    return {
        // Fighter stats
        fighters: {
            player: {
                hp: calculateMaxHP(fighter1),
                maxHP: calculateMaxHP(fighter1),
                energy: initialEnergy,
                pokemon: fighter1
            },
            opponent: {
                hp: calculateMaxHP(fighter2),
                maxHP: calculateMaxHP(fighter2),
                energy: 3,
                pokemon: fighter2
            }
        },
        
        // Battle flow
        turn: 'player',
        winner: null,
        battleLog: [],
        
        // Card system
        cards: {
            hand: [],
            deck: [],
            selectedIndices: [],
            opponentMoves: []
        },
        
        // UI state
        ui: {
            attackingFighter: null,
            damagedFighter: null,
            effectivenessMsg: null,
            comboMsg: null,
            showItems: false
        },
        
        // Misc
        lastMoveName: null,
        outfitId
    };
}

/**
 * Battle state reducer
 */
export function battleReducer(state, action) {
    switch (action.type) {
        case BATTLE_ACTIONS.UPDATE_FIGHTER_HP:
            return {
                ...state,
                fighters: {
                    ...state.fighters,
                    [action.fighter]: {
                        ...state.fighters[action.fighter],
                        hp: Math.max(0, Math.min(action.hp, state.fighters[action.fighter].maxHP))
                    }
                }
            };
            
        case BATTLE_ACTIONS.UPDATE_FIGHTER_ENERGY:
            return {
                ...state,
                fighters: {
                    ...state.fighters,
                    [action.fighter]: {
                        ...state.fighters[action.fighter],
                        energy: Math.max(0, Math.min(action.energy, 5))
                    }
                }
            };
            
        case BATTLE_ACTIONS.ADD_ENERGY:
            return {
                ...state,
                fighters: {
                    ...state.fighters,
                    [action.fighter]: {
                        ...state.fighters[action.fighter],
                        energy: Math.min(5, state.fighters[action.fighter].energy + action.amount)
                    }
                }
            };
            
        case BATTLE_ACTIONS.SPEND_ENERGY:
            return {
                ...state,
                fighters: {
                    ...state.fighters,
                    [action.fighter]: {
                        ...state.fighters[action.fighter],
                        energy: Math.max(0, state.fighters[action.fighter].energy - action.amount)
                    }
                }
            };
            
        case BATTLE_ACTIONS.SET_TURN:
            return { ...state, turn: action.turn };
            
        case BATTLE_ACTIONS.SET_WINNER:
            return { ...state, winner: action.winner };
            
        case BATTLE_ACTIONS.ADD_TO_LOG:
            return {
                ...state,
                battleLog: [...state.battleLog, action.message]
            };
            
        case BATTLE_ACTIONS.SET_HAND:
            return {
                ...state,
                cards: { ...state.cards, hand: action.hand }
            };
            
        case BATTLE_ACTIONS.SET_DECK:
            return {
                ...state,
                cards: { ...state.cards, deck: action.deck }
            };
            
        case BATTLE_ACTIONS.SELECT_CARD:
            if (state.cards.selectedIndices.includes(action.index)) {
                return state;
            }
            return {
                ...state,
                cards: {
                    ...state.cards,
                    selectedIndices: [...state.cards.selectedIndices, action.index]
                }
            };
            
        case BATTLE_ACTIONS.DESELECT_CARD:
            return {
                ...state,
                cards: {
                    ...state.cards,
                    selectedIndices: state.cards.selectedIndices.filter(i => i !== action.index)
                }
            };
            
        case BATTLE_ACTIONS.CLEAR_SELECTION:
            return {
                ...state,
                cards: { ...state.cards, selectedIndices: [] }
            };
            
        case BATTLE_ACTIONS.SET_OPPONENT_MOVES:
            return {
                ...state,
                cards: { ...state.cards, opponentMoves: action.moves }
            };
            
        case BATTLE_ACTIONS.SET_ATTACKING_FIGHTER:
            return {
                ...state,
                ui: { ...state.ui, attackingFighter: action.fighter }
            };
            
        case BATTLE_ACTIONS.SET_DAMAGED_FIGHTER:
            return {
                ...state,
                ui: { ...state.ui, damagedFighter: action.fighter }
            };
            
        case BATTLE_ACTIONS.SET_EFFECTIVENESS_MSG:
            return {
                ...state,
                ui: { ...state.ui, effectivenessMsg: action.message }
            };
            
        case BATTLE_ACTIONS.SET_COMBO_MSG:
            return {
                ...state,
                ui: { ...state.ui, comboMsg: action.message }
            };
            
        case BATTLE_ACTIONS.CLEAR_ANIMATIONS:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    attackingFighter: null,
                    damagedFighter: null,
                    effectivenessMsg: null,
                    comboMsg: null
                }
            };
            
        case BATTLE_ACTIONS.SET_LAST_MOVE:
            return { ...state, lastMoveName: action.moveName };
            
        case BATTLE_ACTIONS.TOGGLE_ITEMS:
            return {
                ...state,
                ui: { ...state.ui, showItems: !state.ui.showItems }
            };
            
        case BATTLE_ACTIONS.RESET_BATTLE:
            return createInitialBattleState(
                state.fighters.player.pokemon,
                state.fighters.opponent.pokemon,
                state.outfitId
            );
            
        default:
            return state;
    }
}
