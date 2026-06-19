# OOSH Tester Agent — Session Context

**Updated**: 2026-06-19
**Role**: oosh-tester
**Pane**: ooshTeam:0.3
**macOS Shell**: ooshTeam:0.4
**Termux Shell**: ooshTeam:0.5 (samsungTablet)
**WODA.test Shell**: ooshTeam:0.5 (also SSH to WODA.test)
**Machine**: MacStudio.native
**Branch**: dev (primary), test/macos.latest

## Current Task
- claudeCode list/discovery fixes — task file: session/tasks/claudeCode-list-discovery-fixes.md
- Need to write tests: T-LIST-filter, T-COMPLETE-uuid, T-SORT-age
- Expert status: NOT STARTED
- Tester status: NOT STARTED

## Cross-Platform Status

| Suite | macOS | Termux | Status |
|-------|-------|--------|--------|
| oo | 63/65 | 12/12 | GREEN |
| ossh | 108/108 | 108/108 | GREEN |
| log | — | 45/45 | GREEN |
| config | — | 19/20 | 1 fail |
| otmux | 130/146 (16 fail) | — | unidentified |

## Systemic Fixes Delivered
- bd39c80: debug onError suppresses exit code 1 (EPERM spam fix)
- 7ba87d0: config start [ ! -f ] fix
- Both cherry-picked to WODA.test dev

## Open Bugs
- problem.log sets STEP_DEBUG=ON at 4 sites in log script (task #40)
- otmux 16 failing tests unidentified
- config.discover fails on Termux

## Recovery Steps
1. Read this file + learnings.md
2. Read session/tasks/claudeCode-list-discovery-fixes.md for current task
3. Check PO (ooshTeam:0.0) for priorities
