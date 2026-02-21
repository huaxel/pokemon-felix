## Why

Enhance the player experience for Felix by transforming static NPCs into dynamic, LLM-powered characters. This makes the game feel like a "multiplayer" environment where rivals and friends have persistence, personality, and memory of past interactions (battles, chats, achievements).

## What Changes

- Implementation of a persona system for NPCs.
- Persistent database storage for relationships and chat history.
- Integration with LLM (GPT-4o-mini) for character-driven dialogue.
- Memory management system using summarization to maintain long-term context cost-effectively.
- Function-calling/Tool-use layer to allow NPCs to trigger in-game actions like battle challenges.

## Capabilities

### New Capabilities
- `trainer-persona`: Define and store NPC traits, speech styles, and backstories.
- `relationship-tracking`: Maintain friendship and rivalry scores that evolve based on player behavior.
- `llm-chat`: Real-time, in-character conversation interface.
- `memory-summarization`: Periodic summarization of chat history into long-term relationship context.
- `npc-actions`: System for NPCs to initiate game events (e.g., challenging the player to a battle).

## Impact

- **Database**: New tables for `trainers`, `relationships`, `messages`, and `memory_summaries`.
- **Backend API**: New endpoints for chat, relationship status, and character data.
- **Frontend**: New chat UI components and relationship visualizations.
- **Dependencies**: Integration with OpenAI/Anthropic APIs.
