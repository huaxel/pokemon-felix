# 📡 PROJECT PULSE (Mobile Context)
**Generated:** Thu Jan  1 12:59:23 PM CET 2026

## 🏛️ 1. ARCHITECTURE & VISION
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

## 📰 2. ACTIVE STATE & TASKS
# Active State

## Current Focus
- Lighthouse Protocol fully operational and ready for mobile/desktop workflow

## Recent Work
- [2026-01-01] **Completed Lighthouse Protocol setup**
  - Enhanced `pulse.sh` to include core types (150 lines), game design brief, and roadmap
  - Created comprehensive system prompt with context awareness and mobile workflow instructions
  - Pulse now generates 18KB/477 lines of rich context
- [2026-01-01] Implemented Morning Briefing display fixes
- [2026-01-01] Standardized agenda slots configuration
- [2026-01-01] Fixed dossier population in game state

## Known Issues
- None currently blocking

## Next Steps
1. Test mobile workflow with enhanced pulse
2. Continue game development with improved AI assistance
3. Use GitHub Issues as bridge between mobile ideation and desktop implementation

## 🗺️ 3. PROJECT MAP
```
.
├── agents
│   ├── belgian_politics_expert.md
│   ├── frontend_specialist.md
│   ├── logic_engineer.md
│   ├── playtester.md
│   ├── product_manager.md
│   ├── qa_engineer.md
│   ├── systems_architect.md
│   ├── team-workflow.md
│   └── trimmer.md
├── docs
│   ├── ai
│   │   ├── active_state.md
│   │   ├── architecture.md
│   │   ├── current_pulse.md
│   │   ├── README.md
│   │   └── system_prompt.md
│   ├── architecture
│   │   ├── README.md
│   │   └── registry-and-eventbus-rfc.md
│   ├── brand-design
│   │   ├── logo_only.png
│   │   ├── logo_only.psd
│   │   ├── logo.png
│   │   ├── logo_with_name.png
│   │   ├── logo_with_name.psd
│   │   ├── README.md
│   │   └── style-guide.md
│   ├── design
│   │   ├── constituency-schema.md
│   │   ├── GEOJSON_INTEGRATION.md
│   │   ├── one-page-game-brief.md
│   │   └── seat-allocation.md
│   ├── features
│   │   └── README.md
│   ├── planning
│   │   ├── qa-strategy.md
│   │   ├── README.md
│   │   └── roadmap.md
│   └── README.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── public
│   ├── logo.png
│   └── vite.svg
├── pulse.sh
├── README.md
├── scripts
│   ├── buildGeoMapping.cjs
│   ├── consolidateArchive.cjs
│   ├── migrateGeometryIds.cjs
│   ├── validateGeoJson.cjs
│   └── validateGeoJson.js
├── src
│   ├── app
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── assets
│   │   ├── belgium_provincies.json
│   │   ├── belgium_regions.json
│   │   └── react.svg
│   ├── core
│   │   ├── bootstrapSystems.ts
│   │   ├── factories.ts
│   │   ├── gameReducer.ts
│   │   ├── index.ts
│   │   ├── queries.ts
│   │   ├── SystemRegistry.ts
│   │   ├── System.ts
│   │   └── types.ts
│   ├── features
│   │   └── index.ts
│   ├── hooks
│   │   ├── index.ts
│   │   ├── useGameActions.ts
│   │   └── useGameLogic.ts
│   ├── index.css
│   ├── lib
│   │   ├── actions.ts
│   │   ├── index.ts
│   │   └── legacyMapper.ts
│   ├── pages
│   │   ├── BriefingView.tsx
│   │   ├── GameView.tsx
│   │   ├── index.ts
│   │   └── MainMenu.tsx
│   ├── test
│   │   ├── debug.test.ts
│   │   ├── infrastructure.test.ts
│   │   └── setup.ts
│   └── types
│       └── assets.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts

21 directories, 79 files
```
## 🔧 4. CORE TYPE DEFINITIONS
```typescript
// Key types from src/core/types.ts (first 150 lines)
/**
 * Hybrid ECS Type System for Belgian Political Simulator
 * Compatibility layer: provide commonly-used type exports and permissive
 * action shapes while the codebase migrates between naming conventions.
 */

export * from './domain';
// Re-export UI/shared types to satisfy imports that expect a `types` barrel
// Note: avoid re-exporting './types/shared' to prevent circular/duplicate exports

import type {
  EntityId,
  EntityType,
  Stats,
  Resources,
  Relations,
  Identity,
  TransientStatus,
  Modifier,
} from './domain/primitives';

import type { TechNode } from './domain/items/TechNode'; // Add import

import type { Dossier, ResolutionPath } from './domain/items/Dossier';
import type { PartyPlatform, PartyTrait } from './domain/containers/Party';
import type { ConstituencyData } from './domain/containers/Constituency';
import type { Baron } from './domain/items/Baron';
import type { Rumor } from './domain/items/Rumor';
import type { Mandate } from './domain/items/Mandate';
import type { BillData } from './domain/items/Bill';
import type { IssueData } from './domain/items/Issue';
import type { Organization, PillarAffiliation } from './domain/containers/Organization';
import type { GameEvent } from './domain/items/GameEvent';
import type { Actor } from './domain/items/Actor';
import type { NationState } from './domain/simulation/NationState';

// Helpers
export function createEntityId(type: EntityType, id: string): EntityId {
  if (id.startsWith(`${type}:`)) return id as EntityId;
  return `${type}:${id}` as EntityId;
}

export function getEntityType(id: EntityId): EntityType | null {
  const parts = id.split(':');
  return parts.length > 1 ? (parts[0] as EntityType) : null;
}

// Minimal ECS components/state (keep compatible with existing code)
export interface CorruptionStats { risk: number; investigationChance: number; history: string[] }
export interface BudgetState { deficit: number; debt: number; revenue: number; spending: number; marketConfidence: number }
export interface DeckComponent { library: string[]; hand: string[]; agenda: string[]; discard: string[]; exhaust: string[] }
export type PlayerDeck = DeckComponent; // Alias for Guide compatibility
export interface SchedulerComponent { assignments: Record<string, string>; lockedSlots: string[] }
export interface PoliticalDesk { inbox: string[]; agenda: string[]; archive: string[]; backlog: string[]; } // Added
export interface TechState { unlockedNodes: string[]; availableNodes: string[] } // New State
export type ComponentTable<T> = Record<EntityId, T>

export interface Components {
  identity: ComponentTable<Identity>
  stats: ComponentTable<Stats>
  relations: ComponentTable<Relations>
  resources: ComponentTable<Resources>
  transientStatus: ComponentTable<TransientStatus>
  partyPlatform: ComponentTable<PartyPlatform>
  constituencyData: ComponentTable<ConstituencyData>
  politicalDesk?: ComponentTable<PoliticalDesk> // Added

  issueData: ComponentTable<IssueData>
  billData: ComponentTable<BillData>
  deck: ComponentTable<DeckComponent>
  dossierData?: ComponentTable<Dossier>
  scheduler: ComponentTable<SchedulerComponent>
  techTree?: ComponentTable<TechState> // New component
  baronData: ComponentTable<Baron>
  rumors?: ComponentTable<Rumor[]>
  actorData: ComponentTable<Actor>
  corruption: ComponentTable<CorruptionStats>
  pillarAffiliation: ComponentTable<PillarAffiliation>
  organizationData: ComponentTable<Organization>
  factions?: ComponentTable<Faction[]> // New component for V2
}

// Player / Game state (trimmed for compatibility)
export interface PlayerState { authority: number; authorityWarningShown: boolean; authorityHistory: any[] }
export interface PartyBureau { currentMandate: Mandate | null; mandateHistory: Mandate[]; nextMandateDate: number }

export type GamePhase = 'setup' | 'campaign' | 'election' | 'consultation' | 'formation' | 'governing' | 'crisis' | 'gameOver'
export type Season = 'winter' | 'spring' | 'summer' | 'autumn'
export type TurnPhase = 'briefing' | 'execution' | 'resolution'

export interface Coalition { parties: EntityId[]; primeMinister: EntityId; formationDate: number;[k: string]: any }
export interface ElectionResult { date: number; seats: Record<EntityId, number>; votes: Record<EntityId, number>; voteShare?: Record<EntityId, number>; constituencyResults?: Record<EntityId, { seats: Record<EntityId, number>; voteShare: Record<EntityId, number> }>; turnout: number }

export type TimeMode = 'STRATEGIC' | 'TACTICAL';

export interface ChronosState {
  absoluteTurn: number;
  year: number;     // 2025
  season: Season;   // 'winter'
  week: number;     // 1-52

  // The Elastic State
  timeMode: TimeMode;

  // Progress within current Phase
  weeksInPhase: number;
  trimestersInPhase: number;
}

export interface MorningPaper { headlines: { text: string; sentiment: 'positive' | 'negative' | 'neutral' }[] }
export interface Globals { currentTurn: number; currentPhase: GamePhase; turnPhase: TurnPhase; playerParty: EntityId; electionHistory: ElectionResult[]; events: GameEvent[]; voiceInfluence?: Record<string, number>; chronos?: ChronosState; transientJuice?: { type: string; value: number; label: string }; delayedActions?: { turn: number; effects: any[]; description: string; source?: string }[]; morningPaper?: MorningPaper;[k: string]: any }

export interface GameState { entities: EntityId[]; components: Components; globals: Globals; nation?: NationState;[k: string]: any }

// Modding / data
export interface ModManifest { id: string; name: string; version: string; author: string; description: string }

export interface Faction {
  id: string;
  name: string;
  description?: string;
  ideology?: string;
  power: number; // 0-100
  satisfaction: number; // 0-100
  alignedInterest?: string;
}

export interface PartyDefinition { id: string; name: string; fullName?: string; ideology: string; color: string; description: string; language: string; difficulty?: string; seats: number; money: number; momentum: number; toxicity?: number; traits: PartyTrait[]; positions: Record<string, number>; priorityIssues?: string[]; tags?: string[]; initialDeck?: string[]; factions?: Faction[] }

export interface GameDataPackage { manifest: ModManifest; parties: PartyDefinition[]; constituencies: any[]; issues: any[]; dossiers?: Dossier[]; actors?: Actor[]; technologies?: TechNode[]; crises?: any[]; traits?: any[] }

// Make GameAction permissive so legacy code that expects ad-hoc fields compiles
export interface GameAction {
  type: string
  actor: EntityId
  target?: EntityId
  payload?: Record<string, unknown>
  cost?: { money?: number; politicalCapital?: number; }
  [key: string]: any
}

export interface CampaignAction extends GameAction { type: CampaignActionType }

// Accept both snake_case and camelCase variants used throughout the codebase
export type CampaignActionType =
  | 'canvassing' | 'doorToDoor' | 'door_to_door'
  | 'media_appearance' | 'mediaAppearance' | 'media_appearance'
  | 'fundraising' | 'fundraise' | 'fundraising'
  | 'attack_ad' | 'attackAd' | 'advertisement'
  | 'policy_speech' | 'policySpeech' | 'policyAnnouncement' | 'policy_announcement'
```

## 🎮 5. GAME DESIGN BRIEF
# One-Page Game Design Brief — BelPolSim

Overview
- Tactical political simulation focused on Belgian federal politics. Players manage a party: campaign, negotiate coalitions, govern, and survive crises.

Player Goals
- Win enough seats in an election to form or join a stable coalition.
- Maintain government stability, pass priority legislation, and manage resources (money, political capital).

Core Loop
1. Campaign phase: allocate resources across constituencies, run targeted actions (canvass, ads, rallies) that modify local polling and awareness.
2. Election: calculate seat allocation per constituency, produce national seat totals.
3. Formation: negotiate coalition offers with AI parties; objective is to reach majority and manage linguistic/policy parity.
4. Governing: enact laws, respond to crises, manage toxicity and coalition stability; poor outcomes feed back into polling.

Polling Model (high-level)
- Two-tier polling: national (components.stats[party].nationalPolling) and constituency-level (components.stats[party].constituencyPolling[constituencyId]).
- Campaign actions apply local delta to constituencyPolling; events apply national or local shocks with decay over time.
- Polling should respect normalization (sums ≈ 100%) and include noise/smoothing to avoid erratic swings.

Seat Allocation
- Use per-constituency proportional allocation (recommended: D'Hondt) producing integer seat counts per constituency.
- Global parliament composition is the sum of constituency seats; majority threshold computed from total seats.

Coalition Rules & UX
- Cordon sanitaire: some parties may be barred from coalition; enforce in evaluation logic.
- Cabinet parity: apply linguistic parity rules when assigning ministers; affect coalition friction metric.
- UX: map-driven constituency view, tooltip with leader + polling, election-results modal presenting seat map and seat swing.

Metrics & Balancing Targets
- Target election pacing (turns between elections), typical seat swings, win rates per difficulty.
- Design 5 scenarios (easy/normal/hard + 2 challenge scenarios) to tune win conditions.

Next Deliverables for Design/Dev
1. Formal JSON Schema for constituencies and polling (example in repo).  
2. Seat allocation spec: D'Hondt algorithm + tie-break rules.  
3. UI mockups: map legend, constituency drilldown, election-results screen.  
4. Scenario specs (start states, objectives, balancing targets).

## 🗺️ 6. ROADMAP STATUS
# Roadmap

**Last Updated:** 2025-12-31  
**Current Version:** v0.6.4 (The Execution Loop)  
**Next Version:** v0.7.0 (Iron Logic)  
**Philosophy:** "Deepen the Well before you Dig the Moat"

## Current Status

**v0.6.4 Complete** ✅
- Phase system (Briefing, Execution, Resolution)
- DeskView UI component
- Turn phase transitions
- Core gameplay loop functional

**Next Focus**: v0.6.5 - Polish, tests, and moddability foundation

## Next 4 Versions (Tactical Roadmap)

### v0.6.5 - Polish, Tests & Moddability 🧪

**Goal**: Solidify foundation before Iron Logic

**Core Features**:
1. **Test Coverage** (80%+ target)
   - ElectionSystem, CoalitionSystem, CampaignSystem
   - TimeSystem, AuthoritySystem
   - State builder helpers

2. **JSON Data Migration**
   - Move parties, constituencies, issues to JSON
   - Move barons, traits to JSON
   - Create DataLoader system
   - Enable community modding

3. **Polish**
   - UI/UX improvements
   - Bug fixes
   - Performance optimization
   - Better error messages

**Success Criteria**:
- 80%+ test coverage
- All game data in JSON files
- Modding guide published
- No critical bugs

**Timeline**: 2-3 weeks

---

### v0.7.0 - Iron Logic 🎯

**Goal**: Architectural unification - "One Game" principle

**Core Features**:
1. **Master State** (`GameLoop.ts`)
   - Unified state machine: Formation → Government → Opposition → Campaign
   - Mode transitions (election day, government collapse)
   - Single `GameState` for all modes

2. **The Simulation** ("The 5 Great Needles")
   - `NationState` (GDP, Inflation, Emissions) logic
   - The Planbureau Engine (Input -> Trend -> Crisis)

3. **The Clausewitz Engine** (Traits)
   - Universal Trait System (`trait_separatist`, `trait_union_leader`)
   - `TraitSystem` for cost/vote modifiers

4. **Kabinetschef UI** (Voices)
   - Internal Monologue system ("Technocrat", "Populist", "Ideologue")

2. **Seasonal System** (`SeasonSystem.ts`)
   - Winter (Budget Season) - High constraint, grumpy voters
   - Spring (Reform Window) - High legislative output
   - Summer (Cucumber Time) - Low stakes, high scandal risk
   - Autumn (Rentrée) - High friction, strikes

3. **Unified Desk** (`UnifiedDesk.tsx`)
   - Single adaptive UI for all modes
   - Inbox (drawn cards for the week)
   - Grid (5-day execution calendar)
   - Context shifts: Campaign HQ ↔ PM Office

**Implementation**:
- Define GameState interfaces
- Implement SeasonSystem
- Refactor useGameLogic to state machine
- Build UnifiedDesk component

**Success Criteria**:
- All 4 modes use same game loop
- Seasonal events inject correctly
- Smooth mode transitions
- Single coherent UI

---

### v0.8.0 - Worker Placement


## 🩸 7. UNCOMMITTED CHANGES
```diff
 M agents/belgian_politics_expert.md
 M docs/ai/current_pulse.md
---
 agents/belgian_politics_expert.md |  2 +-
 docs/ai/current_pulse.md          | 11 +++++------
 2 files changed, 6 insertions(+), 7 deletions(-)
```
