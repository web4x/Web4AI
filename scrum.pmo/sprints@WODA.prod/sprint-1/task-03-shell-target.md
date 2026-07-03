[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 03: Case: bash-SHELL target
[task:uuid:91e7cf57-4ee6-4265-a122-b875ef6baeeb]

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
**Case [S] shell-provable** — exercises: send.smart to a bash shell (kind=shell).
**Expected:** NO prefix, NO Escape, stage + ONE Enter, rc0 dispatch; verify light (no ❯)

## Test case
- **TC-3** [test:uuid:44f89f9c-54a7-4d59-ac8f-f366b37a956f] — assert: NO prefix, NO Escape, stage + ONE Enter, rc0 dispatch; verify light (no ❯).
  - **Proven by:** Task 01 + send-matrix A2/E3/G1 + live testSend.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
