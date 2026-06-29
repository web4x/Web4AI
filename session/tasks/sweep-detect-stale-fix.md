# Done: sweep.detect stale scrollback false-active fix

**Agent**: oosh-expert
**Result**: PASS
**Commit**: d79a4c9 (test/macos.latest)

## Problem
sweep.detect classified idle agents as rate-limit/api-error/just-compacted/etc. because scrollback-based checks (grepping full 20-line content) ran BEFORE the live bottom-5-line idle/active check. Stale scrollback from prior states matched first.

## Fix
Restructured detection order: live bottom-5-line checks (active/idle/queued/shell-escaped) now run FIRST, before any scrollback-based pattern matching. If the bottom shows a clear prompt or active signal, it returns immediately without consulting scrollback.

Only when the bottom area is ambiguous (no prompt, no active signal) do we fall through to overlay/error/rate-limit/context checks.

## Verification
`hiveMind team.status ooshTeam` — all 4 Claude panes correctly classified:
- 0.0 oosh-po: idle (was potentially false-positive from scrollback)
- 0.1 oosh-architect: idle
- 0.2 oosh-expert: idle
- 0.3 oosh-tester: stuck-prompt (permission menu)

## Side observation
`hiveMind sweep.detect ooshTeam:0.0` gives terrible error message ("No such file or directory") because `this` dispatch doesn't recognize private method names. Separate fix needed for `this` dispatch to say "private method, not callable from CLI".

## PO Verification (oosh-po, 2026-06-21)
VERIFIED ✅ — fresh `hiveMind team.status ooshTeam` classifies cleanly:
- 0.0 oosh-po active, 0.1 architect idle, 0.2 expert active, 0.3 tester correctly flagged stuck-prompt (real permission menu), now idle after unblock.
- No false rate-limit/api-error/just-compacted from scrollback. Live bottom-5 check FIRST works.
Fix d79a4c9 closes the sweep.detect false-positive bug logged in oosh-po context.

## Follow-up: this-dispatch DONE (12100f8)
**Agent**: oosh-expert
**Commit**: 12100f8

Two guards added to `this` kernel dispatch chain:
1. **Private method**: `hiveMind sweep.detect ooshTeam:0.0` → `ERROR> sweep.detect is a private method of hiveMind — not callable from CLI`
2. **Unknown method**: `hiveMind nonexistent.method` → `ERROR> Unknown method: hiveMind nonexistent.method`

Both are clean one-line errors (no PATH dump, no ENOENT, no debugger stepping). Valid methods unaffected (verified: `hiveMind resolve`, `claudeCode process.running`, `otmux` all pass).

Tester: T-THIS-DISPATCH **7/7 GREEN** (ea63801). Private method → "private method ... not callable from CLI" ✓. Unknown method → "Unknown method: ..." ✓. Both return non-zero ✓. Zero ENOENT/EPERM/line# noise ✓. Valid commands unaffected ✓.
