# FEATURE: tronMonitor — OOSH script for TRON-monitor pane management

**From**: product-owner@opus (TRONinterface:0.0)
**To**: oosh-expert, oosh-tester
**Priority**: HIGH — Tron directive
**Date**: 2026-03-29

## Goal

Create a new OOSH script `tronMonitor` that makes the TRON-monitor pane (GNU screen inside tmux) a no-brainer to use. Currently, switching the monitor to show a different team requires knowing screen internals (`C-a c`, `TMUX= tmux attach -t <session> -r`). This script wraps all of that.

## Background

The TRON-monitor lives at `TRONinterface:0.3`. It runs GNU `screen` inside a tmux pane. Each screen window has a read-only tmux attach to a different team session. Tron flips between teams with `Ctrl-a 0/1/2` inside screen.

## Methods

### `tronMonitor setup <monitorPane>`
One-time setup: starts GNU screen in the given pane (default `TRONinterface:0.3`).

```bash
tronMonitor setup                    # uses TRONinterface:0.3
tronMonitor setup mySession:0.2      # custom pane
```

Steps:
1. Check if screen is already running in the pane (skip if so)
2. Send `screen` to the pane to start GNU screen
3. Store the monitorPane in config (`config set TRON_MONITOR_PANE <pane>`)

### `tronMonitor add <teamSession>`
Add a team session as a new screen window with read-only tmux attach.

```bash
tronMonitor add UpDown_ai_projectTeam
tronMonitor add hiveMindTeam02_03_26
```

Steps:
1. Read monitorPane from config (or default `TRONinterface:0.3`)
2. Create new screen window: send `C-a c` to monitorPane
3. Send: `TMUX= tmux attach -t <teamSession> -r` Enter
4. Info log which screen window number was created

### `tronMonitor switch <teamSession>`
Switch the monitor to show a specific team. If the team is already in a screen window, switch to it. If not, add it first.

```bash
tronMonitor switch UpDown_ai_projectTeam
tronMonitor switch hiveMindTeam02_03_26
```

Steps:
1. Check if teamSession already has a screen window (track in a config/env file)
2. If yes: send `C-a <windowNumber>` to monitorPane
3. If no: call `tronMonitor add <teamSession>` then switch to the new window

### `tronMonitor list`
Show which teams are in the monitor and which screen window number each has.

```bash
tronMonitor list
# 0: hiveMindTeam02_03_26
# 1: UpDown_ai_projectTeam
# 2: baseTeam
```

### `tronMonitor remove <teamSession>`
Remove a team's screen window from the monitor.

## Tab completion

```bash
tronMonitor add <TAB>         # list tmux sessions (otmux list)
tronMonitor switch <TAB>      # list teams currently in monitor
tronMonitor remove <TAB>      # list teams currently in monitor
tronMonitor setup <TAB>       # list panes (otmux pane.list)
```

## State tracking

Use a config env file: `~/config/tronMonitor.env`
```bash
# screenWindow|teamSession
0|hiveMindTeam02_03_26
1|UpDown_ai_projectTeam
2|baseTeam
```

## OOSH rules

- Create with `oo new tronMonitor`
- camelCase for ALL variables (monitorPane, teamSession, windowNumber)
- Positional args only, NEVER --flags
- Use OOSH wrappers: `otmux send`, `config set/get` — NEVER raw tmux
- All error messages must be human-readable sentences
- Tests must clean up after themselves

## Test requirements

oosh-tester must verify:
1. `setup` starts screen in a pane
2. `add` creates a screen window with read-only attach
3. `switch` changes to correct screen window
4. `list` shows tracked teams with window numbers
5. Completion works for all methods
6. Double-add same team doesn't create duplicate window
