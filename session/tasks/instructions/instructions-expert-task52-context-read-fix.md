# Task 52: Fix claudeCode context.read unreliable readings

**Assigned to**: Expert (cursorOrchestrator:0.4)
**Priority**: High — blocks CMM4 burn rate tracking

## Bug

`claudeCode context.read` reports "above-threshold" at 12% context, gives inconsistent numbers (20% then "above-threshold" in same session). This breaks velocity/health measurement.

## Root Cause (from Tester research)

1. Pane capture is too shallow — misses context info that may be at different positions
2. ANSI escape codes in captured text break pattern matching
3. No flexible patterns for different TUI message formats
4. No context info visible when context is high (only shows at low %)

## Fix Required

In `components/OOSH/dev.claude/claudeCode`, find the `context.read` method and:

1. **Capture FULL pane content** — not just last N lines, use `-S -` for full scrollback or increase capture depth significantly
2. **Strip ANSI codes** before parsing: `sed 's/\x1b\[[0-9;]*m//g'`
3. **Add flexible patterns** — match "Context left until auto-compact: X%", "context: X%", percentage patterns like just "N%" near "context" keyword
4. **Check top AND bottom of pane** — context warnings can appear in different locations
5. **Add debug logging** when parsing fails so we can see what was actually captured
6. **Return "unknown" instead of "above-threshold"** when no context info is found — absence of info is not the same as "above threshold"

## Testing

Test against real panes in cursorOrchestrator (NOT claudeWoda):
```bash
# Capture a pane and manually check what context info is visible
tmux capture-pane -t cursorOrchestrator:0.5 -p | grep -i context
# Then run context.read and compare
./claudeCode context.read cursorOrchestrator:0.5
```

## When Done
Commit: "Task 52: Fix claudeCode context.read — ANSI stripping + flexible patterns"
Then say: "Task 52 committed"
