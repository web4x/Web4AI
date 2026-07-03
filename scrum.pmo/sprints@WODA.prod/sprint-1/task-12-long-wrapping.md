[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 12: Case: long / wrapping message (g.7)
[task:uuid:2d4a53a7-6815-4c45-8933-34737e193253]

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
**Case [C] needs claude target** — exercises: >120-char message that wraps input rows.
**Expected:** region-scan detects commit despite wrap; NO false rc0

## Test case
- **TC-12** [test:uuid:3be15442-9523-48db-89f5-5420d5098ae6] — assert: region-scan detects commit despite wrap; NO false rc0.
  - **Proven by:** T-VERIFY-WRAP (g.7) + send-matrix H.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
