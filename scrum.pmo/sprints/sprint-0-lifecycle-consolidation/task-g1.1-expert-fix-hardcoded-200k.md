[Back to Task G1](./task-g1-claudecode-context-read-1m-fix.md)

# Task G1.1: Expert - Fix hardcoded 200k max_tokens
[task:uuid:c8f2d4b1-a053-4e9f-c6b2-1h2345678901]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing — commit ca49445
  - [x] testing (live verified — ea2c7021 was -226%, now 31.5%)
- [x] QA Review
- [x] Done

## Deliverable
**Commit:** `ca49445` (pushed to test/macos.latest)
**Helper:** `private.claudeCode.max.tokens.for.jsonl <jsonlFile>` — returns per-session limit

**Detection enhancement over spec:**
The spec proposed JSONL `"model"` field → map to max_tokens with `*opus*[1m]*` → 1M.
Reality check: JSONL `"model"` field always contains the base name (`claude-opus-4-6`,
`claude-opus-4-7`, etc.) — the `[1m]` suffix is a CLI flag, never persisted to the
API response. So JSONL-only model detection cannot distinguish 1M from 200k sessions.

**3-tier detection implemented:**
1. `ps -eo args` — live claude process with `[1m]` in model flag → 1,000,000
   (reliable for running sessions, which is what SM monitors)
2. Observed-max from JSONL usage — any usage > 200k → must be 1M
   (safety net: a 200k-capped session would have compacted before exceeding 200k)
3. Model from JSONL default → 200,000 (opus/sonnet/haiku base)

All 5 spec locations replaced (lines 1386, 1643, 1720, 1723, 1725). See
`task-g1.2-expert-fix-velocity-calculator.md` for the velocity-specific patches
included in the same commit.

## Traceability
- up
  - [Task G1: claudeCode context.read 1M fix](./task-g1-claudecode-context-read-1m-fix.md)

## Description
Fix all 5 hardcoded values in `/Users/donges/oosh/claudeCode`:
1. Line 1386: `200000` in `private.claudeCode.context.from.jsonl`
2. Line 1643: `max_tokens = 200000` in `private.claudeCode.velocity.calculate`
3. Line 1720: `200000` in velocity fallback display
4. Line 1723: `180000` threshold (should be 90% of detected max)
5. Line 1725: `200000` in velocity pct display

Add model detection: parse `"model"` from last assistant message in JSONL, map to max_tokens. Extract into a shared helper so all 5 locations use ONE source.
