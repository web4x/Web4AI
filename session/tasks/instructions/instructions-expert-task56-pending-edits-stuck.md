# Task 56: Fix TUI pending-edits stuck state detection and recovery

**Priority**: Medium
**Source**: CMM4 Ch12 — edits accumulate faster than processed, TUI locks up

## Bug

Claude Code's TUI shows `⏵⏵ accept edits on · N bash` when file edits are pending. When multiple edits pile up (e.g., `⏵⏵ accept edits on · 3 bashes`), the agent can't recover without external intervention. The current `sweep.detect` / `unblock.pane` treats accept-edits the same as permission prompts (sends Down+Enter), which is WRONG:

- Permission prompts: arrow-key selection (Down=option 2, Enter=confirm)
- Accept edits: just needs `Enter` to accept, or `Escape` to dismiss

Sending `Down` before `Enter` on accept-edits types stray arrow keys into the prompt.

## Current Code

File: `components/OOSH/dev.claude/hiveMind`

### sweep.detect (line 1534-1538):
```bash
# Accept edits prompt: ⏵⏵ accept edits
if echo "$content" | grep -q '⏵⏵ accept'; then
    echo "accept-edits|enter"
    return 0
fi
```

### unblock.pane (line 1594-1601):
```bash
permission|accept-edits)
    # Select option 2 ("Yes, and don't ask again") — Down then Enter
    tmux send-keys -t "$target" Down
    sleep 0.3
    tmux send-keys -t "$target" Enter
```

## Required Fixes

### 1. Separate accept-edits from permission in unblock.pane

Split the case statement so accept-edits gets its OWN handler:

```bash
permission)
    # Select option 2 ("Yes, and don't ask again") — Down then Enter
    tmux send-keys -t "$target" Down
    sleep 0.3
    tmux send-keys -t "$target" Enter
    console.log "Unblocked $label ($status) → Down+Enter (option 2)"
    ;;
accept-edits)
    # Accept pending edits — just Enter (no Down!)
    tmux send-keys -t "$target" Enter
    console.log "Unblocked $label ($status) → Enter (accept edits)"
    ;;
```

### 2. Detect stacked edits count

Enhance sweep.detect to parse how many edits are pending:

```bash
# Accept edits prompt: ⏵⏵ accept edits on · N bash(es)
if echo "$content" | grep -q '⏵⏵ accept'; then
    local edit_count
    edit_count=$(echo "$content" | grep -oE '[0-9]+ bash' | head -1 | grep -oE '[0-9]+')
    [ -z "$edit_count" ] && edit_count=0
    echo "accept-edits|enter|$edit_count"
    return 0
fi
```

### 3. Handle stacked edits in unblock.pane

When multiple edits are stacked, send Enter multiple times (once per edit + once for the base edits):

```bash
accept-edits)
    # Accept pending edits — Enter for file edits, then for each bash
    local count="${3:-1}"
    local i
    for ((i=0; i<=count; i++)); do
        tmux send-keys -t "$target" Enter
        sleep 0.5
    done
    console.log "Unblocked $label ($status) → ${count}x Enter (accept stacked edits)"
    ;;
```

### 4. Add accept-edits to the idle detection

If accept-edits bar is showing but the agent prompt is empty (idle), the agent finished its turn but edits weren't accepted. Detect this:
- Look for `⏵⏵ accept` AND empty `❯` prompt = "stuck-edits" (agent done, edits pending)

## IMPORTANT Notes

- The `result` variable uses `|` as delimiter. Adding a third field (edit count) requires updating the parsing in `unblock.pane` — use `${result}` splitting carefully.
- Keep the third field optional for backward compatibility.
- Test with actual pane captures — the `⏵⏵` characters are UTF-8.

## Testing

From `components/OOSH/dev.claude/`:
```bash
# 1. Syntax check
bash -n hiveMind

# 2. Verify accept-edits case is separate from permission
grep -A3 'accept-edits)' hiveMind

# 3. Verify permission case no longer includes accept-edits
grep -B1 -A3 'permission)' hiveMind | head -10

# 4. Test sweep.detect against a real pane with accept-edits bar
# (find a pane showing ⏵⏵ accept edits)
./hiveMind sweep cursorOrchestrator

# 5. Verify Down is NOT sent for accept-edits
# The log should show "Enter (accept edits)" not "Down+Enter"
```

## When Done
Commit: "Task 56: Fix accept-edits handler — separate from permissions, handle stacked edits"
Then say: "Task 56 committed"
