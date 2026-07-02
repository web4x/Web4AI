[Back to Sprint 2 Planning](./planning.md)

# Task S2-F: plantuml OOSH script (dockerized render via odocker)
[task:uuid:0181e4e6-bcff-4b3c-863d-61ca0f856a61]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (co-design + FINAL SPEC `5b7a803`, PO sign-off `713b207`)
  - [ ] creating test cases (T-PLANTUML)
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- down
  - [task-s2-f.1-plantuml-design.md](./task-s2-f.1-plantuml-design.md) — co-design + final spec + PO sign-off

## Description
**Role: architect (spec ✅) → expert (impl) → tester (T-PLANTUML)**
Two-layer split (TRON 2026-07-02): **odocker** = generic docker image/container LIFECYCLE plumbing (2 new generic primitives `run.ephemeral`, `image.ensure`). **`plantuml`** = the SOLE interface for USING plantUML docker — `install` manages the plantUML IMAGE lifecycle + brings it UP+READY (via `odocker.image.ensure` + readiness check); `render` USES the ready image (via `odocker.run.ephemeral`) → .puml→.svg + post-render stub-detection. PLANTUML_IMAGE/TAG pinned; object.verb/no-flag; plantuml has ZERO `docker` calls (grep-guard). Serves the robbin R22.3 render (dogfood). Full spine in [task-s2-f.1](./task-s2-f.1-plantuml-design.md).

## Open items
- [ ] Expert: implement `odocker.run.ephemeral` + `odocker.image.ensure` (generic, +completions) → then `plantuml` (install/render/status/usage +completion, config vars, validation).
- [ ] Tester: T-PLANTUML — good robbin .puml→real svg (dogfood); bad .puml→detected error-stub (not shipped); odocker primitives idempotent + `--rm` cleanup.

## Definition of Done
- `plantuml render <dir>` → validated .svg; layering invariant (plantuml has ZERO `docker` calls — grep-guard)
- robbin R22.3 render runs through `plantuml render` (not a one-off)
- T-PLANTUML green

*Sprint 2 — Controller Reliability · task-s2-f*
