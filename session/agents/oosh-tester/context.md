# OOSH Tester Agent — Session Context

**Updated**: 2026-06-22
**Role**: oosh-tester
**Pane**: ooshTeam:0.3
**macOS Shell**: ooshTeam:0.4
**Termux Shell**: ooshTeam:0.5 (samsungTablet)
**WODA.test Shell**: ooshTeam:0.5 (also SSH to WODA.test)
**Machine**: MacStudio.native
**Branch**: test/macos.latest

## Current Task
Verifying expert fixes from bugs-agent-restore-process.md and new features.

### Completed this session (2026-06-21 → 2026-06-22)
- **#5 claudeCode.stop** (b904be5): T-STOP 6/6 GREEN (ee590cd) — kill PID + respawn cooked mode
- **#7 otmux send.zoomed** (516ebb3): T-ZOOM 7/7 GREEN (724123e) — balanced zoom/unzoom, live flag test
- **this-dispatch** (12100f8): T-THIS-DISPATCH 7/7 GREEN (ea63801) — private+unknown method clean errors
- **DURING_REWIND** (80fdbd8): T-REWIND-STATE 11/11 GREEN (efbdc5e) — state set/get/clear, send rc=3, sweep override
- **c2 completion** (33da219): T-COMPLETION 7/7 GREEN (8374cc5) — ''' corruption + interactive loop both fixed

### Prior session work (carried forward)
- claudeCode list/discovery: ✅ DELIVERED
- hiveMind audit bugs #2/#3/#4/#5: ✅ VERIFIED
- hiveMind panes/list/DRY/UUID: all verified earlier sessions

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
- hiveMind test suite too slow at fleet scale (~2hr with 80 panes)
- test.hiveMind line 1600 arithmetic error (T-DRY section) blocks filtered runs

## Recovery Steps
1. Read this file + learnings.md
2. Check PO (ooshTeam:0.0) for priorities
3. Check session/tasks/bugs-agent-restore-process.md for open items
4. Run filtered tests via `test.suite run <script> 1 <T-filter>`
