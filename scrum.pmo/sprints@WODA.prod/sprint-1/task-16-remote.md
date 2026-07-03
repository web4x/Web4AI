[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 16: Case: remote target (ossh-exec)
[task:uuid:d59ec500-490f-4c8e-9b0a-5fbfb46a6eec]

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
**Case [R] needs remote** — exercises: send to a pane on a remote host.
**Expected:** send runs ON the remote (self-similar); unreachable → marker, no hang

## Test case
- **TC-16** [test:uuid:f54a8733-3045-47b1-8e1a-49e5ca7a2341] — assert: send runs ON the remote (self-similar); unreachable → marker, no hang.
  - **Proven by:** c.0 remote (0d9d162) + send-matrix J.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
