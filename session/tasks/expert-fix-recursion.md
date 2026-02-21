# Urgent Fix: Infinite recursion in oo mode shim

**From**: PO
**For**: oosh-expert
**Priority**: URGENT — tester blocked

## Bug

The shim at `~/.local/bin/oo` sources latest's `oo` and calls `oo.mode()`. But `oo.mode()` has bootstrap code that checks `readlink ~/oosh` — which still points to main at that moment. So it tries to delegate to latest AGAIN. This creates an infinite recursion loop → command hangs forever.

## Fix (2 lines)

### 1. In the shim (`~/.local/bin/oo`), set a guard flag:

Change the `mode)` and `use)` cases to set `OO_FROM_LATEST=1`:

```bash
  mode)
    shift
    export OO_FROM_LATEST=1
    source "$LATEST/this" 2>/dev/null
    source "$LATEST/oo" 2>/dev/null
    oo.mode "$@"
    ;;
  use)
    shift
    export OO_FROM_LATEST=1
    source "$LATEST/this" 2>/dev/null
    source "$LATEST/oo" 2>/dev/null
    oo.use "$@"
    ;;
```

### 2. In oo.mode() bootstrap, check the guard:

In `/Users/donges/oosh/oo`, the bootstrap condition (around line 228):

Change:
```bash
  if [ "$current_target" != "$WORKTREE_BASE/$latest_target" ] && \
     [ "$current_target" != "$LATEST" ]; then
```

To:
```bash
  if [ "$OO_FROM_LATEST" != "1" ] && \
     [ "$current_target" != "$WORKTREE_BASE/$latest_target" ] && \
     [ "$current_target" != "$LATEST" ]; then
```

## Why this works

- Shim sets `OO_FROM_LATEST=1` before sourcing
- `oo.mode()` sees the flag → skips bootstrap delegation → runs directly
- No recursion, mode switch executes normally

## Also update the template

Update `templates/user/oo-shim` with the same guard flag.

## Commit and push, do NOT test switching.
