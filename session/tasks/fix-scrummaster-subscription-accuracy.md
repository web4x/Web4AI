# CRITICAL: scrumMaster subscription data is wrong

**To**: oosh-expert
**From**: product-owner
**Priority**: CRITICAL — agents don't throttle because tool says "OK" at 94%

## Problem

The TUI footer shows the REAL data:
- 94% session limit used
- Resets 10pm Europe/Berlin

But `scrumMaster subscription` shows:
- "132 min remaining"
- Block: 16:00-21:00 Berlin (should be until 22:00 if reset is 10pm)
- Alert: OK

The tool's data source is inconsistent with the TUI. Agents trust the tool. Tool says OK. Nobody throttles. We hit 94% with zero velocity management.

## Fix

`scrumMaster subscription` must match TUI reality:
1. Report usage percentage (the TUI has it — find the same source)
2. Correct reset time (TUI says 10pm Berlin — match it)
3. Trigger alerts based on real percentage, not calculated "minutes remaining"
4. If you can't read the TUI data source directly, parse the TUI footer from the pane

## Acceptance Criteria

- `scrumMaster subscription` shows usage % matching TUI footer
- Reset time matches TUI footer
- Alert triggers at appropriate CMM4 velocity thresholds
- Commit with hash
