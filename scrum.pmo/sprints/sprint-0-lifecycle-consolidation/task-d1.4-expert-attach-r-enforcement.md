[Back to Task D1](./task-d1-tronmonitor-lifecycle-review.md)

# Task D1.4: Expert — Enforce `tmux attach -r` (read-only) everywhere in tronMonitor
[task:uuid:d14-attach-r-enforcement]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (CRITICAL from Tron — bare attach destroys agent layouts)
  - [x] creating test cases
  - [x] implementing (commit e9723ff)
  - [x] testing (grep audit: only 1 attach in tronMonitor, now hardened)
- [x] QA Review
- [x] Done

## Requirement (from Tron)
NEVER use bare `tmux attach -t <session>`. Always use `tmux attach -r -t <session>`.
Bare attach clamps all panes of the session to the viewer's terminal size,
destroying agent layouts.

## Audit result
Grep across all oosh scripts for `tmux attach`:
- `tronMonitor:188` — only real attach; already had `-r`, now reordered to
  `-r -t` (flag first for clarity) + comment block explaining WHY.
- `claudeFlow:856`, `hiveMind:*` — all `echo` instructions to users (help text)
  or `otmux.attach` wrapper calls (interactive user attach — not monitor).
  Not in tronMonitor-monitor path, no changes needed.
- `restore/hiveMind:*` — legacy restore/backup script, not in active use.

## Fix (commit e9723ff)
```
-screen -S ... -X stuff "TMUX= tmux attach -t $teamSession -r$(printf '\r')"
+screen -S ... -X stuff "TMUX= tmux attach -r -t $teamSession$(printf '\r')"
```
+ comment block above line asserting `-r` is MANDATORY.

## Note — renumbering
Earlier task files at this repo used D1.4 for the prune fix (now renumbered D1.7).
Mapping:
- OLD D1.4 (prune EPERM) → NEW D1.7 (see `task-d1.7-*.md`)
- NEW D1.4 = this (attach -r)
