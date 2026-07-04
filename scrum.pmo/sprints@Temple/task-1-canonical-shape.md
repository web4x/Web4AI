[Back to Planning Sprint T1](./planning.md)

# Task 1: Canonical task shape — hybrid vs fork vs pure-Web4

[task:uuid:70ed0f88-3c95-4676-bb7c-d15ce15b8ac7]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing
  - [x] testing
- [x] QA Review
- [ ] Done   ← pending: apply ruling to planning-templates.md (add AC↔test)

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

## Candidates to review (dual-linked — click to compare)
1. **Web4 canonical** (authoritative example — real sprint task):
   [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/scrum.pmo/sprints/sprint-2/task-1.0-architect-ranger-main.md) | [/var/dev/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/sprints/sprint-2/task-1.0-architect-ranger-main.md](/var/dev/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/sprints/sprint-2/task-1.0-architect-ranger-main.md)
2. **WODA fork** (oosh-po's sprint-0 shape — real task):
   [GitHub](https://github.com/web4x/Web4AI/blob/main/scrum.pmo/sprints/sprint-0-lifecycle-consolidation/task-a1-claudecode-mvc-boundary-audit.md) | [scrum.pmo/sprints/sprint-0-lifecycle-consolidation/task-a1-claudecode-mvc-boundary-audit.md](../sprints/sprint-0-lifecycle-consolidation/task-a1-claudecode-mvc-boundary-audit.md)
3. **HYBRID** (ARON's proposal — Web4 base + `[WODA-local]` labeled extensions):
   [GitHub](https://github.com/web4x/Web4AI/blob/main/scrum.pmo/sprints@Temple/templates/task-template.hybrid.md) | [scrum.pmo/sprints@Temple/templates/task-template.hybrid.md](./templates/task-template.hybrid.md)

## Acceptance Criteria
- [x] TRON rules the shape → **Web4 canonical (option 1).** (Hybrid rejected: mixed headers+comments = not a template.)
- [ ] `planning-templates.md` updated to **Web4 canonical shape + AC↔test link** (with provenance line).
- [ ] A CLEAN reusable template (Web4 shape, no inline comments) produced — **each Acceptance Criterion links to the test that verifies it** (AC↔test traceability, the gap TRON found in option 1).

## QA Audit & User Feedback
- **TRON 2026-07-03 (verbatim):** "its 1. 3 mixes heders and comments and can never be a template. 1 contains exaples and uuids.,, it lacks tthe test to the acceptance criterias"
- **Ruling:** shape = **option 1, Web4 canonical.** Option 3 (ARON hybrid) REJECTED — a template must be clean headers, no mixed commentary. **Add the missing piece:** each Acceptance Criterion must link to its verifying test (AC↔test), which Web4 canonical lacks.
