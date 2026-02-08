# Task: Fix claudeCode context.read — guard against non-Claude panes

**Assigned to**: Expert (0.4)
**Priority**: P1

## Bug

`claudeCode context.read` returns fake percentages (e.g. 20.8%) for panes running plain zsh — no Claude Code session at all. The JSONL lookup finds stale data and reports it as current.

## Root Cause

`context.read()` (line 864 of claudeCode) calls `claudeCode.context.jsonl()` which finds JSONL files by project path — but doesn't verify a Claude process is actually running in the target pane. Stale JSONL files from old sessions return outdated token counts.

## Fix

Add a process guard at the top of `claudeCode.context.read()`. If a pane is specified, verify Claude Code is running there first using `claudeCode.process.running`.

The fix goes at the top of `claudeCode.context.read()` (line 864), right after `local pane="$1"`:

```bash
# Guard: if pane specified, verify Claude is actually running there
if [ -n "$pane" ]; then
    if ! claudeCode.process.running "$pane" 2>/dev/null; then
        RESULT="no-claude"
        echo "no-claude"
        return 1
    fi
fi
```

## Key Methods (already exist)

- `claudeCode.process.running()` at line 581 — checks if Claude Code PID exists in pane
- `claudeCode.process.find()` — finds Claude Code PID in a pane
- `claudeCode.context.jsonl()` — finds JSONL file for current project

## Testing

```bash
# 1. Syntax check
bash -n claudeCode

# 2. Test with a pane that HAS Claude (should return %)
./claudeCode context.read cursorOrchestrator:0.4

# 3. Test with a plain zsh pane (should return "no-claude")
./claudeCode context.read claudeWoda:0.2

# 4. Test with no pane arg (should still work via JSONL)
./claudeCode context.read
```

## When Done
Commit: "Fix context.read — guard against non-Claude panes"
Then say: "context.read guard committed"
