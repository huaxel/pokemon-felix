# Lighthouse Protocol - Usage Guide

## Overview
The Lighthouse Protocol enables seamless workflow between desktop (deep coding) and mobile (high-level strategy) by using your GitHub repo as a synchronization point.

**Current Pulse Size**: ~18KB / 477 lines of rich context

## Quick Start

### 1. Before Leaving Your Desk
Run the pulse script to generate a mobile-friendly context snapshot:
```bash
./pulse.sh
```

This will:
- Gather your architecture, active state, and recent changes
- Include core type definitions (150 lines from `types.ts`)
- Add game design brief and roadmap status
- Generate `docs/ai/current_pulse.md` (~18KB)
- Commit and push it to GitHub

### 2. On Mobile (Ideation Phase)
1. Open **GitHub Mobile App**
2. Navigate to `docs/ai/current_pulse.md`
3. Copy the raw text content
4. Paste into **Gemini** along with `docs/ai/system_prompt.md`
5. Start with this prompt:

> "I am mobile. Here is the Project Pulse and System Prompt. Review the state and let's discuss [TOPIC]. Focus on logic and architecture, not syntax."

### 3. Closing Mobile Session (The Dead Drop)
When you've solved a problem or designed a feature:

1. Ask Gemini:
> "Create an Implementation Spec for this solution formatted for a GitHub Issue. Include: Summary, Context, Files to Touch, Logic Flow, Type Changes, and Verification."

2. Open **GitHub App** → **Issues** → **New Issue**
3. Paste the spec and title it clearly (e.g., `feat: Refactor Auth Service`)

### 4. Back at Desktop (Implementation)
1. `git pull` to get the latest pulse and new Issue
2. Open the Issue in VS Code
3. Prompt Copilot/Antigravity:
> "Implement this spec from Issue #XX. Update `active_state.md` when finished."

## What's Included in the Pulse

The `current_pulse.md` file contains comprehensive context for mobile conversations:

1. **Architecture & Vision** - Tech stack, patterns, constraints, project structure
2. **Active State** - Current focus, recent work, known issues, next steps
3. **Project Map** - 3-level deep file tree for spatial awareness
4. **Core Type Definitions** - 150 lines from `src/core/types.ts` including:
   - `GameState`, `Components`, `Globals` interfaces
   - Entity types and component tables
   - Action types and system interfaces
5. **Game Design Brief** - High-level game concept and mechanics from `docs/design/one-page-game-brief.md`
6. **Roadmap Status** - First 100 lines of current feature planning
7. **Git Status** - Uncommitted changes and file modifications

**Total Size**: ~18KB / 477 lines - rich enough for strategic discussions, small enough for mobile copy-paste.

## Maintaining the System

### Update Architecture (Rare)
Edit `docs/ai/architecture.md` when:
- Tech stack changes
- Core patterns shift
- Database schema evolves

### Update Active State (Frequent)
Edit `docs/ai/active_state.md` to track:
- Current focus/objective
- Recent decisions
- Known issues
- Next steps

Or use this "Exit Ticket" prompt with Gemini:
> "Review our progress. Rewrite the `active_state.md` to reflect the current status, listing the 3 most critical next steps and any new architectural decisions we made. Keep it dense and technical. Output ONLY the markdown."

## Files Created

- `docs/ai/architecture.md` - The Constitution (stable context)
- `docs/ai/active_state.md` - The Newspaper (volatile context)
- `docs/ai/current_pulse.md` - The Signal (auto-generated, do not edit manually)
- `pulse.sh` - The Beacon Script (run before going mobile)

## Tips

- **Keep active_state.md concise**: 50-80 lines for focused context
- **Use dense, technical language**: "Auth: Firebase. Rationale: Speed + Scale."
- **Kill long chats**: Summarize to docs, then start fresh
- **Use GitHub Issues as the bridge**: Never copy-paste chat logs into VS Code
