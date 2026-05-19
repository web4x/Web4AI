[Back to Sprint 1 Design](./sprint-1-design.md)

# Task SC-A: consistency.audit foundation
[task:uuid:540e913c-a4c1-4f0a-ae85-b7e2cf5b809c]

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 1 Design](./sprint-1-design.md)

- down
  - [Task SC-A.1: Expert — reconcile.diff primitive](./task-sc-a.1-expert-reconcile-diff-primitive.md)
  - [Task SC-A.2: Expert — consistency.audit method](./task-sc-a.2-expert-consistency-audit.md)
  - [Task SC-A.3: Tester — 6 invariant detection fixtures](./task-sc-a.3-tester-invariant-fixtures.md)

## Description
Foundation for state-correctness audit. Implements the diff primitive shared
by audit/fix/reconcile, then layers `consistency.audit` on top to report all
I1-I7 violations graded (per U2: CRITICAL/HIGH/MEDIUM/LOW).

## Context
Per consolidated design (sprint-1-design.md §4) — Option B reconcile is the
safety net for Option C event dispatch. `consistency.audit` is the
read-only inspection face of the same diff primitive used by `fix` and
`reconcile`.

## Definition of Done
- `hiveMind consistency.audit` runs all I1-I7 checks (sprint-1-design.md §3)
- Reports human-readable + JSON output (graded by severity)
- Exit code = total violation count (per U2)
- Tester fixtures cover each invariant violation scenario

*Sprint 1 — State Correctness Architecture · Epic A*
