# Architecture & Vision

## Tech Stack

- **Frontend:** React 18 + Vite
- **State Management:** Context API (PokemonProvider, PlayerProvider, BattleContext, etc.)
- **Styling:** CSS Modules
- **Build Tool:** Vite
- **Package Manager:** npm
- **External APIs:** PokeAPI (https://pokeapi.co)

## Core Patterns

- **Architecture:** Component-based with Context API for state management
- **Data Persistence:** localStorage for save states and collections
- **Data Flow:** Context providers with custom hooks
- **File Structure:** Feature-based organization in `src/`

## Project Structure

```
src/
├── components/     # React UI components (pages, UI elements)
├── contexts/       # Context providers for state management
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and game logic
├── reducers/       # Reducers for complex state (battle system)
public/
├── assets/         # Images, sprites, pixel art
├── data/           # Pokemon data cache (if any)
docs/               # Documentation
agents/             # AI agent definitions
```

## Core Systems

- **World Navigation:** Tile-based 10x10 grid with keyboard/D-pad controls
- **Battle System:** Turn-based combat with stat calculations and energy management
- **Collection System:** Pokemon ownership, care (HP, hunger, happiness)
- **Inventory System:** Items, Pokeballs, consumables
- **Quest System:** NPCs, objectives, rewards
- **Educational Mini-Games:** School quizzes, Potion Lab (math), Porygon Lab (coding), Game Console (Python)
- **Customization:** Player profile, wardrobe, town building

## Constraints

- **Child-Friendly:** All content appropriate for age 7
- **Educational Focus:** Every feature should teach something valuable
- **Fun First:** If it's not fun, Felix won't play it
- **localStorage Persistence:** All progress saved locally
- **PokeAPI Integration:** Pokemon data fetched from external API

## Mobile Context (Included in Pulse)

The `pulse.sh` script generates rich context for mobile conversations including:

- **Roadmap**: Current feature status and planned work
- **File Tree**: 3-level deep project structure
- **Git Status**: Uncommitted changes and modified files
- **Project Overview**: Educational Pokemon game for Felix (age 7)
