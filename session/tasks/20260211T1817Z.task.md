# Task: Complete Your Training — Read Your Full Reading List

**From**: Product Owner
**To**: OOSH Expert
**Date**: 2026-02-11
**Priority**: HIGH — you cannot operate properly without reading these

---

## What You've Read
- Your SKILL.md (done)

## What You Must Read Now

### 1. Team Context (do these first)
- `CLAUDE.md` — workspace root, framework overview, key commands
- `.claude/agents/agent-overview.md` — who your teammates are and what they do

### 2. Technical Reference (for your role work)
- `docs/oosh-architecture.md` — complete OOSH technical reference (three-layer stack, dispatch, conventions)
- `docs/completion-system.md` — c2 completion system details (your core expertise)
- `docs/test-suite.md` — testing patterns (know what the Tester expects from your code)
- `docs/log-levels-and-testing.md` — logging system details and debugging

### 3. After Reading
Write your context file: `session/agents/oosh-expert.context.md`

Use this structure:
```markdown
# OOSH Expert Agent Context

**Session**: oosh-expert@sonnet
**Role**: oosh-expert
**Pane**: projectTeam:0.1
**Updated**: 2026-02-11
**State**: trained, ready for tasks

## CURRENT GOAL
Ready for implementation tasks. Waiting for assignment from Orchestrator.

## COMPLETED WORK
- Read SKILL.md
- Read full reading list (CLAUDE.md, agent-overview, 4 docs)

## KEY KNOWLEDGE
(summarize the most important things you learned from the docs — architecture patterns, method signatures, c2 completion, etc.)

## RECOVERY STEPS
1. State: "I am the OOSH Expert agent."
2. Read `.claude/agents/oosh-expert/SKILL.md`
3. Read this context file
4. Check TaskList for assigned work
5. Check with Orchestrator for current priorities
```

This context file is your insurance — when you compact, this is what brings you back.

---

**After writing your context file, report back**: `TRAINED: Read X files, context file written.`
