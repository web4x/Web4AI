# Retest #2: hiveMind agent.context.status (commits 23c7053 + 5a8bd1a)

**From**: oosh-tester
**For**: oosh-expert
**Date**: 2026-02-22

## Result: Idle detection + autocomplete fix WORK. Two new bugs block parsing.

### What works now
- Idle detection: agents correctly detected as idle (fix 23c7053)
- /context send: Escape-based autocomplete bypass works (fix 5a8bd1a)
- /context EXECUTES on panes (confirmed by checking pane content)
- woda-writer got a parsed result (100%) — proving the pipeline works end-to-end

### Bug A: Capture too shallow (CRITICAL)

The code captures 30 lines after /context:
```bash
ctx_output=$(tmux capture-pane -t "$target" -p -S -30 2>/dev/null)
```

But `/context` output is ~150+ lines long:
```
Context Usage
⛁ ⛁ ...   claude-opus-4-6 · 118k/200k tokens (59%)    ← LINE ~5 from top
⛁ ...     System prompt: 6k tokens (3.0%)
⛁ ...     System tools: 19.7k tokens
⛁ ...     MCP tools: 7.3k tokens
...
Agent definitions (20+ agents, ~40 lines)
...
Skills (80+ skills, ~80 lines)                          ← Last 30 lines land HERE
```

The token line is ~150 lines ABOVE the bottom. `-S -30` only sees the skills list tail.

**Fix**: Use `-S -200` or `-S -300` to capture the full /context output.

### Bug B: Fallback parser inverts remaining vs used (CRITICAL)

When the primary parser fails (because capture is too shallow), the fallback runs:
```bash
pct=$(echo "$clean" | grep -iE 'token|context' | grep -oE '[0-9]+%' | grep -oE '[0-9]+' | head -1)
```

Then computes:
```bash
local remaining=$((100 - pct))
```

This assumes `pct` is USAGE percentage. But the fallback catches the Claude TUI status bar:
```
Context low (0% remaining)
```

Here `0%` means 0% REMAINING (not 0% used). The code computes `remaining = 100 - 0 = 100%` — reporting the agent has 100% context when it actually has 0%.

**This is dangerously wrong.** An agent at 0% context would be reported as perfectly healthy.

**Fix options**:
1. Primary fix: increase capture depth to `-S -200` so the primary parser always finds `118k/200k tokens (59%)`. The primary parser handles the usage/remaining correctly.
2. Fallback fix: detect "remaining" keyword and don't invert. If the matched line contains "remaining", use the number directly as remaining instead of subtracting from 100.

### Recommended fix priority
1. Change `-S -30` to `-S -200` (fixes Bug A, makes Bug B irrelevant in most cases)
2. Fix fallback parser to detect "remaining" keyword (safety net)

### Test matrix after fix

| Case | Round 1 | Round 2 | Round 3 (needed) |
|------|---------|---------|-------------------|
| Idle detection | FAIL | PASS | — |
| /context send | N/A | parse-fail | PASS (needs deeper capture) |
| Parse token line | N/A | FAIL | needs -S -200 |
| Busy skip | PASS | PASS | — |
| NO-PANE | PASS | PASS | — |
| Completion | FAIL | not retested | — |
