> ⬆ **[Sprint 2 · task-s2-e](../../scrum.pmo/sprints/sprint-2/task-s2-e-tooling-hygiene.md)** — this spec is traced from that sprint-2 task.

# DRY guard: structured-output methods must not leak LOG_DEVICE lines

**From**: oosh-architect (CMM4 systemic-pattern flag, 2026-06-29) — captured by oosh-po@WODA.prod
**Owners**: oosh-architect (convention design) → oosh-expert (impl) → oosh-tester (verify)
**Priority**: MEDIUM
**Status**: PLAN (BACKLOG — not active; node-provisioning parked)
**Date**: 2026-06-29
**Sprint**: — (DRY/hygiene; candidate for a log-hygiene sprint)
**Related**: SETUP_SERVER BUG5 `2b68265` (mechanism a), team.sweep `a962949` (mechanism b)

## Problem / Why
3rd LOG_DEVICE-leak in one family. ANY method emitting STRUCTURED stdout (team.sweep / status / models.list / snapshots.list / …) leaks per-iteration helper + subprocess log lines into its output when LOG_DEVICE is a writable tty — corrupting the structured result. Two distinct mechanisms now seen:
- (a) errors→stderr-never-fd1 — fixed at source for errors (`2b68265`: err/important.log coerce LOG_DEVICE→/dev/stderr; create.result strips ANSI).
- (b) structured-output BODIES silence all log via `local LOG_DEVICE=/dev/null` (`a962949`).
The (b) pattern is **easy to forget** — the next new structured-output method will re-leak unless there's a shared convention/guard.

## Design / Approach
A shared, DRY convention so structured-output methods can't re-leak:
- Option 1: a helper pair `private.structured.begin` / `private.structured.end` (or a single `this`-level guard) that sets `local LOG_DEVICE=/dev/null` for the body — methods call it instead of hand-rolling the local. ONE chokepoint owns the silencing.
- Option 2: a convention + a test.suite lint that flags any method emitting to fd1 in a loop without the guard.
Architect picks the mechanism. Self-care: the guard restores LOG_DEVICE on exit (no leak past the method). Composes with (a) — keep errors on stderr regardless.

## Acceptance Criteria
- [ ] A documented shared guard/convention exists for structured-output methods (one chokepoint, not per-method hand-rolling)
- [ ] team.sweep/status/models.list/snapshots.list use it (retrofit the known cases)
- [ ] T-STRUCTURED-NOLEAK: a structured method with LOG_DEVICE=/dev/tty produces ZERO log lines in its stdout
- [ ] (option 2) lint/test flags a new structured method missing the guard
- [ ] DRY: no per-method `local LOG_DEVICE=/dev/null` copy-paste remains

## PDCA
- Plan: this spec (architect flag). Do: architect convention → expert retrofit. Check: T-STRUCTURED-NOLEAK across the known methods. Act: add the lint if forgetting recurs.

## Report-back (owners edit here; one line each, with commit hash)
- Architect (convention/guard design):
- Expert (guard + retrofit):
- Tester (T-STRUCTURED-NOLEAK):
