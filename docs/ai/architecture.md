# Architecture & Vision

## Tech Stack
- **Frontend:** React + TypeScript + Vite
- **State Management:** Redux Toolkit
- **Styling:** CSS Modules
- **Build Tool:** Vite
- **Package Manager:** npm

## Core Patterns
- **Architecture:** Component-based with Redux for state management
- **Type Safety:** Strict TypeScript throughout
- **Data Flow:** Unidirectional (Redux)
- **File Structure:** Feature-based organization in `src/`

## Project Structure
```
src/
├── core/           # Game logic, systems, types
├── components/     # React UI components
├── ui/            # UI-specific components
├── test/          # Test utilities and helpers
public/
├── data/          # Game data (JSON files)
docs/              # Documentation
```

## Core Systems
- **Game State:** Redux-based state management with typed actions
- **Turn System:** Phase-based gameplay (briefing → execution → resolution)
- **Data Loading:** JSON-based game data (parties, issues, constituencies)
- **Event System:** Dynamic game events and crises

## Constraints
- No `any` types in TypeScript
- Immutable state updates via Redux
- All game data externalized to JSON files
- Component-based UI architecture

## Mobile Context (Included in Pulse)
The `pulse.sh` script generates rich context for mobile conversations including:
- **Core Types** (150 lines from `types.ts`): GameState, Components, Actions
- **Game Design Brief**: High-level game concept and mechanics
- **Roadmap**: Current feature status and planned work
- **File Tree**: 3-level deep project structure
- **Git Status**: Uncommitted changes and modified files
