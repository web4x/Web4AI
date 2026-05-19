# Task: Tron P0 #3 — send.prefix uses TMUX_PANE for subprocess-safe self-pane resolution

**Sprint:** 1 — State Correctness Architecture
**Priority:** P0 (Tron-escalated — production bug)
**Origin:** PO directive 2026-05-12 LATE via ooshTeam:0.0
**Status:** Done (expert); tester smoke + regression pending
**Depends on:** Tron P0 #1 (`af2f76b` — registry-only) — this fixes the resolution that registry-only relies on

## Problem

`private.otmux.send.prefix` resolved the caller's pane via:

```bash
myPane=$($TMUX_CMD display-message -p "#{session_name}:#{window_index}.#{pane_index}" 2>/dev/null)
```

A bare `tmux display-message -p` returns the **focused** pane — the pane the
user last selected via mouse or tmux command. NOT the pane that called
`tmux`. In production, `otmux.send` runs as a subprocess (every shell-out
invocation of `otmux send <target> <text>`). That subprocess has no attached
tmux client; `display-message` falls back to the active pane of the
calling session, which is whichever pane currently has focus — often a
different agent's pane.

Observed:
- I (oosh-expert at `ooshTeam:0.2`) ran `otmux send` from my Bash tool subprocess.
- The focused pane in that tmux session was `ooshTeam:0.0` (oosh-po).
- `display-message -p` returned `ooshTeam:0.0`, registry lookup returned `oosh-po`.
- Prefix delivered: `[@oosh-po ooshTeam:0.0] my-message` — wrong sender.

This had been silently broken since the prefix was added. Tron P0 #1 fixed
the source-of-truth question (registry, not env), but the resolution layer
itself was looking at the wrong pane the whole time. Both fixes are needed
together — registry as source + correct pane as key.

## Fix

`tmux` exports `TMUX_PANE=%N` to every child process of every pane. The
subprocess inherits it. Pass it as `-t` to `display-message` to get the
canonical `session:window.pane` format used as the registry key:

```bash
myPane=$($TMUX_CMD display-message -p -t "$TMUX_PANE" "#{session_name}:#{window_index}.#{pane_index}" 2>/dev/null)
```

Add an early return when `$TMUX_PANE` is empty — i.e. running outside tmux
(CI, plain shell, script run from cron). In those contexts there is no
"sender pane", so no prefix.

## Verification (subprocess context)

Reproduced the bug in a clean subprocess and confirmed the fix:

```
TMUX_PANE=%4
fixed prefix output: [@oosh-expert ooshTeam:0.2]
```

Before the fix, the same subprocess returned `[@oosh-po ooshTeam:0.0]`
because `display-message -p` (no -t) reported the focused pane (0.0), not
the caller's pane (0.2).

Verification matrix:
| Context              | TMUX_PANE | Expected behavior |
|----------------------|-----------|-------------------|
| In-tmux subprocess   | `%N`      | Resolves to own pane via -t → correct prefix |
| Outside tmux         | unset/""  | Empty return — no prefix (was broken before too, now explicit) |
| Stale TMUX_PANE      | invalid   | `display-message -t %N` returns empty → no prefix (safe degradation) |

## Files changed

```
otmux  +9 -3   private.otmux.send.prefix uses -t "$TMUX_PANE" + early empty-TMUX_PANE return
```

Single function, single hunk.

## Send-prefix architecture (now correct end-to-end)

The full send-prefix decision chain:

1. **Self-pane resolution** — `$TMUX_PANE` from env → `tmux display-message -p -t "$TMUX_PANE"` to get session:win.pane format. *(this fix)*
2. **Role lookup** — `grep "^<pane>|" hivemind.roles.env` — registry as single source of truth. *(Tron P0 #1 — `af2f76b`)*
3. **Empty-payload guard** — `this.isEmpty` predicate gates bare-prefix sends. *(Tron P0 #2 + DRY — `3672559`, `1276e58`)*
4. **Key-vs-prose detection** — `private.otmux.is.key` — only prose gets the prefix. *(Tron P0 v2 — `2a39a60`)*

The four together close the prefix correctness loop. Any future regression
would be in one of these four primitives, all of which are now under
explicit tests/fixtures.

## Commit

`otmux send.prefix: resolve caller pane via TMUX_PANE env (subprocess-safe) — bare display-message returns focused pane, not caller (ref: task-tron-p0-send-prefix-tmux-pane.md)`

## Tester handoff

Suggest test: from a non-active pane, run `bash -c 'source otmux …'` (or
just `otmux send.verified` invoked as a subprocess) and verify the prefix
matches the **calling** pane's registry role, not the focused pane's role.
Setup: make two panes with different roles, focus one, send from the other.
Pre-fix would show focused pane's role; post-fix shows caller's.
