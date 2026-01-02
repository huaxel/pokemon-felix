# Quick Reference: New Utilities & Patterns

This guide shows how to use the newly created utilities in your codebase.

---

## 📦 Centralized Storage Keys

### Import
```javascript
import { STORAGE_KEYS } from '../lib/constants';
```

### Usage
```javascript
// ✅ DO: Use constants
const saved = localStorage.getItem(STORAGE_KEYS.SQUAD);
localStorage.setItem(STORAGE_KEYS.COINS, value);

// ❌ DON'T: Hardcode strings
const saved = localStorage.getItem('pokeSquad'); // BAD
```

### Available Keys
```javascript
STORAGE_KEYS.COLLECTION        // 'felix-pokemon-collection'
STORAGE_KEYS.CARE             // 'felix-pokemon-care'
STORAGE_KEYS.TOWN             // 'felix-town-layout'
STORAGE_KEYS.SQUAD            // 'felix-squad'
STORAGE_KEYS.COINS            // 'felix-coins'
STORAGE_KEYS.INVENTORY        // 'felix-inventory'
STORAGE_KEYS.QUESTS           // 'felix-quests'
STORAGE_KEYS.CURRENT_OUTFIT   // 'felix-current-outfit'
STORAGE_KEYS.OWNED_OUTFITS    // 'felix-owned-outfits'
STORAGE_KEYS.COMPLETED_QUIZZES // 'felix-completed-quizzes'
```

---

## ⚙️ Battle Configuration

### Import
```javascript
import { BATTLE_CONFIG } from '../lib/constants';
```

### Usage
```javascript
if (squadIds.length < BATTLE_CONFIG.MAX_SQUAD_SIZE) {
    addToSquad(pokemonId);
}

const initialEnergy = BATTLE_CONFIG.INITIAL_ENERGY; // 3
const maxEnergy = BATTLE_CONFIG.MAX_ENERGY; // 5
const pageSize = BATTLE_CONFIG.PAGINATION_SIZE; // 50
```

---

## 🏭 Context Hook Factory

### Creating a New Context Hook

```javascript
// contexts/MyContext.js
import { createContext } from 'react';
export const MyContext = createContext(null);

// hooks/useMyContext.js
import { createContextHook } from '../lib/createContextHook';
import { MyContext } from '../contexts/MyContext';

export const useMyContext = createContextHook(MyContext, 'useMyContext');
```

### Benefits
- ✅ Automatic error checking
- ✅ Consistent error messages
- ✅ No boilerplate
- ✅ One-liner hook creation

---

## 🚨 Error Handling Utility

### Import
```javascript
import { handleAsyncError, withErrorHandling } from '../lib/errorHandler';
```

### Basic Usage
```javascript
try {
    await someAsyncOperation();
} catch (error) {
    handleAsyncError(error, 'operationName', {
        message: 'User-friendly error message',
        revert: () => setState(previousValue),
        onError: (err) => setError(err.message)
    });
}
```

### With Wrapper Function
```javascript
const result = await withErrorHandling(
    () => api.getData(),
    'getData',
    {
        message: 'Failed to fetch data',
        throwError: false // Returns { error } instead of throwing
    }
);

if (result.error) {
    // Handle error
}
```

### Options
```javascript
{
    message: string,      // User-friendly message
    revert: function,     // Function to revert optimistic updates
    onError: function,    // Custom error handler
    throwError: boolean   // Whether to rethrow (default: true)
}
```

---

## 🎮 Battle Reducer

### Setup
```javascript
import { useReducer, useEffect } from 'react';
import { 
    battleReducer, 
    createInitialBattleState, 
    BATTLE_ACTIONS 
} from '../../lib/battleReducer';

export function MyBattleComponent({ fighter1, fighter2 }) {
    const [state, dispatch] = useReducer(
        battleReducer,
        null,
        () => createInitialBattleState(fighter1, fighter2)
    );
```

### Dispatching Actions

#### Update HP
```javascript
dispatch({
    type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP,
    fighter: 'player', // or 'opponent'
    hp: newHP
});
```

#### Update Energy
```javascript
dispatch({
    type: BATTLE_ACTIONS.UPDATE_FIGHTER_ENERGY,
    fighter: 'player',
    energy: newEnergy
});

// Or add/spend energy
dispatch({
    type: BATTLE_ACTIONS.ADD_ENERGY,
    fighter: 'player',
    amount: 1
});

dispatch({
    type: BATTLE_ACTIONS.SPEND_ENERGY,
    fighter: 'player',
    amount: 2
});
```

#### Battle Flow
```javascript
// Change turn
dispatch({ type: BATTLE_ACTIONS.SET_TURN, turn: 'opponent' });

// Set winner
dispatch({ type: BATTLE_ACTIONS.SET_WINNER, winner: 'player' });

// Add to battle log
dispatch({ 
    type: BATTLE_ACTIONS.ADD_TO_LOG, 
    message: 'Pikachu used Thunder!' 
});
```

#### Card System
```javascript
// Set hand
dispatch({ type: BATTLE_ACTIONS.SET_HAND, hand: newHand });

// Select a card
dispatch({ type: BATTLE_ACTIONS.SELECT_CARD, index: 0 });

// Deselect a card
dispatch({ type: BATTLE_ACTIONS.DESELECT_CARD, index: 0 });

// Clear selection
dispatch({ type: BATTLE_ACTIONS.CLEAR_SELECTION });
```

#### UI Animations
```javascript
// Set attacking fighter
dispatch({ 
    type: BATTLE_ACTIONS.SET_ATTACKING_FIGHTER, 
    fighter: 'player' 
});

// Set damaged fighter
dispatch({ 
    type: BATTLE_ACTIONS.SET_DAMAGED_FIGHTER, 
    fighter: 'opponent' 
});

// Show effectiveness message
dispatch({ 
    type: BATTLE_ACTIONS.SET_EFFECTIVENESS_MSG, 
    message: "It's super effective!" 
});

// Clear all animations
dispatch({ type: BATTLE_ACTIONS.CLEAR_ANIMATIONS });
```

#### Other Actions
```javascript
// Toggle items panel
dispatch({ type: BATTLE_ACTIONS.TOGGLE_ITEMS });

// Reset battle
dispatch({ type: BATTLE_ACTIONS.RESET_BATTLE });
```

### Accessing State
```javascript
const { fighters, turn, winner, battleLog, cards, ui } = state;

// Fighter data
const playerHP = state.fighters.player.hp;
const opponentEnergy = state.fighters.opponent.energy;

// Battle state
const isPlayerTurn = state.turn === 'player';
const hasWinner = state.winner !== null;

// Cards
const currentHand = state.cards.hand;
const selectedCards = state.cards.selectedIndices.map(i => state.cards.hand[i]);

// UI state
const isAttacking = state.ui.attackingFighter !== null;
const showingEffectiveness = state.ui.effectivenessMsg !== null;
```

---

## 🎨 Memoization Patterns

### Memoize Context Values
```javascript
const value = useMemo(() => ({
    data,
    actions: { create, update, delete }
}), [data, create, update, delete]);

return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
```

### Memoize Callbacks
```javascript
const handleClick = useCallback((id) => {
    performAction(id);
}, [performAction]);
```

### When to Memoize
- ✅ Context values (always)
- ✅ Callbacks passed to memoized children
- ✅ Expensive computations
- ❌ Simple primitive values
- ❌ Callbacks used only once

---

## 📋 Common Patterns

### Custom Hook with Storage
```javascript
export function useMyFeature() {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.MY_FEATURE);
        return saved ? JSON.parse(saved) : DEFAULT_VALUE;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.MY_FEATURE, JSON.stringify(data));
    }, [data]);

    return { data, setData };
}
```

### Error Handling in Custom Hooks
```javascript
export function useAsyncData() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const loadData = async () => {
        try {
            const result = await api.getData();
            setData(result);
        } catch (err) {
            const message = handleAsyncError(err, 'loadData', {
                message: 'Failed to load data'
            });
            setError(message);
        }
    };

    return { data, error, loadData };
}
```

### Creating New Contexts
```javascript
// 1. Create context
import { createContext } from 'react';
export const FeatureContext = createContext(null);

// 2. Create hook with factory
import { createContextHook } from '../lib/createContextHook';
export const useFeature = createContextHook(FeatureContext, 'useFeature');

// 3. Create provider
export function FeatureProvider({ children }) {
    const [state, setState] = useState(initialState);
    
    const value = useMemo(() => ({
        state,
        actions: { /* ... */ }
    }), [state]);
    
    return <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>;
}
```

---

## 🧪 Testing Examples

### Testing Reducer
```javascript
import { battleReducer, createInitialBattleState, BATTLE_ACTIONS } from './battleReducer';

describe('battleReducer', () => {
    it('updates HP correctly', () => {
        const state = createInitialBattleState(mockPokemon1, mockPokemon2);
        const newState = battleReducer(state, {
            type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP,
            fighter: 'player',
            hp: 10
        });
        expect(newState.fighters.player.hp).toBe(10);
    });
});
```

### Testing Error Handler
```javascript
import { handleAsyncError } from './errorHandler';

describe('handleAsyncError', () => {
    it('calls revert function on error', () => {
        const revert = jest.fn();
        handleAsyncError(new Error('test'), 'test', { revert });
        expect(revert).toHaveBeenCalled();
    });
});
```

---

## 🎯 Migration Checklist

When adding a new feature:

- [ ] Use `STORAGE_KEYS` for localStorage
- [ ] Use `BATTLE_CONFIG` for game constants
- [ ] Create contexts with `createContextHook`
- [ ] Memoize context values with `useMemo`
- [ ] Memoize callbacks with `useCallback`
- [ ] Use `handleAsyncError` for error handling
- [ ] Consider reducer for complex state (>5 useState)

---

## 📚 Further Reading

- [Implementation Summary](implementation-summary.md)
- [CardBattle Refactoring Guide](cardbattle-refactor-guide.md)
- [Original Code Review](yagni-solid-dry-kiss-review.md)

---

Last Updated: January 1, 2026
