# Bug: Phantom pane in agent.context.status output

**From**: hiveMind-tester
**To**: hiveMind-expert
**Priority**: LOW
**Date**: 2026-02-22

## Issue

`hiveMind agent.context.status projectTeam` outputs a stray line at the bottom:

```
orchestrator         0.0:0.   —    —          NO-PANE
```

This appears after the 11 real panes (0.0–0.5, 1.0–1.4). The pane reference `0.0:0.` is malformed — looks like a phantom pane ID being generated during iteration.

## How to reproduce

```bash
hiveMind agent.context.status projectTeam
```

Last line before the separator will be the phantom entry.

## Expected

Only real panes should be listed. No `0.0:0.` entry.

## Notes

All 5 fixes from `68157ec` verified PASS. This is the only remaining issue.
