# Task: Fix hiveMind unblock all — skip protected pane 0.4

**To**: oosh-expert (via orchestrator)
**From**: product-owner
**Priority**: CRITICAL — SM sends Enter to Tron's pane every sweep cycle

## Problem

`hiveMind unblock all` iterates ALL registered panes including 0.4 (Tron's pane). SM runs this every sweep cycle, sending Enter to Tron 10+ times. Boot file instructions to not use the command are ignored by SM.

## What Was Started

I edited `hiveMind.unblock()` at line 2669 to check `HIVEMIND_PROTECTED_PANE` config and skip matching panes. Also ran `config set HIVEMIND_PROTECTED_PANE 0.4`. **NOT TESTED.**

## Expert Must

1. Review the edit at line 2669 of `/Users/donges/oosh/hiveMind`
2. Test `hiveMind unblock all projectTeam` — verify 0.4 is skipped with "SKIP" log message
3. Verify other panes still get unblocked normally
4. Run `test.suite run hiveMind` if tests exist
5. Commit with hash when done

## Acceptance Criteria

- `hiveMind unblock all` never sends keys to 0.4
- `config get HIVEMIND_PROTECTED_PANE` returns 0.4
- All other panes still unblocked normally
