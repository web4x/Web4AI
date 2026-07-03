[Back to Task 2](./task-2-nonclaude-verify-rc0.md)

# Task 2.1: Tester - shell rc0 / no-drain-re-drive test
[task:uuid:4fda9fd1-5e1d-4c80-8b3a-36f25c3b6c8a]

## Status
- [x] Planned (pending Task 2 approval)
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Task 2: non-claude verify → rc0](./task-2-nonclaude-verify-rc0.md)

## Description
**Role: oosh-tester** — validate Task 2's non-claude rc0 fix.

## Test case
- **TC-2.1** [test:uuid:82abf58e-8fd7-4162-a699-0ea87b5ace37] — **shell send → rc0, no false-staged, no drain re-drive.** Send to a bash shell → the command runs once AND `send.verified` returns **rc0** (not rc2). A subsequent `agent.queue.drain` of the same target does **NOT** re-drive (no duplicate). A **claude** target still returns the g.7-verified rc {0/2} unchanged (no regression). Suites `send-selfheal` + `T-SEND-MATRIX` stay green.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
