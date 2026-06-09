---
name: rawbin-traceability-standard
description: "Where the RawBin planning + UUID traceability standard lives, and what it mandates"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

The canonical RawBin planning/traceability standard (Tron directive 2026-05-25, derived from
Web4Articles) lives in the RawBin repo at:
`scrum.pmo/standards/traceability-standard.md` (authored by robbin-req).

It mandates a UUID-linked chain: Tron directive → `[requirement:uuid]` (in per-sprint
`requirements.md`) → `[task:uuid]`/`[subtask:uuid]` (task files) → `[uc:uuid]`/`[class:uuid]`
(in PlantUML `.puml`) → `[impl:uuid]` (source comments) → `[test:uuid]` (test comments).
Defines 7 tag types, file-structure rules, MUST(new work)/SHOULD(retrofit), bidirectional
verification greps, and Web4Articles naming conventions.

Reference source: Web4Articles repo at `/Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/sprints/`.

Adoption: future tasks comply fully (Sprint 10+); existing Sprints 1-9 retrofitted via the
Sprint 11 "Traceability Standardization" remediation sprint. Companion audit:
`scrum.pmo/standards/sprint-1-traceability-audit.md`. Ties to [[feedback-cmm4-task-refinement]].
