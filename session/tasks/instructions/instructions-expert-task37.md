# Expert: Implement Task 37 — Peer Context Monitoring

**Task file**: `/Users/Shared/Workspaces/AI/Claude/session/tasks/Task.37.peer-context-monitoring.md`
**Priority**: High

## What to Build

Three methods across two scripts:

### 1. `claudeCode context.read <pane>` (in `claudeCode` script)
- Capture pane output via `otmux pane.capture`
- Parse: `Context left until auto-compact: (\d+)%`
- Set RESULT to the percentage, or "above-threshold" if not present
- Return 0 on success

### 2. `claudeCode context.alert <pane> <threshold>` (in `claudeCode` script)
- Default threshold: 20%
- If below threshold: send message to the pane: "CONTEXT: {N}% — save state now"
- Log: `warn.log "Agent at $pane has $N% context remaining"`
- Return 0 if alert fired, 1 if context is fine

### 3. `scrumMaster measure.context <pane>` (in `scrumMaster` script)
- Integrate alongside existing measure.pane, measure.team, measure.subscription
- Store readings in ~/config/metrics/ with timestamps
- Track burn rate: compare consecutive readings to estimate time-to-compaction

## Implementation Notes
- Use `otmux pane.capture` not raw tmux
- Add Tab completion for all three methods
- Private helpers with `private.` prefix for parsing logic
- Follow OOSH conventions (RESULT, RETURN_VALUE)

## When Done
Commit and report: `Task 37 done`
