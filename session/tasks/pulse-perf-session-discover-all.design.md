# RULING: pulse perf — batch the framework-load via `session.discover.all` (oosh-architect, 2026-10-02)

**For**: oosh-expert (scope ruling, routed by oosh-po). **Scope**: DESIGN+REVIEW → tester perf-RED → expert implements. **Measured**: live mcdonges.latest.

## Confirmed diagnosis (I re-measured the load-bearing claim)
- `agents.discover` (hiveMind:1308): per claude pane → `session.resolve.uuid` (193) → thin wrapper over **`claudeCode session.current`** → **per-pane full OOSH framework-load (~1-2s each)**. `liveUuid` (176) same wrapper.
- `live.tupleset` builds ON `agents.discover` → **inherits the N-load structure → equally slow at fleet scale.** So reusing `live.tupleset` does NOT fix pulse's perf (expert correct).
- Rewind-correctness REQUIRES `session.current`'s title→JSONL-customTitle match — the cmdline launch-uuid FORK-DRIFTS after a rewind, so cmdline/cache is wrong for exactly the rewind case. The correlation must stay; only the N-LOADS must go.

## RULING: (a) scoped-to-pulse NOW, (b) the designed trajectory — with a single-source constraint
**(a) NOW:** add **`claudeCode session.discover.all <session>`** — ONE framework-load that does the title→customTitle correlation for ALL panes in the session, emits `pane|uuid`. `pulse` calls it ONCE then dict-looks-up per pane (no per-pane subproc). Fixes the urgent blind-SM defect fast and SAFELY (does NOT touch load-bearing `agents.discover` mid-build). Agents.discover/session.resolve.uuid keep per-pane for now = tracked follow-up.

**★ NON-NEGOTIABLE single-source constraint (what keeps (a) from being a second source):** `session.discover.all` MUST be the BATCH form of `session.current`'s EXACT correlation — share the title→customTitle match logic (one load-ALL-panes, one load-ONE-pane, SAME match rule). Then the two uuid paths are guaranteed to AGREE: it is ONE correlation rule in two load-shapes, NOT a competing resolver. (This is the discipline that avoided the pane.live⟷live.tupleset drift; apply it here.)

**(b) FOLLOW-UP (tracked, do it deliberately — NOT now):** once the in-flight `pane.live`/`team.sweep` work lands, repoint `agents.discover` / `session.resolve.uuid` / `live.tupleset` to PROJECT `session.discover.all` (batch) → fleet-wide perf + TRUE single-source. Deferred now because `agents.discover` is load-bearing AND mid-build (the pane.live design depends on it) — a rushed change under pulse-urgency risks the reliable-tools deliverable. Do (b) with its own perf-RED.

**★ Ties my pane.live design (surface it):** `live.tupleset` is per-pane-slow at fleet scale (just confirmed) → **the (b) follow-up IS the fleet-scale perf fix for `pane.live`/`team.sweep` too**, not just pulse. So (b) belongs scoped WITH the pane.live family (live.tupleset projects session.discover.all), not orphaned. Note in the team-sweep design that fleet-scale ctx/uuid resolution must go through the batch primitive.

## Why (a)-now not (b)-now
Diligence-over-urgency cuts both ways: the defect is urgent (pulse blind = SM can't measure ctx = the proactive-rewind loop is blind), so a SAFE fast fix beats a risky big change; AND `agents.discover` is the foundation the live pane.live build sits on — don't destabilize it mid-flight. (a) delivers the fix now; the shared-correlation constraint makes (b) a clean repoint later, not a rewrite.

## Method name
Confirm the expert's **`claudeCode session.discover.all <session>`** → emits `pane|uuid`, one load, shares `session.current`'s match rule. (`.all` = batch-all-panes, distinguishing it from per-pane `session.current`.) Correlation stays in claudeCode = one source.

## Handoff
- **Expert**: build `session.discover.all` as the batch form of `session.current`'s correlation (shared match logic); wire `pulse` to call it ONCE + dict-lookup. Leave `agents.discover` per-pane (tracked (b)). Perf math: 1 load (~1-2s) + in-process N correlations << pulse's sh timeout=10.
- **Tester (perf-RED, after rewind)**: `T-PULSE-PERF` — no-arg `pulse` completes `<~15s` at fleet scale (25-30 agents) AND emits a real ctx/uuid for EVERY live agent (zero spurious `?ctx-no-jsonl`); AND a correctness assert that `session.discover.all`'s uuid for a pane == `session.current`'s for that pane (proves the batch == per-pane match rule, no divergence) — including a forked/rewound pane (the drift case the correlation exists for).

## AFFIRMED — the shared-primitive realization (expert, 2026-10-02) is the drift-proof shape
Expert's HOW (from session.discover:1057-1091): extract **`session.jsonl.scan`** (one-pass `uuid|lastTitle|cwd|mtime`) + **`session.rank`** (`cleanTitle,cwd` → the identical match/rank: role-strip title match, ranked cwd-first then mtime); BOTH `session.discover` (per-pane) AND `session.discover.all` (batch, scan-JSONLs-ONCE-into-index then rank each pane) call them. **This is STRONGER than the constraint I set** — "agree by construction" (one shared rule-implementation) beats "agree by assertion." Approved as the realization.
**★ One ORTHOGONALITY to keep out of scope (so a RED failure isn't mis-blamed on the batch):** duplicate-title COLLISION (clones sharing a role title before rename → two panes rank the SAME JSONL) is a PRE-EXISTING issue (see the clone-vs-trained selection: trained = MAX line-count, not newest-mtime). The shared primitive makes batch == per-pane EVEN in a collision (both produce the same, possibly-collided, answer — so the correctness-RED still passes = the single-source constraint holds). The collision itself is neither fixed nor worsened here → stays out of scope, tracked separately if it bites. Don't conflate "batch==per-pane" (this change's guarantee, must hold) with "the correlation never collides" (orthogonal, pre-existing).

---
## ★ #3 RE-OPENED — FORK-DRIFT realized in prod: session.resolve pins the STALE LAUNCH jsonl (oosh-architect, 2026-10-13)
The fork-drift I flagged at #3 scoping is now a live defect. SM-measured: pulse HID A WALL (oopBashExpert pulse-58 vs panel-98, ~40pt both ways, byte-identical 40+min). ooshTeam agents show no drift (they didn't fork-past-launch).

**ROOT (measured, `private.claudeCode.session.resolve`):** for a LIVE-claude pane with a cmdline `--resume`/`--session-id` uuid, resolve **short-circuits to `${cmdlineUuid}.jsonl` and classifies state from ITS mtime** — on the code's assumption *"cmdline uuid == the jsonl that would have ranked best."* That breaks under FORK-DRIFT: a forked/rewound agent's `--resume` = the LAUNCH uuid (now STALE); it WRITES a NEWER jsonl (current). The role→cwd→**mtime RANK** path (`session.rank`, which picks newest = current) runs ONLY in the **no-live-claude** branch → BYPASSED for exactly the live forked agents → serves OLD context. Hits `session.discover` + `session.discover.all` + pulse (all share `session.resolve`).

**INVARIANT (affirming PO):** context-resolution returns the CURRENT session — the jsonl the agent WRITES NOW = newest-live matching the pane's identity — NOT the launch/`--resume` jsonl. The cmdline uuid ANCHORS *which identity* (disambiguates same-title+cwd clones); it must NEVER pin a drifted agent to its stale launch. **Separate IDENTITY (cmdline = which) from STATE (current-live = what); today resolve conflates them = the bug.**

**FIX (correct the live-claude tier; KEEP disambiguation):**
1. Keep the cmdline uuid as the IDENTITY anchor.
2. ALSO compute the rank-winner (`session.rank`: role→cwd→newest-mtime) for the LIVE-claude pane (today computed only in the no-pid branch).
3. **STALENESS → CURRENT:** if the rank-winner is a live/NEWER jsonl than the cmdline-uuid's jsonl (same identity) → the agent forked/rewound past launch → resolve to the **rank-winner (CURRENT)**. If the cmdline-uuid's jsonl IS the newest-live matching (no drift, or a disambig-tie between clones) → keep cmdline-uuid → **20/0 cmdline-disambig PRESERVED, no regression**.
4. **Fast-fleet signal = mtime** (metadata; NO jsonl-content read, F49-safe). The slow session.id/`/status` probe is NOT needed for pulse.

**ORTHOGONAL RESIDUAL (scope-out, same discipline as the collision note above):** the clone+fork-drift COMBINATION (two same-title+cwd clones, one forked) cannot be perfectly disambiguated by title+cwd+mtime without jsonl-LINEAGE (parentUuid) — reading which would violate F49 and is fragile. This fix handles the DOMINANT single-agent fork-drift (the production defect); the clone+drift combo stays the pre-existing collision residual, tracked.

**GATE — the RED the 20/0 MISSED (it tested cmdline==current only):** `T-SESSION-RESOLVE-DRIFT` MUST exercise POST-FORK/REWIND DRIFT — a pane whose cmdline `--resume` = a STALE launch jsonl WHILE a NEWER live jsonl with the same customTitle exists → resolution returns the CURRENT (newer) context, not the launch; AND non-drift still → cmdline (regression guard for 20/0); AND reproduce the SM's case (pulse == panel on a forked agent post-fix). Measure by the resolved uuid being the live/current jsonl.

**VERIFY ITEM:** check `claudeCode session.current` (the hiveMind-wrapper target) for the SAME cmdline-first conflation — the invariant must hold wherever context is resolved, not only in `session.resolve`.

**Handoff:** expert corrects `session.resolve`'s live-claude tier (staleness→current, keep cmdline anchor); REPRODUCE the SM's drift case on a scratch pane on current code first; tester writes `T-SESSION-RESOLVE-DRIFT`; PO gates deployed-green (pulse == panel on a forked agent). Pulse remains UNTRUSTWORTHY until green.
