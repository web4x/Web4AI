# Task: Replace raw tmux send-keys with otmux wrappers

**Assigned to**: Expert (0.4)
**Source**: session/oosh-bugs.md — Agent Behavior Issues
**Priority**: P2

## Problem

Raw `tmux send-keys` used throughout codebase instead of `otmux send` wrappers. This bypasses logging, naming, and role registry. It's an anti-OOSH pattern.

## Scope

Replace raw `tmux send-keys` with `otmux send` in these files:

### hiveMind (highest priority — 13 occurrences)
- Line 245: agent spawn — `tmux send-keys -t "$pane_id" "cd..."`
- Lines 367-369: legacy spawn
- Line 439-441: session resume
- Line 642: agent send
- Line 840: agent prompt
- Line 985: system prompt
- Line 1477: unblock option send
- Lines 1605-1633: unblock.pane (Down/Enter/Escape sends)

### claudeCode (1 occurrence)
- Line 649: `tmux send-keys "cd '$workdir' && $cmd" Enter`

### claudeFlow (3 occurrences)
- Lines 1235-1249: pane control

### EXCEPTIONS — do NOT change:
- `otmux` itself (it wraps tmux — that's its job)
- `test/test.c2` (test harness, direct tmux is acceptable for testing)
- Lines inside `private.otmux.*` functions (they ARE the wrappers)

## Replacement Pattern

```bash
# BEFORE (raw tmux):
tmux send-keys -t "$pane" "text" Enter

# AFTER (otmux wrapper):
"$OOSH_DIR/otmux" send "$pane" "text" Enter
# OR for literal text + Enter:
"$OOSH_DIR/otmux" send "$pane" "text" Enter
```

Use `"$OOSH_DIR/otmux"` (not `./otmux`) since these scripts may run from different directories.

## Testing

```bash
# 1. Syntax check all modified files
bash -n hiveMind
bash -n claudeCode
bash -n claudeFlow

# 2. Verify otmux send still works
./otmux send cursorOrchestrator:0.3 'echo hello' Enter

# 3. Count remaining raw tmux send-keys (should only be in otmux and tests)
grep -rn 'tmux send-keys' . --include='[a-z]*' | grep -v otmux | grep -v test/
```

## When Done
Commit: "Replace raw tmux send-keys with otmux wrappers in hiveMind/claudeCode/claudeFlow"
Then say: "raw tmux audit committed"
