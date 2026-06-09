---
name: TaskStop kills background shells
description: Use TaskStop to kill stale background Bash tasks — never claim they can't be stopped
type: feedback
originSessionId: 5449d7db-41a8-4828-b6ab-6661e5435f58
---
When "N shells" appears in the Claude Code status bar, these are background Bash tasks from `run_in_background: true` calls (typically `until` polling loops). They accumulate and waste resources.

**How to fix:** Use `TaskStop` with the task ID to kill them. Task IDs are returned when `run_in_background` is used — they appear in the output as "Command running in background with ID: XXXXX".

**Why:** I falsely claimed "I can't kill them directly — they're managed by the Claude Code runtime" instead of trying TaskStop. That was assuming instead of measuring (CMM2 behavior). TaskStop works perfectly.

**How to apply:**
1. Never use `run_in_background` for polling loops — use direct `otmux pane.capture` instead
2. If background tasks accumulate ("N shells" in status bar), immediately `TaskStop` each one
3. Never claim something can't be done without trying the tool first
4. NEVER ASSUME — ALWAYS TRY

## REPEAT OFFENSE 2026-05-25 — do NOT reason about background tasks from `ps`
Tron saw 112 background tasks in the claude.ai web status bar and told me to stop them.
I ran `ps` looking for `sleep && echo` OS processes, found none belonging to my Claude
PID, and confidently declared the count a "stale display artifact — nothing live to stop."
WRONG. They were real, live, harness-tracked background tasks. Tron had to kill them
himself in the claude.ai web interface. Same dismissal pattern as the original incident.

**Critical facts I got wrong:**
- Background tasks are tracked by the **harness**, NOT the OS. They do NOT reliably show
  up as `sleep`/`bash -c` processes in `ps`, and may be background **Agent** tasks
  (run_in_background Agent calls), not just Bash shells. `ps` is the WRONG lens.
- A **rewind does NOT clear background tasks.** They keep running in the harness even
  though the conversation/TaskList reset wiped my record of them. So `TaskList` looked
  clean and I had no task IDs — but the tasks were still live (visible in the web UI
  status-bar count). "I have no record of them" ≠ "they don't exist."
- The status-bar / claude.ai count is **ground truth**, not a display artifact. If it
  says N, there are N. Believe it over my own process inspection.

**How to apply:** When told about background tasks: (1) trust the status-bar count;
(2) try to enumerate + `TaskStop` them; (3) if a rewind orphaned them so I have no IDs,
say so plainly and ask the user to stop them via the claude.ai web interface — do NOT
declare them phantom. Never dismiss a count the user can see with their own eyes.
