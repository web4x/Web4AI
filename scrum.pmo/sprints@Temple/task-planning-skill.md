[Back to Planning Sprint T1](./planning.md)

# Task 4: Make sprint planning a FLEET SKILL

[task:uuid:9eba655a-45b8-4707-ae9a-a23f42c4b343]

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
- Source: TRON 2026-07-16 — "none of the tasks comply to sprint planning templates ... check why planning is not a skill they have and that needs to be done by the agent trainer."
- up
  - [Sprint T1 Planning](./planning.md)
- down
  - [Task 4.1: agent-trainer - create planning base-skill](#) `[subtask:uuid:76627842-1320-418b-9a89-0021110b9442]`
  - [Task 4.2: agent-trainer - propagate template-mandatory rule fleet-wide](#) `[subtask:uuid:10cc34d6-3f08-41df-8b7b-c779c191901d]`
- chain (req -> usecase -> class/method -> impl -> test): N/A (process/skill task, not code)

## Goal
Make the sprint planning template a skill every agent has, so every task/sprint is born template-compliant (measured root cause: no planning base-skill; only 2/93 SKILL.md reference the template; `planning-templates.md` orphan).

## Context
Canonical single sources (DRY — reference, never duplicate): `session/knowledge-base/planning-templates.md`; `scrum.pmo/sprints@<host>/templates/task-template.md`, `subtask-template.md`, `planning-template.md`. Owner of SKILL.md propagation: agent-trainer.

## Steps
1. Create ONE planning base-skill that references the canonical sources.
2. Propagate a boot reading-list line + the template-mandatory rule into all 93 SKILL.md.
3. Re-cast the existing non-compliant tasks (`session/tasks/team-loop-mvc-design.md` + `.SPEC.md`) into the template.

## Requirements
- DRY: the base-skill and every SKILL.md REFERENCE the canonical template/planning-templates.md; no restated copies.
- The rule is unambiguous: a non-compliant task is rejected regardless of content.

## Acceptance Criteria
- [ ] AC1: `session/base-skills/sprint-planning.md` exists and references the canonical templates + `planning-templates.md` (no duplication).
- [ ] AC2: all 93 `.claude/agents/*/SKILL.md` reference the planning base-skill + carry the template-mandatory rule (verify by grep count = 93).
- [ ] AC3: the two team-loop tasks are re-cast into the template (`[task:uuid]`, clean Status, Traceability, AC) or formally rejected.

## Deliverables
- session/base-skills/sprint-planning.md
- 93 updated SKILL.md (agent-trainer)
- re-cast team-loop task files

## QA Audit & User Feedback
- (awaiting)

## Subtasks
- [Task 4.1: agent-trainer - create planning base-skill](#) `[subtask:uuid:76627842-1320-418b-9a89-0021110b9442]` (AC1)
- [Task 4.2: agent-trainer - propagate template-mandatory rule + reading-list line to all 93 SKILL.md](#) `[subtask:uuid:10cc34d6-3f08-41df-8b7b-c779c191901d]` (AC2)
