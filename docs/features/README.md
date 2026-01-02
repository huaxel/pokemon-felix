# Features Documentation

This directory details the gameplay features, mechanics, and design philosophies of Pokemon Felix.

## Structure

### **[00 Design Pillars](./00-DESIGN-PILLARS.md)**
The core philosophy: Care, Training, and Battle.

### **[01 Core Mechanics](./01-core-mechanics)**
- **[Care System](./01-core-mechanics/care-system.md)**: Feeding, grooming, and affection.
- **[Progression Loop](./01-core-mechanics/progression-loop.md)**: The daily cycle of gameplay.

### **[02 Game Systems](./02-game-systems)**
- **[Battle System](./02-game-systems/battle-system.md)**: Card-based combat rules.
- **[World System](./02-game-systems/world-exploration.md)**: Travel and map logic.

### **[03 Design Philosophy](./03-design-philosophy)**
- **[Age Appropriate Design](./03-design-philosophy/age-appropriate-design.md)**: Guidelines for the target audience (7yo).

### **[04 Advanced Features](./04-advanced-features)**
- **[Porygon Lab](./04-advanced-features/porygon-lab.md)**: The coding mini-game.

## Implementation Logs
Legacy implementation logs have been archived in `../planning/development-log/from_features/`.

- Battle system
  - [Issues & Improvements](features/battle-system-issues.md)
  - [Refactor / Fix Summary](features/battle-system-fix.md)

- Gameplay & Features
  - [Phase 2 Improvements (complete)](features/phase2-improvements-complete.md)
  - [Water Routes Implementation](features/WATER_ROUTES_IMPLEMENTATION.md)
  - [Mountain Implementation](features/MOUNTAIN_IMPLEMENTATION.md)
  - [Implementation Roadmap](features/implementation_roadmap.md)
  - [Implementation Summary](features/implementation-summary.md)
  - [Final Implementation Summary](features/final-implementation-summary.md)

- User-facing docs / quick notes
  - [Quick Start](quick-start.md)
  - [Quick Reference](quick-reference.md)

How to add a feature doc

1. Create a markdown file under `docs/features/` named clearly: `feature-<name>.md`.
2. Include a short summary, motivation, acceptance criteria, and any UI mockups.
3. Link the doc from this page so it appears in the project feature index.
