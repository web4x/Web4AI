# OTR-3: hiveMind reconcile-after-fork — adopt orphans (tty-match) + team.audit (empty-uuid / unknown-route)

**Type**: DESIGN (architect) · **From**: oosh-architect (PO OTR-3: "adopt orphans via tty-match + team.audit for empty-uuid/unknown-route; same registry-integrity family as the parity reader + route auto-heal") · **Date**: 2026-07-02
**Family**: registry-integrity / consistency — same DRY chokepoint as the parity live-reader (proc-args) + route auto-heal. Live is truth; the registry is a timestamp-gated cache; a fork invalidates the cache for the affected pane; reconcile heals it.

## The decisive finding (measured) — OTR-3 completes a KNOWN skipped check
`private.hiveMind.reconcile.check.i2` (hiveMind:~5036) checks **I2 (HIGH): every pane in S2 (sessions.env) is in S1 (roles.env), UUID matches live ps** — BUT the "**UUID matches live**" half (I2b) is **EXPLICITLY SKIPPED** (code comment: *"Cached UUID must match live Claude on that pane — SKIPPED for now. TODO Sprint 1 follow-up: batch live UUID discovery"*). Only I2a (orphan-in-S2) runs today.

**A `claudeCode fork` breaks exactly I2b:** the pane keeps its role + tty, but the live Claude gets a NEW uuid while sessions.env still caches the OLD one → stale route. There's already a **post-fork event** (hiveMind:527, *"Fires after a successful claudeCode fork; handlers reaffirm S1 pane→role"*) — it reaffirms ROLE but NOT uuid. That is the gap. `push.captureForkedUUID` (hiveMind:4156) closes it for the PUSH path only (pre/post JSONL diff); a plain in-place fork has no capture → stale/empty uuid.

**⇒ OTR-3 = implement I2b (batch live-uuid discovery via the parity reader) + fire it on the fork event + tty-match orphan adoption + a team-scoped audit surfacing empty-uuid / unknown-route.** The deferred "batch live UUID discovery" IS the parity live reader — DRY convergence.

## Design

### 1. Complete I2b — cached uuid must equal live uuid (the core heal)
In `reconcile.check.i2`, implement the skipped half using the **parity live reader** (batch proc-args: pane → live Claude pid → session uuid — the SAME producer OTR-parity factors out). For each S2 entry: if `cachedUuid != liveUuid(pane)` → emit `HIGH|I2|S2|UPDATE|<pane>|<liveUuid>|<role>` (cache→live). Batch, not per-pane (kills the slowness the TODO feared — same reason the parity reader is batch). Fork is the dominant cause of I2b drift.

### 2. Fire on the fork event + SM-sweep safety net (events + reconcile, the established model)
- **Immediate (Option C):** add a **uuid-reconcile handler** to the existing post-fork event (527). After a fork completes, it runs the tty-match adopt (below) for the forked pane → sessions.env carries the new uuid at once (fast happy path). Generalizes `push.captureForkedUUID` to ALL forks, not just push.
- **Safety net (Option B):** the SM-cycle `consistency.reconcile` already runs `reconcile.diff → apply`; with I2b now implemented, it heals any fork the event missed/raced (orphans, cross-host, crashed-mid-fork).
- `team.audit` (below) surfaces whatever both missed — nothing stays silently broken.

### 3. Adopt orphans via TTY-MATCH (the stable join key across a fork)
A fork-in-place reuses the pane's pty → **tty is stable; uuid changes; pane address may renumber** (split/swap). So tty is the robust anchor. `private.hiveMind.claude.processes` already emits `pid|tty|paneTarget|title|args` — live truth with tty. Adoption:
- For each LIVE Claude process: resolve its pane via **tty → live pane** (tmux `#{pane_tty}`), read its uuid from proc-args.
- Match to the registry entry for that pane/tty. **Adopt uuid ALWAYS** (uuid is derivable): write live uuid to sessions.env, reaffirm role from roles.env.
- **Orphan = live Claude whose (tty→pane) has NO role in roles.env.** Policy: adopt the UUID (route it), but **NEVER fabricate a role** — flag as `unknown-route` in team.audit for PO/human resolution. EXCEPTION: if the fork's provenance is known (initiated by `delegate`/`agent.restart` for a specific role), pass that role in and adopt it. Identity is derived or provided, never invented.

### 4. `team.audit <session>` (NEW — team-scoped wrapper over consistency.audit) surfacing the 2 post-fork signatures
`consistency.audit` grades I1-I10 fleet-wide (exit = violation count). `team.audit <session>` scopes it to one team + names the two fork-corruption signatures as graded checks:
- **EMPTY-UUID** — a roles.env pane (has role) with an EMPTY sessions.env uuid AND a live Claude on it → agent live but unrouteable by uuid → HEAL via tty-match (§3). *(Empty uuid + NO live = a legitimate un-booted slot → informational, not a violation.)*
- **UNKNOWN-ROUTE** — any of: a sessions.env uuid matching NO live process (dead route); a live Claude pane with no role (orphan); `private.hiveMind.agent.route` → `unknown-state` (hiveMind:2154/2311). → HEAL (adopt/remove) or flag.
These map to I2b (uuid match) + a routing-integrity invariant. If not yet an explicit invariant, add **I-route: every role resolves to a live deliverable pane; every live agent pane has a role AND a matching-uuid route.** `team.audit` exit code = team violation count (mirrors consistency.audit U2 contract).

### 5. Route auto-heal (closes the loop)
An `unknown-route`/`empty-uuid` finding → `consistency.reconcile.apply` re-derives from live (tty-match) → writes registry → the route heals. Same engine (`reconcile.diff → apply`), now covering the fork-uuid case that I2b was skipping. This is the "route auto-heal" the PO named — it falls out of implementing I2b + the tty-adopt.

## Why this is the parity family (DRY)
- Truth source = LIVE (proc-args via `claude.processes`) — the SAME reader as OTR-parity (`tree.detailed` tupleset). Factor ONE batch live-uuid producer; both I2b and the parity reader call it.
- Cache = registry (roles.env/sessions.env), TTL-gated (`HIVEMIND_REGISTRY_TTL=30`, hiveMind:61) — the timestamp gate already exists.
- Law: fork invalidates the cache for the affected pane; live wins; reconcile heals. Identical to "live pane title > eventual JSONL" and the parity invariant.

## Acceptance / handoff
- [ ] `reconcile.check.i2` implements I2b (batch live-uuid vs cached; UPDATE on mismatch) via the shared live reader.
- [ ] post-fork event runs the tty-match uuid-adopt immediately; SM-sweep reconcile is the safety net.
- [ ] tty-match adopts uuid for every live Claude pane; orphan-without-role → flagged unknown-route, role never fabricated (unless provenance provided).
- [ ] `hiveMind team.audit <session>` exists — team-scoped, grades empty-uuid + unknown-route, exit = violation count, discoverable via completion.
- [ ] auto-heal: audit finding → reconcile.apply heals the route.
- **Expert**: implement §1-5 on dev. **Tester**: T-RECONCILE-FORK — fork an agent in-place, assert sessions.env carries the NEW uuid (not stale) after the event AND after a sweep; orphan (kill role entry) → team.audit flags unknown-route → reconcile adopts; empty-uuid + live → healed; dead uuid → flagged. Measure live.

## Report-back (edit here)
- Architect (reconcile-after-fork design): **DONE 2026-07-02** — see above. Crux: OTR-3 completes the SKIPPED I2b check (cached-uuid==live-uuid, hiveMind:~5047) which is exactly what fork breaks; heals via the parity batch-uuid reader (DRY) on the existing post-fork event + SM-sweep net; tty-match adopts orphans (uuid always, role only-if-derivable); team.audit surfaces empty-uuid/unknown-route → route auto-heals through reconcile.apply.
- Expert (impl + commit):
- Tester (T-RECONCILE-FORK):
