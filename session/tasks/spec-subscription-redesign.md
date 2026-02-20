# Specification: scrumMaster.subscription Redesign

**Author**: PO + Tron joint analysis, Feb 20 2026
**For**: oosh-expert
**Status**: DRAFT — awaiting Tron review before sending

## 1. Problem Statement

`scrumMaster.subscription` combines two independent data sources into one display as if they measure the same thing. They don't. The output is misleading and has caused the team to be "surprised" at rate limits multiple times.

## 2. The Two Data Sources

### Source A: rate-limit-cache.json (Claude Code's own cache)

```json
{
  "session5h": 0.04,
  "weekly7d": 0.49,
  "reset5h": 1771592400,
  "reset7d": 1771945200,
  "timestamp": 1771581216466
}
```

- Written by Claude Code internally (same data as TUI footer bar)
- `session5h`: a value between 0 and 1. We ASSUME it means "fraction of rate-limit capacity remaining." We have NOT verified this assumption.
- `reset5h`: unix timestamp of next session reset. Verified: matches TUI.
- **Rate-limit capacity is NOT measured in raw tokens.** It's measured in some weighted unit Anthropic uses internally. Model type matters — one Opus call likely consumes far more capacity than one Haiku call.
- **We do not know the absolute capacity** (denominator). There is no field for it.

### Source B: ccusage (via `npx ccusage blocks --active --json`)

```json
{
  "totalTokens": 2207275,
  "costUSD": 2.012711,
  "burnRate": { "tokensPerMinute": 12777 },
  "tokenCounts": {
    "inputTokens": 365,
    "outputTokens": 489,
    "cacheCreationInputTokens": 222838,
    "cacheReadInputTokens": 1983583
  }
}
```

- External tool that reads Claude Code's local usage logs
- Counts RAW tokens (input, output, cache read, cache creation)
- Calculates burn rate in raw tokens per minute
- Block boundaries are fixed (e.g., every 5h from midnight UTC) — NOT the same as the rolling rate-limit window

## 3. Proof They Are Independent

From `session/subscription-trend.md` (Feb 19-20):

| Time | Tokens_M (ccusage) | Session% (cache) | Analysis |
|------|--------------------|--------------------|----------|
| 17:10 | 3.0M | 40% used | |
| 17:59 | 13.7M | 32% used | +10.7M tokens, but % DROPPED — impossible if same unit |
| 18:03 | 19.0M | 32% used | After "18:00 reset" — tokens UP, % unchanged |
| 18:06 | 21.7M | 98% used | Sudden jump to 98%, new reset at 23:00 |
| 10:52 | 1.4M | 97% used | Next day: 1.4M = 97%, but yesterday 13.7M = 32% |

**Key contradictions:**
1. **13.7M tokens = 32% used, but 1.4M tokens = 97% used.** If they measured the same thing, 1.4M would be ~3% used, not 97%.
2. **After 18:00 "reset": tokens went UP** (13.7M → 19M). ccusage block didn't reset at 18:00.
3. **Percentage stayed at 32% across the reset**, then jumped to 98% six minutes later. The cache's rolling window shifted independently.
4. **Tokens climb while percentage drops** (17:10-17:59): 3.0M→13.7M but 40%→32%. Old usage rolling off the 5h window faster than new usage arrives.

**Conclusion**: The two sources have different time windows, different units, and different reset schedules. Displaying them in the same row implies correlation that does not exist.

## 4. What The Current Code Does Wrong

### 4a. Mixing sources in output (lines 958-962)
```
Session:  96% used  (resets 14:00 Berlin)    ← Source A
Tokens:   2207275  (burn: 12777/min)          ← Source B
```
A user reading this thinks "96% of token capacity used, 2.2M tokens consumed, burning 12K/min." None of that follows. The 96% is in rate-limit units, the 2.2M is in raw tokens, and the burn rate is in raw tokens/min which cannot predict when the rate-limit hits 100%.

### 4b. Mixing sources in trend file (lines 893-905)
The trend file writes `| time | tokens_M | session% | burn | reset |` — putting Source A and Source B in the same row as if they're related measurements of the same thing.

### 4c. Projected exhaustion calculation (lines 902-917)
Uses percentage slope from the trend file to project when 100% is reached. The percentage comes from Source A (cache), but the trend was influenced by Source B's burn rate. The projection is unreliable because:
- Percentage can DECREASE while tokens increase (rolling window)
- Percentage can jump discontinuously (new rate-limit window)
- Past slope doesn't predict future slope (model mix changes)

### 4d. Alert thresholds assume percentage is meaningful
The fallback (lines 939-943) uses `pct >= 90` to trigger alerts. But if we don't know what the percentage measures with certainty, we're alerting on an unverified number.

## 5. What We CAN Trust

| Data point | Source | Reliable? | Why |
|-----------|--------|-----------|-----|
| `session5h` fraction | Cache | Probably yes | Same source as TUI bar. TUI bar correlates with actual rate limiting. |
| `reset5h` timestamp | Cache | Yes | Verified: matches TUI reset time exactly. |
| `timestamp` (freshness) | Cache | Yes | When the cache was last updated. |
| `totalTokens` | ccusage | Yes, for its own scope | Real count of tokens consumed since ccusage block start. |
| `costUSD` | ccusage | Yes | Real cost accounting. |
| `burnRate` (tokens/min) | ccusage | Yes, for tokens | Real token burn rate. But meaningless for predicting rate-limit exhaustion. |

## 6. Required Changes

### 6a. Separate the two sources in output

BEFORE (current, misleading):
```
Subscription Status:
  Session:  96% used  (resets 14:00 Berlin)
  Tokens:   2207275  (burn: 12777/min)
  Cost:     $2.01
  Alert:    HIGH — >90% used
```

AFTER (honest):
```
Subscription Status:
  Rate Limit: 96% capacity used  (resets 14:00 Berlin, cache 2m ago)
  ⚠ Capacity unit is unknown — not raw tokens. Treat as TUI-equivalent.
  ---
  Token Accounting (ccusage, separate measurement):
    Tokens:  2,207,275 this block  (burn: 12,777/min)
    Cost:    $2.01 this block
    Block:   08:00-13:00 Berlin
```

### 6b. Separate the two sources in trend file

Either:
- **Option 1**: Two separate trend tables (rate-limit trend + token trend)
- **Option 2**: Remove tokens from the trend table entirely. Track only: `| time | rate_limit_% | reset_time |` — the one number that actually drives alerts.

### 6c. Fix projected exhaustion

Base it ONLY on the rate-limit percentage slope. Don't involve token burn rate.

The formula should be:
```
remaining_pct = 100 - current_pct
pct_per_min = (current_pct - previous_pct) / minutes_elapsed
if pct_per_min > 0:
    projected_min = remaining_pct / pct_per_min
else:
    projected_min = "stable/recovering"
```

And compare with `time_until_reset`:
```
if time_until_reset < projected_min:
    alert = "OK — resets before exhaustion"
```

### 6d. Add raw cache dump for debugging

Add a `--raw` flag that shows the actual cache values without interpretation:
```
scrumMaster subscription --raw
  session5h: 0.04
  weekly7d: 0.49
  reset5h: 1771592400 (14:00 Berlin)
  reset7d: 1771945200 (16:00 Feb 24 Berlin)
  cache_age: 2m
```

### 6e. Investigate what session5h actually means

This is research, not coding:
1. Run `scrumMaster subscription --raw` every 5 minutes during active team work
2. Note when the TUI bar changes
3. Compare session5h values with TUI bar position
4. Try to determine: is `session5h` exactly `1.0 - (bar_fill_fraction)`?
5. Document findings

## 7. Acceptance Criteria

1. Output clearly labels Source A (rate-limit cache) and Source B (ccusage) as separate measurements
2. No output line combines data from both sources
3. Trend file tracks only rate-limit percentage (one source)
4. Projected exhaustion uses only rate-limit percentage slope
5. `--raw` flag shows uninterpreted cache values
6. Alert system works on rate-limit % only, with fallback to time-until-reset
7. All existing callers (SM cycle, dashboard) work with new output format

## 8. Out of Scope

- Determining absolute rate-limit capacity (we may never know this)
- Changing ccusage itself
- Changing how Claude Code writes rate-limit-cache.json

## 9. Implementation Notes

The subscription function is at `scrumMaster` lines 790-975. The trend persistence is at lines 893-905. The dashboard pickup is at lines 970-975.

Key: this is primarily a display/interpretation fix, not a data collection fix. The data sources are fine — the problem is how we combine and present them.
