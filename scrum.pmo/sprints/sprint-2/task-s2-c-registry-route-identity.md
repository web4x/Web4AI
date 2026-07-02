[Back to Sprint 2 Planning](./planning.md)

# Task S2-C: registry / route / identity integrity
[task:uuid:e86af5f5-f8a4-48ee-a52d-7cd6c2534c2b]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [ ] creating test cases
  - [~] implementing (route auto-heal shipped; reconcile+audit+boot-id open)
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- down
  - [hivemind-route-autoheal.task.md](../../../session/tasks/hivemind-route-autoheal.task.md) — C.1 route auto-heal + fd/EMFILE root-cause
  - [hivemind-reconcile-after-fork.task.md](../../../session/tasks/hivemind-reconcile-after-fork.task.md) — C.2 adopt orphans + team.audit
  - [agent-dirs-per-host-split.md](../../../session/tasks/agent-dirs-per-host-split.md) — C.3 boot/identity resolution (OTR-11)

## Description
**Role: architect (design) → expert (impl) → tester (validate)**
One root family behind BUG10-adjacent chaos: registry/route/uuid drift under load. Fix so the controller's routing + identity are always TRUE.

## Open items
- [x] **C.1 route auto-heal** — `agent.send` re-resolves unknown-route from live + retries before queue (SHIPPED). Watch: does route=unknown-state recurrence STOP now the u20 malware (1001 sockets → EMFILE suspect) is gone? Confirm the fd-exhaustion source.
- [ ] **C.2 reconcile-after-fork + team.audit** — adopt raw-forked orphans (tty-match → registry.set → consistency.fix); `team.audit` flags ALL orphans (live-claude+empty-uuid/unknown-route) in one sweep. (architect designing.)
- [ ] **C.3 boot/identity resolution** — hook must resolve `role@host` from ground truth; never emit an "unknown" boot that clobbers a real agent (live artifact seen [session/agents/unknown/boot.md](../../../session/agents/unknown/boot.md)).

## Definition of Done
- route survives sustained RC-driving (no recurrence); unknown-route auto-heals, never silent-drops
- orphans adoptable + detectable via one audit; boot hook resolves role@host correctly
- tests: T-ROUTE-AUTOHEAL, T-RECONCILE-FORK

*Sprint 2 — Controller Reliability · Epic C*
