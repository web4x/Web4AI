[Back to Task D1](./task-d1-tronmonitor-lifecycle-review.md)

# Task D1.5: Expert — Set window-size=largest on team sessions
[task:uuid:d15-window-size-largest]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (understand why window-size matters for tronMonitor)
  - [x] creating test cases
  - [x] implementing (commit e9723ff)
  - [x] testing (retroactively applied to ooshTeam + web4team, verified via show-options)
- [x] QA Review
- [x] Done

## Requirement (from Tron)
Add `tmux set -g window-size largest` to team sessions. Without this, tmux
default "smallest" resizes all clients to the smallest attached viewer — so
tronMonitor's small monitor pane would shrink agent panes. With "largest",
tmux tracks the biggest attached client and read-only viewers crop/scroll
their own view.

## Fix (commit e9723ff)
`tronMonitor.add <teamSession>` now calls:
```bash
tmux set-option -t "$teamSession" window-size largest
```
BEFORE the attach. Applied per-team, idempotent (tmux silently no-ops if
already set).

## Retroactive application
For existing team sessions created before this fix landed:
```bash
tmux set-option -t ooshTeam  window-size largest
tmux set-option -t web4team  window-size largest
```

Verified:
```
ooshTeam window-size: window-size largest
web4team window-size: window-size largest
```

## Alternative considered
Place the setting in `hiveMind team.register` or `team.setup.full` — would
apply earlier in lifecycle. Rejected for this task because: (a) setting at
`tronMonitor.add` keeps concern inside tronMonitor's scope; (b) idempotent
— doesn't matter if it's set 5 times; (c) matches "tronMonitor is the
reason this setting matters" principle. Future task can move it upstream.

## Note — global `-g` vs session-level `-t`
PO requirement used `tmux set -g`. Per-session `-t` is used here because:
- `-g` requires a running server; sets server-wide default for new sessions
- `-t <session>` is more targeted + safer for existing sessions
- For brand-new teams created after this commit, `-t` at add time works
- If ever needed globally, a startup hook could set `-g` too
