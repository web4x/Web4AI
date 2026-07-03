[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 15: Case: queue path (enqueue/drain, no dup)
[task:uuid:bc0b7ea8-d471-4130-b936-73af3075d1bf]

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
  - [Sprint 1 Planning @ WODA.prod](./planning.md)

## Description
**Case [S] shell-provable** — exercises: agent.send to busy → enqueue; idle → drain.
**Expected:** rc0-gated dequeue, no silent drop, NO duplicate on drain

## Test case
- **TC-15** [test:uuid:55cbb6ab-6761-4788-8b27-d957b913cf0f] — assert: rc0-gated dequeue, no silent drop, NO duplicate on drain.
  - **Proven by:** dup-fix fccdad8/d4e3ae0 + send-matrix F.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
