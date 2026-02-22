# Recurring Incidents — Prioritized by Frequency

*Track repetitive incidents. When count reaches 3+, escalate to expert for root cause fix.*
*This is CMM4: measurement -> pattern recognition -> process improvement.*

## How to Use This File

When an incident occurs that you've seen before:
1. Find or create the entry below
2. Increment the count
3. Add date and brief context
4. When count reaches 3+, escalate to expert for root cause fix

## Active Incidents

### ~~INC-001: Enter key sent as text instead of keypress~~ RESOLVED

**Count**: 5+
**Impact**: HIGH — blocked every compact, boot prompt, agent message
**Root cause**: `hiveMind.send()` line 758 used `otmux send "$target" -l "$*"` — the `-l` flag + `$*` joining made "Enter" literal text instead of a keypress.
**Fix**: Commit `15a8a90` — expert added trailing key name detection (Enter, C-u, Tab, etc.) with regex matching. Three branches: text+key, key-only, text-only.
**Verified**: 2026-02-22 — all 6 test cases passed (trainer quality gate)
**Status**: RESOLVED — moved to Resolved Incidents

### INC-002: Context measurement tool inaccurate

**Count**: 3+
**Impact**: MEDIUM — SM cannot accurately measure agent context, must use /context manually
**First seen**: 2026-02-21
**Pattern**: `claudeCode context.read` reports different % than `/context` (off by 10+ points). Hardcoded 200K window, wrong JSONL selection.
**Workaround**: Only use `/context` via peer pane capture ("42" principle)
**Root cause**: Known — `claudeCode` line 1002 hardcodes 200K context window, and without pane argument reads any agent's JSONL.
**Occurrences**:
- 2026-02-21: /context showed 42%, claudeCode showed 32-35%
- 2026-02-21: SM relying on claudeCode for context monitoring — wrong readings
- 2026-02-22: Confirmed still broken
**Assigned to**: oosh-expert — fix `claudeCode context.read` to match `/context` output
**Status**: OPEN

### INC-003: scrumMaster subscription inaccurate

**Count**: 3+
**Impact**: MEDIUM — SM cannot accurately plan quota management
**First seen**: 2026-02-18
**Pattern**: `scrumMaster subscription` reports wrong reset times, wrong capacity %, stale data from rate-limit-cache.json.
**Workaround**: Trust TUI footer for real reset time, not the tool.
**Root cause**: Partially known — cache data is stale/incorrect. Post-fix (9e0d9ea) improved alerts but still shows shifting reset times and wrong token counts.
**Occurrences**:
- 2026-02-18: TUI said 10pm Berlin, tool said 9pm (1hr off)
- 2026-02-18: Tool said "OK" at 94% — no alert triggered
- 2026-02-19: Reset times shifted 03->08->13 Berlin overnight
- 2026-02-19: Shows "95% CRITICAL" while agents operate normally
**Assigned to**: oosh-expert (task: fix-scrummaster-subscription-accuracy.md)
**Status**: OPEN — partially improved by 9e0d9ea

## Resolved Incidents

### INC-001: Enter key sent as text instead of keypress
**Resolved**: 2026-02-22 | **Commit**: `15a8a90` | **By**: oosh-expert
**Root cause**: `-l` flag + `$*` in `hiveMind.send()` made all args literal including "Enter"
**Fix**: Regex detection of trailing tmux key names, sent as keypresses separately from `-l` text
**Verified by**: agent-trainer — 6/6 test cases passed

## Template for New Incidents

```
### INC-NNN: [Brief title]

**Count**: 1
**Impact**: HIGH/MEDIUM/LOW
**First seen**: [date]
**Pattern**: [what happens]
**Workaround**: [immediate fix]
**Root cause**: Unknown/Known — [details]
**Occurrences**:
- [date]: [context]
**Assigned to**: [role]
**Status**: OPEN
```
