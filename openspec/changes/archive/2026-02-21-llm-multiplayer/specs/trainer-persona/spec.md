## ADDED Requirements

### Requirement: Definable NPC Personalities

The system SHALL support defining NPCs with rich personality data including traits, speech styles, and backstories.

#### Scenario: NPC data retrieval

- **WHEN** the system requests information for a specific NPC (e.g., Gary)
- **THEN** it returns a structured object containing traits (e.g., arrogant, competitive), speech style (e.g., "braggadocious"), and backstory.

### Requirement: Static Pokemon Teams

NPCs SHALL have a predefined Pokémon team associated with their persona.

#### Scenario: Accessing NPC team

- **WHEN** a battle is initiated with an NPC
- **THEN** the system retrieves the standard team defined in the NPC's persona.
