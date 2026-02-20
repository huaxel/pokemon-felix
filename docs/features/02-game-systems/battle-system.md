# Card Battle System

## Concept

A simplified deck-builder where "Moves" are cards drawn from a deck.

## Mechanics

- **Energy**: Players have limited energy per turn (default: 3).
- **Cards**: Represent Moves (Tackle, Thunderbolt) or Items (Potion).
- **Hand**: Cards available to play this turn.
- **Discard Pile**: Used cards go here; reshuffled when Deck is empty.

## Refactoring Note

The Battle System uses a `useReducer` architecture to manage the complex state transitions (Animations, HP updates, Turn switching).
See `docs/architecture/02-systems/card-battle.md` for the technical implementation details.

## Feature Components

- `src/features/battle/CardBattle.jsx`: Main container.
- `src/features/battle/BattleHand.jsx`: UI for the player's hand.
- `src/features/battle/BattleField.jsx`: The visual arena.
