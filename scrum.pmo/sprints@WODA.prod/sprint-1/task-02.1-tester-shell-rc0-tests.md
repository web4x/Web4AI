[Back to Task 02](./task-02-nonclaude-verify-rc0.md)

# Task 02.1: Tester - shell commit-detect / log-level test
[test:uuid:4fda9fd1-5e1d-4c80-8b3a-36f25c3b6c8a]

## Status
- [x] Planned
- [ ] In Progress
  - [ ] creating test cases
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Task 02: non-claude verify — detect commit, log correctly](./task-02-nonclaude-verify-rc0.md)

## Description
**Role: oosh-tester** — validate Task 02: the non-claude verify detects commit + logs correctly.

## Test case
- **TC-02.1** [test:uuid:82abf58e-8fd7-4162-a699-0ea87b5ace37] — **shell delivered → `info`+rc0; genuine non-apply → `WARNING`+rc2; no drain re-drive; claude unregressed.** Assert:
  1. **Delivered shell send** (command runs) → `send.verified` **`info.log` "committed"** + **rc0**; **NO `WARNING`** in the log.
  2. **Genuine non-apply** (Enter blocked / text left staged, prompt unchanged) → **`WARNING`** + **rc2** (the warning fires only here).
  3. A subsequent `agent.queue.drain` of a committed target does **NOT** re-drive (no duplicate).
  4. **Claude** target still returns the g.7-verified rc {0/2} unchanged; `send-selfheal` + `T-SEND-MATRIX` stay green.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
