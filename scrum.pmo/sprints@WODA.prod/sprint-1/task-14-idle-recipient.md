[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 14: Case: IDLE recipient
[task:uuid:ac790ff5-781e-438c-8c61-fbba6a8454cc]

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
**Case [S/C] shell + claude** — exercises: target at idle ❯ / shell prompt.
**Expected:** delivers/dispatches rc0

## Test case
- **TC-14** [test:uuid:dca70b9c-5a90-4266-9b10-ff9b2c7629e4] — assert: delivers/dispatches rc0.
  - **Proven by:** send-matrix B1/C4 + live.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
