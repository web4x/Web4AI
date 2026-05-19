[Back to Task D1](./task-d1-tronmonitor-lifecycle-review.md)

# Task D1.6: Expert - Screen session resilience
[task:uuid:d16-screen-resilience]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (root causes identified: remove() race + no-recovery on dead screen)
  - [x] creating test cases
  - [x] implementing (commit cd23b6e)
  - [x] testing
- [x] QA Review
- [x] Done

## Root causes — "screen session terminated unexpectedly"

1. **`tronMonitor.remove` race:** same pattern as D1.4's prune — select-then-kill with no
   `-p` targeting. If select failed or raced, kill landed on current window. Killing window 0
   (the screen login shell) terminates the entire screen session.

2. **No recovery when screen died:** add/switch/prune called `screen -X ...` which silently
   no-op's when the named session doesn't exist. Commands appeared to succeed but did nothing.

3. **pane.isValid was unreliable:** used `tmux display-message -t <pane>` which returns rc=0
   even for non-existent panes (tmux oddity). Broke D1.5 validation.

## Fixes (commit cd23b6e)

1. `tronMonitor.remove` — adopted atomic `screen -S <sess> -p <num> -X kill` pattern from D1.4.
   Target-specific kill, no race, no accidental window-0 hits.

2. New helpers:
   - `private.tronMonitor.screen.isAlive` — probes via `screen -ls | grep`
   - `private.tronMonitor.screen.ensure` — restarts screen + re-adds tracked teams if dead
   - `add` + `switch` call `screen.ensure` first → self-healing
   - `prune` works even with screen dead (cleans env, skips window kills)

3. `pane.isValid` rewritten:
   - `tmux has-session -t <session>` (rc=1 on missing session)
   - `tmux list-panes -t <pane>` (rc=1 on missing pane within session)
   Both primitives are reliable — no more false-positive validations.

## Verification
- Prune on live env: `__test_*` entries removed cleanly, no EPERM
- Remove now targets specific window via `-p <num>` — no window-0 kills
- Stale `UpDown_ai_po:0.1` env var correctly falls through to `TRONinterface:0.3`
- Screen auto-recovery wired into add/switch lifecycle

## Commits
- `26c4fdf` — D1.4 prune atomic kill + __test_ guard
- `a030f68` — D1.5 pane resolution respects env + validates existence
- `cd23b6e` — D1.6 remove kill fix + screen resilience + validator correctness
