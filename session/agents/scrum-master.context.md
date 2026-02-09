# ScrumMaster Agent Context

## Role
Continuous monitoring agent in tmux session `cursorOrchestrator`, pane 0.6.

## Updated
2026-02-08T18:10Z

## Monitoring Targets

### cursorOrchestrator (7 panes)

| Pane | Agent | Status |
|------|-------|--------|
| 0.0 | Orchestrator | Idle |
| 0.1 | Product Owner | DO NOT TOUCH |
| 0.2 | Agent Trainer | Adding woda-writer/woda-scribe to overview + Never Assume propagation |
| 0.3 | Task Agent | Rate limited (resets 2am Berlin), has 8 planned tasks |
| 0.4 | Expert | Working on Task #15: raw tmux → otmux audit (25+ replacements) |
| 0.5 | Tester | Just validated help + guard fixes: ALL PASS |
| 0.6 | ScrumMaster (me) | Compacting |

### claudeWoda (5 panes)

| Pane | Agent | Status |
|------|-------|--------|
| 0.0 | woda-writer | Alive, PID 21529, uptime 6d+ |
| 0.1 | woda-scribe | Alive, PID 27367, uptime 6d+ |
| 0.2 | zsh shell | |
| 0.3 | zsh shell | |
| 0.4 | bash shell | |

## Commands — MANDATORY RULES
- **Permission approval**: `otmux send <pane> Down` then `otmux send <pane> Enter` (SEPARATE commands)
- **Close UI panels**: `otmux send <pane> Escape`
- **File-based comms**: Write to `session/tasks/`, send short reference only
- **NEVER ASSUME — ALWAYS MEASURE**: Use `claudeCode context.read`, `otmux pane.capture`, `git status`
- **TaskCreate/TaskUpdate/TaskList** mandatory for all work

## Completed This Session (2026-02-08)

### Expert Commits (dev.claude branch, all pushed)
- 6dd4f57: Task 49 watchdog supervisor
- 7453ba1: Task 56 accept-edits handler fix
- a8422a4: Task 57 compound command wrappers
- 894a618: Task 58 context.read via JSONL
- ea22cb2: Task 58 bugfix optional param debugger
- dea9b54: Improvements #4-5 auto-commit + cycle
- b2f6892: Improvement #9 context velocity tracking
- 805aecc: otmux send.verified (delivery guarantee)
- b13b6df: Improvement #6 single source of truth dashboard
- 0dc0ffc: Fix hiveMind help (xargs error)
- 9255a5d: Fix context.read guard (non-Claude panes)

### SM Work
- Routed all tasks through Expert → Tester pipeline
- Approved 10+ permission prompts
- Started watchdog supervisor (PID 61433, 60s interval)
- Verified claudeWoda agents alive (6+ days uptime)
- Broadcast "Never Assume — Always MEASURE" rule
- Broadcast TaskCreate/TaskUpdate/TaskList rule
- Sent woda-writer/woda-scribe SKILL.md task to Agent Trainer

## In Progress

| Task # | Description | Agent | Status |
|--------|-------------|-------|--------|
| #15 | Replace raw tmux send-keys with otmux wrappers | Expert (0.4) | In progress |
| #7 | RECURRING: Sweep + approve permissions | SM | Ongoing |

## Pending

- Task #15 completion → route to Tester for validation
- Task Agent has 8 planned tasks (hiveMind help done, 7 remain)
- Improvement #7 (delegate 1 bug/cycle) — raw tmux audit is this cycle's delegation
- Agent Trainer updating agent-overview.md with woda-writer/woda-scribe

## Watchdog Status
- PID 61433, 60s interval, heartbeat fresh
- Monitors ALL teams including claudeWoda

## Recovery Steps (after /compact)

1. Read this file: `session/agents/scrum-master.context.md`
2. Read `.claude/agents/scrum-master/SKILL.md`
3. Read `.claude/agents/agent-overview.md` for role enforcement
4. Check TaskList for pending work
5. Sweep all panes (0.0, 0.2, 0.3, 0.4, 0.5 — skip 0.1)
6. Check Expert (0.4) — should be finishing Task #15 (raw tmux audit)
7. When Expert commits → route to Tester (0.5) for validation
8. Verify watchdog still running: `./hiveMind watchdog.status`
