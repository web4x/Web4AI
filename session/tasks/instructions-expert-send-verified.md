# Task: Implement otmux send.verified method

**Assigned to**: Expert (0.4)
**Source**: session/oosh-bugs.md — "otmux send Reliability"
**PO authorized**

## Problem

`otmux send` has no delivery guarantee. 7 failure modes documented:
1. Single Enter = newline, not submit
2. Message lands behind permission dialog
3. Tab doesn't reliably accept edits
4. Escape doesn't always close overlays
5. C-u doesn't clear in all TUI states
6. Rapid sends cause character spam
7. No feedback when send fails — caller assumes success

## Solution

Add `otmux.send.verified()` method — send + sleep + pane.capture to confirm delivery. Returns success/failure.

## Implementation

Add this method to `otmux` script, after the existing `otmux.send()` method (around line 945):

```bash
otmux.send.verified() # <target> <text> <?timeout:3> # send text to pane and verify delivery via capture
{
    local target=$(private.resolve.target "$1")
    local text="$2"
    local timeout="${3:-3}"

    if [ -z "$target" ] || [ -z "$text" ]; then
        error.log "usage: otmux send.verified <target> <text> <?timeout>"
        return 1
    fi

    # Capture state BEFORE send
    local before
    before=$($TMUX_CMD capture-pane -t "$target" -p -S -5 2>/dev/null | tail -5)

    # Send text + Enter (using sendEnter for literal text handling)
    private.otmux.sendEnter "$target" "$text"

    # Wait for TUI to process
    sleep "$timeout"

    # Capture state AFTER send
    local after
    after=$($TMUX_CMD capture-pane -t "$target" -p -S -10 2>/dev/null | tail -10)

    # Verify: text should appear in pane OR pane state should have changed
    if [ "$before" = "$after" ]; then
        # Pane didn't change — likely blocked (permission dialog, overlay, etc.)
        error.log "send.verified FAILED: pane $target unchanged after send"
        RESULT="FAILED"
        return 1
    fi

    # Check if our text appears in the after capture
    if echo "$after" | grep -qF "$text"; then
        console.log "send.verified OK: text delivered to $target"
        RESULT="DELIVERED"
        return 0
    fi

    # Pane changed but text not visible — likely processed (agent consumed it)
    console.log "send.verified OK: pane $target changed (text likely processed)"
    RESULT="CHANGED"
    return 0
}
otmux.send.verified.completion.target() { private.complete.panes; }
```

## Key Design Decisions

1. **Uses `private.otmux.sendEnter`** — literal text (-l flag) prevents key name interpretation
2. **Before/after comparison** — detects if send had any effect at all
3. **Three outcomes**: `DELIVERED` (text visible), `CHANGED` (pane moved on), `FAILED` (no change)
4. **Configurable timeout** — default 3s, increase for slow panes
5. **Uses RESULT variable** — standard OOSH return pattern
6. **Completion stub** — follows OOSH pattern

## Testing

From `components/OOSH/dev.claude/`:
```bash
# 1. Syntax check
bash -n otmux

# 2. Test with a known pane (send text to self or another pane)
./otmux send.verified cursorOrchestrator:0.3 'echo hello'

# 3. Verify failure case — send to a pane with permission dialog
# (should return FAILED if pane doesn't change)

# 4. Check completion
grep 'send.verified.completion' otmux
```

## When Done
Commit: "otmux send.verified — delivery guarantee with before/after capture"
Then say: "send.verified committed"
