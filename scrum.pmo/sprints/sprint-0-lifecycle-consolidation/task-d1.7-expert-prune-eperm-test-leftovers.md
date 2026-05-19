[Back to Task D1](./task-d1-tronmonitor-lifecycle-review.md)

# Task D1.4: Expert - Fix prune EPERM + __test_* survivors
[task:uuid:d14-prune-eperm-fix]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (root cause identified)
  - [x] creating test cases (handed to D1.x tester)
  - [x] implementing (commit 26c4fdf)
  - [x] testing (live verified: __test_xteam_b_95660 + __test_xteam_b_82994 pruned)
- [x] QA Review
- [x] Done

## Root cause
`tronMonitor.prune` used two-step `select` + `kill` for window removal. Issues:
- Malformed-entry path had them in wrong order (kill before select) — hit current window → EPERM
- Dead-session path had correct order but still raced — `screen -X kill` without `-p` hits current window
- `__test_*` survivors: their dead-session path silently failed, leaving env entries

## Fix (commit 26c4fdf)
- Atomic `screen -S <sess> -p <num> -X kill` — combines select+kill in one op, targets specific window
- Added explicit `__test_*` pattern guard → always prune regardless of tmux state
- Simplified guard chain: test-pattern → malformed → dead → else keep

## Verification
```
Before: ~/config/tronMonitor.env had __test_xteam_b_95660 + __test_xteam_b_82994
After tronMonitor prune: SUCCESS "Pruned: 2 dropped, 3 kept"
After: only live teams remain (ooshTeam, web4team, TRONinterface)
```
