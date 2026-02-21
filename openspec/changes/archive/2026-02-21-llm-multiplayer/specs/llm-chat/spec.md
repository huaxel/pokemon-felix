## ADDED Requirements

### Requirement: Interactive Dialogue Interface
The system SHALL provide a chat interface allowing Felix to send text messages to any NPC in the world.

#### Scenario: Sending a message
- **WHEN** Felix types "Hello" and hits send
- **THEN** the system forwards the message to the LLM agent and waits for a response.

### Requirement: Character-Driven Responses
The NPC's responses SHALL reflect their defined persona and current relationship status with Felix.

#### Scenario: In-character response
- **WHEN** Felix chats with Gary (high rivalry)
- **THEN** Gary's response is arrogant and mentions being a better trainer.

### Requirement: Real-time Communication
The system SHALL support real-time message delivery between the client and the chat engine.

#### Scenario: Receiving a message
- **WHEN** the LLM generates a response
- **THEN** the message appears in Felix's chat window immediately without a page refresh.
