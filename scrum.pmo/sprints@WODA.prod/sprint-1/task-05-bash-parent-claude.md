[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 05: Case: bash-parent claude (kind false-negative g.4)
[task:uuid:d94cd197-3649-4871-8e60-8e8cfbb992cf]

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
**Case [C] needs claude target** — exercises: a claude whose parent is bash.
**Expected:** classifies CLAUDE (keeps prefix+verify), not shell

## Test case
- **TC-5** [test:uuid:e22be7cb-d4c7-4b7c-9c01-ec27c231df3f] — assert: classifies CLAUDE (keeps prefix+verify), not shell.
  - **Proven by:** T-KIND-CLASSIFY 12/12 (g.4 6213ad6).
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
