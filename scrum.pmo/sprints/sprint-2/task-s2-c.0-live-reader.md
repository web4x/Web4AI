> ⬆ **[Sprint 2 · task-s2-c](./task-s2-c-registry-route-identity.md)** — sub-task; back to parent task.

# Task S2-C.0: the canonical live-truth reader (DRY foundation for C.2 / C.3 / parity)

**From**: oosh-po@WODA.prod (architect-spotted; PO-approved) · **Architect**: oosh-architect · **Date**: 2026-07-02
**Priority**: HIGH — foundation; C.2 (reconcile-after-fork) + C.3 (boot-identity) + parity all CONSUME it.
**Family**: live-is-truth / registry-integrity. **DO NOT reinvent** — CANONICALIZE + EXTEND the already-shipped `private.hiveMind.live.tupleset` (parity seed).

## Why (the risk this closes)
Parity, C.2, and C.3 each say "use the shared reader / `identity.resolve`" but none specs it as ONE named primitive. Implemented separately → **3 divergent readers = the exact re-enumeration parity was built to kill** (the PF2/PF3 root cause: teams.save + status each rolled their own lossy enumeration). c.0 = the ONE reader; everything else is a projection of it.

## The seed (measured — `private.hiveMind.live.tupleset`, hiveMind:1309)
Emits per pane: `sess | addr | role | uuid | title | cwd | <model:empty> | kind`. Sources: `hiveMind.protected.agents.discover` (proc-args → target|role|state|uuid|title|is_claude) + one `tmux list-panes -a` (cwd). Batch, good. **But: LOCAL-ONLY, and missing `tty` + `host`** — the three gaps c.0 fills.

## Canonical tuple (canonicalize — do it NOW, before C.2/C.3 add consumers)
```
host | session | address | tty | role | uuid | kind | title | cwd
```
- **host** (NEW) — which host's live truth this row is. Local rows = `HIVEMIND_HOST` (hostname -s, cached); remote rows = the remote host. Every row self-describing.
- **tty** (NEW) — `#{pane_tty}` (stripped of `/dev/`). The stable-across-fork join key C.2's tty-match adopt + C.3's identity anchor need.
- session, address, role, uuid, kind (agent|shell), title, cwd — retained from the seed.
- Drop the empty `model` middle field — model is derive-on-demand (slow JSONL read), NOT part of the enumeration tuple; a consumer that needs it derives it live.
- **`role` precedence — TITLE-FIRST (live) > registry (cache) [COHERENCE FIX 2026-07-02].** `role` MUST be resolved from the LIVE pane title (`role.fromTitle`, with the `bash`/`zsh` → empty guard), then cross-checked against the registry — NOT registry-first. **The shipped `agents.discover` (hiveMind:28-33) is registry-FIRST ("registry → pane title") — the c.0 impl must FLIP it to title-first.** Why: this is the family's own law (live pane title > cache — same as "prefer pane title over eventual JSONL"); and it's what makes `identity.resolve` (the C.3 projection) ground-truth by construction — a stale/empty registry can no longer yield a stale role. Registry-first would inherit the exact "unknown"/stale-role bug C.3 exists to kill, and is a latent parity staleness (status/save would report a stale role). Title-first fixes both.

## The three EXTENSIONS to the seed
1. **tty** — add one field to the existing batch: `tmux list-panes -aF '…|#{pane_tty}'` (the exact pattern already at otmux:2373; hiveMind has a `tty+title` format at 260-261 and a tty→pane matcher at 2812-2813 to REUSE). Free — same call class, no per-pane subprocess.
2. **host** — tag every local row with `HIVEMIND_HOST`; remote rows with the remote host (from §3).
3. **LOCAL + REMOTE sourcing** — self-similar recursion:
   - `teams.env` gains a **host column**: `session | description | host` (local teams = HIVEMIND_HOST; remote teams e.g. `remoteOOSH` = the target host — set at `team.push`/register time). This is the session→host map that does not exist today.
   - The reader, per in-scope team: **host == local** → read locally (agents.discover + list-panes + tty/host tag, current behavior extended). **host == remote** → `ossh exec <host> "hiveMind protected.live.tupleset <session>"` → the remote runs the SAME reader locally → returns its canonical rows → trusted as that host's live truth, host-tagged. **ONE reader, runs everywhere; remote truth = the reader executed on the remote.**
   - **FAIL-SAFE (never the PF3 bug):** unreachable remote → emit an explicit `kind=remote-unreachable` marker row for the team (never SILENTLY omit it — PF3 was status dropping remoteOOSH), and never present stale cache as fresh. If a TTL-cache fallback is used, flag it stale. Constructor-contract honesty ("never silently broken").

## ONE reader, ALL consumers (the DRY payoff)
- **parity** (PF1-4): `status` / `team.list` / `teams.save` all call `live.tupleset` → identical tuple-set → parity by construction. (Already the parity plan; c.0 makes it a real single primitive.)
- **C.2 reconcile-after-fork**: the "batch live-uuid" (completes the skipped I2b) + the tty-match adopt read `uuid` + `tty` from `live.tupleset`. No separate enumeration.
- **C.3 boot-identity**: `identity.resolve <pane>` = **a thin projection** — `live.tupleset` filtered to the caller's own pane (via `otmux pane.self`), extract `role@host`. C.3's resolver IS a view of c.0. Exactly the PO's point.

## Interface (object.verb — no flags; variation lives in the verb + the team's host, never a `--flag`)
- `private.hiveMind.live.tupleset <?session>` — the canonical reader (extended; local by default, remote-sources per-team via the host column).
- `hiveMind.protected.live.tupleset <?session>` — CLI/test wrapper AND the remote-exec entry point (`ossh exec <host> "hiveMind protected.live.tupleset <s>"` depends on this existing).
- `private.hiveMind.identity.resolve <pane>` — C.3 projection: role@host for one pane (filter by pane.self).
- Local-vs-remote is decided INTERNALLY from the team's host — not a caller flag.

## Migration (small, do it now)
Audit + update the ~3 existing consumers to the canonical field order: `live.tupleset` internal use (hiveMind:1344), the consumer at hiveMind:3298, and teams.save/status (parity). Few consumers today, C.2/C.3 not yet built → canonicalize before they multiply.

## Performance (preserve the batch discipline)
+tty = one list-panes field (free). host-local = a cached var (free). Remote = ONE `ossh exec` per REMOTE team only (bounded; TTL-cacheable behind the existing `HIVEMIND_REGISTRY_TTL` gate). No per-pane subprocess — keep the seed's single-batch shape.

## Acceptance / handoff
- [x] `live.tupleset` emits the canonical 9-field tuple incl. `tty` + `host`; batch preserved. — VERIFIED (6/6 rows 9-field, tty=pts/N, host=v60211)
- [x] `teams.env` carries a host column; reader sources remote teams via `ossh exec … protected.live.tupleset`; unreachable → explicit marker, NEVER silent omit. — VERIFIED (marker `host|session|||||remote-unreachable|…|`, union emits local+marker)
- [x] `hiveMind.protected.live.tupleset` exists (CLI/test/remote-exec entry). — VERIFIED
- [x] `identity.resolve <pane>` returns role@host as a projection of the reader (C.3 consumes; C.2 consumes tty+uuid). — VERIFIED (`identity.resolve ooshTeam:0.3` → `oosh-expert@v60211`)
- [x] ~3 existing consumers migrated to the canonical order. — role.uuid (awk $5/$6), teams.save (remap→8-field snapshot); teamsave-parity 3/3 green
- **Expert**: extend the seed per §Canonical + §Extensions; add the teams.env host column + remote-exec sourcing; add the protected wrapper + identity.resolve projection. Commit. **Then** C.2/C.3 impl consume it.
- **Tester**: T-LIVE-READER — local tuple has tty+host for every pane; a remote team (remoteOOSH) is enumerated via ossh-exec with host-tagged rows; unreachable remote → marker row, not omission; identity.resolve(pane.self) == the reader's row for that pane.

## Report-back
- Architect (c.0 design): **DONE 2026-07-02** — CANONICALIZE+EXTEND the shipped `private.hiveMind.live.tupleset` (not reinvent): canonical tuple `host|session|address|tty|role|uuid|kind|title|cwd`; add tty (batch list-panes, reuse otmux:2373 pattern + the 2812 tty-matcher) + host; LOCAL+REMOTE via a new teams.env host column + self-similar `ossh exec … protected.live.tupleset` (fail-safe marker, never silent-omit — kills PF3). ONE reader; parity/C.2/C.3 are projections (identity.resolve = pane-filtered view). Migrate ~3 consumers now. object.verb/no-flag; batch preserved.
- Expert (impl + commit): **DONE 2026-07-02** — 2 commits on dev. **`45951ad` (local)**: canonicalized `live.tupleset` → 9-field `host|session|address|tty|role|uuid|kind|title|cwd` (+tty via the existing batch list-panes, +host=HIVEMIND_HOST, dropped empty `model`); **flipped `agents.discover` role resolution to TITLE-first** (`role.fromTitle` > registry — widened `role.isGeneric` to reject bash/zsh/sh so fromTitle is the single title→role parse point with the shell guard); added `hiveMind.protected.live.tupleset` (CLI/test/remote entry) + `private.hiveMind.identity.resolve <pane>` (role@host projection via pane.self); migrated the 2 live consumers (`role.uuid` awk $5/$6, `teams.save` remap to the UNCHANGED 8-field snapshot schema). **`0d9d162` (remote)**: `teams.env` host column (col 3; absent=local, backward-compat) + `private.hiveMind.live.tupleset.remote` sourcing remote teams via `ossh exec <host> hiveMind protected.live.tupleset <s>` (self-similar — remote runs the SAME reader; no recursion since the session is local on the remote); **fail-safe `kind=remote-unreachable` marker row, NEVER silent-omit (kills PF3)**; `private.hiveMind.team.host` reader + `hiveMind.team.host.set` (team.push-time). **Live-verified WODA.prod** (all bullets above). Non-regression: teamsave-parity **3/3**, T-DISPATCH-SUBMIT unaffected. NB: leading blank line on the CLI/remote path is a pre-existing `this`-dispatch artifact; consumers are blank-safe (NF/`-z` guards) and the remote reader filters to `NF==9`.
- Tester (T-LIVE-READER): READY — local tuple has tty+host for every pane (9-field); a remote team enumerated via ossh-exec with host-tagged rows; unreachable remote → marker row (`kind=remote-unreachable`), not omission; `identity.resolve(pane.self)` == the reader's row for that pane. Commits `45951ad`+`0d9d162` on dev.
