# Measurement System (CMM4) — Details

## The 4 Metrics
1. **Token usage per agent** — how many tokens consumed this session
2. **Velocity** — tasks completed per hour, tokens per task
3. **Context % per agent** — real-time context window usage, who needs compact
4. **Subscription window** — 5-hour and 7-day burn rate, will we hit the limit

## Current Tool Status
| Tool | Status | Problem |
|------|--------|---------|
| `claudeCode context.read` | BROKEN | Returns same value (53.1%) for all panes in same window |
| `claudeCode context.velocity` | BROKEN | Returns "unknown" |
| `hiveMind dashboard` | PARTIAL | Subscription/activity missing, wrong git branch |
| TUI footer | WORKS | Shows context %, subscription reset — but only visible per pane |

## Roles
- **Expert**: Fix the broken tools (context.read same-value bug, velocity, dashboard)
- **SM**: Run dashboard at start of every sweep, log to `session/metrics/sweep-log.md`
- **Scribe**: Maintain persistent metrics log, hourly KB summary

## CMM Targets
- CMM2 → CMM3: Tools work deterministically (expert fixes)
- CMM2 → CMM4: Automated measurement loop (SM cadence)
- CMM1 → CMM3: Written, persistent metrics (scribe log)

## Files
- Sweep log: `session/metrics/sweep-log.md`
- Dashboard: `hiveMind dashboard`
- Task: `session/tasks/20260212T1200Z.task.md`

## Action Checklists
-> [log-metrics.md](actions/log-metrics.md)
