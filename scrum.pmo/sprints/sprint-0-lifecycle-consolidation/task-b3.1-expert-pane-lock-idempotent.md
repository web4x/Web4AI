[Back to Task B3](./task-b3-otmux-pane-lock-idempotent.md)

# Task B3.1: Expert — otmux pane.lock is idempotent (auto-unlocks before relocking)
[task:uuid:b31-pane-lock-idempotent]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing (commit 75ab018)
  - [x] testing (3-step relock sequence verified)
- [x] QA Review
- [x] Done

## Requirement
`otmux pane.lock <target> <title>` should be callable repeatedly with
different titles without needing a manual `otmux pane.unlock` between calls.
One command, idempotent.

## Fix (commit 75ab018)
Added a silent `otmux.pane.unlock "$target"` as the first step of
`pane.lock`. Clears any prior hook (tmux 3.2+), kills any background
enforcer (tmux <3.2), and resets allow-rename state before applying the
new lock.

## Verification
```
$ otmux pane.lock ooshTeam:0.1 "test-title-1"
$ otmux pane.lock ooshTeam:0.1 "test-title-2"
$ tmux display-message -p -t ooshTeam:0.1 '#{pane_title}'
test-title-2
$ otmux pane.lock ooshTeam:0.1 "oosh-expert"   # restore
$ tmux display-message -p -t ooshTeam:0.1 '#{pane_title}'
oosh-expert
```

All three lock calls succeed without errors. Titles cleanly replaced.
