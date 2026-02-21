# Fix: oo mode/use bootstrap paradox v2

**From**: PO (based on tester report: 6/9 PASS, 3 FAIL)
**For**: oosh-expert
**Priority**: HIGH

## The problem (still unfixed)

Your commit 96be66e put bootstrap delegation in dev.claude's `oo.mode()`. But after `oo mode main`, ~/oosh → main, so `oo mode dev.claude` runs **main's** old `oo.mode()` which has no bootstrap.

**The bootstrap code only helps when you're ALREADY on dev.claude.** It never triggers from other branches.

Tester confirmed: T3 FAIL (switch back from main), T4 FAIL (oo use from main), T8 FAIL (round-trip).

## Root cause

PATH resolves `oo` to `~/oosh/oo`. After branch switch, `~/oosh` → target branch. Target branch has OLD code. The bootstrap in dev.claude's oo is unreachable.

## The fix

`~/.local/bin` is #1 on PATH, `~/oosh` is #20. Create a **shim** at `~/.local/bin/oo` that intercepts `mode` and `use`:

```bash
#!/usr/bin/env bash
# oo shim — delegates mode/use to latest, everything else to ~/oosh/oo
LATEST="/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/latest"

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
    # All other oo subcommands go through the normal ~/oosh/oo
    exec "$HOME/oosh/oo" "$@"
    ;;
esac
```

This is NOT an "external script." It's a 15-line shim that routes `oo mode` and `oo use` to `latest` (which is inside oosh). It's the same pattern as oosh putting itself on PATH.

## Implementation steps

1. Create `~/.local/bin/oo` with the shim above
2. `chmod +x ~/.local/bin/oo`
3. Verify: `which oo` should show `~/.local/bin/oo`
4. The existing code in dev.claude's oo (bootstrap in oo.mode, oo.use method, completions) stays as-is
5. Commit the `oo` shim to dev.claude as `templates/user/oo-shim` (so it can be installed by `oo install` later)
6. Push

## Test (do NOT test switching yourself — tester will do it)

Only verify:
- `which oo` → `~/.local/bin/oo`
- `oo mode` (no args, from dev.claude) still works
- `oo use main oo mode` still works

## Do NOT

- Do NOT test `oo mode main` yourself (breaks your environment)
- Do NOT modify other branches' oo scripts
- Do NOT remove the bootstrap code from oo.mode() — it's still useful as defense-in-depth
