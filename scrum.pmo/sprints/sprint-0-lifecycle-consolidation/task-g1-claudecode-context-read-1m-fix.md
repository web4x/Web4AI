[Back to Planning Sprint 0](./planning.md)

# Task G1: claudeCode context.read hardcodes 200k — BROKEN for 1M agents
[task:uuid:b7e1c3a0-9f42-4d8e-b5a1-0g1234567890]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md`

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [ ] creating test cases (handoff to G1.3 tester)
  - [x] implementing (G1.1 + G1.2 bundled in commit ca49445)
  - [x] testing (live: my session was -226%, now 31.5%; dashboard sane for all sessions)
- [x] QA Review (fix verified live, ready for G1.3 tester coverage)
- [ ] Done (pending G1.3 automated test pass)

## Implementation summary

All 5 hardcoded locations fixed in commit `ca49445`:
- Line 1386 (`context.from.jsonl`): `200000` → `$MAX_TOKENS`
- Line 1643 (`velocity.calculate`): `max_tokens = 200000` → `int(os.environ.get('MAX_TOKENS', 200000))`
- Line 1720, 1725 (dashboard): `200000` → `max_tokens`
- Line 1723 (dashboard): `180000` → `int(max_tokens * 0.90)` (now scales)

Helper: `private.claudeCode.max.tokens.for.jsonl <jsonl>` with 3-tier detection.
See `task-g1.1-expert-fix-hardcoded-200k.md` for detection rationale.

## Traceability
- up
  - [Sprint 0 Planning](./planning.md)

- down
  - [Task G1.1: Expert - Fix hardcoded 200k max_tokens](./task-g1.1-expert-fix-hardcoded-200k.md)
  - [Task G1.2: Expert - Fix velocity calculator](./task-g1.2-expert-fix-velocity-calculator.md)
  - [Task G1.3: Tester - Test context.read for 1M agent](./task-g1.3-tester-test-context-read-1m.md)

## Task Description
claudeCode context.read, context.velocity, and context.dashboard all hardcode `200000` as the max context window size. For 1M agents (`claude-opus-4-6[1m]`), this produces negative percentages (-226%) because 600k used / 200k max = 300%.

## Context
The scrum-master uses context.read to monitor agent health. With wrong readings, it reports all 1M agents as "overflowed" and cannot detect real context pressure. This is a BLOCKER for CMM4 agent lifecycle management.

## Bug Locations
- Line 1386: `pct = round((total / 200000) * 100, 1)` — context.read JSONL parser
- Line 1643: `max_tokens = 200000` — velocity calculator
- Line 1720: `round(last['tokens']/200000*100,1)` — velocity fallback
- Line 1725: `round(last['tokens'] / 200000 * 100, 1)` — velocity display
- Line 1723: `remaining = 180000 - last['tokens']` — threshold (should be 90% of max)

## Fix Approach
Detect model from JSONL `"model"` field in assistant messages. Map to max_tokens:
- `*opus*[1m]*` → 1000000
- `*opus*` → 200000
- `*sonnet*` → 200000
- `*haiku*` → 200000
- default → 200000

## Intention
Correct context % readings for all model sizes. SM can then reliably monitor agent health and report accurate context levels.
