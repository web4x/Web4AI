[Back to Sprint 2 Planning](./planning.md)

# Task S2-G: otmux send reliability + c2 completion + dev↔macos.latest parity
[task:uuid:3751a2a7-7915-4b18-b321-a453cf0279f7]

## Status
- [x] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- down
  - [task-s2-g.1](./task-s2-g.1-otmux-send-session-regression.md) — otmux send session/manual regression (OTR-1?)
  - [task-s2-g.2](./task-s2-g.2-c2-completion-parity.md) — c2 completion parity dev↔macos.latest
  - [task-s2-g.3](./task-s2-g.3-branch-newer-reliable.md) — dev vs macos.latest: newer/more-reliable + reconcile

## Description
**From Tron (2026-07-02):** otmux send is failing for the agent-trainer (rewinding ARON) AND for Tron's own shell — *"does not complete the session, seems totally broken."* Review what's going on; check if dev's otmux is **as reliable as macos.latest**; check if **c2 completion works the same in both branches**; determine if **macos.latest is newer or more reliable**.
**Role**: architect (diagnose/design) → expert (fix) → tester (verify the SESSION/MANUAL send path + c2 + branch parity).

## Key measured context (oosh-po, read-only)
- **OTR-1 `send.smart` rewrite is DEV-ONLY** (`7ac96d4` + `96ccff2`); macos.latest has the OLD send. If dev's send "doesn't complete the session" while macos.latest works → **OTR-1 regressed the non-agent-dispatch send path**. My OTR-1 gate verified rc-dispatch paths (rc0/rc2/rc3/queue) but NOT session-completion / manual send / the trainer's ARON-rewind session send — likely gate-miss.
- `macos.latest` + `test/macos.latest` are LOCAL branches; `c2` exists on dev.

## Definition of Done
- otmux send completes reliably for ALL paths (agent-dispatch AND session/manual/trainer-rewind) on dev, ≥ macos.latest reliability
- c2 completion parity confirmed dev↔macos.latest (or divergence fixed)
- clear verdict: is macos.latest newer / more reliable, and the reconcile plan
- tests cover the session/manual send path (the gap OTR-1's tests missed)

*Sprint 2 — Controller Reliability · task-s2-g*
