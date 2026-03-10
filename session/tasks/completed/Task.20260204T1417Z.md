# Task.29: Fix Subscription Measurement — Specification Correction

## Origin

This task comes from the `claudeWoda` session (woda-writer). Read the full story in:
- `session/woda/chapters-20-plus.md` — Chapter 29: "Am I Claude or Are You Claude?"

## The Problem

Task.27 (ScrumMaster Measurement Capabilities) was a **specification failure**. The woda-writer specified pane-scraping metrics — extracting token counts from `tmux capture-pane` output with regex. The expert implemented it perfectly: 14/14 tests pass, proper OOSH methods, Tab completions.

But it measures the **wrong thing**. When we hit 93% subscription limit, `scrumMaster measure.subscription` reported "4,300 tokens combined." Because it only sees what's in the last 20 lines of each pane's TUI output — not actual subscription consumption.

Nobody in the specification chain questioned this:
- Writer specified pane-scraping (wrong approach)
- Task-agent planned it faithfully
- Orchestrator assigned it without review
- Expert implemented it perfectly
- Tester validated it — 14/14 pass
- Scrum-master never asked "does this prevent rate limit hits?"

## The Fix

An **OAuth usage API** already exists. One HTTP call returns exact subscription utilization percentages.

### API Details

**Endpoint:** `GET https://api.anthropic.com/api/oauth/usage`

**Authentication:**
```bash
# Extract OAuth token from macOS Keychain
TOKEN=$(security find-generic-password -s 'Claude Code-credentials' -w 2>/dev/null \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['claudeAiOauth']['accessToken'])")
```

**Headers:**
```
Authorization: Bearer $TOKEN
anthropic-beta: oauth-2025-04-20
Accept: application/json
```

**Live response (tested 2026-02-04):**
```json
{
    "five_hour": {
        "utilization": 4.0,
        "resets_at": "2026-02-04T17:59:59.681617+00:00"
    },
    "seven_day": {
        "utilization": 20.0,
        "resets_at": "2026-02-09T08:59:59.681642+00:00"
    },
    "seven_day_opus": null,
    "seven_day_sonnet": {
        "utilization": 0.0,
        "resets_at": "2026-02-11T11:59:59.681655+00:00"
    },
    "extra_usage": {
        "is_enabled": false,
        "monthly_limit": null,
        "used_credits": null,
        "utilization": null
    }
}
```

### Also Available Inside TUI

These slash commands exist in every Claude Code instance:
- `/usage` — real-time token consumption, usage limits, reset timers
- `/status` — remaining allocation overview
- `/stats` — usage patterns (Max/Pro subscribers)
- `/context` — context window usage AND subscription budget consumption

## What Needs to Happen

### Step 1: New scrumMaster method (Expert)

Add `scrumMaster.measure.subscription.api` — the OOSH way:

- `scrumMaster.measure.subscription.api` calls the OAuth endpoint, parses JSON, returns utilization percentages
- `scrumMaster.measure.subscription.api.completion()` — no parameters needed (or optional session name)
- `private.measure.subscription.api.parse()` — JSON parsing internals behind private prefix
- `private.measure.subscription.api.auth()` — Keychain token extraction
- Alerting: if `five_hour.utilization > 80`, output a warning. If `> 90`, output an error via `error.log`
- Store results to `~/config/metrics/subscription.<timestamp>.env`

### Step 2: Keep existing pane-scraping (Expert)

The existing `measure.pane`, `measure.team` etc. are still useful for per-agent metrics (token counts, activity state, timing). They just aren't subscription monitors. Rename or document accordingly — they measure **agent activity**, not **subscription consumption**.

### Step 3: Periodic monitoring (Scrum-master agent)

The scrum-master agent should call `scrumMaster measure.subscription.api` periodically (e.g., after every PDCA cycle or on a timer). This is the CMM4 feedback loop: measure → detect → alert → throttle.

### Step 4: Test (Tester)

- Test API call with real credentials
- Test alert thresholds (mock utilization at 80%, 90%, 95%)
- Test Keychain unavailable (graceful fallback)
- Test malformed API response handling

## Lesson for Future Specifications

Before specifying any measurement or monitoring tool:
1. Research what APIs and commands already exist
2. Ask "does the answer already exist in a simpler form?"
3. Don't build a six-step pane-scraping pipeline when one HTTP request returns the exact number

## Priority

High. This is the capability that would have prevented the 4-agent rate-limit cascade.
