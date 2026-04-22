# otmux expert Agent Context
**Session**: otmux-expert@opus
**Role**: otmux-expert
**Updated**: 2026-03-11
**State**: active — bootstrapped, script read, awaiting phantom panes task

## Identity
| Field | Value |
|-------|-------|
| **Host** | `MacStudio.fritz.box` |
| **Pane** | `otmuxTeam:0.0` |
| **Session UUID** | `a552f5ac-b8bf-4032-b8db-767c5e0b26d0` |

## CURRENT GOAL
Forked from backup-expert. New role: otmux script expertise, ground-truth testing (raw tmux vs otmux), phantom panes bug fix.

## Script Knowledge
- **otmux**: `/Users/donges/oosh/otmux` — 2267+ lines, ~120 public methods
- **claudeCode**: `/Users/donges/oosh/claudeCode` — 1740 lines, key methods read
- Key otmux features: session/window/pane management, tree/tree.detailed views, send/capture, UTF-8/color
- `pane.get.target` (line 1676) uses `$TMUX_PANE` env var for self-identification
- `tree.detailed` (line 1268) does 3-level: session → pane (addr/title/cmd) → agent (role@model/sessionID)
- Ghost detection (lines 1340-1358): title looks like role but no Claude process → ⚠ DEAD
- `TMUX_CMD="tmux -u"` — all tmux ops go through this

## claudeCode Methods (used by tree/tree.detailed)
- `process.find` (line 710): finds Claude PID by TTY match in tmux pane
- `process.running` (line 729): boolean wrapper
- `session.id` (line 757): UUID from `--resume` process arg + staleness check (>300s JSONL age)
- `session.name` (line 810): name from sessions-index.json customTitle → JSONL custom-title → firstPrompt
- `session.probe` (line 734): ground truth UUID via /status TUI capture (slow ~3s)

## Tester
- At `otmuxTeam:0.1` — notified to read claudeCode methods via `session/tasks/otmux-read-claudeCode.md`

## Next Steps
1. Await phantom panes bug task details from Tron
2. Ground-truth testing: compare raw tmux output vs otmux wrapper output
3. Fix phantom panes bug in tree/tree.detailed

## Recovery After Compact
1. State identity: otmux-expert@opus
2. Read `.claude/agents/otmux-expert/SKILL.md`
3. Read this context.md
4. Read backlog.md
5. Read learnings.md
6. Read `/Users/donges/oosh/otmux` (large — read key sections: tree at 1175, tree.detailed at 1268, pane.get.target at 1676)
7. Read `/Users/donges/oosh/claudeCode` sections: process.find (710), session.id (757), session.name (810)
