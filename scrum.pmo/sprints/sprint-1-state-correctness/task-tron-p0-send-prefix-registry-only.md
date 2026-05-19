# Task: Tron P0 — send.prefix reads registry only (drop HIVEMIND_ROLE env path)

**Sprint:** 1 — State Correctness Architecture
**Priority:** P0 (Tron-escalated)
**Origin:** PO directive 2026-05-12 LATE via ooshTeam:0.0
**Status:** Done

## Problem

`private.otmux.send.prefix` (in `otmux`) reads `HIVEMIND_ROLE` from the
calling pane's environment **first**, then falls back to the registry only if
the env var is empty. This is wrong:

- `HIVEMIND_ROLE` is exported once at shell start and persists for the lifetime
  of that shell — it does NOT auto-update after `swap-pane`, `pane.move`, or
  `agent.rename`.
- Bug #3 mitigation (`pushRoleEnv`) papers over this by best-effort pushing the
  new value to plain shells, but Claude TUIs are skipped (sending into a TUI
  injects text into the prompt — harmful), so any swap involving a TUI leaves
  the env stale.
- Sprint 1 just built event dispatch + registry handlers + the 3-field TTL
  registry — the registry IS the single source of truth. Reading env first
  defeats that whole stack.

Symptom: after pane swaps/renames involving TUIs, sender prefix prints the
**old** role (`[@oosh-architect ooshTeam:0.2] ...` from a pane now occupied by
oosh-expert). Tron sees the wrong tag.

## Fix

Single edit in `otmux` (file: `/Users/donges/oosh/otmux`, function
`private.otmux.send.prefix`):

- Remove `local myRole="${HIVEMIND_ROLE:-}"` and the `[ -z "$myRole" ]` guard.
- Always grep the registry for the role keyed by `myPane`.
- Add early return if the registry file is missing (no role → no prefix).

Bonus: update stale comments in `hiveMind` `pane.pushRoleEnv` to reflect that
the env is no longer the source of truth for send.prefix. The push is still
useful for future-launched Claude processes (which read env at boot) and for
user-visible `$HIVEMIND_ROLE` in shells.

## Diff (otmux, ~lines 1727–1738)

```bash
private.otmux.send.prefix() # # return sender prefix [@role pane] or empty string
# Reads role from the hivemind registry (single source of truth) — never from
# HIVEMIND_ROLE env var, which is set once at shell start and goes stale after
# pane swaps/moves/renames. Per PO directive (Tron P0, 2026-05-12): the registry
# is the ground truth; env reads here cause stale role leakage.
{
  local reg="${HIVEMIND_REGISTRY:-${CONFIG_PATH:-$HOME/config}/hivemind.roles.env}"
  local myPane
  myPane=$($TMUX_CMD display-message -p "#{session_name}:#{window_index}.#{pane_index}" 2>/dev/null)
  [ -z "$myPane" ] && return
  [ -f "$reg" ] || return
  local myRole
  myRole=$(grep "^${myPane}|" "$reg" 2>/dev/null | head -1 | cut -d'|' -f2)
  [ -n "$myRole" ] && echo "[@${myRole} ${myPane}] "
}
```

## Verification

1. From this pane (`ooshTeam:0.2` / `oosh-expert`):
   ```bash
   private.otmux.send.prefix    # → "[@oosh-expert ooshTeam:0.2] "
   ```
   Same result whether `HIVEMIND_ROLE=stale-role` is exported or unset.

2. With `HIVEMIND_ROLE` deliberately polluted:
   ```bash
   HIVEMIND_ROLE=fakefake bash -c 'source otmux; private.otmux.send.prefix'
   ```
   Should still print the registry-correct role for the current pane (or empty
   if no registry entry — never `fakefake`).

3. Regression for the original Bug #3 motivation: after `agent.rename` and
   `panes.swapped`, the next `otmux send <selfpane> "msg"` from that pane should
   produce the NEW role in the prefix without requiring a shell restart.

## TTL/registry guarantees this rests on

- B5.1 TTL-priority pattern: file writes from `registry.set` win within
  `HIVEMIND_REGISTRY_TTL=30`s (env-overridable). Live-discovery is the fallback
  outside that window — but always still ground-truth-driven, never env.
- SC-C.5/6/7 handlers update the registry on every panes.shifted/swapped/moved
  before send-paths can race.
- SC-C.3 (agent.renamed) handler updates the registry entry on rename.

So the registry is fresh by definition at every send call site.

## Commit

`<otmux send.prefix: registry-only role lookup — drop stale HIVEMIND_ROLE env read (ref: task-tron-p0-send-prefix-registry-only.md)>`
