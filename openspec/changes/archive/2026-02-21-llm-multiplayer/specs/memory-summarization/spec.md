## ADDED Requirements

### Requirement: Long-term Context Management
The system SHALL periodically summarize recent chat interactions into a persistent "history summary" for each NPC relationship.

#### Scenario: Summarization trigger
- **WHEN** the chat history for an NPC exceeds 20 messages
- **THEN** the system triggers a summarization task and updates the `history_summary` field in the database.

### Requirement: Context Enrichment
The system SHALL inject the long-term `history_summary` into the LLM system prompt for all subsequent interactions.

#### Scenario: Contextual conversation
- **WHEN** Felix chats with Gary after a previous battle
- **THEN** Gary references the outcome of that battle (stored in the summary) in his opening message.
