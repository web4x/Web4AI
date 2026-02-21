# Re-Test v2: oo shim at ~/.local/bin/oo (commit e8fb73e)

**Agent**: oosh-tester
**Date**: 2026-02-20

## Results

| Test | Description | Result | Notes |
|------|-------------|--------|-------|
| T1 | `oo mode` show current | **PASS** | "Mode: dev.claude", path, git status |
| T2 | `oo mode main` switch | **PASS** | Symlink switched, "Switched to: main" |
| T3 | From main: `oo mode dev.claude` | **FAIL** | Infinite recursion in bootstrap delegation — hangs |
| T4 | From main: `oo use latest user list` | **PASS** | Returns user list from latest. Symlink unchanged. |
| T5 | `oo use main oo mode` one-shot | **PASS** | Ran main's old `oo mode`, symlink unchanged |
| T6 | `oo use` invalid branch | **PASS** | Error, exit code 1 |
| T7 | `oo use` invalid command | **PASS** | Error, exit code 1 |
| T8 | Round-trip switching | **FAIL** | Hangs on second switch (same as T3) |
| T9 | Tab completion | **PASS** | Both completions list 20 branches incl. `latest` |

**Score: 7/9 PASS, 2 FAIL**

Improvement from v1: T4 now PASS (was FAIL), T6/T7 cleaner errors. T3/T8 still FAIL.

## Progress: `oo use` works, `oo mode` switch-back doesn't

The shim correctly intercepts `mode` and `use` commands and delegates to latest. PATH ordering verified: `~/.local/bin/oo` resolves before `~/oosh/oo`.

**`oo use` (T4, T5, T6, T7): ALL PASS.** The `oo.use()` function works perfectly from any branch because it uses `exec` with absolute paths — no recursive delegation.

**`oo mode` switch-back (T3, T8): FAIL.** Two bugs stack:

### Bug 1: `source latest/this` hangs in shim

`this.isSourced()` (line 557) checks `${0##*/}` vs `${BASH_SOURCE[1]##*/}`. When the shim (`~/.local/bin/oo`) sources `latest/this`:
- `$0` = `oo` (the shim)
- `BASH_SOURCE[1]` = `oo` (the shim)
- Match → `create.result 1` → NOT sourced → enters started path → spawns `$BASH_FILE` interactive shell (line 844) → **HANGS**

**Fix**: Add `export STARTED=true` before `source "$LATEST/this"` in the shim. This skips the bootstrap entirely (line 770 checks `STARTED`).

### Bug 2: Bootstrap delegation infinite recursion

Even with `STARTED=true` fixing the hang, `oo.mode()` (line 231) checks if `~/oosh` symlink matches latest. When on main:
- `current_target` = `.../OOSH/main`
- `latest_target` = `dev.claude`
- Mismatch → sources latest/this + latest/oo → calls `oo.mode()` recursively
- But `~/oosh` still points to main → same mismatch → infinite recursion

**Fix**: Add a guard variable to prevent recursive delegation:
```bash
# At top of oo.mode(), before the bootstrap check:
if [ -n "$_OO_MODE_FROM_LATEST" ]; then
  : # Already delegated, skip bootstrap
elif [ "$current_target" != "$WORKTREE_BASE/$latest_target" ]; then
  export _OO_MODE_FROM_LATEST=1
  source "$LATEST/this" 2>/dev/null
  source "$LATEST/oo" 2>/dev/null
  oo.mode "$@"
  return $?
fi
```

### Combined fix for the shim:

```bash
#!/usr/bin/env bash
LATEST="/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/latest"
export STARTED=true              # Fix Bug 1: prevent this bootstrap hang
export _OO_MODE_FROM_LATEST=1    # Fix Bug 2: prevent recursive delegation

case "$1" in
  mode)
    shift
    source "$LATEST/this" 2>/dev/null
    source "$LATEST/oo" 2>/dev/null
    oo.mode "$@"
    ;;
  use)
    shift
    source "$LATEST/this" 2>/dev/null
    source "$LATEST/oo" 2>/dev/null
    oo.use "$@"
    ;;
  *)
    unset STARTED _OO_MODE_FROM_LATEST  # Don't leak into normal oo
    exec "$HOME/oosh/oo" "$@"
    ;;
esac
```

And in `oo.mode()`, add the guard check:
```bash
if [ -z "$_OO_MODE_FROM_LATEST" ] && \
   [ "$current_target" != "$WORKTREE_BASE/$latest_target" ] && \
   [ "$current_target" != "$LATEST" ]; then
  export _OO_MODE_FROM_LATEST=1
  source "$LATEST/this" 2>/dev/null
  source "$LATEST/oo" 2>/dev/null
  oo.mode "$@"
  return $?
fi
```

## Symlink Status

Manually restored to dev.claude after each failed test. Verified: `~/oosh` → `.../OOSH/dev.claude`.
