## Context

Currently, the Pokémon Felix project has static NPCs with hardcoded quotes. To make the game more immersive for Felix, we are introducing "LLM Multiplayer," where NPCs have persistent memory, evolving relationships, and the ability to trigger game events through natural conversation.

## Goals / Non-Goals

**Goals:**
- **Dynamic NPCs**: NPCs respond uniquely based on their persona and history with the player.
- **Persistent Relationships**: Friendship and Rivalry scores are saved and influence future interactions.
- **Agency**: NPCs can challenge the player to battles or give items via chat.
- **Cost-Efficiency**: Use summarization to keep context windows small and token costs low.

**Non-Goals:**
- **Real Multiplayer**: This feature is for single-player NPC immersion, not connecting real human players.
- **Voice Recognition**: Chat will be text-based initially.

## Decisions

### 1. Data Persistence via JSON-Server
- **Choice**: Use the existing `db.json` and `json-server` setup.
- **Rationale**: The project already uses `json-server` for the collection and other data. Adding new tables for `trainers` and `relationships` follows the existing pattern and ensures persistence during development.
- **Alternatives**: SQLite or PostgreSQL were considered but add unnecessary complexity for this phase of the project ("KISS" principle).

### 2. LLM Engine: OpenAI gpt-4o-mini
- **Choice**: OpenAI's `gpt-4o-mini` model.
- **Rationale**: It is high-performance, supports function calling for game actions, and is significantly cheaper than `gpt-4o` or `claude-3-5-sonnet`.
- **Alternatives**: `claude-3-5-sonnet` (more expensive), `local-llm` (too slow/hardware intensive).

### 3. Memory Strategy: Recursive Summarization
- **Choice**: Store the last 10 messages verbatim and summarize everything prior into a `relationship_history` field.
- **Rationale**: Keeps the context window small while preserving all important narrative beats. Summarization is triggered every 20 messages.
- **Alternatives**: "Full context" (too expensive), "Static prompt only" (NPCs forget everything).

### 4. Game Actions via Structured JSON
- **Choice**: Request character responses in a JSON format containing `message`, `emotion`, and `action`.
- **Rationale**: Allows the frontend to easily parse and trigger UI changes (emotions) or game state transitions (battles).

## Risks / Trade-offs

- **[Risk] API Latency** → [Mitigation] Use typing indicators and optimistic UI updates.
- **[Risk] Token Cost** → [Mitigation] Aggressive summarization and model selection (`gpt-4o-mini`).
- **[Risk] Character Break** → [Mitigation] Strong system prompts and periodic state re-injection.
