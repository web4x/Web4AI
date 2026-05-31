# Sprint 1 Planning — State Correctness Architecture

## Sprint Goal
Establish architectural prevention of state drift across the MVC stack
(roles, sessions, teams, snapshots, queues, tronMonitor windows, otmux locks
and layouts). Replace today's reactive manual cleanup with proactive event-driven
synchronization + a reconcile safety net that catches anything events miss.

## Sprint Overview
**Duration:** 1 week (per PO greenlight)
**Focus:** Event dispatch, consistency audit/reconcile, ingress hardening,
snapshot integrity
**Team:** oosh-expert (implementation), oosh-tester (validation), oosh-architect (PUMLs)
**Input Sources:** Sprint 0 closing learnings — Bug #4 (Did/you/mean garbage),
B5.1 observer pattern, D1 verify-before-claim, all stored as canonical patterns
in design doc §5.
**Constraint:** Token-efficient — stagger work, one heavy agent at a time.

## Authoritative Design
**`sprint-1-design.md`** — the single canonical design doc.
Signed off: oosh-architect + oosh-po (2026-05-12).
Earlier drafts (`design.md`, `architect-state-analysis.md`,
`expert-review-and-merge.md`) preserved for traceability only.

## Architecture summary

```
View (otmux) ─── observer ──┐
Model (claudeCode) ─────────┤
Monitor (tronMonitor) ──────┤
                            ▼
         Controller (hiveMind) — event dispatch (in-process for internal,
                                  subprocess for cross-script)
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
          handlers per event   reconcile cycle
          (PRIMARY:            (SAFETY NET:
          fast path)           SM-driven, periodic)
                  │                   │
                  └─────────┬─────────┘
                            ▼
              All caches (S1–S10) reconciled
              to ground truth (L1–L3)
```

## PUML diagrams
- `docs/puml/Sprint1_StateCorrectness_StateStores.puml` — macro state-store consistency model
- `docs/puml/Sprint1_StateCorrectness_EventFlow.puml` — micro mutation→emit→handlers flow
- `docs/puml/Sprint1_StateCorrectness_ReconcileCycle.puml` — SM-driven diff→audit→fix cycle

## PO-locked operational decisions
- **U1**: handler failure → log+continue (reconcile catches drift)
- **U2**: audit graded severity (CRITICAL/HIGH/MEDIUM/LOW), shows all violations
- **U3**: reconcile dry-run by default; `--apply` flag required to mutate

## Foundation dependencies (already landed in Sprint 0)
- ebc8b5e: teams.env triple-defense + word-split fix
- aa7d6ac: tronMonitor verify-before-title (I7)
- 10e9fa0: panes.swapped pane normalization
- 14d5866: registry TTL=0 short-circuit
- d0d3d92: B5.1 observer pattern (foundation for event dispatch)
- 597f93e: D2 team.register → tronMonitor observer
- e66036f: tronMonitor.sync (S8 → S3 reconciliation pattern)
- 8d01421: Bug #2 allowlist pattern (canonical P6)

## Task List

> **Note:** Subtask filenames indicate role (expert / tester / architect). Order
> respects dependency graph in design doc §7. SC-A and SC-B can start in parallel.

### **EPIC SC-A: Consistency audit foundation** (PRIORITY 1)

- [x] [Task SC-A: consistency.audit foundation](./task-sc-a-consistency-audit-foundation.md)
  **Status:** DONE (expert) / A.3 PARTIAL (tester — 2 invariant refs, no full fixture suite) · **Depends on:** none
  - [x] [SC-A.1: Expert — reconcile.diff primitive](./task-sc-a.1-expert-reconcile-diff-primitive.md)
  - [x] [SC-A.2: Expert — consistency.audit method](./task-sc-a.2-expert-consistency-audit.md) — graded I1-I10, human/json format
  - [ ] [SC-A.3: Tester — invariant detection fixtures](./task-sc-a.3-tester-invariant-fixtures.md) — 2 refs in test file, no dedicated fixture suite

### **EPIC SC-B: Event dispatch infrastructure** (PRIORITY 1, parallel with SC-A)

- [x] [Task SC-B: Event dispatch infrastructure](./task-sc-b-event-dispatch-infrastructure.md)
  **Status:** DONE (expert) / B.3 NO TESTS (tester — 0 event isolation tests found) · **Depends on:** none
  - [x] [SC-B.1: Expert — events.register/emit primitives](./task-sc-b.1-expert-events-primitives.md) — 52 refs in hiveMind
  - [x] [SC-B.2: Expert — events.history + log rotation](./task-sc-b.2-expert-events-history.md) — `events.history <?lines>` exists
  - [x] [SC-B.3: Tester — isolation + idempotency](./task-sc-b.3-tester-events-isolation.md) — 12 tests (commit 82c2397)

### **EPIC SC-C: Event handler implementation** (PRIORITY 2)

- [x] [Task SC-C: Event handler implementation](./task-sc-c-event-handlers.md)
  **Status:** ALL 10 HANDLERS IMPLEMENTED (25 handler functions) / C.tests MISSING · **Depends on:** SC-B
  - [x] [SC-C.1: Expert — agent.spawned handler](./task-sc-c.1-expert-handler-agent-spawned.md) — 2 handlers (registry, sessions)
  - [x] [SC-C.2: Expert — agent.killed handler](./task-sc-c.2-expert-handler-agent-killed.md) — 3 handlers (registry, sessions, queue)
  - [x] [SC-C.3: Expert — agent.renamed handler](./task-sc-c.3-expert-handler-agent-renamed.md) — 3 handlers (registry, title, role_env)
  - [x] [SC-C.4: Expert — agent.forked handler](./task-sc-c.4-expert-handler-agent-forked.md) — 3 handlers (registry, sessions, forks)
  - [x] [SC-C.5: Expert — panes.shifted handler](./task-sc-c.5-expert-handler-panes-shifted.md) — 1 handler (registry)
  - [x] [SC-C.6: Expert — panes.swapped handler](./task-sc-c.6-expert-handler-panes-swapped.md) — 2 handlers (registry, role_env)
  - [x] [SC-C.7: Expert — pane.moved handler](./task-sc-c.7-expert-handler-pane-moved.md) — 2 handlers (registry, role_env)
  - [x] [SC-C.8: Expert — team.created handler](./task-sc-c.8-expert-handler-team-created.md) — 2 handlers (teams, tronMonitor)
  - [x] [SC-C.9: Expert — team.destroyed handler](./task-sc-c.9-expert-handler-team-destroyed.md) — 4 handlers (teams, tronMonitor, registry, sessions)
  - [x] [SC-C.10: Expert — team.restored handler](./task-sc-c.10-expert-handler-team-restored.md) — 2 handlers (teams, tronMonitor)
  - [x] [SC-C.tests: Tester — handler integration tests](./task-sc-c.tests-tester-handler-integration.md) — 11 tests (commit ce65556)

### **EPIC SC-D: Reconcile cycle (safety net)** (PRIORITY 2)

- [x] [Task SC-D: Reconcile cycle (safety net)](./task-sc-d-reconcile-cycle.md)
  **Status:** DONE (expert: fix+reconcile+SM wiring) / D.3 NO TESTS · **Depends on:** SC-A
  - [x] [SC-D.1: Expert — consistency.fix + consistency.reconcile](./task-sc-d.1-expert-fix-and-reconcile.md) — dry-run/apply modes (U3)
  - [x] [SC-D.2: Expert — scrumMaster.cycle wiring](./task-sc-d.2-expert-sm-cycle-wiring.md)
  - [ ] [SC-D.3: Tester — degrade→reconcile→audit-clean roundtrip](./task-sc-d.3-tester-reconcile-roundtrip.md) — 0 reconcile roundtrip tests

### **EPIC SC-E: Ingress triple-defense audit + apply** (PARALLEL)

- [x] [Task SC-E: Ingress triple-defense](./task-sc-e-ingress-triple-defense.md)
  **Status:** DONE — 13 P3 defense applications in hiveMind + tests exist · **Depends on:** none
  - [x] [SC-E.1: Expert — audit ingress points](./task-sc-e.1-expert-ingress-audit.md) — findings documented
  - [x] [SC-E.2: Expert — apply triple defense to gaps](./task-sc-e.2-expert-apply-defense.md) — 13 SC-E.2 P3 markers in code
  - [x] [SC-E.3: Tester — 3-vector reject per ingress](./task-sc-e.3-tester-3-vector-reject.md) — tests exist in test.hiveMind

### **EPIC SC-F: Snapshot integrity + format versioning** (PARALLEL, after SC-E)

- [x] [Task SC-F: Snapshot integrity + format versioning](./task-sc-f-snapshot-integrity.md)
  **Status:** DONE — version header, save/restore validation, 28 test refs · **Depends on:** SC-E
  - [x] [SC-F.1: Expert — snapshot format version field](./task-sc-f.1-expert-snapshot-version.md) — `# version: 1` header
  - [x] [SC-F.2: Expert — teams.save validates each line](./task-sc-f.2-expert-save-validates.md)
  - [x] [SC-F.3: Expert — teams.restore validates each line](./task-sc-f.3-expert-restore-validates.md)
  - [x] [SC-F.4: Tester — corrupt-snapshot + version-skew reject](./task-sc-f.4-tester-corrupt-reject.md) — 28 T-SNAP refs

### **Task D4: tronMonitor.fit — auto-size team panes** (Tron directive)

- [x] [Task D4: tronMonitor.fit](./task-d4-tronmonitor-fit.md)
  **Status:** DONE · **Depends on:** B4.2 (DONE), architect design (DONE)
  - [x] D4.1: Expert — commit c4a5d2c (border formula fix, otmux wrappers, completion)
  - [ ] D4.2: Tester — test fit ooshTeam/web4team, N=0, oversized, idempotency

### **Task D5: tronMonitor stale client cleanup** (P1 — prevents pane collapse)

- [x] [Task D5: tronMonitor stale client cleanup](./task-d5-tronmonitor-client-cleanup.md)
  **Status:** DONE · **Depends on:** B6 (DONE), B8 (DONE), SC-D.2 (DONE)
  - [x] D5.1: Expert — commit aed6810 (107 lines across otmux+tronMonitor+scrumMaster)
  - [x] D5.2: Expert — sync calls client.cleanup.stale (idle>60min + size<10)
  - [x] D5.3: Expert — scrumMaster.cycle calls client.cleanup.stale (idle>30min)
  - [x] D5.4: Tester — 8 tests at 1427be6. Verified live: 22 stale clients cleaned

### **EPIC SC-G: Documentation + PUMLs** (LAST)

- [ ] [Task SC-G: Documentation + PUMLs](./task-sc-g-docs.md)
  **Status:** PLANNED · **Depends on:** SC-A, SC-B, SC-C, SC-D all landed
  - [x] [SC-G.1: Expert — docs/state-stores.md](./task-sc-g.1-expert-doc-state-stores.md) — commit 2118404
  - [x] [SC-G.2: Expert — docs/invariants.md](./task-sc-g.2-expert-doc-invariants.md) — commit 95e8fae, 161 lines
  - [ ] [SC-G.3: Architect — additional PUMLs as needed](./task-sc-g.3-architect-puml-extensions.md) — architect scope
  - [x] [SC-G.4: Expert — update docs/oosh-architecture.md](./task-sc-g.4-expert-architecture-update.md) — commit 1b89edd

## Sprint Dependencies

```
                SC-A audit foundation ──┐
                SC-B event dispatch  ──┐│
                                       ▼▼
                              SC-C handlers (uses SC-B)
                              SC-D reconcile (uses SC-A diff)
                                       │
SC-E ingress audit ─────── parallel ───┤
SC-F snapshot integrity ── after SC-E ─┤
                                       ▼
                              SC-G docs (last, reflects landed reality)
```

## Definition of Done
- [ ] `hiveMind consistency.audit` graded report runs all I1-I7 checks
- [ ] `private.hiveMind.events.register/emit` primitives implemented with isolated handlers
- [ ] All 10 events in §4 catalog wired to handlers updating their target stores
- [ ] `hiveMind consistency.reconcile [--apply]` integrates into `scrumMaster cycle`
- [ ] All ingress points (registry.set, tronMonitor.add, team.switch, etc.) have P3 triple defense
- [ ] Snapshots have `# version: 1` header; teams.save and teams.restore validate each line
- [ ] `docs/state-stores.md` and `docs/invariants.md` published; `docs/oosh-architecture.md` cross-links

## Token Budget Rule
- ONE agent at a time on heavy refactors (per Sprint 0 rule)
- SC-A and SC-B can run in parallel ONLY if different agents; otherwise serialize
- SC-C events are 10 separate handlers — small commits, easy to slice across agent-hours

## Sprint Metrics
- **Invariant coverage**: count of I1-I7 enforced by event handlers + reconcile (target: 7/7)
- **Ingress defense coverage**: % of caller-supplied-identifier methods with P3 (target: 100%)
- **Reconcile false-positive rate**: violations reported but not real (target: <5%)
- **Reconcile false-negative rate**: real drift missed by audit (target: 0%)

## Risk Management
- **Event-dispatch overhead** — mitigated by in-process function table (per architect Q2 answer)
- **Handler-failure cascade** — mitigated by U1 log+continue; reconcile catches
- **Reconcile false-apply** — mitigated by U3 dry-run default; --apply gated by SM cycle stability
- **Sprint 0 regression** — mitigated by running existing test suites at each commit

---

**Product Owner:** oosh-po (ooshTeam:0.0)
**Architect:** oosh-architect (ooshTeam:0.1)
**Expert:** oosh-expert (ooshTeam:0.2)
**Tester:** oosh-tester (ooshTeam:0.3)
**Sprint:** Sprint 1 — State Correctness Architecture
**Created:** 2026-05-12
**Design signed off by:** architect + PO (2026-05-12)
