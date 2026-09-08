# Planning Templates & Know-How — scrum.pmo sprints/tasks/tests

*Draft by oosh-po@WODA.prod 2026-07-03 (learned the hard way on sprints@WODA.prod/sprint-1). Canonical source: `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/`. Purified by ARON 2026-08-07 (fresh-agent findings folded below); propagated to roles by the agent-trainer.*

## Purification — the 4 defects surfaced by the fresh-agent test (folded 2026-08-07)
TRON: "train a test agent from zero and see if he can plan." A blank agent trained ONLY on this doc + the sprint-0 example planned correctly (**6/6 rubric** — material is actionable-from-zero, the purity test passing) and surfaced 4 doc defects. Resolutions:
1. **Numbering scheme (rule vs example conflict).** §1 mandates zero-pad `task-<NN>`; the canonical example uses epic-letter `task-a1-…`. **Resolution: align to §1's zero-pad `task-<NN>`** — but a task-numbering convention is *strategic/team-wide*, so **planner/Tron ratify against `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/` before the example is rewritten** (surface-to-Tron, per [[consistency-by-construction]]).
2. **Sub-task ordering.** The example orders `.1 expert … .3 tester`, but §6 is scenario-first (tester writes cases BEFORE the expert implements). **Resolution: the example must order architect → tester → expert** (design → scenarios → implement); test cases live in the tester sub-task.
3. **Dangling `[[traceability-links]]`.** No such file exists. **Resolution: §4 repoints to [[dual-links]]** (the existing source) unless/until a dedicated traceability-links doc is created.
4. **`down` scope.** **Resolution: `down` lists top-level parent tasks only** — sub-tasks are reachable via their parent's `down` (state this explicitly in §1).
*(The literal §1/§4/§6 text edits are the planner's to apply against the authoritative sprint-0 source, guided by these resolutions; #1 pending ratification.)*

## 1. Structure
- **`planning.md`** per sprint: `[sprint:uuid:…]`, Sprint Goal, Machine scope, Naming Conventions, Team, Traceability (`down` → every task), Tasks table, QA workflow.
- **Parent task** `task-<NN>-<desc>.md`, own `[task:uuid:…]`.
- **Sub-tasks** `task-<NN>.<m>-<role>-<desc>.md` — **role in the filename** (`-architect-`/`-expert-`/`-tester-`), own a **distinct `[subtask:uuid:…]`** (TRON 2026-07-04 — distinct id, NOT `[task:uuid]`, for unambiguous cross-references at any depth). **Test cases live in the tester sub-task**, each `[test:uuid:…]`.
- When pre-planning a matrix of scenarios: each case is a **flat task** (no subtasks) if the operator asks for that.

## 2. Naming & numbering
- `task-<NN>-...` — **zero-pad single digits (01–09)** so they sort before 10+.
- Sub-tasks `task-<NN>.<m>-<role>-...`.

## 3. Status checklist — MACHINE-READABLE & WRITABLE, NEVER ANNOTATED (TRON 2026-07-04)
Checkboxes ONLY — no trailing text, no commits, no dates, **no comments**, no "(pending X)". Tooling reads AND WRITES this block, so anything but boxes breaks it. **Main tasks and sub-tasks use DIFFERENT status templates** (TRON ruling):

Main task (full pipeline):
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

Sub-task (a single-role PDCA leaf — flat; the pipeline substeps and the TRON QA/Done gate live on the PARENT, not the leaf):
```
## Status
- [ ] Planned
- [ ] In Progress
- [ ] Done
```

**History / who-did-what / commits / dates → a Deliverable or QA-record section, NEVER on or beside the status block.** The status block must stay machine-readable and updatable.

## 4. Two DIFFERENT link concepts (do not confuse)
- **Traceability links** (in-file `## Traceability`): bidirectional `up`/`down` — **written at BOTH ends** (parent's `down` ⇔ child's `up`; planning's `down` ⇔ task's `up`; a tester task `up`→ what it validates ⇔ that task `down`→ the tester). Relative markdown `[Title](./file.md)` + top breadcrumb `[Back to …](./planning.md)`. A one-sided link is broken. See [[traceability-links]].
- **Dual links** (chat/report/PDCA): every artifact reference in BOTH forms on one line — `[GitHub](https://…/blob/<branch>/path) | [relative/path](relative/path)`, GitHub first, **push before you give the link, verify it opens**. See `session/knowledge-base/dual-links.md`.

## 5. Task sections (from sprint-0)
breadcrumb · `# Task …` · `[task:uuid]` · (main:) Naming Conventions · Status · Deliverable (+ commit) · Traceability (Source · up · down) · Task Description · Context (key file) · Intention (Why This Task Exists / Problems It Solves / How It Solves Them) · footer (Sprint · Epic · Priority).

## 6. QA workflow (per task)
architect design → **PO sign-off** → tester writes cases (scenario-first, on disk) → expert implements + commits → tester runs + reports (measure-don't-assume) → **PO gate** on report + independent proof → **operator (TRON) final acceptance** → Done. QA acceptance can carry an explicit **acceptance criterion** (a gate task) — the Done box stays `[ ]` until met; the *why* goes in a note, not the status line.

## 7. Machine split
Host-specific sprints under `scrum.pmo/sprints@<host>/` (e.g. `sprints@WODA.prod/`, `sprints@MacStudio/`).
