# Log Metrics — Action Checklist

**Automated**: `hiveMind metrics.log` + `hiveMind metrics.summary` — CMM3

## SM: After Each Sweep
1. Run `hiveMind dashboard` (or manual pane captures if dashboard broken)
2. Append row to `session/metrics/sweep-log.md` per agent: time, context %, tokens, state
3. Flag: context > 80% → alert agent to save state
4. Flag: subscription > 80% → notify orchestrator to throttle team

## Scribe: Hourly Summary
1. Read `session/metrics/sweep-log.md` tail entries
2. Calculate: velocity trends, context burn rates, subscription projections
3. Update KB topic 14 with current summary
4. If trends alarming: notify orchestrator at projectTeam:0.0
