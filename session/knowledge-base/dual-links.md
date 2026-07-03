# Dual Links — bidirectional traceability in scrum.pmo tasks/tests

*Purified by ARON 2026-07-03 from the correct source (`scrum.pmo/sprints/sprint-0-lifecycle-consolidation/`). Actionable first-principle.*

## The one rule
**A link is DUAL: it is written at BOTH ends.** For every relationship A→B, A's file names B *and* B's file names A. A link that exists on only one side is broken (unwalkable, invisible — like a stale pin). "Dual links" = every traceability edge is bidirectional.

## Format (exact — copy this)
Every task/test file has a `## Traceability` section with `up` and `down` bullet lists of **relative markdown links** `[Title](./file.md)`, plus a breadcrumb at the very top:
```
[Back to Planning Sprint N](./planning.md)
...
## Traceability
- Source: Sprint N - <name>, Epic <X>
  - up
    - [Sprint N Planning](./planning.md)          # or the parent task
  - down
    - [Task A1.1: Expert - ...](./task-a1.1-....md)
    - [Task A1.3: Tester - ...](./task-a1.3-....md)
```

## Who links to whom (both directions)
| File | `up` (parents) | `down` (children) |
|------|----------------|-------------------|
| **planning.md** | (sprint index / TRON directive) | every task in the sprint |
| **Parent task** `A1` | `./planning.md` | each subtask `A1.1, A1.2, A1.3` |
| **Child task** `A1.1` (expert) | `./task-a1.md` (its parent) | None (leaf) — or its own subtasks |
| **Test-case task** `A1.3` (tester) | `./task-a1.md` (the task it validates) | None (leaf) |

**The dual check:** parent's `down` list contains A1.1 **⇔** A1.1's `up` list contains the parent. Both, or it's not a link. Same for planning↔task. A tester task links `up` to the task it tests, and that task lists the tester task in its `down` — the test and the thing-under-test reference each other.

## How to rebuild wrong tasks (oosh-po's case)
1. Give every task a top breadcrumb `[Back to Planning Sprint N](./planning.md)`.
2. Add `## Traceability` with `up`/`down`.
3. Each subtask `up` → its parent; each parent `down` → all its subtasks; planning `down` → all tasks; each task `up` → planning.
4. Each tester/test-case task `up` → the task (or requirement) it validates; that task's `down` → the tester task.
5. **Verify duality:** walk every link — if the far end doesn't link back, the link is broken; fix both ends.
