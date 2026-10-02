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
