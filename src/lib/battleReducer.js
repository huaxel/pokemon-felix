/**
 * Battle state reducer for simplified state management
 * Replaces 20+ separate useState calls with organized, predictable state updates
 */

import { calculateMaxHP } from './battle-logic';
import { BATTLE_CONFIG } from './constants';
import { handleFighterActions, handleCardActions, handleUIActions } from './battleReducerHelpers';

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
        pokemon: fighter1,
      },
      opponent: {
        hp: calculateMaxHP(fighter2),
        maxHP: calculateMaxHP(fighter2),
        energy: 3,
        pokemon: fighter2,
      },
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
      opponentMoves: [],
    },

    // UI state
    ui: {
      attackingFighter: null,
      damagedFighter: null,
      effectivenessMsg: null,
      comboMsg: null,
      showItems: false,
    },

    // Misc
    lastMoveName: null,
    outfitId,
  };
}

/**
 * Battle state reducer
 */
export function battleReducer(state, action) {
  if (Object.values(BATTLE_ACTIONS).slice(0, 4).includes(action.type)) {
    return handleFighterActions(state, action);
  }
  if (Object.values(BATTLE_ACTIONS).slice(7, 13).includes(action.type)) {
    return handleCardActions(state, action);
  }
  if (Object.values(BATTLE_ACTIONS).slice(13, 20).includes(action.type)) {
    return handleUIActions(state, action);
  }

  switch (action.type) {
    case BATTLE_ACTIONS.SET_TURN:
      return { ...state, turn: action.turn };
    case BATTLE_ACTIONS.SET_WINNER:
      return { ...state, winner: action.winner };
    case BATTLE_ACTIONS.ADD_TO_LOG:
      return { ...state, battleLog: [...state.battleLog, action.message] };
    case BATTLE_ACTIONS.SET_LAST_MOVE:
      return { ...state, lastMoveName: action.moveName };
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
