# oosh-po@MacStudio — Backlog

**Updated:** 2026-07-02 (near-ceiling)

## ACTIVE SPRINT — SETUP_SERVER cross-platform + state correctness
📋 `scrum.pmo/sprints@MacStudio/sprint-1/planning.md` (THE tracker). Code on `once.sh/dev`.
- Epics A(order/XOR), B(platform-defaults), C(no-sudo-hang), D(self-heal-reconcile) — **ALL DONE + PO-approved**.
- **OPEN — both blocked on Tron's naked-container call (donges→docker group + authorized_keys):**
  - E1.2 tester — P2 `ossh install` dev→naked container
  - D1.3 tester — T-RECONCILE persistence (rides the same container)
- Non-blocking follow-up: testability seam `OOSH_MODE_FORCE` (oo:322) for full released-path `state next` drive.
- On green → PO QA gate closes sprint-1 on dev (no promote; dev=master).

## DELEGATED — teams.save/status parity (CRITICAL, WODA.prod team)
- `scrum.pmo/sprints/sprint-2/task-s2-a-*` (migrated from session/tasks). PF1 naming, PF2 shell-drop, PF3 enum-gap, PF4 freshness, PF5 tests. I review at their QA gate.
- #32 (175-commit divergence) RESOLVED — mailbox synced.

## OPEN THREADS (older, pending)
- #5 remove --fork flag audit · #7 pushed-team discoverability · #13 claudeCode sh/dash bashism blocker
- #20 agent.bootstrap tiled-index scramble · #22 tronMonitor D3.3 · #24 SM rewind (42-cadence)
- u20 malware incident → tracked in sprint-2 (task-s2-d.0); another track owns it.
