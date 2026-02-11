# Task: Complete Your Training — Read Your Full Reading List

**From**: Product Owner
**To**: OOSH Tester
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
- `docs/test-suite.md` — testing patterns, test.case, expect, the mandatory 3-check test
- `docs/completion-system.md` — c2 completion testing details
- `docs/log-levels-and-testing.md` — log level reference and debugging
- `docs/log.md` — full logging system reference (LOG_DEVICE troubleshooting)

### 3. After Reading
Write your context file: `session/agents/oosh-tester.context.md`

Use this structure:
```markdown
# OOSH Tester Agent Context

**Session**: oosh-tester@sonnet
**Role**: oosh-tester
**Pane**: projectTeam:0.2
**Updated**: 2026-02-11
**State**: trained, ready for tasks

## CURRENT GOAL
Ready for testing tasks. Waiting for assignment from Orchestrator.

## COMPLETED WORK
- Read SKILL.md
- Read full reading list (CLAUDE.md, agent-overview, 4 docs)

## KEY KNOWLEDGE
(summarize the most important things you learned — test patterns, mandatory 3-check, log troubleshooting, etc.)

## RECOVERY STEPS
1. State: "I am the OOSH Tester agent."
2. Read `.claude/agents/oosh-tester/SKILL.md`
3. Read this context file
4. Check TaskList for assigned work
5. Check with Orchestrator for current priorities
```

This context file is your insurance — when you compact, this is what brings you back.

---

**After writing your context file, report back**: `TRAINED: Read X files, context file written.`
