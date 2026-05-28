# robbin-planner Learnings — 2026-05-24

## 1. Sprint Tool Path
The sprint tool is at `/Users/Shared/Workspaces/AI/Claude/components/OOSH/dev.claude/sprint` (not on PATH for this session). Must use full path with `SPRINT_PMO_DIR` env var pointing to the project's scrum.pmo directory.

## 2. Sprint Tool Parser Bug (Sprints 1-4)
Tasks in Sprints 1-4 use hierarchical checkbox format (`- [x] Done`), but the parser's `private.sprint.get.status()` only looks for `**Status:** DONE`. Results in 35 tasks falsely showing IN PROGRESS. Logged in `scrum.pmo/known-issues.md`.

## 3. Task Files Drift from Git Reality
Team works fast — commits land but task file checkboxes aren't updated. The planner role exists specifically to catch this drift. Always cross-reference `git log` with task file status checkboxes.

## 4. Only Commit scrum.pmo Files
Other files (src/, test/, data/, package.json) may be modified by the team. Only stage and commit scrum.pmo/ files and known-issues. Never touch source code.

## 5. Hotfixes Between Tasks
Version bumps happen between tracked tasks (e.g., v0.2.23 "remove file size limits" isn't a task but is a significant change). Document these as a "Hotfixes" subsection in planning.md under the relevant phase.

## 6. Web4Articles Compliance
Task files must have: Status checkboxes, Traceability section (up/down links), Acceptance Criteria (all checked when DONE), QA Audit section. The sprint audit tool checks all of these.

## 7. PO Corrections Take Priority
When PO sends corrections (e.g., "T57 is DONE, not QA REVIEW"), update immediately. PO has ground truth from Tron QA.

## 8. Report Concisely to PO
PO wants structured reports: what changed, what's clean, what remains. Use bullet lists, not paragraphs. Include version, test count, and task completion ratios.

## 9. QA Review + Done = Tron's Gate ONLY (CRITICAL)
NEVER check QA Review or Done checkboxes during sync. These are Tron's QA gate. A git commit proves IMPLEMENTATION is done (justifies In Progress impl steps: refinement/test cases/implementing/testing), but NOT QA approval. Tron QA approval is a SEPARATE explicit commit ("Sprint N QA approved by Tron"). I made this error in b85dfa8 — checked QA Review+Done on T74-T77 from impl commits alone. PO corrected: "the board must be HONEST." When syncing implemented-but-unapproved tasks: check impl steps, leave QA Review + Done UNCHECKED. Verify Tron approval via a dedicated approval commit before marking Done.

## 10. Verify Tron QA Approval via Commit
To confirm a sprint/task is Tron-QA-approved, grep git log for "Sprint N QA approved by Tron" or "QA approv". No such commit = not approved, regardless of impl commits.

## 11. CMM4 File-Based Communication (SM directive 2026-05-26)
Communicate through task files / scrum.pmo artifacts, NOT ad-hoc messages. Write findings, status, handoffs INTO the task file (it's the single source of truth). Read task files before asking questions. otmux/hiveMind messages = SHORT pointers only ("done, read <file>"), never long status dumps. Other agents follow this too — expert/architect write Measured Evidence + Root-Cause Findings sections directly into task files (e.g. S13 T91-T93). Respect their in-flight task-file edits; don't commit another role's uncommitted work.

## 13. Discoverability — sprints AND traceability artifacts must be navigable (PO directives 2026-05-26)
Whenever standing up a new sprint, add it to BOTH (a) the README.md "Individual sprints" list and (b) `scrum.pmo/sprints/sprints.overview.md` IN THE SAME COMMIT. Tron navigates via README/`/md/`; the list had stopped at S3 so S4-S14 were invisible. The durable index `sprints.overview.md` is the canonical sprint catalog. EXTENDED: traceability artifacts must ALSO be indexed under docs — README has a "## Traceability" section linking the matrix (`scrum.pmo/traceability-matrix.md`, the browsable req→uc→puml→method→test index), the standard, and the S1/S2-9 audits; keep these current. When the PO says "push" (or repo is ahead), `git push` so origin/GitHub is current — don't leave commits local-only.

## 12. Recurring: req-eng creates task files / structure ahead of planner
req-eng repeatedly creates task files (sometimes whole sprint dirs) in their own structure/numbering — caused T81/T83 collision, T90-misplacement, and a duplicate Sprint 13 (sprint-13-stability vs my sprint-13-core-workflow-fixes). Resolution pattern: req owns requirement CONTENT (real Tron quotes) so their files are authoritative; planner owns STRUCTURE — adopt req's content, remove my scaffold, add the missing planning.md + diagrams pointer + compliance sections, reconcile T-numbers. Always check `git status -s scrum.pmo/` for untracked sibling dirs/files each cycle.

## 14. Emoji-prefix readability pattern in planning.md (STANDING — Tron 2026-05-28)
Tron flagged: planning.md looked unprogressed because the single `[ ]` per task line only reflects Tron's Done gate (empty by design). FIX: add an at-a-glance emoji prefix to every task line in the task list. Standing pattern for every new sprint AND back-propagation:

**Legend block** — insert once at the top of the `## Task List` section of each planning.md:
> **Progress legend** (at-a-glance per task; `[ ]` stays = Tron's Done gate):
> ⏳ planned · 📝 designed (refinement-done) · 🔧 implementing · ✅ impl-shipped · 🧪 testing · 🏁 Tron-QA-done

**Per-task prefix** — `- [ ] <emoji> [Txx: Title](./task-xx-...)` where <emoji> reflects current state:
- ⏳ planned (no work started)
- 📝 designed (architect refinement done, awaiting impl)
- 🔧 implementing (impl in progress, not yet shipped)
- ✅ impl-shipped (impl committed, tester verification pending)
- 🧪 testing (tester verified PASS, awaiting Tron QA — OR verify task whose verify PASSED)
- 🏁 Tron-QA-done (Tron explicitly QA-approved via commit)

**Rules:**
- KEEP `[ ]` Done-gate semantic untouched — only flips to `[x]` on Tron's explicit "QA approved by Tron" commit.
- Apply to every NEW sprint at planning.md creation time.
- Maintain symbols on every monitoring cycle: when a task transitions state, update its prefix. Treat symbol drift as a sync target (📝→✅ on impl commit, ✅→🧪 on tester PASS, 🧪→🏁 on Tron QA).
- Sprint Totals lines should match the symbol counts.
- First applied: ecce49e (S10-S16 sweep). Initial application to S16 in a0df3f8.
