[Back to Task SC-A](./task-sc-a-consistency-audit-foundation.md)

# Task SC-A.2: Expert — consistency.audit method
[task:uuid:6268d2a6-d151-4f83-ad00-5e9d57948184]

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

Implement `hiveMind consistency.audit` on top of SC-A.1 diff primitive.

## Requirements
- Calls `private.hiveMind.reconcile.diff` → never mutates state
- Human output: section per invariant, severity-colored, action hints
- JSON output via `--json` flag (CI/dashboard consumers)
- Exit code: total violation count (0 = clean, per U2)
- Graded: shows ALL violations, does not exit early (per U2)

## Acceptance (DRY-RUN ONLY — per U3)
- `hiveMind consistency.audit` on clean state → exit 0, summary line
- On degraded state → exit N, full violation report

## Key file
`/Users/donges/oosh/hiveMind`

*Sprint 1 · Epic SC-A*
