[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 13: Case: BUSY recipient
[task:uuid:e7480d7b-593c-48e9-9001-77a8f21d3476]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 1 Planning @ WODA.prod](./planning.md)

## Description
**Case [S/C] shell + claude** — exercises: target generating / running sleep.
**Expected:** send.verified refuses Escape (idle-only, NO interrupt); agent.send routes to QUEUE

## Test case
- **TC-13** [test:uuid:2d6197af-8c83-4578-8749-fcfc608c2ffe] — assert: send.verified refuses Escape (idle-only, NO interrupt); agent.send routes to QUEUE.
  - **Proven by:** send-matrix G4 + agent.route.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
