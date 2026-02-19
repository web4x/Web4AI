# OOSH Expert Agent Context

**Session**: oosh-expert@opus
**Role**: oosh-expert
**Pane**: projectTeam:0.1
**Updated**: 2026-02-18T22:15Z
**State**: standing down — conserving subscription (61% session, 69% weekly)

## CURRENT GOAL
Standing down per PO directive. No active work.

## COMPLETED WORK (40 items)
- Items 1-37: see prior context saves
- 38. **Commit d9ca38e** (oosh/hannes-v2) — Fix hiveMind team.status output: aligned columns with printf (22-char role names), suppressed meaningless "— 0" detail for accept-edits, added [protected] marker for pane 0.4, fixed summary mode bug (was parsing formatted team.list output as team names). 33/33 tests pass.
- 39. **Commit 91eba78** (oosh/hannes-v2) — Fix scrumMaster subscription timezone: convert API UTC times to Berlin local via epoch. Output "16:00-21:00 Berlin (ACTIVE)" instead of UTC.
- 40. **Commit 9e0d9ea** (oosh/hannes-v2) — CRITICAL: scrumMaster subscription reads ~/.claude/rate-limit-cache.json (same as TUI footer) instead of ccusage. Shows real session/weekly % used, reset times in Berlin, CMM4 velocity alerts. Before: "Alert: OK" at 92%. After: correct alerts.

## NO UNCOMMITTED CHANGES
All pushed: oosh to origin/hannes-v2.

## KEY KNOWLEDGE
- Context path: `session/agents/oosh-expert/context.md` (subdirectory)
- Registry at `~/config/hivemind.roles.env` (NOT /tmp/hivemind.roles)
- OOSH on PATH — no export needed
- Pane 0.4 = Tron — NEVER touch. HIVEMIND_PROTECTED_PANE needs to be in ~/config/oosh.env
- `config get` hangs in subprocess — read oosh.env directly with sed
- `grep -oP` not available on macOS — use sed instead
- `source hiveMind` hangs (hiveMind.start runs on source) — run as command instead
- Claude Code rate-limit-cache: `~/.claude/rate-limit-cache.json` — session5h (fraction remaining), weekly7d, reset5h (epoch), reset7d (epoch)
- macOS date timezone: TZ=UTC date -jf "%Y-%m-%dT%H:%M:%S" "$ts" "+%s" → TZ=Europe/Berlin date -r $epoch "+%H:%M"

## RECOVERY STEPS
1. Read this context file
2. Check session/tasks/ for new work
