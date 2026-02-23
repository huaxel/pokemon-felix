## ADDED Requirements

### Requirement: Friendship and Rivalry Scores

The system SHALL maintain two independent scores (0-100) for each NPC-player relationship: Friendship and Rivalry.

#### Scenario: Relationship score update

- **WHEN** an interaction occurs (e.g., Felix wins a battle or sends a friendly message)
- **THEN** the system updates the corresponding scores based on the outcome.

### Requirement: Evolving Relationship Types

The system SHALL dynamically calculate a relationship "type" (e.g., "Best Friend", "Arch Rival", "Neutral") based on the current scores.

#### Scenario: Relationship type recalculation

- **WHEN** Friendship score exceeds 80 and Rivalry is high
- **THEN** the relationship type is updated to "Friendly Rival".

### Requirement: Persistent Storage

Relationship data SHALL be persisted in a database to ensure it survives server restarts.

#### Scenario: Data persistence

- **WHEN** the server restarts
- **THEN** the relationship scores for Felix and Gary are loaded correctly from the initial state.
