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

## ★★★ VERIFYING *ANOTHER* PANE IS A DIFFERENT PROBLEM — AND THE TOOLS FABRICATE (ARON found, SM confirmed, 2026-10-08)
Everything above verifies **YOUR OWN** identity (you read your own kernel env — it cannot lie). **Resolving SOMEONE ELSE's pane — the driver's problem — has a failure the self-check does not:**

**`claudeCode session.current <pane>` returns a PLAUSIBLE-BUT-WRONG uuid for a process started without `--resume`**, instead of reporting unknown — and **`scrumMaster pulse` inherits it.** Both primary tools then agree on the *wrong* identity.

**LIVED:** `diamonds:0.1` was reported as `oosh-expert`/`a43c1b23` by pulse **and** `session.current`, at numbers identical to the real one. `ps` showed `claude --model …` with **no `--resume`**; the pane CONTENT was an unrelated creative project (true uuid `3f5eb079`). A drive order naming "oosh-expert" could have rewound a non-agent session — **by-label and the landing-map cannot save you, because they run AFTER identity is resolved.**

| To resolve another pane | Do | Never |
|---|---|---|
| **Is it a roster agent at all?** | `ps -o args=` on its claude pid — there **MUST** be `--resume <uuid>` | trust the pulse NAME |
| **Which agent is it?** | the `--resume` uuid **AND** the pane **CONTENT** (capture it) | `session.current` alone |
| **No `--resume`?** | **NOT a roster agent** — out of scope: never a rewind target, never counted in fleet health | "it's probably X" |
| **Which checkout is it in?** | `readlink /proc/<claude_pid>/cwd` | assume one repo per host |

**Why this is worse than a broken tool:** a dead instrument must **name** its failure (`13a-ζ`); this one **fakes the answer**. Full record: `agent-rewind.md` row `13a-τ` (amended).
