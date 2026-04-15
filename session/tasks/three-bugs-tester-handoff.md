# Tester Handoff: Three hiveMind Bug Fixes

**From**: oosh-expert (UpDown_ai_projectTeam:0.1)
**To**: oosh-tester
**Date**: 2026-04-15
**Plan**: `/Users/donges/.claude/plans/concurrent-finding-blossom.md`
**Commit**: pending (will update below)

## What I fixed

### Bug 1 — `hiveMind resolve` returned wrong team
Root cause: `private.hiveMind.active.team` returned a stale session name (from a ghost `__test_hm_XXXXX` entry in `hivemind.active.team`) without validating it exists in tmux. With the stale session unknown, registry lookups fell through to a cross-session `grep -i` that returned the first match by file order — not the active team.

Fix (`hiveMind`):
- `private.hiveMind.active.team` now validates each candidate with `otmux has` before returning it; stale entries are skipped transparently.
- `hiveMind.resolve` added a second preferred scope: when `$TMUX` is set and no explicit session was given, we also try the caller's current tmux session before the cross-team fallback.
- Added `debug.log` per scope so future mis-resolutions show which scope produced the match.

### Bug 2 — `team.monitor <session> <agentName>` failed with `tail: invalid option`
Root cause: signature was `<?session> <?lines:30>` — passing an agent name made it the `lines` arg for `otmux pane.capture`, which calls `tail -n` underneath.

Fix (`hiveMind`):
- New signature: `<?session> <?agentName> <?lines:30>`.
- `$2` type-dispatched: all-digits → `lines` (preserves existing callers); else → agent filter, `$3` becomes `lines`.
- Filter validation uses BOTH the return code AND a regex on the pane-address format, because `error.log` writes to stdout — a raw `[ -z "$filterTarget" ]` would have been fooled by the error string.
- Added completions: `.completion.session` (teams), `.completion.agentName` (roles).

### Bug 3 — `teams.save` recorded stale pane title as role
Root cause: the fallback cascade fired too easily (`role == "unknown"` triggered the pane-title path), and the fallback also duplicated the cleanup logic already in `private.hiveMind.role.fromTitle`.

Fix (`hiveMind`):
- Cascade reduced to: `live.discover` → `registry.get` → `role.fromTitle` → `"unknown"`.
- All inline prefix/@model/whitespace stripping removed (was 5 lines of duplicate work).
- Live verification on MacStudio: `projectTeam:0.4` now records `oosh-tester` (the customTitle from `/rename`) instead of the stale `agent-trainer` pane title. `UpDown_ai_po:0.0` records `product-owner` instead of `master-product-owner@opus1m` (which was the pane title).

## Test scaffolding added

Inserted into `test/test.hiveMind` just after the T-SNAP block (my earlier snapshot tests). All grep-based code assertions — no live-pane dependencies.

| Test | Asserts |
|------|---------|
| T-RESOLVE-ACTIVE | `active.team` ignores stale `hivemind.active.team` entries |
| T-RESOLVE-SCOPE | `resolve` emits `debug.log "resolve:"` lines per scope |
| T-TEAM-MONITOR-FILTER (signature) | function signature declares `<?session> <?agentName> <?lines>` |
| T-TEAM-MONITOR-FILTER (numeric) | numeric `$2` back-compat path present |
| T-TEAM-MONITOR-FILTER (validation) | filter uses both rc and pane-address regex |
| T-SAVE-CUSTOMTITLE (cascade) | live → registry → role.fromTitle → "unknown", NO raw `${title}` |
| T-SAVE-CUSTOMTITLE (DRY) | zero inline prefix/@model strips in `teams.save` |

## What YOU (tester) should do

1. Review my scaffolding in `test.hiveMind` near the "three-bug-fix regression tests" banner — tighten wording or strengthen assertions if too implementation-locked.
2. **Add live tests I could not fully do grep-based**:
   - A live `hiveMind resolve <role>` test when the role is registered in BOTH `projectTeam` and `UpDown_ai_projectTeam` — verify active-team wins, and reversing active also works.
   - A live `hiveMind team.monitor <session> <agent>` test that actually captures one pane (you'll need a stable test session with ≥2 panes).
3. Run `test.suite run hiveMind 1` — report numbers back to me.
4. Optional: a fixture test that stubs a JSONL with a known `customTitle` and verifies `teams.save` records it over a manipulated pane title.

## DRY opportunities I noticed (not fixed — for followup)

- `registry.find` session-scoped path (line 482) grep pattern `^${session}:` does not distinguish between `UpDown_ai_projectTeam:0.1` and `UpDown_ai_projectTeam_extra:0.1` — the current colon anchor is sufficient here but brittle for a future pane with colon in its session name. Probably fine. Flag only.
- `resolve.alias` is a case statement hard-coding `agent-teacher → orchestrator`. If alias table grows, move to `$CONFIG_PATH/hivemind.aliases.env` with the same pattern as roles.env.
