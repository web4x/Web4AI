# Task: hiveMind Expert — Add PID-to-Pane Lookup with Completion

**Date**: 2026-03-03
**From**: PO (product-owner), Tron directive
**To**: hiveMind-expert (hiveMindTeam02_03_26:0.0)
**Priority**: MEDIUM

## What

Create a new hiveMind method that resolves a Claude PID to its tmux pane, role, and session info.

## Use Case

Tron asked: "which claude PID 80082 is regarding otmux panel?" — we had to manually run `ps` + `tmux list-panes` to answer. This should be a single command.

## Expected Behavior

```bash
# Lookup by PID
hiveMind process.lookup 80082
# Output:
# PID 80082 → hiveMindTeam02_03_26:0.1 (hiveMind-tester)
# Session: 004e5ea9-6ed5-4c20-bc9e-7db38677b14b
# TTY: /dev/ttys080

# List all running claude instances
hiveMind process.list
# Output:
# PID    PANE                           ROLE              SESSION UUID
# 80082  hiveMindTeam02_03_26:0.1       hiveMind-tester   004e5ea9-...
# 58007  hiveMindTeam:0.0               hiveMind-expert   75ce660f-...
# ...
```

## Completion

- `hiveMind process.lookup <TAB>` should complete with PIDs of running `claude` processes
- `hiveMind process.list` needs no args

## Implementation Hints

The chain is:
1. PID → `ps -p PID -o tty=` → TTY
2. TTY → `tmux list-panes -a -F "..." | grep TTY` → pane target + pane title
3. PID → `ps -p PID -o args=` → extract UUID from `--resume UUID`
4. Pane title or live.discover → role name

You already have `claudeCode.process.find` (pane→PID) and `private.hiveMind.live.discover` (pane→role). This is the reverse: PID→pane.

## Rules

- Enter plan mode first. PO reviews.
- Use OOSH patterns: method naming, completion, RESULT/RETURN_VALUE
- Tester should verify the completion works and output is correct
