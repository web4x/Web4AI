# Agent Trainer Context

## Updated
2026-02-17T16:45Z

## Role
Agent Trainer at pane projectTeam:0.5. Maintains all SKILL.md files and agent role definitions.

## Current State
- **Session**: projectTeam
- **My pane**: projectTeam:0.5
- **Status**: IDLE — all tasks complete, awaiting next directive

## Completed This Session
1. **Task #34** — Fixed 7 outdated items in scrum-master SKILL.md (commit c635acd)
2. **Task #35** — Added "Address by Role Name (MANDATORY)" to all 81 SKILL.md (commit aae6410)
3. **Task #36** — Added "Compact Protocol (CRITICAL)" to all 81 SKILL.md (commit 9633060)
4. **Task #37** — Enhanced ossh-expert and ossh-tester SKILL.md with OOSH fundamentals (commit 26ed0ac)
5. **Task #38** — Retrained PO after unclean kill — wrote boot file, sent to pane 0.4
6. **Task #39** — Added hiveMind/scrumMaster command reference to SM SKILL.md + rewrote SM boot (commit af89deb)
7. **Task #40** — Added WODA learnings to 9 boot files + reading lists in all 81 SKILL.md (commit d34320c)
8. **Task #41** — Added consolidated OOSH tools reference to orchestrator SKILL.md (commit a23b2a8)
9. **SM restart** — Killed frozen SM process, restarted Claude session, sent retrain

## Pending
- Nothing — backlog empty, all tasks complete

## Key Learnings
1. Python script for bulk SKILL.md edits — efficient, avoids 81 Read+Edit cycles
2. Universal anchors: `## Never Assume (MANDATORY)`, `## Completion Reporting (MANDATORY)`, `## Compact Protocol`
3. Role boundary: don't take parts of other agents' assigned tasks
4. Frozen Claude Code panes: `kill -9` needed, then `unset CLAUDECODE && claude --resume <name>`
5. Orchestrator SKILL.md lives at `.claude/agents/agent-teacher/SKILL.md` (historical directory name)

## Recovery Steps
1. State: "I am the Agent Trainer agent."
2. Read this file (`context.md`)
3. Read `backlog.md` for pending items
4. Glob `session/tasks/` for new task files addressed to agent-trainer
5. Check with Orchestrator for next directive
