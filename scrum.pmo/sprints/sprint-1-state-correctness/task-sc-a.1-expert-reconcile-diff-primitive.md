[Back to Task SC-A](./task-sc-a-consistency-audit-foundation.md)

# Task SC-A.1: Expert — reconcile.diff primitive
[task:uuid:55c930fd-44ae-45e1-8f86-ac67d2d0513f]

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Description
**Role: oosh-expert**

Implement `private.hiveMind.reconcile.diff` — the single primitive that
compares cached state (S1-S10) to ground truth (L1-L3) and returns a list
of mutations needed.

Used by:
- `consistency.audit` (read-only — reports diff)
- `consistency.fix` (apply with confirmation)
- `consistency.reconcile` (apply silently, SM-cycle caller)

## Requirements
- Output format: one mutation per line, `<store>|<op>|<key>|<expected>|<actual>`
- Op set: ADD, REMOVE, UPDATE
- Severity tag per mutation (CRITICAL/HIGH/MEDIUM/LOW per invariant)
- Pure: no side effects, no writes — diff only
- Idempotent: same input always produces same output
- Incremental: efficient when most state is consistent; falls back to full
  rebuild logic naturally when diff is large (per expert review Q3 answer)

## Key file
`/Users/donges/oosh/hiveMind`

*Sprint 1 · Epic SC-A*
