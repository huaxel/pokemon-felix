# CardBattle Refactoring Guide

This document provides guidance on refactoring CardBattle.jsx to use the new battle reducer system.

## Overview

The current CardBattle component has **27+ separate useState calls**, making it difficult to maintain and reason about. The refactoring consolidates this into a single `useReducer` with organized state structure.

## Before (Current)

```jsx
const [battleLog, setBattleLog] = useState([]);
const [winner, setWinner] = useState(null);
const [attackingFighter, setAttackingFighter] = useState(null);
const [damagedFighter, setDamagedFighter] = useState(null);
const [effectivenessMsg, setEffectivenessMsg] = useState(null);
const [comboMsg, setComboMsg] = useState(null);
const [f1HP, setF1HP] = useState(calculateMaxHP(fighter1));
const [f2HP, setF2HP] = useState(calculateMaxHP(fighter2));
const [f1MaxHP, setF1MaxHP] = useState(calculateMaxHP(fighter1));
const [f2MaxHP, setF2MaxHP] = useState(calculateMaxHP(fighter2));
const [f1Energy, setF1Energy] = useState(3);
const [f2Energy, setF2Energy] = useState(3);
const [hand, setHand] = useState([]);
const [selectedIndices, setSelectedIndices] = useState([]);
const [deck, setDeck] = useState([]);
const [f2Moves, setF2Moves] = useState([]);
const [turn, setTurn] = useState('player');
const [lastMoveName, setLastMoveName] = useState(null);
const [showItems, setShowItems] = useState(false);
const [outfitId, setOutfitId] = useState('default');
// ... etc
```

## After (With Reducer)

```jsx
import { useReducer, useEffect, useCallback } from 'react';
import { battleReducer, createInitialBattleState, BATTLE_ACTIONS } from '../../lib/battleReducer';

export function CardBattle({ fighter1, fighter2, onBattleEnd }) {
    const { inventory, removeItem, toggleOwned, addCoins } = usePokemonContext();
    const { careStats, addFatigue } = useCareContext();

    // Single reducer for all battle state
    const [battleState, dispatch] = useReducer(
        battleReducer,
        null,
        () => createInitialBattleState(fighter1, fighter2)
    );

    // Destructure for convenience
    const { fighters, turn, winner, battleLog, cards, ui } = battleState;
```

## Migration Steps

### Step 1: Replace Individual State with Reducer

**Old:**

```jsx
setF1HP(prev => Math.max(0, prev - damage));
```

**New:**

```jsx
dispatch({
  type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP,
  fighter: 'player',
  hp: battleState.fighters.player.hp - damage,
});
```

### Step 2: Update References

**Old:**

```jsx
if (f1HP <= 0) {
  setWinner('opponent');
}
```

**New:**

```jsx
if (battleState.fighters.player.hp <= 0) {
  dispatch({ type: BATTLE_ACTIONS.SET_WINNER, winner: 'opponent' });
}
```

### Step 3: Batch Updates

**Old:**

```jsx
setF1HP(newHP);
setF1Energy(newEnergy);
setTurn('opponent');
setBattleLog(prev => [message, ...prev]);
```

**New:**

```jsx
// Updates are still separate but better organized
dispatch({ type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP, fighter: 'player', hp: newHP });
dispatch({ type: BATTLE_ACTIONS.UPDATE_FIGHTER_ENERGY, fighter: 'player', energy: newEnergy });
dispatch({ type: BATTLE_ACTIONS.SET_TURN, turn: 'opponent' });
dispatch({ type: BATTLE_ACTIONS.ADD_TO_LOG, message });
```

### Step 4: Update Animation Handlers

**Old:**

```jsx
setAttackingFighter('player');
setTimeout(() => setAttackingFighter(null), 500);
setDamagedFighter('opponent');
setTimeout(() => setDamagedFighter(null), 500);
```

**New:**

```jsx
dispatch({ type: BATTLE_ACTIONS.SET_ATTACKING_FIGHTER, fighter: 'player' });
setTimeout(() => dispatch({ type: BATTLE_ACTIONS.CLEAR_ANIMATIONS }), 500);
```

### Step 5: Update Card System

**Old:**

```jsx
setSelectedIndices(prev => [...prev, index]);
setHand(newHand);
```

**New:**

```jsx
dispatch({ type: BATTLE_ACTIONS.SELECT_CARD, index });
dispatch({ type: BATTLE_ACTIONS.SET_HAND, hand: newHand });
```

## Complete Example: Attack Handler

### Before

```jsx
const handleAttack = async moveIndex => {
  if (turn !== 'player' || winner) return;

  const move = hand[moveIndex];
  const cost = calculateEnergyCost(move);

  if (f1Energy < cost) {
    setBattleLog(prev => ['⚡ Not enough energy!', ...prev]);
    return;
  }

  setF1Energy(prev => prev - cost);
  setAttackingFighter('player');
  setDamagedFighter('opponent');

  const { damage, effectiveness } = calculateSmartDamage(fighter1, fighter2, move);
  setF2HP(prev => Math.max(0, prev - damage));

  setBattleLog(prev => [`${fighter1.name} used ${move.name}! Dealt ${damage} damage.`, ...prev]);

  setTimeout(() => {
    setAttackingFighter(null);
    setDamagedFighter(null);

    if (f2HP - damage <= 0) {
      setWinner('player');
    } else {
      setTurn('opponent');
    }
  }, 1000);
};
```

### After

```jsx
const handleAttack = async moveIndex => {
  if (battleState.turn !== 'player' || battleState.winner) return;

  const move = battleState.cards.hand[moveIndex];
  const cost = calculateEnergyCost(move);
  const currentEnergy = battleState.fighters.player.energy;

  if (currentEnergy < cost) {
    dispatch({ type: BATTLE_ACTIONS.ADD_TO_LOG, message: '⚡ Not enough energy!' });
    return;
  }

  // Spend energy
  dispatch({ type: BATTLE_ACTIONS.SPEND_ENERGY, fighter: 'player', amount: cost });

  // Animation
  dispatch({ type: BATTLE_ACTIONS.SET_ATTACKING_FIGHTER, fighter: 'player' });
  dispatch({ type: BATTLE_ACTIONS.SET_DAMAGED_FIGHTER, fighter: 'opponent' });

  // Calculate and apply damage
  const { damage, effectiveness } = calculateSmartDamage(
    battleState.fighters.player.pokemon,
    battleState.fighters.opponent.pokemon,
    move
  );

  const newHP = Math.max(0, battleState.fighters.opponent.hp - damage);
  dispatch({ type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP, fighter: 'opponent', hp: newHP });

  // Log
  dispatch({
    type: BATTLE_ACTIONS.ADD_TO_LOG,
    message: `${fighter1.name} used ${move.name}! Dealt ${damage} damage.`,
  });

  // Clear animations and check winner
  setTimeout(() => {
    dispatch({ type: BATTLE_ACTIONS.CLEAR_ANIMATIONS });

    if (newHP <= 0) {
      dispatch({ type: BATTLE_ACTIONS.SET_WINNER, winner: 'player' });
    } else {
      dispatch({ type: BATTLE_ACTIONS.SET_TURN, turn: 'opponent' });
    }
  }, 1000);
};
```

## Benefits of This Refactor

1. **Single Source of Truth**: All battle state in one place
2. **Predictable Updates**: All state changes go through the reducer
3. **Easier Testing**: Reducer is a pure function, easy to unit test
4. **Better Organization**: Related state grouped together
5. **Simplified Logic**: No need to track multiple setters
6. **Time Travel Debugging**: Can log/replay actions

## JSX Updates

### Before

```jsx
<div className="hp-bar">
    <div className="hp-fill" style={{ width: `${(f1HP / f1MaxHP) * 100}%` }} />
</div>
<div className="energy">⚡ {f1Energy}</div>
```

### After

```jsx
<div className="hp-bar">
    <div className="hp-fill" style={{
        width: `${(battleState.fighters.player.hp / battleState.fighters.player.maxHP) * 100}%`
    }} />
</div>
<div className="energy">⚡ {battleState.fighters.player.energy}</div>
```

## Testing the Reducer

```javascript
import { battleReducer, createInitialBattleState, BATTLE_ACTIONS } from './battleReducer';

describe('battleReducer', () => {
  it('should update fighter HP correctly', () => {
    const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
    const action = {
      type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP,
      fighter: 'player',
      hp: 10,
    };

    const newState = battleReducer(initialState, action);
    expect(newState.fighters.player.hp).toBe(10);
  });

  it('should not allow HP above max', () => {
    const initialState = createInitialBattleState(mockPokemon1, mockPokemon2);
    const action = {
      type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP,
      fighter: 'player',
      hp: 9999,
    };

    const newState = battleReducer(initialState, action);
    expect(newState.fighters.player.hp).toBe(initialState.fighters.player.maxHP);
  });
});
```

## Timeline

This refactoring should be done incrementally:

1. **Phase 1** (1-2 hours): Set up reducer, migrate basic state (HP, energy, turn)
2. **Phase 2** (2-3 hours): Migrate card system state
3. **Phase 3** (1-2 hours): Migrate UI/animation state
4. **Phase 4** (1 hour): Update all JSX references
5. **Phase 5** (1 hour): Testing and cleanup

**Total Estimate**: 6-9 hours

## Notes

- Keep outfit logic separate as it's loaded once on mount
- Keep loading state for moves separate (or add to reducer if needed)
- The reducer doesn't replace ALL logic - complex battle flow can stay as functions
- This is about STATE management, not business logic

## Next Steps

1. Review this guide
2. Create a test file for the reducer
3. Start with Phase 1 migration
4. Test thoroughly after each phase
5. Update components that use CardBattle if needed
