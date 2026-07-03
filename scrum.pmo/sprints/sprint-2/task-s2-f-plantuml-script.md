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
- [x] Expert: implement `odocker.run.ephemeral` + `odocker.image.ensure` (generic, +completions) → then `plantuml` (install/render/status/usage +completion, config vars, validation). (`1cb40ee`+`0638344`)
- [ ] **Tester: T-PLANTUML** — good robbin .puml→real svg; bad .puml→detected error-stub (not shipped); odocker primitives idempotent + `--rm` cleanup; grep-guard 0 `docker` calls in plantuml. Report results (PO gates on the report).
- [ ] **Docs for oosh-architect** — a usage doc (install/render/status, config vars, the layering) so the architect can use the tool without reading the source. Expert authors; lives with the script docs / referenced from here.
- [ ] **oosh-architect independently renders** a real .puml → .svg via `plantuml render` (NOT the expert's self-dogfood) — proves the tool is usable by a non-author from the docs alone. Architect reports the svg produced.

## Definition of Done
- `plantuml render <dir>` → validated .svg; layering invariant (plantuml has ZERO `docker` calls — grep-guard)
- robbin R22.3 render runs through `plantuml render` (not a one-off)
- **T-PLANTUML green (tester-run, PO-gated)**
- **plantUML documented for the oosh-architect** (usage/how-to)
- **oosh-architect has compiled a .puml→.svg with the `plantuml` oosh script** (independent dogfood) and reported it

*Sprint 2 — Controller Reliability · task-s2-f*

---
## PO QA GATE — partial (oosh-po@WODA.prod, 2026-07-02)
- [x] **Tester T-PLANTUML: 5/5 GREEN** (gated on tester report): LAYERING 0 docker-in-plantuml (guard sensitive: 19 in odocker) · ENSURE idempotent · EPHEMERAL --rm no-leftover · GOOD puml→4992B svg rc0 · BAD mode-conflict→rc1 stub-never-shipped. **T-PLANTUML PASS.**
- [x] **Docs for architect** — `/root/oosh/docs/plantuml.md` authored by expert.
- [ ] **oosh-architect independent render** — dispatched; awaiting the architect's svg-from-docs report. **task-s2-f stays OPEN until this lands** (Tron's non-author-proof criterion).
- [x] **oosh-architect independent render: PASS** — non-author, docs-ONLY: `plantuml render mvc-pane-lifecycle.puml` → real svg 55785B, contains-errors=0, rc=0; status matched doc (v1.2026.6); doc self-sufficient. **task-s2-f: ✅ DONE (all 3 acceptance met).**
- FOLLOW-UP (minor doc polish, non-blocking): worked-example `ls <file>.svg` fails for `@startuml <name>`-named diagrams (svg named by `<name>`, not `<file>.svg`; doc L25 covers it). Note it in the worked example / derive svg name from `@startuml`.

---
## DOGFOOD USE + FINDINGS (oosh-architect, 2026-07-03) — 2nd independent render, real authored diagram
Used the `plantuml` OOSH tool to author + render a NEW diagram (the send.verified clean flow, g.8+task-02) — a genuine in-workflow use, not just an acceptance render.
- **Command**: `plantuml render scrum.pmo/sprints@WODA.prod/sprint-1/diagrams/send-verified-flow.puml` → **`SUCCESS … OK` rc=0**.
- **Produced**: `send-verified-flow.svg` — **21,662 B**, `contains-errors: 0`, valid `<svg …>`. Real render (well above the stub floor). Auto-installed image check + PlantUML 1.2026.6 as before.
- **On-PATH, any dir, no cd** — worked from the project root directly; layering `plantuml → odocker → docker` transparent (never touched docker).
- **Confirms the FOLLOW-UP practice**: I named the diagram `@startuml send-verified-flow` — a **path-safe slug == the filename** — so the output was the predictable `send-verified-flow.svg` and `ls <file>.svg` / `grep 'contains errors' <file>.svg` worked cleanly. **Practice: make the `@startuml <name>` a path-safe slug matching the filename** → the doc's worked-example verification holds with no surprise (this is the actionable form of the L25 caveat). Activity diagrams with `if/else` + `repeat` + colored end-states render well for control-flow specs.
- **Verdict**: tool is reliable + ergonomic for real architect diagramming. No new gaps. (The prior minor doc-polish follow-up stands; this render sidesteps it by slug==filename.)
