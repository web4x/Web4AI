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
  - session/tasks/structured-output-log-guard.task.md (E.1)
  - session/tasks/panelock-skip-human-shells.md (E.2)
  - session/tasks/rewind-readiness-preflight.md (E.3)
  - session/tasks/test-suite-regression-check.task.md (E.4)
  - session/tasks/oo-new-task-scaffolder.md (E.5)
  - session/tasks/claudecode-sessions-prune.task.md (E.6)

## Description
**Role: architect (where needed) → expert → tester**
Quality/hygiene gaps that erode trust but don't force raw fallback. Do as capacity allows behind Epics A–C.

## Open items
- [ ] **E.1** structured-output log-guard — DRY guard so structured stdout can't leak LOG_DEVICE lines (3rd in family).
- [ ] **E.2** panelock-skip-human-shells — pane.lock refuses non-Claude/human shells (flicker war).
- [ ] **E.3** rewind-readiness-preflight — `agent.rewind.ready` gate before any rewind.
- [ ] **E.4** test.suite regression.check — objective regression-vs-preexisting triage vs a base branch.
- [ ] **E.5** `oo new.task` scaffolder — consistent task files from `_TEMPLATE.task.md`.
- [ ] **E.6** claudeCode sessions.prune — archive DEAD sessions + test-artifact cleanup.

## Definition of Done
- Each sub-item: fix + its named test green; no regressions.

*Sprint 2 — Controller Reliability · Epic E*
