[Back to Sprint 2 Planning](./planning.md)

# Task S2-E: tooling hygiene
[task:uuid:cc3dc93b-ddd9-432b-80ad-32c0696eb7e1]

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
  - [Sprint 2 Planning](./planning.md)
- down (one spec each)
  - [task-s2-e.1-structured-output-log-guard.md](./task-s2-e.1-structured-output-log-guard.md) — E.1
  - [task-s2-e.2-panelock-skip-human-shells.md](./task-s2-e.2-panelock-skip-human-shells.md) — E.2
  - [task-s2-e.3-rewind-readiness-preflight.md](./task-s2-e.3-rewind-readiness-preflight.md) — E.3
  - [task-s2-e.4-regression-check.md](./task-s2-e.4-regression-check.md) — E.4
  - [task-s2-e.5-oo-new-task-scaffolder.md](./task-s2-e.5-oo-new-task-scaffolder.md) — E.5
  - [task-s2-e.6-sessions-prune.md](./task-s2-e.6-sessions-prune.md) — E.6

## Description
**Role: architect (where needed) → expert → tester**
Quality/hygiene gaps that erode trust but don't force raw fallback. Do as capacity allows behind the CRITICAL tasks (a–c).

## Open items
- [ ] **E.1** structured-output log-guard — DRY guard so structured stdout can't leak LOG_DEVICE lines (3rd in family).
- [ ] **E.2** panelock-skip-human-shells — pane.lock refuses non-Claude/human shells (flicker war).
- [ ] **E.3** rewind-readiness-preflight — `agent.rewind.ready` gate before any rewind.
- [ ] **E.4** test.suite regression.check — objective regression-vs-preexisting triage vs a base branch.
- [ ] **E.5** `oo new.task` scaffolder — consistent task files from `_TEMPLATE.task.md`.
- [ ] **E.6** claudeCode sessions.prune — archive DEAD sessions + test-artifact cleanup.

## Definition of Done
- Each sub-item: fix + its named test green; no regressions.

*Sprint 2 — Controller Reliability · task-s2-e*
