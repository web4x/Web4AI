> ⬆ **[Sprint 2 · task-s2-c](./task-s2-c-registry-route-identity.md)** — sub-task; back to parent task.

# OTR-3: hiveMind reconcile-after-fork — adopt orphans (tty-match) + team.audit (empty-uuid / unknown-route)
[task:uuid:1d5d3363-c3f8-43f0-9bb7-cdeb98d62933]

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
  - **COHERENCE FIX (post-c.0, 2026-07-02):** this design's truth source is the canonical **`private.hiveMind.live.tupleset` (c.0)** — read `tty` + `uuid` (and `role`) from IT, the ONE reader. Earlier references above to `claude.processes` and "`tree.detailed` tupleset" name the UNDERLYING proc-args producer c.0 wraps + otmux's cousin method — they are NOT a second reader the expert should consume directly. **Consumer = `live.tupleset`** (which now carries `tty` per c.0). This keeps C.2 a projection of the one reader, not a divergent enumeration.
- Expert (impl + commit): **DONE 2026-07-02 `3946942`** (dev) — **T-RECONCILE-FORK 4/4 GREEN.** §1 I2b: implemented the SKIPPED half of `reconcile.check.i2` — batch live-uuid map from the c.0 `live.tupleset` (pane→uuid, ONE scan), emit `HIGH|I2|S2|UPDATE|<pane>|<liveUuid>|<cached>` on mismatch/empty; existing `reconcile.apply` S2:UPDATE writes it → heals FORKUUID + EMPTY-UUID cache→live. §4 `hiveMind team.audit <session>` (NEW): grades ORPHAN/unknown-route (live agent pane with NO role in S1 — checked against roles.env, NOT the title, since title-first would mask a missing registry entry), EMPTY-UUID (live+no route), DEAD-ROUTE (S2 uuid matching no live process); exit = violation count (U2); completion added. §5 route auto-heal falls out of I2b + reconcile.apply.
  - **⚠ ENABLING FINDING (root cause the design assumed away): the "live reader" was NOT cache-immune for forked agents.** ARON runs `--resume <parent> --fork-session` → proc-args give the PARENT uuid; the live CHILD uuid (f814788a) is only in the JSONL. `claudeCode session.discover` correlates the live JSONL by `customTitle` — but the JSONL customTitle is `ARON@WODA.prod` (sshConfigHost, set at /rename) while the live pane title is `ARON@v60211` (hostname-s). **Exact-title mismatch → JSONL correlation failed → S2-cache fallback → the reader echoed the (bogus, under test) cache** → I2b had no live truth to heal toward. **Fix (in `session.discover`, part of this commit): correlate on the ROLE portion (`${title%%@*}`), not the @host-qualified title — @host is a location qualifier, not identity; role-strip is a SUPERSET of exact-match (no regression). PLUS trim a stray leading newline that `otmux pane.get` prepends (a this-dispatch artifact) which was corrupting the role.** This makes `session.discover` genuinely cache-immune → I2b heals. Verified isolated: bogus S2 → reader returns f814788a (live). **Non-regression: teamsave-parity 3/3, dispatch-submit 5/5, claudeCode suite 83/55 IDENTICAL to HEAD baseline (0 added fails), live sessions.env md5 `bc6f6673` undisturbed.**
  - **Two spin-off findings for PO triage (separate tasks, NOT widening C.2):** (a) **host-naming inconsistency** `@WODA.prod` (sshConfigHost, JSONL customTitle) vs `@v60211` (hostname-s, pane title) — the root of the correlation skew; C.3/boot-identity is the natural home to canonicalize which `@host` is authoritative. (b) **`otmux pane.get` prepends a stray leading newline** (this-dispatch artifact) — worked around in session.discover, but a broad latent issue for any `$(otmux pane.get …)` consumer; candidate otmux fix.
- Tester (T-RECONCILE-FORK): **RED DELIVERED (scenario-first, before OTR-3 impl) — 4/4 FAIL as designed, dev `test/test.reconcile-fork`.** Measured live on WODA.prod; fully ISOLATED via temp `HIVEMIND_SESSIONS`/`HIVEMIND_REGISTRY` copies — **live registry UNTOUCHED** (verified: live sessions.env md5 `bc6f6673` unchanged across the run; no real-agent route disturbed). Dynamic live-anchor (Temple:0.0/ARON/f814788a). Results:
  - **FORKUUID 🔴** — planted a stale (bogus `deadbeef…`) cached uuid for a live agent (post-fork drift); after `consistency.reconcile apply` the cache is STILL bogus → **I2b not implemented** (the SKIPPED cached-uuid==live-uuid half).
  - **EMPTY-UUID 🔴** — empty uuid on a live pane; reconcile leaves it empty (`healed=''`) → I2b/tty-adopt not implemented.
  - **AUDIT-ORPHAN 🔴** — roleless live pane; `hiveMind team.audit <session>` → `Unknown method` (team.audit not created yet).
  - **DEAD-UUID 🔴** — sessions.env uuid matching no live process; `team.audit` → `Unknown method`.
  - Each test asserts the OBSERVABLE contract (healed uuid == live proc-args truth / audit names unknown-route), so §1-5 turn them GREEN by construction: I2b via the shared parity reader heals FORKUUID+EMPTY; `team.audit` grades AUDIT-ORPHAN+DEAD. Run: `test.suite run reconcile-fork`. Committed dev. **Handoff to expert — make GREEN.**
  - **✅ RED→GREEN VERIFIED after expert's OTR-3 impl — 4/4 PASS:** FORKUUID ✓ (reconcile heals stale cache→live via I2b), EMPTY-UUID ✓ (empty uuid healed via tty-match adopt), AUDIT-ORPHAN ✓ (`team.audit` flags roleless live pane unknown-route), DEAD-UUID ✓ (`team.audit` flags the no-live-process uuid). Isolation held — live sessions.env md5 unchanged (`bc6f6673`), zero real-agent disturbance. **OTR-3 verified — reconcile-after-fork closed.**
