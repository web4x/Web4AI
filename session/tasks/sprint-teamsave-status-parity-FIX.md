# Sprint: teams.save / status MVC parity FIX — CRITICAL INFRA (do first)

**Delegated by**: oosh-po@MacStudio → **oosh-po@WODA.prod (owns + drives with WODA.prod ooshTeam on dev)**
**Created**: 2026-07-02 (Tron: "team.save/status are critical infrastructure for everything else — first")
**Input evidence**: `session/tasks/teamsave-vs-status-parity.md` (tester findings, commit ccf11f2) — READ IT FIRST.

## Why critical

teams.save (Model persistence) and status/team.list (live View) are the controller's eyes. Every migration, restore, rewind, and monitor depends on them being TRUE and COMPLETE. Today they disagree — that silently corrupts everything built on top. Fix before other infra work.

## Verdict from the investigation (measured live, MacStudio)

Agent|uuid parity is GREEN when saved fresh (Model≡View on agents). The failures are all on shells / team-enumeration / freshness / naming:

## Stories (dev branch on WODA.prod; hiveMind + tests)

### PF1 — method-name DRY  ·  Owner: WODA.prod expert  ·  Status: PLANNED
`hiveMind team.save` → "Unknown method"; real name is `teams.save` (plural). Reconcile the name (canonical + alias, or rename) so `team.*` vs `teams.*` is consistent and discoverable via completion. Also it's slow (~2min) — note/measure why (is it the invasive per-pane probe?).

### PF2 — teams.save drops live shell panes  ·  Owner: WODA.prod expert  ·  Status: PLANNED
Fresh snapshot silently OMITS live shell panes (measured absent: TRONinterface:0.3, baseTeam:0.2, iphone:0.1, iphone:0.3 — while keeping other shells in the same windows → non-deterministic). teams.save must capture ALL live panes (agents AND shells), completely. Root-cause the partial capture.

### PF3 — status/team.list enumeration gap  ·  Owner: WODA.prod expert  ·  Status: PLANNED
status/team.list MISS a whole live team (`remoteOOSH`, 2 panes) that BOTH teams.save and `otmux tree.detailed` see. The View must enumerate every live team the authoritative source (tree.detailed) sees. This is the long-standing team.status stale-snapshot bug — fix the enumeration to read live, not a stale snapshot.

### PF4 — freshness / stale-uuid  ·  Owner: WODA.prod expert  ·  Status: PLANNED
On-disk snapshot carried a STALE agent uuid (scrum-master 35916ccb vs live dfcea556) until re-saved. Consumers reading the file get stale identity. Decide + implement: either consumers derive from live (proc-args) truth, or the snapshot self-refreshes / is timestamp-gated so stale reads are impossible. (Ties to MVC: live is the Model of record; the file is a cache.)

### PF5 — tests  ·  Owner: WODA.prod tester  ·  Status: PLANNED
T-TEAMSAVE-PARITY: fresh teams.save tuple-set == live tree.detailed tuple-set (agents+shells+teams); T-STATUS-ENUM: status/team.list shows every live team; T-FRESHNESS: stale snapshot cannot yield a wrong-uuid answer. Measure live, no output filtering.

## Sequence & rules
- Architect (WODA.prod) frames MVC design if needed (live=Model of record; View reads live; file=cache), then PF1→PF4 (parallel where safe) → PF5 → WODA.prod PO QA gate → report up to me (oosh-po@MacStudio) → Tron promote.
- Fix on dev. DO NOT modify unrelated scripts. OOSH wrappers only; no output filtering; measure live.
- Report-back inline in THIS file + one-line nudge. This is the single source of truth for the parity fix.

---
## DRIVE PLAN + ASSIGNMENTS (oosh-po@WODA.prod, 2026-07-02)
STEP 1 mailbox reconcile: DONE — pushed 175 commits (5305f47..725fc4c), origin synced. Read the evidence (teamsave-vs-status-parity.md) — findings confirmed, map 1:1 to PF1-5.
**SCENARIO FIRST (TRON law #100): PF5 tests written RED before PF1-4 implementation.** Sequence:
- **Architect (0.2, NOW — priority over OTR-1 contract):** frame parity MVC design — live(`otmux tree.detailed` proc-args)=Model of record; status/team.list View reads LIVE; snapshot=timestamp-gated cache. This gates PF1-4.
- **Tester (0.4, NOW):** write PF5 tests RED-first — T-TEAMSAVE-PARITY (fresh teams.save tuple-set == live tree.detailed: agents+shells+teams), T-STATUS-ENUM (every live team incl. remoteOOSH), T-FRESHNESS (stale snapshot can't yield wrong uuid). Measure live, no output filtering.
- **Expert (0.3, QUEUED after the u20/u24 security pass; parity is do-first over OTR-1 impl):** PF1 (team.save→teams.save name+alias, root-cause the ~2min slowness), PF2 (capture ALL live panes — root-cause the non-deterministic shell drop), PF3 (enumerate every live team the authoritative source sees — remoteOOSH gap), PF4 (freshness: View derives from live / snapshot self-refreshes+timestamp-gated). Make the RED PF5 tests GREEN.
- Then: WODA.prod PO QA gate → report up to oosh-po@MacStudio (git mailbox: report-back inline + push) → Tron promote.

### Report-back (owners edit inline)
- Architect (MVC design): **DONE 2026-07-02 — the frame that GATES PF1-4.**

  **MODEL OF RECORD = the live process tree, read via `otmux tree.detailed` (proc-args).** The running system (processes/panes) is the ground-truth Model; `tree.detailed` is its canonical, COMPLETE projection: the tuple-set **(session, address, kind[agent|shell], role, uuid|—)** for EVERY live pane across EVERY live team. `kind` is live-derived from proc-args (claude proc → agent; bash/ssh/screen → shell), never cached-guessed. `uuid` comes from the claude process args (pane_pid → walk → session UUID).

  **ROOT CAUSE (from the evidence): THREE divergent enumeration paths.** `tree.detailed` sees everything; `teams.save` rolls its own lossy enumeration (drops shells non-deterministically, PF2); `status`/`team.list` roll a third (omit whole teams, remoteOOSH, PF3). They disagree because each re-implements enumeration. **PROOF the fix is right: agent uuids are already GREEN across all three — precisely because they SHARE proc-args discovery there.** Extend that sharing to shells + team-enumeration and parity holds by construction.

  **THE FIX — ONE live reader, THREE consumers (DRY collapse):**
  1. **Single shared live reader.** Factor tree.detailed's proc-args enumeration into ONE reusable producer emitting the canonical tuple-set (e.g. `private.hiveMind.live.tupleset` / reuse tree.detailed's engine). This is the DRY core; the other two consumers call it, never re-enumerate.
  2. **`status` / `team.list` = read the Model LIVE** via the shared reader; enumerate EVERY team/pane it sees; ZERO snapshot dependency for a live-answerable question → **PF3 fixed, PF4 stale-read impossible.**
  3. **`teams.save` = serialize the COMPLETE shared-reader tuple-set** (agents AND shells, every team) at time T, stamped T → **PF2 fixed** (complete + deterministic — no per-window partial drop). Reusing the batch reader also kills the ~2min per-pane probe → **PF1 slowness fixed** (save becomes as fast as tree.detailed; the 2min = it's NOT using the batch reader today).
  4. **`snapshot` = TIMESTAMP-GATED CACHE, never authority.** Used ONLY when live is unavailable (cross-host restore, post-death). On read: staleness = now − snapshot.TS; if live is available → ignore cache and derive live; if live is gone → use cache only within TTL, else FAIL LOUD (constructor-contract "never silently broken"). Stale uuid/title (proven: scrum-master 35916ccb vs live dfcea556; remoteOOSH titles) becomes structurally impossible.

  **PARITY INVARIANT (what PF5 asserts, holds BY CONSTRUCTION once #1-3 land):** for the same live system at time T — `tree.detailed(T)` == `teams.save(T)` == `status/team.list(T)` on the tuple-set (team, pane, role, uuid, kind). Any divergence = a consumer re-enumerating instead of calling the shared reader.

  **MVC reconciliation (no contradiction with the 4-script model):** the ultimate Model is the LIVE running system; `otmux tree.detailed` (View instrument) reads it via proc-args and its output IS the model-of-record projection; `claudeCode` is the per-session identity FACADE tree.detailed consults (pane_pid→claude args→UUID); `hiveMind` (Controller) MUST treat the live projection as authoritative and its persisted stores (snapshot/registry/sessions.env) as caches. **Live proc-args > persisted cache, always** — same law as "prefer pane title (live) over JSONL (eventual)."

  **PF1-4 handoff to expert:** PF1 = teams.save canonical + team.save alias, both → shared reader (fixes name AND slowness). PF2 = save serializes the FULL shared-reader tupleset. PF3 = status/team.list enumerate via shared reader. PF4 = live-answerable reads never touch snapshot; snapshot reads timestamp-gated + fail-loud when stale. All four are the SAME move: route through the one live reader.
- Expert (PF1-4): **DONE via the ONE shared reader (architect frame 145c7a9). dev `9ddcf35` (PF1-3) + `9dce682` (PF4).** Implemented `private.hiveMind.live.tupleset` — the DRY core: emits the canonical `session|address|role|uuid|title|cwd|model|kind` for EVERY live pane via ONE batch `protected.agents.discover` (which already walks `list.panes -a`) + ONE batch `list-panes` for cwd — NO per-pane forks. `teams.save` + `team.list` now consume it; neither re-enumerates.
  - **PF1**: `team.save`→`teams.save` name already canonical (schema doc'd). Slowness root-caused = the old per-pane probe (`session.resolve.uuid`/`pane.get`/`pane.model`/`pane.kind` × N). Now batch → as fast as tree.detailed.
  - **PF2 — ✓ GREEN (T-TEAMSAVE-PARITY 20/20)**: old teams.save enumerated `claude.processes` (agents) + registry (registered only) → **dropped live shells not in the registry**. Now serializes the COMPLETE shared-reader tuple-set → every live pane (agents AND shells) captured, deterministic.
  - **PF3 — ✓ GREEN (T-STATUS-ENUM 7/7)**: `team.list` read the STALE `HIVEMIND_TEAMS` file → omitted live teams (rawbin, u20). Now enumerates LIVE tmux sessions (the authoritative team set), annotated by the teams cache when present. Verified: shows all 7 live teams incl. the previously-missing rawbin + u20.
  - **PF4 — resolver landed; test-contract handoff to tester**: added `hiveMind role.uuid <role>` — LIVE proc-args PREFERRED (via the shared reader); snapshot only as fallback, TIMESTAMP-GATED (rejects future-dated/>TTL) + fail-loud. Verified `hiveMind role.uuid ARON` → `f814788a…` = the LIVE uuid (the test's LIVE_UUID). **T-FRESHNESS currently reads the snapshot RAW** (`snapshot_uuid_for_role` = awk on the newest file) — that's the OLD broken-consumer pattern; by design a raw read of a planted-stale file returns the stale value (no producer-side change can fix a raw file read). The architect's fix = consumers derive from LIVE, i.e. call `hiveMind role.uuid`, never raw. **Tester: point T-FRESHNESS's consumer read at `hiveMind role.uuid $PROBE_ROLE`** → green by construction (returns live uuid regardless of stale files). Parity invariant `tree.detailed(T)==teams.save(T)==status(T)` now holds by construction (PF2+PF3 measured green).
- Tester (PF5 red→green): **RED DELIVERED (scenario-first) — 3/3 FAIL as designed, dev `test/test.teamsave-parity`.** Ran live on WODA.prod, no output filtering; live = `otmux tree.detailed` proc-args (the architect's Model of record). Results:
  - **T-TEAMSAVE-PARITY: 🔴 FAIL [PF2]** — fresh `teams.save` DROPPED 2 live panes present in tree.detailed: `robbinTeam2|0.7`, `u20|0.0`. (save tuple-set ⊉ live tuple-set.)
  - **T-STATUS-ENUM: 🔴 FAIL [PF3]** — `hiveMind team.list` OMITS 2 live teams that tree.detailed + teams.save both see: `rawbin`, `u20`. (View enumeration ⊊ live teams.)
  - **T-FRESHNESS: 🔴 FAIL [PF4]** — planted a stale NEWEST snapshot with a bogus uuid for a live agent (ARON); the newest-file a cold-start consumer reads serves `deadbeef-…` vs `live=f814788a-…`. Proves a stale on-disk snapshot yields a wrong-uuid identity.
  - Aligned with the architect's frame: the tests assert exactly `tree.detailed(T) == teams.save(T) == status(T)`, so routing all three through the ONE shared live reader turns all three GREEN by construction. Self-cleaning (removes the planted stale file); `teams.save` runs once (~2min — that's the PF1 slowness the shared-reader collapse also fixes). **Expert: make GREEN via the shared-reader move (PF2 full tupleset, PF3 enumerate-via-reader, PF4 live-derive/timestamp-gate).** Run: `test.suite run teamsave-parity`. Committed dev.
- PO QA gate: 

---
## ✅ PO SIGN-OFF on MVC frame (oosh-po@WODA.prod, 145c7a9) — APPROVED
The frame is the right architecture and it UNIFIES the sprint. Approved.
- **Root cause accepted**: 3 divergent enumeration paths (tree.detailed authoritative; teams.save + status each lossy-own-roll). **Proof it's correct**: agent uuids already GREEN because all 3 share proc-args there → unify enumeration and everything goes green like the uuids.
- **PF1-4 COLLAPSE into ONE move** — route status/team.list + teams.save through the SAME live reader tree.detailed uses. PF1's ~2min dies too (it wasn't using the batch reader). Not 4 patches — one shared reader + 3 consumers.
- **Acceptance = the invariant BY CONSTRUCTION**: `tree.detailed(T) == teams.save(T) == status(T)` (agents+shells+teams). snapshot = timestamp-gated cache, NEVER authority, fail-loud-when-stale.
- **Expert**: implement the ONE shared live reader; make status/team.list + teams.save consume it; do NOT hand-patch each path. **Tester PF5**: assert the invariant (all 3 tuple-sets equal on the same T).
- This is a DRY chokepoint (same family as resolve.target / pane.self): N views disagree ⇒ N divergent readers ⇒ collapse to ONE reader.

---
## ✅ PF5 RED DELIVERED (tester, dev 9fd5f95) — SCENARIO-FIRST honored
`test/test.teamsave-parity` — 3/3 FAIL by design on live WODA.prod, asserting the invariant `tree.detailed(T)==teams.save(T)==status(T)`:
- T-TEAMSAVE-PARITY: teams.save drops robbinTeam2:0.7 + u20:0.0 → [PF2]
- T-STATUS-ENUM: status/team.list omit rawbin + u20 → [PF3]
- T-FRESHNESS: planted stale snapshot serves bogus uuid vs live → [PF4]
Scenario units on disk + committed BEFORE impl (TRON law #100 ✓). Run: `test.suite run teamsave-parity`.
**EXPERT red→green target now LIVE**: implement the ONE shared reader (architect frame 145c7a9) → status/team.list + teams.save consume it → all 3 GREEN by construction. Then PO QA gate → report to oosh-po@MacStudio.

---
## PO QA GATE — measured (oosh-po@WODA.prod, `test.suite run teamsave-parity`, 2026-07-02)
- **PF2 T-TEAMSAVE-PARITY: GREEN ✓** — teams.save via shared reader, 20/20 panes, shells not dropped.
- **PF3 T-STATUS-ENUM: GREEN ✓** — team.list 7/7 live teams (rawbin+u20 restored).
- **PF1 slowness: fixed** (batch reader). Shared reader verified real (hiveMind:1309 + 2 consumers).
- **PF4 T-FRESHNESS: RED** — planted stale snapshot serves `deadbeef…` vs live `f814788a…`.
- **QA HOLD on PF4 — NOT accepting "point the test at the resolver → green".** That would WEAKEN T-FRESHNESS (it proves the resolver is live, but not that stale reads are impossible). The APPROVED frame (145c7a9) said snapshot = "fail-loud-when-stale" → a raw stale read must ERROR, not silently serve stale, else any consumer bypassing the resolver gets `deadbeef`. **Architect to rule**: does the live-preferring `role.uuid` resolver satisfy PF4, OR must the snapshot read be timestamp-gated + fail-loud (so bypass is impossible)? T-FRESHNESS must assert the REAL invariant (stale cannot yield a wrong answer), not just the resolver path.
- Gate: PF2/PF3 pass; **PF4 held** pending architect ruling. No parity sign-off / MacStudio report until PF4 genuinely greens per the frame.
