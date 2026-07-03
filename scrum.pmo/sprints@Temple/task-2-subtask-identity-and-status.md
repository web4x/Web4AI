[Back to Planning Sprint T1](./planning.md)

# Task 2: Sub-task identity + status granularity

[task:uuid:98dd7e58-02fc-4592-b1a4-3ba92fcf31bf]

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
- _(awaiting TRON's ruling)_
