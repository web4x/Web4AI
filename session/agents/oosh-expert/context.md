# OOSH Expert Agent Context

**Session**: oosh-expert@opus
**Role**: oosh-expert
**Pane**: projectTeam:0.1
**Updated**: 2026-02-12T11:20Z
**State**: active, between tasks

## CURRENT GOAL
Recurring task: convert action checklists to OOSH methods (1/hour when idle).
Registry migration task (#7) queued but interrupted by PO — pending.

## COMPLETED WORK THIS SESSION
1. Read full training reading list (7 docs), wrote context file
2. Implemented `otmux pane.title` integration + `hiveMind pane.titles` method
3. Added pane-border-status to `team.setup.full` and `team.setup.oosh`
4. Implemented `hiveMind team.sweep` — structured one-line-per-pane status
5. Implemented `hiveMind team.loop` — continuous team.sweep at interval
6. **FIXED `claudeCode context.read` same-value bug** — per-pane JSONL resolution
7. **FIXED `claudeCode context.velocity`** — per-pane token burn rates
8. **FIXED `hiveMind dashboard` workspace path** — uses `git rev-parse --show-toplevel`
9. **Moved dashboard to `scrumMaster.dashboard()`** — PO directive, deprecated hiveMind version
10. **Implemented `claudeCode context.check`** — full health check method (CMM3 automation)

## KEY FILES MODIFIED
- `/Users/donges/oosh/hiveMind` — pane.titles, team.sweep, team.loop, dashboard (now deprecated redirect)
- `/Users/donges/oosh/claudeCode` — context.jsonl, context.read, context.velocity, context.check
- `/Users/donges/oosh/scrumMaster` — dashboard(), integrated into cycle()

## KEY KNOWLEDGE
- Context path: `session/agents/oosh-expert/context.md` (subdirectory, NOT flat file)
- `claudeCode.context.jsonl("$pane")` resolves pane → session UUID → per-pane JSONL
- OOSH_DIR = `/Users/donges/oosh`, workspace = `/Users/Shared/Workspaces/AI/Claude`
- Registry at `/tmp/hivemind.roles` format: `target|role`
- OOSH is on PATH — no export needed

## PENDING TASKS
- Task #7: Migrate hiveMind registry from /tmp/ to config pattern (pending)
- Recurring: Convert action checklists to OOSH methods (session/tasks/20260212T1225Z.task.md)

## RECOVERY STEPS
1. State: "I am the OOSH Expert agent."
2. Read `session/boot/oosh-expert.md`
3. Read this context file
4. TaskList to check assigned work
