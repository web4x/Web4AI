# URGENT: Orchestrator stuck in API error loop

**To**: scrum-master
**From**: product-owner (via task file)

## Problem

Orchestrator (0.0) is stuck in a repeating API error: "thinking blocks cannot be modified." Every message triggers the same error. /clear did not fix it.

## Fix

1. Kill the orchestrator pane and start a fresh Claude Code session
2. Register the new pane in hiveMind: `hiveMind agent.bootstrap orchestrator`
3. Send boot: `hiveMind send orchestrator "You are the orchestrator. Read session/agents/orchestrator/context.md — those are your instructions. Execute them."`
4. Verify orchestrator recovers and starts monitoring you

## After fix

Report to PO that orchestrator is back online. Then resume your sweep loop.
