[Back to Task SC-G](./task-sc-g-docs.md)

# Task SC-G.2: Expert — doc-invariants
[task:uuid:37784d61-6b08-41f2-8ffc-54d69f678787]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing — commit 95e8fae (added event enforcement + P0 case study to existing doc)
- [x] QA Review
- [x] Done

## Deliverable
**File:** `docs/invariants.md` (106 → 161 lines, commit 95e8fae)

Added over prior version:
- **Event handler enforcement table** — for each I1-I10: which events maintain it, what reconcile catches if events miss
- **Bash 3.2 fallback note** — events gated by BASH_VERSINFO; direct fallback inline
- **P0 real-world case study** (2026-05-28) — I2/I10 violation where stale S2 UUID caused context.read to report 100% on a 48% agent, leading SM to skip needed compacts. Documents: what happened, why events didn't catch it, fix commit, lesson learned (consumers must defend against stale reads independently)

## Description
**Role: oosh-expert**

Write `docs/invariants.md` documenting I1-I7 (owner, detection method, severity, recovery action).

*Sprint 1 · Epic SC-G*
