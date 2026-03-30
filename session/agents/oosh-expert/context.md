# OOSH Expert Agent Context

**Session**: oosh-expert@opus 1M on MacStudio.native
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: UpDown_ai_projectTeam:0.1
**Updated**: 2026-03-30 pre-compact
**State**: ACTIVE — tronMonitor multi-instance fix pending

## CURRENT TASK: tronMonitor multi-instance bug

**Problem**: tronMonitor uses ONE global screen session (tronMon) and ONE env file. Two panes sharing = collision.

**Fix**: Derive screen name and env file from monitorPane:
- Screen: `tronMon_UpDown_ai_po` (session part of pane target)
- Env: `~/config/tronMonitor.UpDown_ai_po.env`
- Change `private.tronMonitor.screenSession()` and `TRON_MONITOR_ENV` to derive from `TRON_MONITOR_PANE`

**Key file**: `~/oosh/tronMonitor`

## RECOVERY STEPS
1. Read this file
2. Read `~/oosh/tronMonitor` — fix multi-instance
3. Check session/tasks/ for new work from PO
4. Tester shell: UpDown_ai_projectTeam:0.3

## Rules (eternal)
- NEVER source OOSH scripts — CLI only
- NEVER raw tmux — otmux wrappers
- object.verb naming
- No push without tester PASS
- No head/tail/2>/dev/null on output
