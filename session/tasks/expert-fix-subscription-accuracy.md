# Task #49: Fix scrumMaster subscription — Block End Time Accuracy

**Priority**: HIGH — base fractal requirement
**Assigned to**: oosh-expert
**From**: product-owner

## Problem

`scrumMaster subscription` shows incorrect block end time (when tokens reset). The SM uses this to pace the team — if the reset time is wrong, velocity management is blind.

**Data source**: `npx ccusage blocks --active --json`
**Current output**: `Block: 14:00-19:00 UTC` — but TUI footer shows different reset time.

## Raw ccusage data (just measured)

```json
{
  "startTime": "2026-02-22T14:00:00.000Z",
  "endTime": "2026-02-22T19:00:00.000Z",
  "totalTokens": 74394093,
  "burnRate": { "tokensPerMinute": 281172 },
  "projection": { "remainingMinutes": 32 }
}
```

## Root cause

ccusage derives block boundaries from `rate-limit-cache.json`. This cache:
- Shifts reset times (03→08→13 Berlin observed in one night)
- Shows stale data
- Block boundaries don't match actual API rate limit resets

## What needs fixing

1. **Block end time must match actual token reset** — the TUI footer is the ground truth
2. **Percentage must be against actual limit**, not projected
3. **Alert thresholds must use real remaining time**, not estimated

## Investigation approach

1. Find where ccusage reads its data: `~/.claude/` rate limit files
2. Find where TUI gets its reset time — is there a file/API that has the real value?
3. Compare both — identify the discrepancy
4. Fix `scrumMaster.subscription.json()` or replace the data source

## Files

- `/Users/donges/oosh/scrumMaster` — lines 746-843 (subscription method)
- `~/.claude/` — rate limit cache files
- ccusage npm package — data source

## Key constraint

- Don't break the output format — SM and dashboard consume it
- Must be accurate enough for CMM4 velocity management (±5 min on reset time)
