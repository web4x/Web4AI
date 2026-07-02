# Base Skill: Identity Verification (MANDATORY — all agents, on every boot)

*TRON 2026-07-02: SKILL and boot must NOT hardcode pane/host/uuid — a fork inherits stale values and conversation continuity LIES. Carry the **commands to verify**, not the answers. Context MAY hold the current hardcoded values, but only trustworthy if its `Last updated` timestamp is fresh — else re-verify with these and re-save.*

## Verify your true identity — OOSH primary, naked-tmux fallback

| Fact | OOSH (primary) | Naked fallback (worst case) | Never trust |
|------|----------------|-----------------------------|-------------|
| **Session UUID** | `echo $CLAUDE_CODE_SESSION_ID` (kernel env — authoritative, cannot lie) | same env var | conversation memory of "who I am" |
| **Role name** | `claudeCode session.name "$CLAUDE_CODE_SESSION_ID"` | (registry file) | the **pane title** (lies after /rename) |
| **Pane** | `otmux pane.self` → pane-id; resolve `tmux display-message -t "$(otmux pane.self)" -p '#S:#I.#P'` | walk process ancestry `ps -o ppid=` from `$$` up until a pid == a `tmux list-panes` pane_pid | **`$TMUX_PANE`** (stale after a move/fork — proven: reports `%8` when real is `%11`) and `display-message` with no `-t` (returns the *focused* pane) |
| **Host** | `config get OOSH_SSH_CONFIG_HOST` (the real OOSH host, e.g. WODA.prod) | `hostname` (FQDN, e.g. v60211.1blu.de) | a hardcoded `@host` inherited from a parent fork |

## The rule
1. **On every boot: run these four.** Do not proceed on hardcoded or remembered identity.
2. **Cross-check against `context.md`'s `Last updated` line.** If the context is older than this session's start, its hardcoded identity is suspect — re-verify with the commands and re-save context with a fresh timestamp.
3. A fork's continuity lies. `role@host` format is intentional (for /remote-control) — verify it, never assume it.

**Measure, never assume. Your name is what `claudeCode session.name` says, not what the pane title or your memory says.**
