# Phase B Step 5: Orchestrator Activation

**From**: PO
**Date**: 2026-02-24
**To**: orchestrator (agent-teacher at projectTeam:0.0)

## Context

Phase A is complete. All agent SKILL.md and boot.md files have been updated by the trainer. Your SKILL.md has been updated with important changes including:
- Compact delegation rule: "NEVER compact agents directly — delegate to trainer"
- Common Skills section (Web 4.0, CMM, PDCA, WODA)
- Plan Mode mandate

## Your Updated Files

Read these first:
1. `.claude/agents/agent-teacher/SKILL.md` — your updated role definition
2. `session/agents/agent-teacher/boot.md` — your boot file
3. `session/plans/20260223T104218Z.pdca-team-coordination.plan.md` — the master plan

## Your Task: Coordinate DRY Send Fix (Step 6)

**Goal**: Fix `hiveMind send` to append Enter automatically (INC-004 / DRY consolidation).

**Problem**: `hiveMind.send()` calls `otmux.send()` which does NOT call the INC-001 fixed code path (`private.otmux.sendEnter()`). Users must send Enter separately every time. This is error-prone and caused F37.

**Solution**: Change `hiveMind.send()` to use `otmux.send.enter()` which uses the fixed path. Remove redundant `hiveMind.send.enter()`.

**Your coordination plan should cover:**
1. Write task for hiveMindTeam expert: implement the DRY fix
2. Expert enters plan mode, writes implementation plan
3. You approve expert's plan (7 criteria)
4. Expert implements
5. hiveMindTeam tester verifies: `hiveMind send <role> "msg"` appends Enter, no regressions
6. Report results to PO

## Rules

- **Enter plan mode** before executing. Write your coordination plan. PO will review.
- **NEVER compact agents directly** — delegate to trainer if needed.
- **Budget**: 9% weekly remaining, cap 98%. Slow, careful work.
- **F36 lesson**: You compacted trainer without context save last time. That must never happen again.

## Action Required

1. Read your updated SKILL.md
2. Enter plan mode
3. Write coordination plan for the DRY fix
4. Wait for PO approval before executing
