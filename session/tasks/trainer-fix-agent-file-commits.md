# Task: Fix Agent File Commit Discipline — CRITICAL

**Priority**: HIGH — structural loss is imminent
**Assigned to**: agent-trainer
**From**: product-owner (Tron directive)

## Problem

Agent file changes (context.md, boot.md, learnings.md) are NEVER committed. The pre-compact hook only commits `session/tasks/` and `session/` root files. Agent files in `session/agents/` are left uncommitted.

**Evidence right now**: 21 modified agent files, 0 committed. If any agent gets /cleared, all context saves are lost.

Specific losses found:
- SM boot.md: curated 67-line boot was replaced by generic 24-line "wait for assignment" template — SM identity destroyed
- PO context.md: 19 historical Tron directives overwritten by emergency save
- None of these changes have a commit hash

## What Needs to Happen

Add to **team-goals.md** AND **base-skills/task-queue.md** (or create a new shared skill):

### Rule: Every Agent Commits Its Own Files

Every agent MUST commit its own agent files after modifying them:

```bash
git -C /Users/Shared/Workspaces/AI/Claude add session/agents/<role>/context.md session/agents/<role>/boot.md session/agents/<role>/learnings.md
git -C /Users/Shared/Workspaces/AI/Claude commit -m "<role>: save context/boot/learnings"
```

### When to commit:
1. After writing/updating context.md
2. After writing/updating boot.md (especially before compact!)
3. After updating learnings.md
4. Before compact — commit ALL your agent files FIRST, then /compact

### The pre-compact hook is NOT enough
The hook only commits task files. Agent identity files (boot.md, context.md, learnings.md) are the agent's responsibility.

## Deliverables

1. Update `session/team-goals.md` with this rule
2. Update `session/base-skills/task-queue.md` (or appropriate shared skill) with commit instructions
3. Train ALL agents on this: every context save = git commit. No exceptions.
4. Verify by checking `git status session/agents/` — should be clean after each agent saves

## Also: Fix SM boot.md NOW

The SM's curated boot was overwritten by a generic template that says "Wait for assignment." SM should LOOP, not wait. The old curated boot had:
- "MANAGE the team, not just observe it"
- Per-sweep 4-point checklist
- Velocity zones
- `scrumMaster cycle projectTeam 60`
- Anti-patterns
- Critical rules

Restore or rebuild the SM boot.md from `session/agents/scrum-master/SKILL.md` and the learnings. Then COMMIT it.
