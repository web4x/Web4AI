# Planning Templates & Know-How — scrum.pmo sprints/tasks/tests

*Draft by oosh-po@WODA.prod 2026-07-03 (learned the hard way on sprints@WODA.prod/sprint-1). Canonical source: `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/`. ⚠️ TO BE PURIFIED by ARON against the authoritative source; propagated to roles by the agent-trainer.*

## 1. Structure
- **`planning.md`** per sprint: `[sprint:uuid:…]`, Sprint Goal, Machine scope, Naming Conventions, Team, Traceability (`down` → every task), Tasks table, QA workflow.
- **Parent task** `task-<NN>-<desc>.md`, own `[task:uuid:…]`.
- **Sub-tasks** `task-<NN>.<m>-<role>-<desc>.md` — **role in the filename** (`-architect-`/`-expert-`/`-tester-`), own `[task:uuid:…]`. **Test cases live in the tester sub-task**, each `[test:uuid:…]`.
- When pre-planning a matrix of scenarios: each case is a **flat task** (no subtasks) if the operator asks for that.

## 2. Naming & numbering
- `task-<NN>-...` — **zero-pad single digits (01–09)** so they sort before 10+.
- Sub-tasks `task-<NN>.<m>-<role>-...`.

## 3. Status checklist — MACHINE-READABLE, NEVER ANNOTATED
The canonical list (main AND sub-tasks), checkboxes only — **no trailing text, no commits, no dates, no "(pending X)"**:
```
## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done
```
**History / who-did-what / commits / dates → go in the SUB-TASKS (or a Deliverable/QA-record section), NOT on the status line.** The status list must be machine-readable and updatable.

## 4. Two DIFFERENT link concepts (do not confuse)
- **Traceability links** (in-file `## Traceability`): bidirectional `up`/`down` — **written at BOTH ends** (parent's `down` ⇔ child's `up`; planning's `down` ⇔ task's `up`; a tester task `up`→ what it validates ⇔ that task `down`→ the tester). Relative markdown `[Title](./file.md)` + top breadcrumb `[Back to …](./planning.md)`. A one-sided link is broken. See [[traceability-links]].
- **Dual links** (chat/report/PDCA): every artifact reference in BOTH forms on one line — `[GitHub](https://…/blob/<branch>/path) | [relative/path](relative/path)`, GitHub first, **push before you give the link, verify it opens**. See `session/knowledge-base/dual-links.md`.

## 5. Task sections (from sprint-0)
breadcrumb · `# Task …` · `[task:uuid]` · (main:) Naming Conventions · Status · Deliverable (+ commit) · Traceability (Source · up · down) · Task Description · Context (key file) · Intention (Why This Task Exists / Problems It Solves / How It Solves Them) · footer (Sprint · Epic · Priority).

## 6. QA workflow (per task)
architect design → **PO sign-off** → tester writes cases (scenario-first, on disk) → expert implements + commits → tester runs + reports (measure-don't-assume) → **PO gate** on report + independent proof → **operator (TRON) final acceptance** → Done. QA acceptance can carry an explicit **acceptance criterion** (a gate task) — the Done box stays `[ ]` until met; the *why* goes in a note, not the status line.

## 7. Machine split
Host-specific sprints under `scrum.pmo/sprints@<host>/` (e.g. `sprints@WODA.prod/`, `sprints@MacStudio/`).
