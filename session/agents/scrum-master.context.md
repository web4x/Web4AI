# ScrumMaster Agent Context

## Role
Continuous monitoring agent in tmux session `cursorOrchestrator`, pane 0.6.

## Updated
2026-02-06T19:30Z

## Monitoring Targets — TWO SESSIONS

### cursorOrchestrator (7 panes)

| Pane | Agent | Status |
|------|-------|--------|
| 0.0 | Orchestrator | Idle. Routed Task 50 SCP→rsync to Expert. |
| 0.1 | Product Owner | Idle. |
| 0.2 | Agent Trainer | Idle. Standing by. |
| 0.3 | Task Agent | Adding Task 50 to board. |
| 0.4 | Expert | DONE. Task 50 committed (81f888f). 2% context. |
| 0.5 | Tester | Validating Task 50 SCP→rsync. |
| 0.6 | ScrumMaster (me) | Active monitoring. Waiting for Tester results. |

### claudeWoda (5 panes)

| Pane | Agent | Status |
|------|-------|--------|
| 0.0 | woda-writer | Idle. UI panels keep opening. |
| 0.1 | woda-scribe | Persistent "2 files +0 -0" issue. Accept edits doesn't respond to Tab/Enter/Escape. |
| 0.2 | zsh.commands | Shell. |
| 0.3 | zsh.split | Shell. |
| 0.4 | oosh.shell | Shell. |

## Commands — MANDATORY RULES
- **NO ./ prefix**: `hiveMind sweep`, NOT `./hiveMind sweep`
- **Dual-session sweep**: `hiveMind sweep cursorOrchestrator && hiveMind sweep claudeWoda && hiveMind unblock all claudeWoda`
- **Permission approval**: `otmux send <pane> Down` then `otmux send <pane> Enter` (SEPARATE commands)
- **Close UI panels**: `otmux send <pane> Escape`
- **File-based comms**: Write to `session/tasks/`, send short reference only
- **Do NOT submit idle loops**: "stand by", "check for new instructions" — clear with C-u

## Completed Work This Session
- **Task 49** (Opus 4.6 model switching): COMPLETE, ALL PASS, pushed
- **Task 50** (ossh SCP → rsync): Expert COMMITTED (81f888f). 126 insertions, 19 deletions.
  - All 7 SCP calls in ossh replaced with rsync + auto-mkdir
  - All 3 SCP calls in user replaced with rsync
  - Added ossh.connection.open/close (SSH ControlMaster)
  - Added private.ossh.rsync, private.ossh.rsync.pull, private.ossh.ssh helpers
  - Tester validating now
- Closed 30+ UI panels across both sessions
- Approved 5+ permission prompts

## Active Work
- **Task 50**: COMPLETE + VALIDATED. All 5 checks PASS. Ready for push.
- Expert at 2% context — will need fresh session for next task

## Pending Issues
- **Scribe broken**: claudeWoda:0.1 cycling through Interrupted states
- **Expert low context**: 2% — will need fresh session for next task

## Key Learnings (Accumulated)
- Permission UI: Arrow keys + Enter (Down Enter = option 2)
- Never send stray text to panes — only keys when dialog visible
- C-u to clear stale prompts (doesn't always work — try Escape + C-c)
- Orchestrator must delegate, never code directly
- I must NEVER run tests or implement code
- Use /tmp/hivemind.roles registry for name→pane mapping
- `hiveMind sweep` handles pane discovery automatically
- Background tasks panels need Escape to close
- Git diff panels need Escape to close
- **TEST IN OOSH SHELL via otmux** — never test oosh from own bash. Use the oosh.shell pane.
- **Tester must do real functional tests** — grep + bash -n is not testing. Run test.suite AND test in oosh shell.
- macOS uses openrsync (not GNU rsync) — --mkpath not supported, flags differ

## Recovery Steps (after /compact)

**The pre-compact hook auto-sends a resume prompt 15s after compact.**

When you receive the auto-resume prompt:
1. Read this file: `session/agents/scrum-master.context.md`
2. Read `.claude/agents/scrum-master/SKILL.md`
3. Use `hiveMind sweep cursorOrchestrator && hiveMind sweep claudeWoda` to check all panes
4. Approve any permission prompts with `otmux send <pane> Down` then `otmux send <pane> Enter`
5. Resume monitoring — do NOT wait for further instructions
6. Check if Task 48 and Task 50 completed — Orchestrator should notify at 0.6
