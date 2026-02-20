# Battle System - Issues & Improvements

## Current Issues

### 1. **State Management Complexity** 🔴 CRITICAL

**Problem**: CardBattle uses 17+ separate useState calls

- `battleLog`, `winner`
- `attackingFighter`, `damagedFighter`, `effectivenessMsg`, `comboMsg`
- `f1HP`, `f2HP`, `f1MaxHP`, `f2MaxHP`
- `f1Energy`, `f2Energy`
- `hand`, `selectedIndices`, `deck`
- `f2Moves`, `turn`, `lastMoveName`
- `showItems`, `outfitId`

**Impact**: Hard to reason about state updates, race conditions possible

**Solution**: Use `battleReducer` (already created in `/src/lib/battleReducer.js`)

### 2. **HP Sync Issues** 🟡 MEDIUM

**Problem**: HP state (`f1HP`, `f2HP`) can desync from maxHP during battle

- Initial state from `calculateMaxHP()` doesn't always match actual stats
- Multiple `setF1HP` calls in rapid sequence can lose updates

**Solution**:

- Always calculate maxHP from pokemon.stats, not from props
- Use batch updates with callback refs for rapid HP changes
- Add validation: `HP <= maxHP` always

### 3. **Energy Regeneration Bugs** 🟡 MEDIUM

**Problem**: Energy regeneration timing is inconsistent

- `+2 energy` per turn but happens at wrong times
- Max energy cap (5) sometimes enforced, sometimes not

**Solution**:

- Consolidate energy logic in reducer
- Use `Math.min(MAX_ENERGY, current + amount)` consistently

### 4. **Race Conditions in Turn Execution** 🟡 MEDIUM

**Problem**: `executeTurn` async function + state setters

- Multiple `setTurn()` calls can execute out of order
- `battleLog` updates might not reflect latest state

**Solution**:

- Queue-based turn system (process one action at a time)
- Use reducer dispatch for all state changes (automatic batching)

### 5. **AI Opponent Timing** 🟡 MEDIUM

**Problem**: AI turn logic depends on stale state

- `f2Energy` value in closure is stale when AI executes
- Chaining logic is fragile

**Solution**:

- Move AI logic into effects that depend on `turn` state
- Use custom hook for AI behavior

### 6. **Card System Fragility** 🟡 MEDIUM

**Problem**: Hand/deck management is error-prone

- `selectedIndices` can reference non-existent cards
- Card dedup using `Math.random()` as ID is bad

**Solution**:

- Use proper unique IDs (UUID)
- Validate card existence before actions
- Immutable card operations

## Migration Path

### Phase 1: Immediate Stability (v0.6.1)

- ✅ Add HP validation: `Math.max(0, Math.min(hp, maxHP))`
- ✅ Fix energy capping: `Math.min(5, energy)`
- ✅ Add null checks for card operations
- ✅ Add logging for debugging race conditions

### Phase 2: Medium Refactor (v0.7.0)

- Migrate to `battleReducer` for all state
- Create `useAI` hook for opponent logic
- Extract card logic to `useCardHand` hook
- Add turn queue system

### Phase 3: Major Refactor (v0.8.0+)

- Full reducer implementation
- Proper effect-based architecture
- Comprehensive battle state tests
- Performance optimizations

## Testing Checklist

- [ ] HP never goes negative
- [ ] HP never exceeds maxHP
- [ ] Energy capped at 5
- [ ] Turn order is consistent
- [ ] Battle log reflects all actions
- [ ] No stale closure bugs in AI
- [ ] Cards selected exist in hand
- [ ] Item use doesn't break turn order
- [ ] Multiple rapid attacks don't desync

## Code Quality Improvements

```javascript
// ❌ BAD - Multiple state setters, race conditions
const attack = () => {
  setF2HP(prev => prev - damage); // Async!
  setTurn('opponent'); // Might execute first
  setBattleLog(prev => [...prev, msg]);
};

// ✅ GOOD - Single dispatch, batched updates
const attack = () => {
  dispatch({ type: ATTACK, damage, defender: 'f2' });
  // Reducer handles HP, turn, logging atomically
};
```

## Files Involved

- `src/features/battle/CardBattle.jsx` - Main component (431 lines)
- `src/lib/battleReducer.js` - Already created but unused
- `src/lib/battle-logic.js` - Damage calculations
- `src/features/battle/SingleBattlePage.jsx` - Simple battles

## Documentation

All battle functions need JSDoc comments explaining:

1. Input parameters and types
2. State mutations side effects
3. Race conditions it might have
4. Expected async behavior

---

**Priority**: HIGH - Battles are core game feature
**Effort**: 2-3 hours for full migration
**Risk**: MEDIUM - Good test coverage needed
