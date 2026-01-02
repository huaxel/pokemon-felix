# The Agentic Development Team & Workflow

This document outlines the roles, responsibilities, and operational workflow of the AI development team for **Pokemon Felix**.

---

## Quick Reference

> **TL;DR:** The 4-phase loop for every feature.

1. **Align** → Check `roadmap.md` + recent conversation history
2. **Plan** → Create a short plan (implementation_plan.md artifact if complex)
3. **Build** → Design → Data → Logic → UI → Tests
4. **Review** → Run tests → Update docs → Walkthrough

---

## 1. The Team

| Role | Alias | Focus | File |
|------|-------|-------|------|
| **Pokemon Expert** | Oracle | Pokemon mechanics, content, balance | [→](./pokemon_expert.md) |
| **Educational Specialist** | Teacher | Age-appropriate learning design | [→](./educational_specialist.md) |
| **Game Designer** | Vision | Fun, engagement, roadmap | [→](./game_designer.md) |
| **Systems Architect** | Blueprint | React architecture, state management | [→](./systems_architect.md) |
| **Frontend Specialist** | Face | Child-friendly UI, components | [→](./frontend_specialist.md) |
| **Playtester** | Gamer | Fun factor, balance (age 7) | [→](./playtester.md) |
| **QA Engineer** | Guardian | Tests, bug hunting | [→](./qa_engineer.md) |
| **Trimmer** | Minimalist | Scope trimming (YAGNI/KISS) | [→](./trimmer.md) |
| **AI Context Maintainer** | Lighthouse | AI context sync, session continuity | [→](./ai_context_maintainer.md) |

---

## 2. Handoff Triggers

Explicit conditions for transitioning between roles:

| From | To | Trigger |
|------|----|------------|
| AI Context Maintainer | Game Designer | New session started, context loaded |
| Game Designer | Pokemon Expert | Feature approved, needs Pokemon content |
| Game Designer | Educational Specialist | Feature approved, needs learning design |
| Pokemon Expert | Systems Architect | Pokemon mechanics defined |
| Educational Specialist | Systems Architect | Learning objectives defined |
| Systems Architect | Frontend Specialist | Architecture designed |
| Frontend Specialist | QA Engineer | UI implementation complete |
| QA Engineer | Playtester | Tests passing |
| Playtester | Game Designer | Playtest feedback written |
| Game Designer | AI Context Maintainer | Sign-off complete, update context |

---

## 3. Escalation Matrix

When stuck, escalate to the right role:

| If stuck on... | Escalate to... |
|----------------|----------------|
| Pokemon accuracy/balance | Pokemon Expert |
| Educational appropriateness | Educational Specialist |
| Is this fun for a 7-year-old? | Playtester |
| React architecture | Systems Architect |
| UI/UX issues | Frontend Specialist |
| Test failures | QA Engineer |
| Scope / Priority | Game Designer |
| Feature creep | Trimmer |
| AI context / Session sync | AI Context Maintainer |

---

## 4. The Methodology

We follow a structured **Agentic Workflow** to ensure quality and consistency.

### Phase 0: Context (The "Lighthouse")

Before starting work, sync AI context.

#### Context Checklist

```markdown
- [ ] Review `roadmap.md` for current phase and priorities
- [ ] Check recent conversation history for context
- [ ] Understand current version and completed features
```

### Phase 1: Alignment (The "Board Meeting")

Before writing code, align on the objective.

#### Board Meeting Checklist

```markdown
- [ ] Reviewed `roadmap.md` - Current phase: ___
- [ ] Defined Goal: ___________________________
- [ ] User Value (for Felix): _________________
- [ ] Educational Value: _____________________
- [ ] Fun Factor Estimate: ___ (1-10)
- [ ] Complexity Estimate: ___ (1-5)
- [ ] Roles Required: ________________________
```

### Phase 2: Planning

1. **Trim:** Run the [Trimmer](./trimmer.md) checklist - do we really need this?
2. **Create Plan:** For complex features, write an implementation_plan.md artifact
3. **Game Design Check:** Game Designer reviews for fun and educational value
4. **Pokemon Check:** Pokemon Expert reviews if Pokemon mechanics are involved
5. **Educational Check:** Educational Specialist reviews if learning content is involved
6. **Architecture Check:** Systems Architect reviews if new state/architecture is needed
7. **UX Check:** Frontend Specialist defines UI flow and child-friendly design

### Phase 3: Execution

1. **Foundation:** Systems Architect designs architecture and data structures
2. **Content:** Pokemon Expert or Educational Specialist provides content/mechanics
3. **Logic:** Implement core logic (hooks, utilities, game systems)
4. **Interface:** Frontend Specialist builds child-friendly UI components
5. **Verification:** QA Engineer tests functionality and edge cases

#### Task Tracking

Use a `task.md` artifact to track atomic progress:

```markdown
- [ ] AI Context Maintainer: context reviewed
- [ ] Game Designer: feature approved
- [ ] Trimmer: scope validated
- [ ] Pokemon Expert: mechanics defined (if applicable)
- [ ] Educational Specialist: learning objectives defined (if applicable)
- [ ] Systems Architect: architecture designed
- [ ] Frontend Specialist: UI implemented
- [ ] QA Engineer: tests passing
- [ ] Playtester: fun factor validated
- [ ] Game Designer: final sign-off
- [ ] AI Context Maintainer: context updated
```

### Phase 4: Review & Documentation

1. **Verify:** Run tests and manual checks
2. **Playtest:** Playtester evaluates fun factor and age-appropriateness
3. **Update Roadmap:** Update `roadmap.md` if milestones completed
4. **Walkthrough:** Create a `walkthrough.md` artifact to demonstrate the work
5. **Context Sync:** AI Context Maintainer updates context for next session

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

- **AI Context Maintainer** reviews roadmap and recent work

**1. Feature Definition**

- **Game Designer** evaluates feature for fun and educational value
- **Trimmer** challenges complexity and scope

**2. Content Design**

- **Pokemon Expert** defines Pokemon mechanics (if applicable)
- **Educational Specialist** designs learning objectives (if applicable)

**3. Technical Design**

- **Systems Architect** designs React architecture and state management
- **Frontend Specialist** outlines child-friendly UI flow

**4. Implementation**

- **Systems Architect** implements core logic and data structures
- **Frontend Specialist** builds UI components with fun animations

**5. Quality Assurance**

- **QA Engineer** tests functionality and edge cases
- **Playtester** evaluates fun factor for a 7-year-old

**6. Sign-Off**

- **Game Designer** reviews for alignment with vision
- **AI Context Maintainer** updates context for next session

---

## 7. Pokemon Felix Specific Guidelines

### Educational Focus

Every feature should teach something valuable:
- **Math:** Calculations, counting, patterns
- **Reading:** Quest text, Pokemon descriptions
- **Logic:** Puzzles, strategy, problem-solving
- **Coding:** Basic programming concepts (Porygon Lab, Game Console)

### Age-Appropriate Design (Age 7)

- **No Frustration:** Failures are learning opportunities
- **Clear Feedback:** Visual and immediate
- **Progressive Difficulty:** Start simple, unlock complexity
- **Positive Reinforcement:** Encourage, don't punish

### Fun First

- If it's not fun, Felix won't play it
- Education must be seamlessly integrated
- Rewards should feel satisfying
- Progression should feel meaningful

---

**Current Project Status:** Pokemon Felix v0.6.0 - Advanced World Features  
**Target Player:** Felix (age 7)  
**Core Vision:** Educational Pokemon adventure that makes learning fun
