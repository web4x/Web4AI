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
- [ ] `live.tupleset` emits the canonical 9-field tuple incl. `tty` + `host`; batch preserved.
- [ ] `teams.env` carries a host column; reader sources remote teams via `ossh exec … protected.live.tupleset`; unreachable → explicit marker, NEVER silent omit.
- [ ] `hiveMind.protected.live.tupleset` exists (CLI/test/remote-exec entry).
- [ ] `identity.resolve <pane>` returns role@host as a projection of the reader (C.3 consumes; C.2 consumes tty+uuid).
- [ ] ~3 existing consumers migrated to the canonical order.
- **Expert**: extend the seed per §Canonical + §Extensions; add the teams.env host column + remote-exec sourcing; add the protected wrapper + identity.resolve projection. Commit. **Then** C.2/C.3 impl consume it.
- **Tester**: T-LIVE-READER — local tuple has tty+host for every pane; a remote team (remoteOOSH) is enumerated via ossh-exec with host-tagged rows; unreachable remote → marker row, not omission; identity.resolve(pane.self) == the reader's row for that pane.

## Report-back
- Architect (c.0 design): **DONE 2026-07-02** — CANONICALIZE+EXTEND the shipped `private.hiveMind.live.tupleset` (not reinvent): canonical tuple `host|session|address|tty|role|uuid|kind|title|cwd`; add tty (batch list-panes, reuse otmux:2373 pattern + the 2812 tty-matcher) + host; LOCAL+REMOTE via a new teams.env host column + self-similar `ossh exec … protected.live.tupleset` (fail-safe marker, never silent-omit — kills PF3). ONE reader; parity/C.2/C.3 are projections (identity.resolve = pane-filtered view). Migrate ~3 consumers now. object.verb/no-flag; batch preserved.
- Expert (impl + commit):
- Tester (T-LIVE-READER):
