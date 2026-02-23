## ADDED Requirements

### Requirement: LLM-Triggered Game Events

The system SHALL allow NPCs to trigger specific game events (e.g., `START_BATTLE`, `GIVE_ITEM`) through function calling or structured response fields.

#### Scenario: Battle challenge trigger

- **WHEN** an NPC decides to challenge Felix (e.g., Rivalry > 70)
- **THEN** the system parses the `START_BATTLE` action and transitions the game state to the battle engine.

### Requirement: Action Context

The system SHALL provide the necessary context for triggered actions (e.g., which Pokémon the NPC is using, what the stakes are).

#### Scenario: Battle setup

- **WHEN** a `START_BATTLE` action is triggered
- **THEN** the system initializes the battle with the NPC's team and the appropriate background/music.
