[Back to Task D1](./task-d1-tronmonitor-lifecycle-review.md)

# Task D1.5: Expert - Pane default respects env var and validates existence
[task:uuid:d15-pane-default-fix]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (root cause identified: config shadowed env; setup polluted config)
  - [x] creating test cases
  - [x] implementing (commits a030f68 + cd23b6e)
  - [x] testing (verified: stale UpDown_ai_po:0.1 env falls through to TRONinterface:0.3)
- [x] QA Review
- [x] Done

## Root cause
Two bugs compounding:
1. `private.tronMonitor.pane` read config FIRST, shadowing `$TRON_MONITOR_PANE` env var
2. `tronMonitor.setup <pane>` unconditionally persisted `$1` to config — one `setup UpDown_ai_po:0.1`
   call stuck permanently in user.env, polluting all subsequent no-arg calls
3. Initial D1.5 fix used `tmux display-message` for validation — unreliable (rc=0 even for
   non-existent panes). Fixed in D1.6 with `has-session` + `list-panes -t <pane>`.

## Fix
Commit a030f68:
- 3-tier resolution: env var → config → hardcoded `TRONinterface:0.3`
- setup only persists config when user explicitly passes a pane argument

Commit cd23b6e (validator correctness):
- Replaced unreliable `tmux display-message` with `tmux has-session` + `tmux list-panes -t <pane>`
- Both fail rc=1 on missing session or pane

## Verification
With `TRON_MONITOR_PANE=UpDown_ai_po:0.1` stale in env (from prior buggy setup):
- `UpDown_ai_po` session doesn't exist → validation fails → falls through
- Config returns same stale value → validation fails → falls through
- Final fallback: `TRONinterface:0.3` (returned even if TRONinterface:0.3 pane doesn't exist,
  by design — no further fallback so user knows to create the pane or set env explicitly)
