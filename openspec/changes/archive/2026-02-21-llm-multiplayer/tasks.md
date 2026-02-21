## 1. Data Layer Setup

- [ ] 1.1 Update `db.json` with `trainers`, `relationships`, `messages`, and `memory_summaries` tables.
- [ ] 1.2 Seed initial trainer data from `src/lib/trainers.js` into `db.json`.

## 2. LLM Service Implementation

- [ ] 2.1 Create `src/lib/services/llmService.js` with `fetchChatResponse`.
- [ ] 2.2 Create `src/lib/services/promptBuilder.js` for dynamic system prompt generation.
- [ ] 2.3 Implement relationship score update logic and summarization logic.

## 3. UI Components

- [ ] 3.1 Create `src/components/RelationshipBar.jsx`.
- [ ] 3.2 Create `src/components/TrainerChat.jsx` modal component.
- [ ] 3.3 Integrate chat modal and "Talk" buttons into the Trainers UI.

## 4. Game Integration & Verification

- [ ] 4.1 Implement `START_BATTLE` action handler to trigger the battle engine.
- [ ] 4.2 Write unit tests for the core logic in `llmService.js`.
- [ ] 4.3 Manually verify end-to-end chat, memory, and actions.
