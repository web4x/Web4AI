# Base Skill: Sprint Planning — every task/sprint is born template-compliant (MANDATORY — all agents)

*TRON 2026-07-16: "none of the tasks comply to sprint planning templates … planning is not a skill they have — that needs to be done by the agent trainer." Measured root cause: no planning base-skill; only 2/93 SKILLs referenced the template; `planning-templates.md` was an orphan. This is the fleet skill that fixes it.*

## The rule (unambiguous, MANDATORY)
**Any task, sub-task, or sprint you create or edit MUST follow the canonical templates. A non-compliant artifact is REJECTED regardless of how good its content is.** Correct-by-construction: start from the template, don't retrofit.

## Canonical sources — REFERENCE, never duplicate (DRY)
Do NOT restate these here or in your SKILL — read and follow them:
- **The rules & know-how:** `session/knowledge-base/planning-templates.md` — structure, zero-pad numbering, MACHINE-READABLE status (never annotated — history lives in sub-tasks), traceability-links (bidirectional up/down, both ends) vs dual-links, role-prefixed sub-tasks (tests in the tester sub-task), QA workflow, host-split.
- **The fill-in templates:** `scrum.pmo/sprints@<host>/templates/` — `task-template.md`, `subtask-template.md` (+ `planning-template.md` where present). Copy the template, fill it; never author a task file from scratch.

## The non-negotiables (quick recall — detail is in `planning-templates.md`, don't restate)
- `planning.md` per sprint (`[sprint:uuid]`, goal, traceability `down`→every task, QA workflow); parent `task-<NN>-*.md` (zero-pad 01–09); role-prefixed sub-tasks `task-<NN>.<m>-<role>-*.md`; **test cases live in the tester sub-task**.
- **Status block is machine-readable** — checkboxes only, no trailing text/commits/dates; put history/commits in a Deliverable/sub-task, never on the status line.
- **Traceability links** (in-file `up`/`down`, written at BOTH ends) are NOT dual-links (`[GitHub](url) | [local](path)`, chat/report only) — keep them distinct.
- Only TRON authorizes a NEW sprint number; new work goes into an existing sprint's backlog.

## Self-check before you commit any task/sprint
Filename zero-padded + role in sub-task name · `[task:uuid]`/`[test:uuid]` present · status block clean (no annotations) · traceability closed at both ends · built from the template, not from scratch. If any fail → fix before commit (a non-compliant task is rejected).

*Single source. Your SKILL only carries a one-line REFERENCE to this file + the mandatory rule — never a copy.*
