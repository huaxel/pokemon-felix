# Core Concepts

## Game Philosophy
Pokemon Felix is a web-based Pokemon game that emphasizes care, training, and strategic battling. It balances three main pillars:
1. **Care**: Feeding, grooming, and bonding with Pokemon.
2. **Training**: Improving stats through mini-games and interactions.
3. **Battle**: A card-based combat system where stronger bonds lead to better performance.

## State Management
The application uses **React Context** as the primary state management solution.
- **Global State**: Managed via providers in `src/contexts/DomainProviders.jsx`.
- **Battle State**: Uses a dedicated `useReducer` pattern for complex turn-based logic (see `src/lib/battleReducer.js`).

### Key Contexts
- `PokemonContext`: Manages the player's Pokemon roster, PC storage, and current party.
- `PlayerContext`: Manages player inventory, currency (coins), and progress.
- `CareContext`: Tracks hunger, energy, and affection via the `useCareSystem` hook.

## Core Entities
- **Pokemon**: The central entity, defined by species, stats, current status (HP, Energy), and Move set.
- **Items**: Potions, berries, and evolution items managed in the inventory.
- **Battle**: An instance of combat between two Pokemon, governed by `src/lib/battle-logic.js`.
