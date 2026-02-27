# Test Results: hiveMind Identity Consistency Tests

**Tester**: hiveMind-tester
**Date**: 2026-02-27
**Test file**: `test/test.hiveMind` (7 new T-CONSIST tests added)

## Summary

87 test cases, 89 assertions: **58 PASS, 31 FAIL**

Pre-existing tests: 31 cases, 27 PASS, 4 FAIL (2 known: cursorOrchestrator completion, symlink path)
New consistency tests: 56 cases, 31 PASS, 27 FAIL (all expected — detecting known bugs)

## Consistency Test Results

| Test | Description | Result | Detail |
|------|-------------|--------|--------|
| T-CONSIST-1 | team.context.status shows ALL panes | **PASS** | 4/4 panes on baseTeam |
| T-CONSIST-2 | No raw tmux in team.context.status | **PASS** | 0 raw tmux calls |
| T-CONSIST-3 | Registry role names valid | **24 FAIL** | 5 garbage (boot prompt text), 19 orphan (path resolution issue — see note) |
| T-CONSIST-4 | Registry panes exist in tmux | **PASS** | 24/24 panes exist |
| T-CONSIST-5 | Pane titles match registry | **3 FAIL** | All baseTeam titles mismatch — Claude TUI overwrites pane titles |
| T-CONSIST-6 | team.status agrees with team.context.status | **PASS** | Both show 4 agents |
| T-CONSIST-7 | registry.set validates role names | **PASS** | Rejects garbage, accepts valid |

## Confirmed Bugs

### Bug 4: Registry has boot prompt text as role names
5 entries have garbage role names (>30 chars or spaces):
- `hiveMindTeam:0.0` → `Read .claude/agents/hiveMind-expert/SKIL...`
- `hiveMindTeam:0.1` → `Read .claude/agents/hiveMind-tester/SKIL...`
- `odockerTeam:0.0` → `Read session/agents/odocker-expert/boot....`
- `projectTeam:0.3` → `You are oosh-expert on projectTeam:0.1. ...`
- `projectTeam:0.4` → `You are oosh-tester on projectTeam:0.2. ...`
- `projectTeam:1.0` → `You are the woda-writer on pane projectT...`
- `projectTeam:1.1` → `You are the woda-scribe on pane projectT...`

**registry.set validation (Bug 4 fix) is working** — T-CONSIST-7 PASS. But existing garbage entries need cleanup.

### Bug 5: Pane titles drift from registry
All 3 baseTeam panes show mismatched titles:
- `baseTeam:0.0`: title=`agent-trainer.26.2.26`, registry=`oosh-expert`
- `baseTeam:0.1`: title=`McDonges-4.fritz.box`, registry=`oosh-expert`
- `baseTeam:0.2`: title=`oosh-expert@opus.26.02.26`, registry=`oosh-tester`

Claude TUI overwrites pane titles with session name format `role@model.date`.

## Notes

### T-CONSIST-3 ORPHAN false positives
19 entries show as ORPHAN because `WORKSPACE_ROOT` resolves via symlink target. The roles DO exist in `/Users/Shared/Workspaces/AI/Claude/.claude/agents/`. Fixed in test: now uses `HIVEMIND_AGENTS_DIR` as primary path. Re-run after fix will show fewer false positives.

### T-CONSIST-2 sed fix
macOS `head -n -1` doesn't work. Fixed to use `awk` + line numbers for function body extraction.

## Next Steps

1. **hiveMind-expert**: Run `registry.refresh` or `registry.fix` to clean garbage entries
2. **hiveMind-expert**: Investigate pane title overwrite by Claude TUI — can `pane.identify` re-set after startup?
3. **Re-run tests** after registry cleanup to get true baseline
