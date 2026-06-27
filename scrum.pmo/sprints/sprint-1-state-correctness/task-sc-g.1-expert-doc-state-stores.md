[Back to Task SC-G](./task-sc-g-docs.md)

# Task SC-G.1: Expert — doc-state-stores
[task:uuid:7b708ca0-d637-472c-983d-a8bcb9b9943d]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing — commit 2118404 (update to existing doc from prior session)
- [x] QA Review
- [x] Done

## Deliverable
**File:** `docs/state-stores.md` (111 lines → 125 lines, commit 2118404)

Updates over prior version:
- S2: added staleness risk + P0 bug fix reference (f89bbc8, deferred probe)
- L3: added token semantics (input + cache_create + cache_read = total context; hard-won from P0)
- S10: corrected file path (`~/config/otmux/<session>.layout.env`, not `*.layout`) + format details
- All 10 stores documented with: file, format, owner, writers, readers, ground truth, invariants
- Ground truth L1/L2/L3 documented with query methods
- Write-path discipline, event-driven mutation, snapshot schema v1, file ownership rules

## Description
**Role: oosh-expert**

Write `docs/state-stores.md` documenting S1-S10 (owner, writer, format, what mutates it).

*Sprint 1 · Epic SC-G*
