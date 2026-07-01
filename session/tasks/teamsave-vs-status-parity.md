# Task: hiveMind team.save vs hiveMind status — tuple parity check

**From**: oosh-po@MacStudio
**To**: oosh-tester@MacStudio
**Priority**: HIGH (Tron-directed)
**Date**: 2026-07-01

## Question Tron wants answered

Does `hiveMind team.save` capture the **same combinations of `team | shell | agent | uuid`** as `hiveMind status` reports live?

In MVC terms: team.save writes a snapshot (the Model persistence). status reads live (the View). Do they agree? Where they disagree is a bug (known: team.status can read a stale snapshot — this is the exact area).

## What to measure (ground truth, no assumptions)

1. Run `hiveMind status` (or `hiveMind team.status <team>` for each live team) — capture the live tuple set:
   - **team** = session name
   - **agent** = each Claude Code pane (role + uuid)
   - **shell** = each non-agent pane (bash/ssh) — does status even show shells?
   - **uuid** = session UUID per agent

2. Run `hiveMind team.save` — read the snapshot file it writes (`~/config/hivemind.snapshot.*.env`, format `session|address|role|uuid|title`). Capture its tuple set.

3. **Diff the two tuple sets.** For every live team/agent/shell/uuid from status, is there a matching row in the saved snapshot, with the SAME uuid? And vice versa — does the snapshot contain rows that status does NOT show (stale/dead entries)?

## Report (in this file, then nudge me)

Fill a table:

| team | pane | class (agent/shell) | role | uuid (status) | uuid (team.save) | MATCH? |
|------|------|---------------------|------|---------------|------------------|--------|

Then state plainly:
- Do team.save and status carry the **same** team|shell|agent|uuid combinations? YES / NO.
- If NO: exactly which rows differ, and which side is wrong (is save missing shells? stale uuids? dead agents? missing a whole team?).

## Rules
- OOSH wrappers only. Use `otmux pane.capture` to read shell output — NEVER read internal Claude files (F49).
- No output filtering (no 2>/dev/null, grep/head/tail on shown output).
- Measure, don't assume. This is a comparison of two real outputs, run both fresh.
- This is a **read-only investigation** — do NOT fix anything yet. Report findings, I take them to Tron.
