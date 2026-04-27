[Back to Planning Sprint 0](./planning.md)

# Task B3: otmux pane.lock idempotent relock
[task:uuid:a2fbfdb2-7d15-4d19-a369-570156612ba2]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing (B3.1 expert — commit 75ab018)
  - [ ] testing (B3.2 tester — pending)
- [x] QA Review
- [ ] Done (pending B3.2 tester)

## Deliverable
**Fix:** `otmux pane.lock` now auto-unlocks before relocking, making it idempotent.
Calling `pane.lock` with a different title no longer silently fails or requires manual `pane.unlock` first.
**Commit:** 75ab018

## Traceability
- Source: Sprint 0 - Lifecycle Consolidation, Epic B (View Layer)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task B3.1: Expert - pane.lock idempotent](./task-b3.1-expert-pane-lock-idempotent.md)
    - [Task B3.2: Tester - pane.lock relock test](./task-b3.2-tester-pane-lock-relock-test.md)

## Task Description
Make `otmux pane.lock` idempotent: calling it repeatedly with different titles should apply the new title without requiring a manual `otmux pane.unlock` between calls. Currently, relocking a pane with a different title silently fails because the existing lock hook prevents the title change.

## Context
hiveMind uses `otmux pane.lock` during agent bootstrap to set pane titles (e.g., "oosh-expert", "oosh-tester"). If an agent is re-bootstrapped or a pane is reassigned, the lock must be replaceable in a single call. Without idempotency, the caller must know whether a lock already exists and explicitly unlock first, which is fragile and error-prone.

Key file: `/Users/donges/oosh/otmux`

## Intention

### Why This Task Exists:
1. **Idempotent Operations:** Lock should be a "set to this value" operation, not "fail if already set"
2. **Robust Re-bootstrap:** Agent restart/reassignment must work without manual cleanup
3. **View-Layer Simplicity:** Callers should not need to track lock state

### Problems This Task Solves:
- **Silent relock failure:** Calling pane.lock on an already-locked pane silently keeps the old title
- **Manual unlock required:** Must call pane.unlock before pane.lock to change titles
- **Fragile bootstrap:** hiveMind must track lock state to avoid failures

### How This Task Solves These Problems:
- **Auto-unlock first:** pane.lock clears any prior hook before applying the new lock
- **Single-call contract:** One command sets the title, regardless of prior state
- **Verified with 3-step sequence:** lock -> relock different title -> verify new title applied

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
*Priority: 2 (HIGH - silently fails)*
