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
