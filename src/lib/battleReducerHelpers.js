import { BATTLE_ACTIONS } from './battleReducer';

export const handleFighterActions = (state, action) => {
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
        default: return state;
    }
};

export const handleCardActions = (state, action) => {
    switch (action.type) {
        case BATTLE_ACTIONS.SET_HAND: return { ...state, cards: { ...state.cards, hand: action.hand } };
        case BATTLE_ACTIONS.SET_DECK: return { ...state, cards: { ...state.cards, deck: action.deck } };
        case BATTLE_ACTIONS.SELECT_CARD:
            if (state.cards.selectedIndices.includes(action.index)) return state;
            return { ...state, cards: { ...state.cards, selectedIndices: [...state.cards.selectedIndices, action.index] } };
        case BATTLE_ACTIONS.DESELECT_CARD:
            return { ...state, cards: { ...state.cards, selectedIndices: state.cards.selectedIndices.filter(i => i !== action.index) } };
        case BATTLE_ACTIONS.CLEAR_SELECTION:
            return { ...state, cards: { ...state.cards, selectedIndices: [] } };
        case BATTLE_ACTIONS.SET_OPPONENT_MOVES:
            return { ...state, cards: { ...state.cards, opponentMoves: action.moves } };
        default: return state;
    }
};

export const handleUIActions = (state, action) => {
    switch (action.type) {
        case BATTLE_ACTIONS.SET_ATTACKING_FIGHTER: return { ...state, ui: { ...state.ui, attackingFighter: action.fighter } };
        case BATTLE_ACTIONS.SET_DAMAGED_FIGHTER: return { ...state, ui: { ...state.ui, damagedFighter: action.fighter } };
        case BATTLE_ACTIONS.SET_EFFECTIVENESS_MSG: return { ...state, ui: { ...state.ui, effectivenessMsg: action.message } };
        case BATTLE_ACTIONS.SET_COMBO_MSG: return { ...state, ui: { ...state.ui, comboMsg: action.message } };
        case BATTLE_ACTIONS.CLEAR_ANIMATIONS:
            return { ...state, ui: { ...state.ui, attackingFighter: null, damagedFighter: null, effectivenessMsg: null, comboMsg: null } };
        case BATTLE_ACTIONS.TOGGLE_ITEMS: return { ...state, ui: { ...state.ui, showItems: !state.ui.showItems } };
        default: return state;
    }
};
