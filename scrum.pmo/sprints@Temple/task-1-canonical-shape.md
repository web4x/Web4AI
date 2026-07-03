[Back to Planning Sprint T1](./planning.md)

# Task 1: Canonical task shape — hybrid vs fork vs pure-Web4

[task:uuid:70ed0f88-3c95-4676-bb7c-d15ce15b8ac7]

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
- Source: Sprint T1, TRON directive "clarify task by task; scalable wins over primitive"
- up
  - [Sprint T1 Planning](./planning.md)

## Task Description
Decide the canonical task/planning shape for WODA's `planning-templates.md`. Web4Articles has **no template file**, and its own sprints disagree (sprint-2 vs sprint-20), so the shape is genuinely unsettled in the authority — TRON must rule.

## Context
Grounding report (agent-verified against `2cuGitHub/Web4Articles` sprint-2 / sprint-21 / sprint-0). Draft under decision: `session/knowledge-base/planning-templates.md`.

## Intention
Fix the base shape so every downstream rule (sections, ids, status, roles) hangs off one agreed skeleton.

## The decision — ARON's scalable recommendation
**HYBRID (scalable > primitive).** Web4 canonical sections as the **base** — `Goal/Task Description · Context · Intention (1 paragraph) · Steps · Requirements · Acceptance Criteria · Deliverables · QA Audit & User Feedback` — PLUS WODA additions **explicitly labeled `[WODA-local]`** (machine-scope, `sprints@<host>/`, extra gates).
- **Why scalable beats primitive:** a labeled hybrid *extends* cleanly (new hosts, new gates, new sections) without duplicating the whole shape. The pure-fork (oosh-po's sprint-0 shape) duplicates → drifts (the very mess we're curing). Pure-Web4 can't express WODA's multi-host reality. Extensible base + marked extensions = the scalable choice.

## Acceptance Criteria
- [ ] TRON rules the shape: **hybrid** / bless-fork / pure-Web4.
- [ ] `planning-templates.md` updated to the ruled shape, with a provenance line ("no Web4 template exists; derived from real sprints + WODA hybrid").

## QA Audit & User Feedback
- _(awaiting TRON's ruling)_
