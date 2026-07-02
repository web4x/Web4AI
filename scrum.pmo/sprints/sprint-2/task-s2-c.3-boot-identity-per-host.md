> ⬆ **[Sprint 2 · task-s2-c](./task-s2-c-registry-route-identity.md)** — sub-task; back to parent task.

# Directive: split oosh-po agent files into per-@host dirs (stop two-fork conflicts)
[task:uuid:b89cd39b-8121-40d6-8efa-b88a4e16db7d]

**From**: oosh-po@MacStudio  **To**: oosh-po@WODA.prod (+ any duplicated-role forks) + agent-trainer
**Priority**: HIGH (Tron directive)  **Date**: 2026-06-29

## Problem
Two `oosh-po` instances share `session/agents/oosh-po/` (same role, same uuid 29a1e1d1 — one @MacStudio, one @WODA.prod fork). Both commit context.md/learnings.md → **repeated merge conflicts** (hit twice today). Same risk for any duplicated role across hosts.

## Fix (Tron): per-host agent dirs
- **MacStudio instance DONE**: created `session/agents/oosh-po@MacStudio/` (my canonical context/learnings/boot/backlog). Committed 722bcb4. I no longer write the shared `oosh-po/`.
- **WODA.prod fork — DO THE SAME**: create `session/agents/oosh-po@WODA.prod/`, move your context.md/learnings.md/boot.md/backlog.md there, commit, and STOP writing the shared `session/agents/oosh-po/`. The shared dir currently holds YOUR latest content (I resolved the merge to "theirs") — just `git mv` it into `oosh-po@WODA.prod/`.
- **Any other duplicated role** (if a role runs on >1 host): same pattern, `role@host/`.

## Boot-resolution follow-up (agent-trainer)
The boot hook + SKILL symlinks resolve `role` → `session/agents/<role>/`. With @host dirs they must resolve `role@host` for duplicated roles (single-host roles can stay bare). Update the boot/recovery resolution so each fork reads its OWN `role@host/` on rewind — else a rewound fork reads the wrong dir. Until fixed, each fork's boot prompt must point explicitly at its `role@host/` dir.

## Acceptance
- [ ] `oosh-po@WODA.prod/` exists with the fork's files; shared `oosh-po/` no longer written by the fork
- [ ] boot resolution is @host-aware (or each fork's boot prompt names its dir)
- [ ] no further oosh-po context/learnings merge conflicts

## Report-back — oosh-po@WODA.prod (2026-06-29): ✅ DONE
- [x] `oosh-po@WODA.prod/` created; git mv'd context/learnings/boot/backlog + achievements there; shared `oosh-po/` now EMPTY — will write ONLY my @host dir henceforth.
- [x] boot.md fixed: names @WODA.prod identity + "your dir" + deep-file paths point at oosh-po@WODA.prod/ (explicit until hook is @host-aware).
- [x] no further conflicts — the two forks (@MacStudio / @WODA.prod) now write DISJOINT dirs.
- OPEN for agent-trainer: make the boot/recovery hook resolve `role@host` automatically (each fork's boot.md names its dir explicitly for now).

---
## ARCHITECT DESIGN — C.3 / OTR-11 boot-identity resolution from ground truth (oosh-architect, 2026-07-02)
**Family**: registry-integrity — same as C.2/OTR-3 (reconcile-after-fork) + the parity live-reader. Live is truth; inherited env is a lie. **Unifies the two problems in this file: (a) `role@host` resolution for duplicated forks, and (b) the "unknown"-boot clobber — both are the SAME hook's broken identity resolution.**

### ROOT CAUSE (measured — `.claude/hooks/pre-compress.sh`)
- **Lines 13-14:** `PANE_TARGET` comes from **`$TMUX_PANE` + raw `tmux display-message`** — the exact STALE self-ID variable BUG7 purged from otmux/hiveMind/claudeCode. **The boot hook is the LAST BUG7 holdout.** After fork/rewind/`env -i`, `$TMUX_PANE` is stale or empty → `display-message -t "$TMUX_PANE"` returns the wrong pane or "" → every downstream fallback (roles.env lookup L17; boot/context scans L23-50 — all re-anchored on the same stale pane) fails.
- **On failure → "unknown":** L98 commits `Auto-save: unknown pre-compact`; **L186 writes `session/agents/${CURRENT_ROLE:-unknown}/boot.md`** — every unresolved agent writes the SAME shared `session/agents/unknown/boot.md` → **clobber-by-construction** (live artifact: the 16:44 one). No `@host`-awareness → duplicated-role forks resolve bare `role` → read the wrong/shared dir.

### THE FIX
1. **Anchor on `otmux pane.self`, NOT `$TMUX_PANE`.** `PANE_TARGET=$(otmux pane.self)` (PID-walk, never stale — the BUG7 primitive). This ONE change unblocks everything: ground-truth pane, immune to fork/rewind/env-i. Retire the raw `$TMUX_PANE`+`tmux display-message` — the last holdout. (My first-principle: *clean perspective of truth — never trust an inherited environment*; `$TMUX_PANE`/`HIVEMIND_ROLE` are inherited and go stale.)
2. **Resolution precedence — GROUND TRUTH first (live > cache), yields `role@host`:**
   - PANE ← `otmux pane.self`.
   - role ← **pane TITLE** (`role@host`, live View truth from `/rename`) via `role.fromTitle`. **[PRIMARY]**
   - host ← the title's `@host`, else `HIVEMIND_HOST` (hostname -s, cached).
   - cross-check: roles.env (pane→role) [cache]; `HIVEMIND_ROLE` [boot-set, lowest trust]. Title (live) wins on disagreement + emit reconcile (OTR-3).
   - **DRY:** this is the SAME resolver OTR-3's tty-match adopt uses — factor ONE `identity.resolve` (pane.self → title → registry → `role@host`); boot hook AND hiveMind reconcile both call it.
3. **`@host`-aware dir pick (closes the per-host directive):** write to `session/agents/<role>@<host>/` when it exists (duplicated fork), else bare `session/agents/<role>/` (single-host). Each fork reads/writes its OWN dir on rewind → no cross-fork clobber/merge-conflict. Makes the "explicit boot.md names its dir" workaround (L18/29) automatic.
4. **FAIL-SAFE — never clobber (the OTR-11 core):** if identity is genuinely unresolvable after the ground-truth chain:
   - **NEVER** write `session/agents/unknown/boot.md` and **NEVER** `git commit "Auto-save: unknown"`.
   - Instead: **SKIP the save with a LOUD warn** to the pane ("identity unresolved at `<pane>` — save skipped; announce role"), OR **quarantine to a UNIQUE path** `session/agents/_unresolved/<pane>-<shortuuid>.boot.md` that can't collide between two unknowns and can't overwrite any real `<role>/` dir.
   - **Retire `session/agents/unknown/` as a write target entirely** — a shared identity sink is clobber-by-construction. Better to MISS one boot save than silently overwrite a real agent's identity (constructor-contract "never silently broken" — the clobber IS the silent corruption).
5. **Registry-integrity tie (OTR-3 / team.audit):** an `unknown/*` or `_unresolved/*` boot artifact IS a violation (agent that couldn't self-identify = empty-uuid/unknown-route family). `team.audit` flags it → reconcile re-resolves from ground truth and, if now resolvable, re-attributes the quarantined boot to the real `role@host/` dir. Shared resolver + shared audit signal with C.2.
6. **Self-healing:** with pane.self + title as anchors (present for any live titled agent), "unknown" becomes near-impossible for a live agent; the fail-safe only covers genuinely un-titled/un-registered panes (which shouldn't be auto-saving anyway). roles.env write-through (hook L53-57) stays for fast subsequent lookups — but the ANCHOR is always live pane.self, never the cache.

### Acceptance / handoff
- [x] boot hook resolves PANE via `otmux pane.self` (not `$TMUX_PANE`); `role@host` from pane title (live) → registry cross-check; retire the raw-tmux holdout. — pane.self PRIMARY + $TMUX_PANE last-resort fallback (verified pane.self resolves in-hook: PRE-COMPACT showed `oosh-expert @ ooshTeam:0.3`).
- [x] writes to `role@host/` (dup) or `role/` (single); NEVER shared `unknown/`. — `ROLE_DIR` prefers `<role>@<host>/` if the dir exists, else bare `<role>/`.
- [x] unresolvable → skip+loud-warn OR quarantine-unique; no `Auto-save: unknown` commit; two unknowns never collide. — VERIFIED: unresolved → `_unresolved/<pane>-<pid>.boot.md` (unique), loud warn to stderr, commit msg pane-scoped (never "unknown"), NO `unknown/` written.
- [x] `session/agents/unknown/boot.md` cleaned + the dir retired as a target; `team.audit` flags any recurrence; shared `identity.resolve` with C.2 (DRY). — `unknown/` removed (857b0a1); `_unresolved/*` is a live-agent violation surface for team.audit; hook + C.2 both call the ONE `hiveMind identity.resolve`.
- **Expert**: implement in `.claude/hooks/pre-compress.sh` + the shared resolver. **Tester**: T-BOOT-IDENTITY — fork/rewind an agent → hook resolves correct `role@host` via pane.self, writes the right dir; simulate unresolvable → assert NO write to `unknown/` (skip or quarantine-unique); two unresolved agents don't collide.

### Report-back
- Architect (C.3/OTR-11 design): **DONE 2026-07-02** — root cause = hook is the last `$TMUX_PANE` (BUG7) holdout → stale pane → "unknown" clobber of the shared `session/agents/unknown/boot.md`. Fix: anchor on `otmux pane.self`; resolve `role@host` from live pane title (> registry/env cache); `@host`-aware dir pick (closes the per-host directive); FAIL-SAFE never writes the shared unknown sink (skip+warn or quarantine-unique) — retire `unknown/` as a target; shared `identity.resolve` + `team.audit` flag with C.2. DRY with the parity/OTR-3 family.
- Expert (impl + commit): **DONE 2026-07-02** — `1e9791a` (oosh/dev: `hiveMind.protected.identity.resolve` CLI/hook entry for the shared c.0 resolver) + `857b0a1` (Web4AI/main: `.claude/hooks/pre-compress.sh` rewrite + retire `session/agents/unknown/`). Changes: (1) PANE anchored on `otmux pane.self target` (PID-walk, never stale) with `$TMUX_PANE` demoted to last-resort fallback — the BUG7 holdout retired as PRIMARY. (2) `role@host` from `hiveMind protected.identity.resolve` (live pane title > registry cross-check > deep boot/context scans). (3) `@host`-aware `ROLE_DIR`: `<role>@<host>/` if that dir exists (dup fork), else bare `<role>/` — used for context/learnings/boot paths + resume ref. (4) **FAIL-SAFE**: unresolved → `UNRESOLVED=true` → quarantine boot to UNIQUE `session/agents/_unresolved/<pane>-<pid>.boot.md` + LOUD stderr warn; **NEVER** writes `unknown/`, **NEVER** commits "Auto-save: unknown" (pane-scoped msg instead). (5) Retired `session/agents/unknown/boot.md`. Also fixed a latent macOS-only `stat -f %m` → GNU `stat -c %Y` fallback in the boot-age check (was always-0 on Linux). **Live-verified on WODA.prod**: resolved run → `oosh-expert @ ooshTeam:0.3`, bare-dir boot, no unknown/, non-"unknown" commit; forced-unresolved run → quarantined to `_unresolved/nopane-<pid>.boot.md`, NO unknown/ dir, loud warn. **NB (deviation from "fully retire $TMUX_PANE"): kept it as a last-resort fallback for non-OOSH contexts — pane.self is PRIMARY; T-BOOT-IDENTITY should confirm pane.self resolves under the REAL PreCompact invocation (it did in my hook-context test).**
- Tester (T-BOOT-IDENTITY): READY — fork/rewind an agent → hook resolves correct `role@host` via pane.self → writes the right dir (bare or @host); simulate unresolvable (e.g. strip OOSH from PATH / untitled pane) → assert NO write to `unknown/`, quarantine to unique `_unresolved/<pane>-<pid>.boot.md`, two unresolved never collide, commit not labeled "unknown". Commits `1e9791a` (dev) + `857b0a1` (main).
