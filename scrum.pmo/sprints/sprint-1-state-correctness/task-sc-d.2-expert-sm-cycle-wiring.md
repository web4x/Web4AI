[Back to Task SC-D](./task-sc-d-reconcile-cycle.md)

# Task SC-D.2: Expert — scrumMaster.cycle wiring
[task:uuid:de26c87a-8ce0-4851-a9a6-56f404c5d6c6]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (handed off to SC-D.3 tester for roundtrip)
  - [x] implementing — commit `cef6e8f`
  - [x] testing (live: cycle ran on ooshTeam, reconcile fired and reported "clean (0 violations)")
- [x] QA Review
- [ ] Done (pending SC-D.3 tester roundtrip)

## Deliverable

**Commit:** `cef6e8f` (pushed)

### Changes in `scrumMaster`

1. New private helper `private.scrumMaster.sweep.isStable <?session>`.
2. `scrumMaster.cycle` now calls `hiveMind consistency.reconcile <session> apply`
   as final step, gated by `isStable`. On gate-skip, logs `info.log`.

### Stability gate (single awk pass per cycle)

**Critical insight:** persistent `bash claudeCode fork|join ...` processes are
agent **wrappers**, not in-flight mutations — every running agent looks like a
"fork in progress" forever. Recency filter (`etime < 60s` via awk parse of BSD
ps elapsed-time format) restricts to genuinely-in-flight ops.

Combined gate (one ps + one awk):
- `claudeCode teams.(save|restore) | session.probe` (short-lived state ops)
- `hiveMind agent.(bootstrap|respawn|restart|spawn|rename)` (lifecycle)
- `tronMonitor (setup|reset|add|sync|remove|prune)` (View-layer mutations)
- `hiveMind consistency.(fix|reconcile|audit)` (anti-recursion across concurrent cycles)

### Etime parser (cross-platform BSD/GNU ps)

`ps -eo etimes` is GNU-only; BSD ps on macOS rejects it. Implemented inline
awk `et2s()` that parses the human-readable etime format `[DD-][HH:]MM:SS`
into seconds. Filter `sec >= 60 → next` drops parent shells.

### OOSH compliance
- No `--flag` args (T-ARCH-5)
- No raw tmux in mutation path (T-BOUNDARY-4)
- Single ps invocation per cycle (perf — pipe stays inside awk)
- Conservative bias: when in doubt, skip the cycle

### Live verification
```
scrumMaster cycle ooshTeam
... (capture/sweep/unblock/dashboard output) ...
reconcile: clean (0 violations)
exit 0
```

Gate path not exercised live (state was clean, no concurrent mutations).
SC-D.3 tester needs to:
- Inject a controlled violation, verify cycle's reconcile applies it
- Race a `tronMonitor sync` against `scrumMaster cycle`, verify gate defers reconcile

## Description
**Role: oosh-expert**

Wire `scrumMaster cycle` to call `hiveMind consistency.reconcile --apply`
when sweep is stable (no active mutations in flight).

## Stability gate
Skip reconcile if any of:
- Sweep just detected permission-prompt activity (mutation likely incoming)
- Any agent rc != 'idle' in the last cycle
- Active fork/restore in progress (detected via process args)

*Sprint 1 · Epic SC-D*
