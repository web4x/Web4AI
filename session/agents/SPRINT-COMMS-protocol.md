# Sprint-Task Communication Protocol (CMM4) — how the team communicates work

**For every agent. Read on boot. The channel IS the sprint file; the medium IS git.**

## The single source of truth
- **ONE `scrum.pmo/sprints/<sprint>/planning.md` per sprint.** It holds: epic, dogfood acceptance, and STORIES — each with `Status`, `Owner`, and an inline `report-back` line. Stories live IN the sprint, not scattered across task files. Legacy task files cross-reference INTO the relevant sprint story.

## The channel = git mailbox (durable, not flaky sends)
- **Owner → reports** by editing the story's report-back line (commit hash + measured result) → `git add` → `commit` → **`git push`**. That IS the report. NEVER rely on a chat send for a report.
- **Nudge** = ONE line only: "Read sprint-<x> S-N" or "S-N ready for QA". Never paste content into the message.
- **PO/SM pull** on every turn + at QA gates. SM relays status via its tick commits. No message is "delivered" until it's pulled — keep commits small and pushed often.

## Status lifecycle (PO ticks as commits land — the living truth)
`PLANNED → IN PROGRESS → BLOCKED(why) → QA → DONE`. A story is DONE only when its test is GREEN and the PO (or guardian) has QA-signed-off in the report-back line.

## Measure, never assume (CMM4 feedback)
- **Truth-sources**: claude PROCESS ARGS (`--resume uuid`) for the resumed session; the live PANE FOOTER for the current customTitle. NEVER trust `session.id` or a JSONL `customTitle` grep — they lag/mis-resolve and will lie to you.
- Each story shows commits + status so velocity is visible. Report MEASURED results (hash + what you measured), not "should be done".

## Cadence
After each MAJOR task: all agents save context+learnings → agent-trainer rewinds. SM coordinates; PO assigns; agents report-back in the file.

## Why
Scattered task files + flaky sends = lost messages, stale status, re-work. ONE sprint file + git mailbox + measured status = deterministic (CMM3) and self-improving (CMM4). Wer schreibt, der bleibt.
