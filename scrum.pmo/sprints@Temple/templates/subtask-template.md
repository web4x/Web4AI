[Back to Task N](./task-N-<slug>.md)

# Task N.M: <role> — <Title>
<!-- EXAMPLE: # Task 12.1: developer — add EXAMPLE+KNOWLEDGE guidance to each field
     KNOWLEDGE: A sub-task is a FINITE, SINGLE-ROLE leaf of the parent's fractal PDCA. N.M = parent.child. The role is in BOTH the heading and the filename (task-N.M-<role>-<slug>.md). Role = developer / tester / architect — never "expert". If it needs two roles or two deliverables it is NOT a leaf: split it. -->

[subtask:uuid:<generate-uuid-v4>]
<!-- EXAMPLE: [subtask:uuid:aa11bb22-cc33-4d44-9e55-ff6677889900]
     KNOWLEDGE: A DISTINCT [subtask:uuid] (NOT [task:uuid]) — a real v4 from uuidgen. Distinct child identity = unambiguous cross-references at any depth (TRON 2026-07-04). -->

## Status
- [ ] Planned
- [ ] In Progress
- [ ] Done

## Traceability
- up
  - [Task N: <parent title>](./task-N-<slug>.md) — `[task:uuid:<parent-uuid>]`
- chain (this leaf's own link in req → usecase → class/method → impl → test):
  - `[<class|method|implementation|test>:uuid:<v4>]` <slug>
<!-- KNOWLEDGE: `up` MUST point to the parent's [task:uuid] and the parent's Subtasks MUST list this leaf back (bidirectional, written at both ends — a one-sided link is broken). A tester leaf owns the [test:uuid]s and links up to the AC it validates. -->

## Goal
<what this leaf delivers, in one line — one role, one deliverable>

## Steps
1. <step>

## Acceptance Criteria
- [ ] AC1: <testable criterion> — `[test:uuid:<v4>]` (tester leaf) / verified-by link
<!-- KNOWLEDGE: Every AC testable + linked to a real [test:uuid]. The leaf is Done when its ACs are green; the parent's QA Review + Done (TRON's gate) aggregate all leaves. -->

## Deliverables
- <path/to/file>

<!-- =========================================================================
     STATUS RULES (do NOT annotate the ## Status block — it is machine-read AND
     written by tooling; boxes only, no comments/commits/dates). Sub-tasks use
     this FLAT status (Planned / In Progress / Done); the parent task uses the
     full pipeline. Single canonical source: session/knowledge-base/planning-templates.md §3.
     HOW TO USE: copy to task-N.M-<role>-<slug>.md, fill placeholders, DELETE all
     guidance comments. The instantiated sub-task = clean headers + content.
     ========================================================================= -->
