[Back to Sprint 2 Planning](./planning.md)

# Task S2-B: dispatch submission-verified (supersedes BUG10)
[task:uuid:25058bed-03dc-452c-b3c1-e1d1395d43fd]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (architect contract `d8ad770`)
  - [ ] creating test cases (T-DISPATCH-SUBMIT)
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- down
  - [dispatch-submission-verified.md](../../../session/tasks/dispatch-submission-verified.md) — spec + APPROVED contract + PO sign-off

## Description
**Role: architect (contract ✅) → expert (impl) → tester (validate)**
The shared send core (`otmux send` + `hiveMind send.message`/`agent.queue.drain`) stages text but does not SUBMIT → agent idle, silent no-op. Fix per approved contract: stage→submit→verify(by input-line REGION, not text-presence)→poke(idempotent, text-free)→HONEST rc {0 submitted / 2 staged-unverified / 3 blocked / 1 error}. `agent.queue.drain` gates dequeue on rc 0 (no silent drop). delegate sends one-line pointers (wrap-free; long payloads wrap→Enter=newline→never submit).

## Open items
- [ ] Expert: implement the submission-verified core backing ALL send paths + `send.submit`/`poke`.
- [ ] Tester: T-DISPATCH-SUBMIT — rc-honesty (submitted vs staged vs blocked) + no-silent-drop on drain; live no-SM-net run.

## Definition of Done
- send returns SUCCESS only when verifiably submitted; retries then honest FAILURE
- drain never drops on unknown-route; short-pointer payloads default
- T-DISPATCH-SUBMIT green → closes BUG10

*Sprint 2 — Controller Reliability · Epic B (CRITICAL)*
