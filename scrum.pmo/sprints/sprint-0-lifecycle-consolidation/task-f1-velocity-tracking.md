[Back to Sprint 0](./planning.md)

# Task F1: scrumMaster velocity time-series + burn-rate alerts
[task:uuid:f1-velocity-tracking]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (live-seeded 3 samples + real API sample = 4 total)
  - [x] implementing (commit 3fd0420)
  - [x] testing (alert triggered correctly with real Anthropic API data)
- [x] QA Review
- [x] Done

## Sub-tasks

### F1.1 — velocity.log

Append current subscription sample to `~/config/metrics/velocity.log.env` and
compute burn rate over the last 10-min window. Output summary shows current
5h%/7d%/remaining plus the computed burn.

### F1.2 — velocity.alert

Log a fresh sample, compute burn over configurable window, emit `warn.log`
if burn exceeds threshold. Returns rc=1 when alert fires so callers can chain
(e.g. SM loop: `scrumMaster velocity.alert && reduce-team-load || continue`).

## Supporting methods (bonus)

- `scrumMaster velocity.rate <?windowMin>` — compute burn over any window, no side
  effects (doesn't add a sample).
- `scrumMaster velocity.history <?lines>` — diagnostic dump of recent samples.

## Schema

`~/config/metrics/velocity.log.env` — append-only env-file, one sample per line:
```
<epoch>|<utcTimestamp>|<fiveHourPct>|<sevenDayPct>|<remainingMinutes>
```

## Env tunables

| Var | Default | Purpose |
|-----|--------:|---------|
| `SCRUMMASTER_VELOCITY_LOG` | `~/config/metrics/velocity.log.env` | Log file path |
| `SCRUMMASTER_VELOCITY_ALERT_THRESHOLD` | `15` | % per window that triggers alert |
| `SCRUMMASTER_VELOCITY_WINDOW_MIN` | `10` | Window size (minutes) |

## Live verification

Seeded 3 historical samples (12%→22%→32% over 15 min) then called
`scrumMaster velocity.alert 15 20`:

```
sample: 58% 5h / 8% 7d / 139min left    ← real API data captured
burn  : 46% per 20-min window           ← 58 − 12 = 46
WARNING> velocity BURN RATE HIGH: 46% per 20min (threshold 15%, current 58% 5h)
```

Alert emits with full context. `velocity.history 5` shows the samples
including the real one appended by the alert's internal log call.

## CMM4 progression

Before: subscription monitoring was instantaneous ("what's it RIGHT NOW?").
After: time-series available — SM can compute trends, detect acceleration,
identify burst patterns, and set rate-based thresholds instead of level-based.

Data source: live Anthropic OAuth API (`private.scrumMaster.subscription.api.call`)
with `~/config/scrumMaster.subscription.env` cache fallback.
