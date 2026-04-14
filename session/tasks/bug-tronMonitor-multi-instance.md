# BUG: tronMonitor cannot run multiple instances on same machine

**From**: product-owner@opus (TRONinterface:0.0)
**To**: oosh-expert, oosh-tester
**Priority**: HIGH
**Date**: 2026-03-30

## Problem

tronMonitor uses global state — one screen name (`tronMon`), one env file (`tronMonitor.env`), one config key (`TRON_MONITOR_PANE`). When a second PO runs `tronMonitor setup UpDown_ai_po:0.3`, setup sees `tronMon` already exists and returns early without starting screen in the new pane.

## Root cause

All these are global singletons:
- `TRON_MONITOR_SCREEN=tronMon` — one screen name for all
- `TRON_MONITOR_ENV=~/config/tronMonitor.env` — shared window registry
- `TRON_MONITOR_PANE` config key — only stores one pane

## Required fix

Each monitor instance must be keyed by its pane. Derive unique names from the session:

```bash
# Example: pane = UpDown_ai_po:0.3
# Screen name: tronMon_UpDown_ai_po
# Env file: ~/config/tronMonitor.UpDown_ai_po.env
```

### Changes needed in tronMonitor:

1. **setup()**: Accept monitorPane, derive screen name from session part of pane. Start screen in that specific pane. Store per-instance config.

2. **All methods (add, switch, remove, list, verify, reset)**: Must know WHICH monitor instance to operate on. Either:
   - Accept an optional `monitorPane` param, OR
   - Use a "current instance" from config that gets set by `setup`

3. **private helpers**: `fullScreenName()`, `findWindow()`, `nextWindow()` must all be instance-aware.

4. **hiveMind hook**: `private.hiveMind.monitor.switch` must know which monitor instance to switch. Use the config-stored pane.

## Test plan

1. `tronMonitor setup TRONinterface:0.3` — starts screen tronMon_TRONinterface in pane 0.3
2. `tronMonitor setup UpDown_ai_po:0.3` — starts SEPARATE screen tronMon_UpDown_ai_po in pane 0.3
3. Both can add/switch teams independently
4. `tronMonitor list` shows the current instance's teams
5. hiveMind auto-switch targets the right instance

## OOSH rules
- camelCase, positional args, OOSH wrappers only
- Tab completion on all params
