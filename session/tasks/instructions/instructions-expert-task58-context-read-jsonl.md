# Task 58: Programmatic context.read via JSONL token counting

**Priority**: High
**Source**: Woda-writer — TUI pane-scraping is broken by design, need real measurement

## Problem

`claudeCode context.read` scrapes the TUI for context %. But the TUI only shows context % when it's LOW — so we can only measure when it's already critical. We need continuous measurement.

## Solution: Read token counts from .jsonl conversation files

Every Claude Code session stores its conversation in a `.jsonl` file at:
```
~/.claude/projects/<project-path-with-dashes>/<session-uuid>.jsonl
```

Every `assistant` message contains exact API usage:
```json
{
  "type": "assistant",
  "message": {
    "usage": {
      "input_tokens": 3,
      "cache_creation_input_tokens": 4514,
      "cache_read_input_tokens": 17484,
      "output_tokens": 9
    }
  }
}
```

The context window is ~200,000 tokens. We can calculate:
- `context_used = input_tokens` (from the LAST assistant message — this is the full context sent)
- `context_pct = (input_tokens / 200000) * 100`

## Implementation

In `components/OOSH/dev.claude/claudeCode`, replace or enhance the `context.read` method:

### Step 1: Find the .jsonl file for a session

The session UUID can be found by:
1. Check `~/.claude/projects/` directories for `.jsonl` files
2. Match by most recently modified file (the active session)
3. OR parse the pane's Claude Code output for session ID

Simpler approach: find all `.jsonl` files, sort by mtime, the most recent is likely the active session. For a specific pane, we can match the session UUID from the pane title or process.

**Project paths** (two known locations):
```bash
~/.claude/projects/-Users-Shared-Workspaces-AI-Claude/
~/.claude/projects/-Users-Shared-Workspaces-AI-Claude-components-OOSH-dev-claude/
```

### Step 2: Read the last assistant message's usage

```bash
# Get the last assistant message with usage info
tail -50 "$jsonl_file" | python3 -c "
import sys, json
last_usage = None
for line in sys.stdin:
    try:
        d = json.loads(line)
        if d.get('type') == 'assistant':
            usage = d.get('message', {}).get('usage', {})
            if usage and 'input_tokens' in usage:
                last_usage = usage
    except: pass
if last_usage:
    input_t = last_usage['input_tokens']
    cache_create = last_usage.get('cache_creation_input_tokens', 0)
    cache_read = last_usage.get('cache_read_input_tokens', 0)
    total = input_t + cache_create + cache_read
    pct = round((total / 200000) * 100, 1)
    remaining = 100 - pct
    print(f'{remaining}')
else:
    print('unknown')
"
```

### Step 3: New method signature

```bash
claudeCode.context.read() # <?pane> # read context % remaining from JSONL token data
```

Keep the existing TUI-scraping as a fallback. Try JSONL first, fall back to pane capture if JSONL fails.

### Step 4: Helper to find active session file

```bash
claudeCode.context.jsonl() # <?pane> # find the active .jsonl file for a session
```

This finds the most recently modified `.jsonl` in the project dirs. If a pane is given, try to match by checking which `.jsonl` was modified most recently during that pane's activity.

### Step 5: Method to list all sessions with context

```bash
claudeCode.context.all() # # show context % for all active sessions
```

Loop through all recently modified `.jsonl` files, print session UUID + context %.

## Key Notes

- Use `python3` for JSON parsing — it's available on macOS
- `tail -50` is enough — we only need the LAST assistant message
- The 200,000 token budget is approximate — Opus 4.6 uses 200k context
- `input_tokens` alone may undercount — add `cache_creation_input_tokens` + `cache_read_input_tokens` for total context
- Keep the old TUI-scraping method as `claudeCode.context.read.tui()` for backward compatibility

## Testing

From `components/OOSH/dev.claude/`:
```bash
# 1. Syntax check
bash -n claudeCode

# 2. Test jsonl finder
./claudeCode context.jsonl

# 3. Test context.read (should return a number, not "unknown")
./claudeCode context.read

# 4. Test context.all
./claudeCode context.all

# 5. Compare with TUI reading
./claudeCode context.read.tui cursorOrchestrator:0.4
# Compare the two values — JSONL should be more reliable
```

## When Done
Commit: "Task 58: Programmatic context.read via JSONL token counting"
Then say: "Task 58 committed"
