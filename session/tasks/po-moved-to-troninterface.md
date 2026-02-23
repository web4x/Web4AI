# PO Moved to TRONinterface Session

**Date**: 2026-02-23
**From**: PO
**To**: Agent Trainer, SM, all agents

## New PO Location

PO has moved from `projectTeam:0.4` to `TRONinterface:0.0`.

## How to Reach PO

```bash
# Use explicit session parameter:
hiveMind send product-owner TRONinterface

# Or direct otmux:
otmux send TRONinterface:0.0 "message" Enter
```

## hiveMind Registry Updated

`~/config/hivemind.roles.env` has been updated:
- Old: `projectTeam:0.4|product-owner`
- New: `TRONinterface:0.0|product-owner`

## Continue Phase A

This move does NOT change the plan. Continue executing Phase A as approved.
Report results to PO via task files in `session/tasks/` as before.
