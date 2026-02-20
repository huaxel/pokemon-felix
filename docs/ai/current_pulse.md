# 📡 PROJECT PULSE (Mobile Context)

**Generated:** Thu Jan 1 02:39:16 PM CET 2026

## 🏛️ 1. ARCHITECTURE & VISION

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

## 📰 2. ACTIVE STATE & TASKS

# Active State

## Current Focus

- Agent system adapted for Pokemon Felix (educational game development)
- Ready for Pokemon-focused feature development

## Recent Work

- [2026-01-01] **Adapted Agent System for Pokemon Felix**
  - Created Pokemon Expert agent (content & mechanics)
  - Created Educational Specialist agent (age-appropriate learning)
  - Created Game Designer agent (fun & engagement)
  - Updated Systems Architect for React/Pokemon context
  - Updated Frontend Specialist for child-friendly UI
  - Updated Playtester for 7-year-old audience
  - Updated QA Engineer and Trimmer
  - Rewrote team-workflow.md for Pokemon Felix
  - Updated AI context system (pulse.sh, docs/ai)

## Known Issues

- Old Belgian Politics agents still present (belgian_politics_expert.md, data_engineer.md, logic_engineer.md) - can be removed if desired

## Next Steps

1. Continue Pokemon Felix development with new agent system
2. Use agents for feature planning and implementation
3. Focus on Phase 6 roadmap items (Advanced World Features)

## 🗺️ 3. PROJECT MAP

```
.
├── agents
│   ├── ai_context_maintainer.md
│   ├── educational_specialist.md
│   ├── frontend_specialist.md
│   ├── game_designer.md
│   ├── logic_engineer.md
│   ├── playtester.md
│   ├── pokemon_expert.md
│   ├── product_manager.md
│   ├── qa_engineer.md
│   ├── systems_architect.md
│   ├── team-workflow.md
│   └── trimmer.md
├── conversation-dump.md
├── db.json
├── docker-compose.yml
├── Dockerfile
├── docs
│   ├── 2025 12 31 assets.md
│   ├── 2025 12 31 challenges.md
│   ├── 2025 12 31 review.md
│   ├── 2025 12 31 seizonen.md
│   ├── 2025 12 31 wereldkaart.md
│   ├── ai
│   │   ├── active_state.md
│   │   ├── architecture.md
│   │   ├── current_pulse.md
│   │   ├── README.md
│   │   └── system_prompt.md
│   ├── BATTLE_FIX_COMPLETE.md
│   ├── battle-system-fix.md
│   ├── battle-system-issues.md
│   ├── cardbattle-refactor-guide.md
│   ├── code_review.md
│   ├── features-review.md
│   ├── final-implementation-summary.md
│   ├── hooks-review.md
│   ├── implementation_roadmap.md
│   ├── implementation-summary.md
│   ├── lib-review.md
│   ├── MOUNTAIN_IMPLEMENTATION.md
│   ├── phase2-improvements-complete.md
│   ├── quick-reference.md
│   ├── WATER_ROUTES_IMPLEMENTATION.md
│   └── yagni-solid-dry-kiss-review.md
├── index.html
├── nginx.conf
├── package.json
├── package-lock.json
├── pokemon-favorites-2025-11-29 (1).json
├── PR_SUMMARY.md
├── pulse.sh
├── README.md
├── roadmap.md
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   ├── battle_bg.png
│   │   └── squad_bg.png
│   ├── components
│   │   ├── BattleArena.css
│   │   ├── BattleArena.jsx
│   │   ├── BattlePage.jsx
│   │   ├── CollectionPage.css
│   │   ├── CollectionPage.jsx
│   │   ├── GameConsole.css
│   │   ├── GameConsole.jsx
│   │   ├── HPBar.css
│   │   ├── HPBar.jsx
│   │   ├── Navbar.css
│   │   ├── Navbar.jsx
│   │   ├── PokemonCard.css
│   │   ├── PokemonCard.jsx
│   │   ├── PokemonModal.css
│   │   ├── PokemonModal.jsx
│   │   ├── SearchBar.css
│   │   ├── SearchBar.jsx
│   │   ├── Toast.css
│   │   └── Toast.jsx
│   ├── contexts
│   │   ├── BattleContext.jsx
│   │   ├── CareContext.jsx
│   │   ├── CollectionContext.jsx
│   │   ├── DomainContexts.js
│   │   ├── DomainProviders.jsx
│   │   ├── PlayerContext.js
│   │   ├── PlayerProvider.jsx
│   │   ├── PokemonContext.js
│   │   ├── PokemonProvider.jsx
│   │   ├── TownContext.jsx
│   │   └── UIContext.jsx
│   ├── hooks
│   │   ├── useCareContext.js
│   │   ├── useCare.js
│   │   ├── useCoins.js
│   │   ├── useCollection.js
│   │   ├── useGPS.js
│   │   ├── useInventory.js
│   │   ├── useLocalStorage.js
│   │   ├── useOutfitEffects.js
│   │   ├── usePlayer.js
│   │   ├── usePokemonContext.js
│   │   ├── usePokemonData.js
│   │   ├── usePokemonSearch.js
│   │   ├── useQuests.js
│   │   ├── useSquad.js
│   │   ├── useToast.js
│   │   ├── useTownContext.js
│   │   └── useTown.js
│   ├── index.css
│   ├── lib
│   │   ├── api.js
│   │   ├── battle-logic.js
│   │   ├── battleReducer.js
│   │   ├── constants.js
│   │   ├── createContextHook.js
│   │   ├── errorHandler.js
│   │   ├── favorites.js
│   │   └── utils.js
│   └── main.jsx
├── vite.config.js
└── vitest.config.js

10 directories, 114 files
```

## 🔧 4. KEY PROJECT FILES

```
# Key React contexts and hooks
-rw-r--r-- 1 juan juan  160 Dec 31 20:48 src/contexts/CareContext.jsx
-rw-r--r-- 1 juan juan  169 Dec 31 20:16 src/contexts/CollectionContext.jsx
-rw-r--r-- 1 juan juan 4.3K Jan  1 12:46 src/contexts/DomainProviders.jsx
-rw-r--r-- 1 juan juan 1.5K Jan  1 12:16 src/contexts/PlayerProvider.jsx
-rw-r--r-- 1 juan juan 5.4K Jan  1 12:57 src/contexts/PokemonProvider.jsx
-rw-r--r-- 1 juan juan  162 Dec 31 20:48 src/contexts/TownContext.jsx
-rw-r--r-- 1 juan juan  159 Dec 31 20:27 src/contexts/UIContext.jsx

# Key components
-rw-r--r-- 1 juan juan 9.4K Jan  1 13:29 src/components/BattleArena.jsx
-rw-r--r-- 1 juan juan  495 Dec 31 12:52 src/components/BattlePage.jsx
-rw-r--r-- 1 juan juan 3.7K Dec 31 20:23 src/components/CollectionPage.jsx
-rw-r--r-- 1 juan juan 6.2K Dec 31 19:30 src/components/GameConsole.jsx
-rw-r--r-- 1 juan juan  855 Jan  1 12:38 src/components/HPBar.jsx
-rw-r--r-- 1 juan juan 3.1K Jan  1 12:17 src/components/Navbar.jsx
-rw-r--r-- 1 juan juan 3.6K Dec 31 20:23 src/components/PokemonCard.jsx
-rw-r--r-- 1 juan juan 4.9K Dec 31 12:38 src/components/PokemonModal.jsx
-rw-r--r-- 1 juan juan 2.4K Dec 31 12:38 src/components/SearchBar.jsx
-rw-r--r-- 1 juan juan 1.4K Dec 31 19:12 src/components/Toast.jsx
```

## 🎮 5. PROJECT OVERVIEW

# Pokemon Felix

A modern Pokemon web application built with React + Vite, featuring a comprehensive Pokedex, battle system, and tournament mode.

## Features

- 🔍 **Pokemon Search**: Fuzzy search with autocomplete suggestions
- 📚 **Pokedex**: Browse and collect Pokemon with pagination
- ⭐ **Collection System**: Mark and track your favorite Pokemon
- ⚔️ **Battle Arena**: Simulate Pokemon battles with stat-based combat
- 🏆 **Tournament Mode**: 8-player elimination tournament
- 🌐 **Multilingual**: View Pokemon names and descriptions in multiple languages
- ♿ **Accessible**: Keyboard navigation and screen reader support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pokemon-felix
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

## Development

Start the development server (runs both frontend and backend):

```bash
npm run dev
```

This starts:

- **Frontend** (Vite): http://localhost:5173
- **Backend** (json-server): http://localhost:3001

## Available Scripts

## 🗺️ 6. ROADMAP STATUS

# Pokemon Felix - Roadmap 🗺️

> **Version**: 0.0.0  
> **Last Updated**: 2025-12-31  
> **Project Status**: Active Development

## 📊 Current State

Pokemon Felix has evolved from a simple Pokedex app into an **interactive RPG world** with:

- ✅ **World Map System** (10x10 tile-based navigation)
- ✅ **Seasonal System** (Dynamic visual themes)
- ✅ **Battle Arena** (Stat-based combat + Tournament mode)
- ✅ **Collection System** (Catch, own, and manage Pokemon)
- ✅ **Care System** (HP, Hunger, Happiness mechanics)
- ✅ **Town Builder** (Place buildings, trees, paths)
- ✅ **Inventory/Bag System** (Items, Pokeballs, consumables)
- ✅ **Shiny Pokemon** (1% encounter rate with visual effects)
- ✅ **Gacha System** (Mystery boxes with rewards)
- ✅ **Quest System** (NPCs, objectives, rewards)

---

## 🎯 Development Phases

### Phase 1: Core Foundation ✅ COMPLETE

_Status: Fully implemented and stable_

- [x] React + Vite setup
- [x] React Router navigation
- [x] PokeAPI integration
- [x] Pokemon cards and modal details
- [x] Search with fuzzy matching (Fuse.js)
- [x] Collection persistence (json-server)
- [x] Battle system with damage calculation
- [x] Tournament bracket (8-player elimination)

### Phase 2: World & Exploration ✅ COMPLETE

_Status: Implemented Dec 31, 2025_

- [x] Tile-based world map (10x10 grid)
- [x] Keyboard + D-Pad navigation
- [x] Interactive tiles (Grass, PokeCenter, Houses, Water)
- [x] Random encounters (30% in grass)
- [x] NPC interactions (Prof. Oak, Fisherman, Team Rocket)
- [x] Seasonal system with dynamic styling
- [x] Town construction mode
- [x] localStorage persistence for world state

### Phase 3: RPG Mechanics ✅ COMPLETE

_Status: Implemented Dec 31, 2025_

- [x] Pokemon care (HP, Hunger, Happiness)
- [x] Healing at PokeCenter
- [x] Inventory system with items
- [x] Pokeball variants (Great, Ultra, Master)
- [x] Shiny Pokemon encounters
- [x] Quest system with rewards
- [x] Coin economy
- [x] Gacha/Mystery boxes

---

## 🚀 Upcoming Features

### Phase 4: Educational Systems ✅ COMPLETE

_Status: Implemented Dec 31, 2025_

Integrate learning mechanics for Felix (age 7) to practice math, reading, and logic.

#### 4.1 Pokemon Academy ✅

- [x] Create `SchoolPage.jsx` component
- [x] Quiz system with multiple-choice questions
  - [x] Type advantages (Fire > Grass > Water)
  - [x] Math problems (Evolution levels, item costs)
  - [x] Geography (Where Pokemon live)
  - [x] Evolution knowledge
- [x] Certificate/diploma rewards
- [x] Progress tracking in localStorage
- [x] Add School building to world map
- [x] **Rewards**: Coins, items, badges

#### 4.2 Python Terminal (Coding Introduction) ✅

- [x] Create `GameConsole.jsx` component
- [x] Command interpreter for simplified Python syntax
  - [x] `heal_all()` - Heal all Pokemon
  - [x] `add_coins(amount)` - Add coins
  - [x] `print(pokedex)` - Show collection stats
  - [x] `catch_pokemon(id)` - Catch specific Pokemon
- [x] Syntax error messages for learning
- [x] Secret access (Ctrl+` shortcut)

#### 4.3 Porygon Algorithm Puzzle ✅

- [x] Create `PorygonLabPage.jsx` component
- [x] Sequential command builder
  - [x] `step()` - Move forward
  - [x] `turn_left()` / `turn_right()` - Rotate
- [x] Visual execution of command sequence
- [x] Debugging feedback on collision
- [x] Progressive difficulty levels (3+ levels)

## 🩸 7. UNCOMMITTED CHANGES

```diff
 M docs/ai/current_pulse.md
 M src/features/world/WorldPage.jsx
---
 docs/ai/current_pulse.md         | 678 +++++++++++++++++----------------------
 src/features/world/WorldPage.jsx |   1 -
 2 files changed, 295 insertions(+), 384 deletions(-)
```
