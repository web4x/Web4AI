# Test Results: process.lookup, process.list, live discovery
**Date**: 2026-03-03
**Agent**: hiveMind-tester
**Commit tested**: 6e25180 (process.lookup + process.list)

## Results Summary

| Section | Tests | Pass | Fail | Gated |
|---------|-------|------|------|-------|
| T-PROCESS (1-3,7-12) | 9 | 9 | 0 | 3 gated |
| T-PROCESS (4-6) | 3 | — | — | RUN_LIVE_TESTS |
| T-LIVE (1,3,4) | 3 | 3 | 0 | 4 gated |
| T-LIVE (2,5,6,7) | 4 | — | — | RUN_LIVE_TESTS |
| T-LIFECYCLE (1-3,5,6) | 6 | 6 | 0 | 1 gated |
| T-LIFECYCLE (4) | 1 | — | — | RUN_LIVE_TESTS |

## Verified Working (manual + automated)

- `hiveMind process.list hiveMindTeam02_03_26` — correct roles, UUIDs, pane targets
- `hiveMind process.lookup 80082` — correct pane, role, TTY, UUID
- `hiveMind team.status hiveMindTeam02_03_26` — tree output with live-discovered roles
- `hiveMind resolve hiveMind-tester hiveMindTeam02_03_26` → correct pane 0.1
- `hiveMind resolve hiveMind-expert hiveMindTeam02_03_26` → correct pane 0.0
- process.lookup rejects missing/bogus PIDs with exit code 1
- process.list filters by session correctly
- Completion functions exist for both methods

## Bugs Found

### BUG-D: registry.refresh uses `-a` (all sessions) at line 1668
Same as BUG-C but in `hiveMind.registry.refresh`. Uses `tmux list-panes -t "$session" -a` which probes ALL sessions, not just the specified one. The `session.probe` call sends `/status` to every Claude pane, disrupting live agents. **Fix**: change `-a` to `-s`.

### BUG-E: get.role.prompt hardcoded case — out of sync with role.list
`private.hiveMind.get.role.prompt` (line 58) is a hardcoded case statement with ~15 roles. `hiveMind role.list` reads from `.claude/agents/` and finds 80+ roles. Any role with a SKILL.md but no case entry can't be taught via `hiveMind teach`. The case statement should be replaced with dynamic SKILL.md lookup.

### BUG-F: No public method to set/remove registry entries
- `private.hiveMind.registry.set` and `private.hiveMind.pane.identify` are private
- No public `hiveMind registry.set` or `hiveMind registry.remove` command
- Registry corrections require either `registry.refresh` (which is broken per BUG-D) or manual file editing
- **Missing**: `hiveMind registry.set <pane> <role>` and `hiveMind registry.remove <pane>`

### BUG-G: Registry mismatch at hiveMindTeam02_03_26:0.1
Registry says `hiveMind-expert` but pane title and live discovery both say `hiveMind-tester`. Can't fix with hiveMind commands because `teach` rejects the role (BUG-E) and `registry.set` is private (BUG-F).

### DATA: Session names with boot prompt text
`backupTeam:0.0` session name = "You are the backup script expert. Read ." — boot prompt leaked. `live.discover` correctly rejects this (no `@` in name), but it means the session needs `/rename` to `backup-expert@opus`.

## Gating Rationale

Tests that scan live sessions (calling `claudeCode process.find` or `registry.refresh` across all panes) are gated behind `RUN_LIVE_TESTS=1` because:
1. `registry.refresh` sends `/status` to all panes (BUG-D)
2. Iterating all panes is slow (23 Claude instances × session lookups)
3. Prior incident: T-ALIGN test sent `/status` to my own pane, disrupting the session

Run with: `RUN_LIVE_TESTS=1 test.suite run hiveMind 1`
