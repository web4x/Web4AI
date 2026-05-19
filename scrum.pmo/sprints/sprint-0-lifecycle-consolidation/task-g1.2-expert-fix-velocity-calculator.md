[Back to Task G1](./task-g1-claudecode-context-read-1m-fix.md)

# Task G1.2: Expert - Fix velocity calculator
[task:uuid:d9g3e5c2-b164-4fa0-d7c3-2i3456789012]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing — commit ca49445 (bundled with G1.1 since they share the helper)
  - [x] testing (live `context.all` output: 31.5%/26.9%/23.1%/72.9% — all sane, no negatives)
- [x] QA Review
- [x] Done

## Deliverable
Commit `ca49445` wires `private.claudeCode.max.tokens.for.jsonl` into:
- `private.claudeCode.velocity.calculate` (was `max_tokens = 200000` line 1643)
- `claudeCode.context.dashboard` (was `200000` lines 1720/1725 + `180000` line 1723)

Threshold now computed as `int(max_tokens * 0.90)` — so 1M session threshold is 900k
(was: hardcoded 180k regardless of model). Velocity pct and fallback display use the
detected max.

Bundled with G1.1 because all 3 Python blocks (`context.from.jsonl`,
`velocity.calculate`, dashboard inline) consume the same helper — single commit
keeps the fix atomic.

## Traceability
- up
  - [Task G1: claudeCode context.read 1M fix](./task-g1-claudecode-context-read-1m-fix.md)

## Description
The velocity calculator (`private.claudeCode.velocity.calculate`) and dashboard use the same hardcoded 200k. After G1.1 adds the model-detection helper, wire it into velocity.calculate (line 1643), velocity fallback (1720), velocity display (1725), and threshold (1723 → 90% of detected max).
