# The Agentic Development Team & Workflow

This document outlines the roles, responsibilities, and operational workflow of the AI development team for BelPolSim.

---

## Quick Reference

> **TL;DR:** The 4-phase loop for every feature.

1. **Align** → Check `docs/planning/roadmap.md` + `docs/planning/development-log/`
2. **Plan** → Create a short plan doc in `docs/planning/implementation/`
3. **Build** → Types → Data → Logic → Tests → UI
4. **Review** → Run tests → Update docs by creating `docs/planning/versions/vX.Y.Z-[feature_name].md` → Walkthrough

---

## 1. The Team

| Role | Alias | Focus | File |
|------|-------|-------|------|
| **Belgian Politics Expert** | Oracle | Requirements, historical context, JSON content | [→](./belgian_politics_expert.md) |
| **Product Manager** | Vision | Roadmap, narrative, "Game Feel" | [→](./product_manager.md) |
| **Systems Architect** | Blueprint | Data modeling, types, interfaces | [→](./systems_architect.md) |
| **Data Engineer** | Pipeline | JSON loading, schema validation, content pipeline | [→](./data_engineer.md) |
| **Logic Engineer** | Engine | Core algorithms, pure functions | [→](./logic_engineer.md) |
| **Frontend Specialist** | Face | UI components, UX flows | [→](./frontend_specialist.md) |
| **QA Engineer** | Guardian | Tests, bug hunting | [→](./qa_engineer.md) |
| **Playtester** | Gamer | Fun factor, balance, pacing | [→](./playtester.md) |
| **Trimmer** | Trimmer | Scope trimming (YAGNI/KISS/DRY) | [→](./trimmer.md) |
| **AI Context Maintainer** | Lighthouse | AI context sync, session continuity | [→](./ai_context_maintainer.md) |

---

## 2. Handoff Triggers

Explicit conditions for transitioning between roles:

| From | To | Trigger |
|------|----|---------|
| AI Context Maintainer | Politics Expert | New session started, context loaded |
| Politics Expert | Systems Architect | Requirements document approved |
| Systems Architect | Data Engineer | Types & interfaces merged |
| Data Engineer | Logic Engineer | Data loaded and validated |
| Logic Engineer | QA Engineer | New pure function created |
| QA Engineer | Frontend Specialist | Unit tests passing |
| Frontend Specialist | Playtester | UI feature complete |
| Playtester | Product Manager | Session feedback written |
| Product Manager | AI Context Maintainer | Sign-off complete, update context |

---

## 3. Escalation Matrix

When stuck, escalate to the right role:

| If stuck on... | Escalate to... |
|----------------|----------------|
| Political accuracy | Belgian Politics Expert |
| Data model confusion | Systems Architect |
| JSON loading/validation | Data Engineer |
| Algorithm complexity | Logic Engineer |
| UX flow issues | Frontend Specialist |
| Test failures | QA Engineer |
| "Is this fun?" | Playtester |
| Scope / Priority | Product Manager |
| AI context / Session sync | AI Context Maintainer |

---

## 4. The Methodology

We follow a structured **Agentic Workflow** to ensure quality and consistency.

### Phase 0: Context (The "Lighthouse")

Before starting work, sync AI context.

#### Context Checklist

```markdown
- [ ] Run `./pulse.sh` to generate fresh context
- [ ] Review `docs/ai/active_state.md` for current focus
- [ ] Check `docs/ai/architecture.md` for system overview
```

### Phase 1: Alignment (The "Board Meeting")

Before writing code, align on the objective.

#### Board Meeting Checklist

```markdown
- [ ] Reviewed `docs/planning/roadmap.md` - Current phase: ___
- [ ] Reviewed `docs/planning/development-log/` - Recent context: ___
- [ ] Defined Goal: ___________________________
- [ ] User Value: ____________________________
- [ ] Complexity Estimate: ___ (1-5)
- [ ] Roles Required: ________________________
```

### Phase 2: Planning

0. **Trim:** Run the [Trimmer](./trimmer.md) checklist.
1. **Create Plan:** Write a short plan in `docs/planning/implementation/`.
2. **Versioning:**
    - Create a new version doc: `docs/planning/versions/vX.Y.Z-[feature_name].md`.
    - Update `docs/planning/roadmap.md` if priorities changed.
3. **Architecture Check:** Systems Architect reviews if new types are needed.
4. **Data Check:** Data Engineer reviews if new JSON content or loaders are needed.
5. **UX/Narrative Check:** Product Manager & Frontend Specialist define "flow" and "tone".

### Phase 3: Execution

1. **Foundation:** Systems Architect updates `src/core/types.ts` (and related schema/types as needed).
2. **Data:** Data Engineer adds JSON content to `public/data/core/` and updates loaders.
3. **Logic:** Logic Engineer implements pure functions in `src/core/systems/` (or `src/core/domain/` for pure helpers).
4. **Verification (Logic):** QA Engineer writes unit tests.
5. **Interface:** Frontend Specialist builds components.

#### Task Tracking

Use a `task.md` artifact to track atomic progress:

```markdown
- [ ] AI Context Maintainer: pulse generated
- [ ] Politics Expert: requirements gathered
- [ ] Systems Architect: types defined
- [ ] Data Engineer: JSON content added, loaders updated
- [ ] Logic Engineer: functions implemented
- [ ] QA Engineer: tests written
- [ ] Frontend Specialist: UI completed
- [ ] Playtester: session complete
- [ ] Product Manager: sign-off
- [ ] AI Context Maintainer: context updated
```

### Phase 4: Review & Documentation

1. **Verify:** Run tests and manual checks.
2. **Update Docs:** Update `docs/ai/architecture.md` (or `docs/architecture/`) if models changed.
3. **Log Feedback:** Add a note under `docs/planning/development-log/` if items were addressed.
4. **Walkthrough:** Create a `walkthrough.md` artifact to demonstrate the work.
5. **Context Sync:** AI Context Maintainer updates `docs/ai/active_state.md`.

---

## 5. Agent Report Format

Structured output for agent communications:

```markdown
### 📋 Report from [Role Name]

**Task:** [What was asked]
**Findings:** [Key observations]
**Recommendations:** [Actionable items]
**Blockers:** [If any]
**Next Role:** [Who should take over]
```

---

## 6. The Feature Lifecycle (Step-by-Step)

**0. Context Load**

- **AI Context Maintainer** runs `pulse.sh` and reviews current state.

**1. Feature Definition**

- **Politics Expert** proposes mechanic (e.g., "Coalition Friction").
- **Product Manager** approves and defines the *Narrative*.

**2. Design & UX**

- **Frontend Specialist** outlines the *User Flow*.
- **Systems Architect** defines the architecture (Hybrid ECS-OOP: ECS for data, OOP for logic).

**3. Data Pipeline**

- **Data Engineer** creates JSON content and loader integrations.

**4. Core Implementation**

- **Logic Engineer** implements the math in `src/core/systems/`.
- **QA Engineer** writes unit tests for the math.

**5. UI Implementation**

- **Frontend Specialist** connects the logic to React components.

**6. Integration & Polish**

- **You (Integrator)** merges code.
- **Playtester** simulates a session to check pacing and fun.
- **Product Manager** reviews for "Game Feel".

**7. Context Update**

- **AI Context Maintainer** updates `docs/ai/` for next session.
