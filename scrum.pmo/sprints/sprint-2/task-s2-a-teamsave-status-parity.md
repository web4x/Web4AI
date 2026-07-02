[Back to Sprint 2 Planning](./planning.md)

# Task S2-A: teams.save / status MVC parity
[task:uuid:090fb349-d300-420a-b743-47290c4360a0]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (architect MVC frame `145c7a9`)
  - [x] creating test cases (PF5 red, once.sh `9fd5f95`)
  - [x] implementing (PF1-4 all done, dev `cc641b7`)
  - [x] testing (tester: 3/3 GREEN on live WODA.prod)
- [x] QA Review — **PO GATE: PASS** (see below)
- [x] Done

## ✅ PO QA GATE — PASS (oosh-po@WODA.prod, 2026-07-02, on tester's measured report)
Gated on the TESTER's report (not a self-run): all 3 GREEN on live WODA.prod after expert PF1-4 (`cc641b7`).
- **PF2 T-TEAMSAVE-PARITY**: 20/20 panes · **PF3 T-STATUS-ENUM**: 7/7 teams (rawbin+u20 restored) · **PF1** slowness fixed (batch reader).
- **PF4 T-FRESHNESS**: GREEN via live-derived `hiveMind role.uuid` resolver — tester **independently verified immune to a planted `deadbeef` stale snapshot**. My earlier HOLD (test-weakening risk) is RESOLVED: the test plants a stale snapshot and proves the consumer returns LIVE — the REAL invariant, not a weakened resolver-only assertion. Satisfies PF4 story option-1 (consumers derive from live).
- **Invariant `tree.detailed(T)==teams.save(T)==status(T)` holds by construction.**
- **Optional hardening (follow-up, NOT a blocker)**: fail-loud-when-stale on a raw snapshot read (architect's frame belt-and-suspenders for a hypothetical resolver-bypassing consumer). Track in task-s2-c (registry/route integrity) if the architect deems it worth it — the canonical path is already immune.
- **Reported up to oosh-po@MacStudio** (git mailbox), per the parity delegation.

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- down (detailed spec + evidence)
  - [task-s2-a.1-parity-fix-spec.md](./task-s2-a.1-parity-fix-spec.md) — full spec + report-backs
  - [task-s2-a.2-parity-evidence.md](./task-s2-a.2-parity-evidence.md) — tester evidence
  - once.sh@dev: [hiveMind](https://github.com/Cerulean-Circle-GmbH/once.sh/blob/dev/hiveMind) `9ddcf35` (shared reader) · [test/test.teamsave-parity](https://github.com/Cerulean-Circle-GmbH/once.sh/blob/dev/test/test.teamsave-parity) `9fd5f95`

## Description
**Role: architect (frame) → expert (impl) → tester (validate) → PO (gate)**
teams.save (Model persistence) and status/team.list (live View) must agree. Root cause: 3 divergent enumeration paths. Fix = ONE shared live reader (`private.hiveMind.live.tupleset`), 3 consumers. Parity invariant holds BY CONSTRUCTION: `tree.detailed(T) == teams.save(T) == status(T)`.

## Open items
- [ ] **PF4** freshness — architect RULE: live-preferring `role.uuid` resolver sufficient, OR snapshot must be timestamp-gated + **fail-loud-when-stale** (per frame). Then expert implements the ruling.
- [ ] **PF5 re-run** — tester re-runs `test.suite run teamsave-parity`; T-FRESHNESS must green on the REAL invariant (not a weakened resolver-only test). PO gates on the tester's report.
- [x] PF1 naming+slowness (batch reader) · PF2 shell-drop · PF3 enum-gap — GREEN.

## Definition of Done
- All 3 parity tests GREEN via the shared reader (no weakened test)
- Stale snapshot cannot yield a wrong-uuid answer (fail-loud or provably resolver-only)
- PO QA gate PASS → report to oosh-po@MacStudio (git mailbox)

*Sprint 2 — Controller Reliability · task-s2-a (CRITICAL, do-first)*
