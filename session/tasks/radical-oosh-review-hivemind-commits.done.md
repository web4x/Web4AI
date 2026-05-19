# Done: OOSH Architecture Violation Review

**Agent**: oosh-tester
**Task**: radical-oosh-review-hivemind-commits.md
**Result**: PARTIAL — violations found, tests written, expert action needed
**Date**: 2026-03-11

## Summary

Reviewed commits 102fa81, aa6e313, 1604e3e across claudeCode, hiveMind, otmux.

## Findings by Commit

### 1. `1604e3e` — hiveMind teams.migrate `--fork` mode
**ALREADY FIXED.** The `--fork` flag was refactored to positional `<?mode:join>` (hiveMind:1476). The `teams.migrate` caller at line 1644 uses `hiveMind teams.restore "" fork`. Completion stub exists (line 1560). No remaining violation.

### 2. `102fa81` — claudeCode fork validation + session.id staleness

**2 HIGH violations, 4 MEDIUM violations:**

#### HIGH: `claudeCode.list --json` (line 69-74)
- Method signature: `claudeCode.list() # <?--json>` — uses `--json` flag
- Check: `[ "$1" = "--json" ]` — flag-style parsing
- **Fix**: Should be `claudeCode.list <?format:tree>` with positional arg, or separate method `claudeCode.list.json`

#### HIGH: `claudeCode.agent.start --model` (line 895-906)
- Uses `while/case` loop to parse `--model` flag
- **Fix**: Should be `claudeCode.agent.start <?workdir:.> <?model:sonnet>` with positional args

#### MEDIUM: Raw `stat -f %m` / `stat -c %Y` (lines 59, 1101, 1277, 1436)
- Platform-specific stat flags used 4 times (DRY violation too)
- Already wrapped in `private.claudeCode.file.age` at line 55 — but lines 1101/1277/1436 call `stat` directly instead of using the wrapper
- **Fix**: Use `private.claudeCode.file.age` everywhere, or create an OOSH `check` method

#### MEDIUM: Raw `find ... -name "*.jsonl"` (lines 1106, 1287, 1486)
- Same find pattern repeated 3 times
- **Fix**: Extract to `private.claudeCode.jsonl.find <dir>` helper

#### LOW: Raw `date +%s` (lines 60, 1269, 1427)
- Used 3 times for epoch timestamp
- Acceptable in private helpers, but could be an OOSH utility

### 3. `aa6e313` — otmux ghost pane detection
**NO VIOLATIONS.** Ghost detection uses proper `private.otmux.pane.isGhost` method (line 732). Internal variables (`paneState`, `DEAD` label) are implementation details, not method interface flags. Acceptable OOSH pattern.

## DRY Violations (report to Task Agent)

1. `stat -f %m` pattern: lines 59, 1101, 1277, 1436 in claudeCode — same file age logic 4x
2. `find ... -name "*.jsonl"` pattern: lines 1106, 1287, 1486 in claudeCode — same JSONL discovery 3x

## Tests Written

Added OOSH architecture compliance tests to `test/test.claudeCode`:
- T-ARCH-1: No `--flag` patterns in method signatures
- T-ARCH-2: No `--flag` parsing in method bodies (case/getopt)
- T-ARCH-3: `private.claudeCode.file.age` used instead of raw stat
- T-ARCH-4: JSONL find pattern not duplicated

## Action Required: oosh-expert

1. Refactor `claudeCode.list` to use positional `<?format:tree>` or separate `claudeCode.list.json` method
2. Refactor `claudeCode.agent.start` to use positional `<?workdir:.> <?model:sonnet>`
3. Replace raw `stat -f %m` calls at lines 1101, 1277, 1436 with `private.claudeCode.file.age`
4. Extract `find ... -name "*.jsonl"` to a private helper

## Next
Expert refactors, tester re-runs tests to verify compliance.
