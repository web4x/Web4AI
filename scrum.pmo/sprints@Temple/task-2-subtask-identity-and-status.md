[Back to Planning Sprint T1](./planning.md)

# Task 2: Sub-task identity + status granularity

[task:uuid:98dd7e58-02fc-4592-b1a4-3ba92fcf31bf]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [ ] creating test cases
  - [x] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint T1 Planning](./planning.md)

## Task Description
Two sub-questions. (a) **Id marker:** Web4 uses a *distinct* `[subtask:uuid]` for children vs `[task:uuid]` for parents (grounded: 40 files use `[subtask:uuid`). (b) **Status granularity:** Web4 practice puts the In-Progress substeps (refinement/test-cases/implementing/testing) on **main** tasks and often a **flat** 4-item status on subtasks.

## The decision — ARON's scalable recommendation
- (a) **Adopt `[subtask:uuid]` for children** — distinct identity is grounded AND scalable (unambiguous cross-references at any depth). Primitive (reuse `[task:uuid]`) invites collisions.
- (b) **Uniform full-substep status on EVERY unit (main AND sub)** — scalable > primitive: one machine-readable status schema parsed the same way everywhere beats special-casing "main has substeps, sub is flat." A subtask that skips a substep just leaves it unchecked. Uniformity scales to tooling.

## Acceptance Criteria
- [ ] TRON rules (a): distinct `[subtask:uuid]` yes/no.
- [ ] TRON rules (b): uniform full-substep status, or flat-on-subtasks (Web4 practice).
- [ ] `planning-templates.md` updated accordingly.

## QA Audit & User Feedback
- 2026-07-04: TRON ruled — (a) **distinct `[subtask:uuid]`** = YES; (b) **sub-tasks use a DIFFERENT (flat) status template**, not uniform; and **the Status block must be machine-readable AND writable — NEVER annotated with comments**.
- Implemented (single source + references, DRY): `session/knowledge-base/planning-templates.md` §1 (subtask id → `[subtask:uuid]`) + §3 (split main-full / sub-flat status, "never annotated"); removed the Status guidance comment from `task-template.md`; created `templates/subtask-template.md` (flat status, distinct `[subtask:uuid]`, one role) which references §3.
- Awaiting TRON QA Review.
