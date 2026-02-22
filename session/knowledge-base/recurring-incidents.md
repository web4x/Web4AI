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
**Status**: RESOLVED — commit f5b6c6b. Validated by trainer (7 measurements + block transition). KB #24.

### INC-004: Unsubmitted self-prompts — agents generate text at prompt but never hit Enter

**Count**: 3+
**Impact**: HIGH — agents appear idle but have pending work sitting at `❯`. SM sweeps miss it. Work stalls silently.
**First seen**: 2026-02-22 (observed throughout session)
**Pattern**: Agent generates a "Read session/tasks/..." or continuation prompt for itself but the text sits at `❯` without being submitted. The agent thinks it queued work; actually nothing happens. Only visible via pane capture: text at `❯` WITHOUT "esc to interrupt" = not processing.
**Workaround**: SM must check EVERY sweep: if text at `❯` and no "esc to interrupt" → send Enter to that pane.
**Root cause**: Unknown — possibly Claude Code's accept-edits mode or agent self-prompting mechanism doesn't auto-submit. Agents may be generating tool output that includes the next prompt as text rather than executing it.
**Occurrences**:
- 2026-02-22 18:47: trainer had task at prompt, not submitted — PO sent Enter
- 2026-02-22 19:30: SM activation message not submitted — PO sent Enter
- 2026-02-22 ~21:30: Tron found oosh-expert AND oosh-tester both with unsubmitted prompts
- Multiple instances of hiveMind send requiring follow-up Enter throughout session
**Assigned to**: SM sweep procedure (detection) + oosh-expert (root cause investigation)
**Status**: OPEN — HIGH PRIORITY. Silent work stalls = invisible failure.

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
