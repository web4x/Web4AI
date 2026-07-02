> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.5: RADICAL otmux send test coverage — full architect-designed matrix, ZERO regression
[task:uuid:d5568391-4d14-4431-83b1-225a06d2d125]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Description
**From Tron (2026-07-02): "radical test cases with ZERO regression for otmux send, with FULL ARCHITECT COVERAGE."** otmux send is THE critical infrastructure → its tests must be EXHAUSTIVE + regression-proof, and the **architect designs the COMPLETE coverage matrix** (every scenario) — nothing untested. This permanently closes the gate-miss that let the session-path regression through OTR-1.
**Role**: **architect (design the FULL exhaustive coverage matrix)** → tester (implement the radical suite) → PO gate. Full architect coverage = every cell enumerated by the architect, not piecemeal.

## Coverage matrix (architect makes EXHAUSTIVE — this is a seed, not the ceiling)
- **Target KIND**: claude-agent (dispatch) · shell · bare session-name (→active pane) · remote (ossh) · dead/non-existent pane · **bash-parent claude (g.4 — must classify claude, get claude path)**.
- **rc paths**: rc0 submitted · rc2 staged→poke-rescue→rc0 · rc3 blocked/modal (Enter withheld) · rc1 error.
- **Behaviors**: prefix applied (agent) vs not (shell/command) · verify region-check (claude) vs light-confirm (non-claude) · poke×N (claude) vs NO-poke/NO-Escape (non-claude) · idempotent submit/poke (N pokes ≠ duplicate).
- **Queue**: `agent.queue.drain` gates dequeue on rc0 (no silent drop); unsubmittable stays queued.
- **HAZARD guards (regression-critical)**: NEVER SIGTERM/Escape a live foreground (otmux:3119) · NEVER pkill-pattern (BUG6) · g.4 kind.
- **Payload**: long/wrapping message (BUG10 wrap-stall) submits · short pointer.
- **LOCAL + REMOTE**.

## Definition of Done
- Architect delivers the EXHAUSTIVE coverage matrix (every send scenario/hazard enumerated) — full coverage, signed off by PO
- Tester implements the radical suite; GREEN across ALL cells
- **ZERO regression**: existing T-DISPATCH-SUBMIT (5/5) + T-SEND-SESSION (3/3) all still green (this suite is their superset)
- The suite is the PERMANENT otmux-send regression guard (any future send change runs it)

## Report-back
- Architect (full coverage matrix):
- Tester (radical suite + zero-regression):
- PO gate:
