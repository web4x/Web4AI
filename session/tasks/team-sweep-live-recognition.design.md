# DESIGN: team.sweep LIVE state-recognition + single-source reader (oosh-architect, 2026-08-18)

**From**: TRON directive via oosh-po (reliable-tools priority) · **Scope**: DESIGN + REVIEW only → tester writes `T-SWEEP-LIVE-STATE` (scenario-first) → oosh-expert implements.
**Measured on**: live `mcdonges.latest`, read-only.

## The core principle (why this is one design, not six)
`team.sweep`, `context.status`, and the dashboard must all **PROJECT ONE live reader** — same law as the c.0 live-reader: one producer, many views, so 0.1 can never read `scrum-master` in one view and `shell` in another. Today they **diverge**: sweep = capture `sweep.detect` (hiveMind:9041) + a `"shell"` fallback (1298); context = JSONL `from.jsonl.reading` (7673). That split IS the view-drift bug.

## 1. The ONE live reader — `private.hiveMind.pane.live <pane>` (new; sweep/context/dashboard all call it)
Per pane, emits one canonical tuple (pipe-delimited, projectable):
```
pane | kind | role | uuid | base_state | ctx_used_k | ctx_pct | ctx_denom_k | low_ctx | drawer_detail
```
It composes the two proven measurers — **never re-derives**:
- **base_state** ← capture (`sweep.detect`, normalized to §2 vocabulary).
- **ctx_used_k|ctx_pct|ctx_denom_k** ← **`from.jsonl.reading`** (the WORKING token-math; e.g. `392|39|1000`). NEVER the TUI-capture / `pane_current_command==claude` path (fragile, parse-fails).
- **kind** ← robust process-subtree walk (§4).
- **low_ctx** ← derived from ctx_pct ≥ threshold (§2, orthogonal flag).
Reconciles the registry as a side-effect of every call (§5).

## 2. The 6 canonical live-states (normalize sweep.detect's 18 → these; keep sub-name in drawer_detail)
Base state is **mutually exclusive**, from CAPTURE of the bottom-5 TUI area (the definitive live region — already how sweep.detect avoids stale scrollback):

| State | Recognition pattern (bottom-5 live TUI) | Method | Meaning |
|---|---|---|---|
| **ACTIVE** | `esc to int[errupt]` present | capture | generating/running |
| **ON-PROMPT** | `❯` with STAGED/unsubmitted text after the marker (drawer/wall/active already excluded) — auto-mode bar MAY be present | capture | typed-but-unsubmitted input sitting at the prompt = NOT ready (needs submit/clear; the OTR-1 staged-not-submitted state) |
| **IDLE** | EMPTY `❯` (no staged text after the marker) + auto-mode bar, no esc-to-int, no drawer | capture | parked/done, ready for a new assignment |
| **OPEN-DRAWER** =BLOCKED | any modal drawer: permission (`Do you want to` / `❯ 1. Yes`), `accept edits on`, menu/picker (numbered `Select`), autocomplete, tool-confirm, overlay/panel | capture | **blocked, NOT idle** — a drawer open ≠ ready; `drawer_detail` names which |
| **ON-WALL** =BLOCKED-critical | context-wall / auto-compact prompt: `Context left until auto-compact: 0%`, `Context limit reached`, `/compact` confirm | capture (prompt) **+ JSONL confirm** (pct≥~98) | at the wall — needs rewind/relaunch |

Plus ONE orthogonal overlay flag (NOT mutually exclusive — from JSONL, can co-occur with ANY base state):
- **LOW-CONTEXT** (⚠) ← `from.jsonl.reading` `ctx_pct ≥ 80` (≤20% left). An agent can be `ACTIVE + ⚠LOW-CONTEXT`. This is the proactive-rewind trigger signal; it must be measured (JSONL), never TUI-guessed.

**Discriminator note (ON-PROMPT vs IDLE) — CORRECTED 2026-08-29 (test A3 was right; adopt it):** both are "not blocked, not generating," and BOTH normally show the `⏵⏵ auto-mode` bar — so the auto-mode bar is NOT the discriminator. The real discriminator is **staged text after the `❯`**: EMPTY `❯` ⇒ IDLE (parked, ready); `❯ <unsubmitted text>` ⇒ ON-PROMPT (typed-but-not-submitted = not ready; the OTR-1 staged-not-submitted region check — text after the marker). The bottom-5 order: OPEN-DRAWER/ON-WALL FIRST (a drawer's `❯ 1. Yes` must not read as staged text), then ACTIVE (esc-to-int), then `❯`+staged-text ⇒ ON-PROMPT, then empty-`❯` ⇒ IDLE. (My original "auto-mode bar ⇒ IDLE" was wrong — the bar co-renders in both.)

## 3. Method split (the task's "capture for prompt/drawer/wall; JSONL for context/wall")
- **CAPTURE** (bottom-5, retry-once-on-empty per sweep.detect's self-heal): ACTIVE, ON-PROMPT, IDLE, OPEN-DRAWER, ON-WALL-prompt.
- **JSONL** (`from.jsonl.reading`): ctx_used/pct/denom, LOW-CONTEXT flag, and ON-WALL **confirmation** (capture says wall-prompt AND JSONL pct≥~98 → true ON-WALL, not a stale banner — kills the "stale wall banner vs real wall" false-positive).
- The two are COMBINED in `pane.live`; context% is ALWAYS JSONL, never the capture number.

## 4. Robust kind (g.4) — bash-parent claude = claude, never drop a real agent
A pane is `kind=claude` if a claude process runs ANYWHERE in its process subtree, not only when `pane_current_command ∈ {claude,node}`. Resolve by walking the pane_pid's descendants (`ps`/proc): pane_current_command is claude/node, OR any descendant is a claude process (the bash-wrapped case). Only `kind=shell` when the subtree has NO claude. This kills the `"shell"` fallback at team.sweep:1298 dropping real agents to shell/unknown. (Same process-subtree walk as the identity resolver — shared primitive.)

## 5. Registry stays CURRENT — reconcile every sweep
Each sweep, `pane.live` reconciles per pane: pane still exists in tmux? claude still alive (subtree)? uuid still matches the live JSONL? → if yes, refresh roles/sessions; if the pane is gone or claude dead → **drop the stale entry**. Re-derive role via the corrected resolver (not `$TMUX_PANE`). Net: the registry is a projection of live truth after every sweep, never accumulates ghosts.

## 6. Scenario-first → `T-SWEEP-LIVE-STATE` (tester writes these; expert makes GREEN)
Each scenario FORCES a state and asserts `pane.live` classifies it — and that all three views agree:
1. **ACTIVE** — pane mid-generation (`esc to interrupt`) → `base_state=active`.
2. **ON-PROMPT** — bare `❯`, nothing else → `on-prompt`.
3. **IDLE** — auto-mode bar, no prompt text → `idle`.
4. **OPEN-DRAWER** — trigger a permission dialog / accept-edits / picker → `open-drawer` (BLOCKED), `drawer_detail` names it; assert it is **NOT** reported idle (the core bug).
5. **ON-WALL** — pane at auto-compact/context-limit prompt → `on-wall`; assert JSONL pct≥~98 gates it (stale banner alone ≠ wall).
6. **LOW-CONTEXT** — pane whose JSONL shows ≥80% used → `low_ctx=1` set REGARDLESS of base_state (test with an ACTIVE + low-ctx pane).
7. **SINGLE-SOURCE (zero view-drift)** — assert `team.sweep`, `context.status`, dashboard all report IDENTICAL base_state + ctx for pane 0.1 (the DRY guarantee).
8. **ROBUST-KIND** — a claude under a bash parent → `kind=claude`, never `shell`/`unknown`.
9. **CONTEXT-PROVENANCE** — assert ctx% equals `from.jsonl.reading` output (`used_k|pct|denom`), and that a pane where TUI-capture would parse-fail STILL returns a real ctx% (JSONL path, not TUI).
10. **REGISTRY-RECONCILE** — kill a pane's claude → next sweep drops the stale registry entry (no ghost).

## 7. Handoff
- **Expert**: build `private.hiveMind.pane.live` composing `sweep.detect`(normalized §2) + `from.jsonl.reading` + robust-kind(§4) + reconcile(§5); repoint `team.sweep`, `context.status`, dashboard to PROJECT it (delete their divergent paths). Keep capture bottom-5-first + JSONL-for-context; never TUI-parse context.
- **Tester**: `T-SWEEP-LIVE-STATE` per §6, scenario-first (RED before impl).
- Ties: the corrected self-ID resolver (G1) + one-identity (G2) from the team-loop MVC spec — same single-source-of-truth family. Design + review only; no code changed by me.

---
## ✅ PO SIGN-OFF (oosh-po@WODA.prod, 2026-08-18)
APPROVED (520a0b87). Meets Tron's spec fully — 5 mutually-exclusive base states + LOW-CONTEXT orthogonal flag, single reader `pane.live` all views project (kills the measured sweep-capture-vs-context-JSONL drift), context ALWAYS via the working `from.jsonl.reading`, ON-WALL double-gated (capture-banner AND JSONL pct≥98 = independent-method), robust kind g.4 (claude anywhere in subtree), registry reconciled every sweep. Discriminator order correct (drawer/wall before bare ❯). Scenario-first §6 = 10 RED tests incl single-source-agreement + drawer-not-idle + context-provenance + registry-reconcile.
**Flow**: tester writes §6 RED → expert builds §7 (pane.live + repoint the 3 views, delete divergent paths) → PO gates GREEN (verify live against ground truth: e.g. an OPEN-DRAWER pane must NOT read idle; a bash-parent claude must read kind=claude).

---
## RECONCILIATION with `live.tupleset` (oosh-architect, 2026-08-29) — expert caught real drift; RULING = option (b), sharpened
**The drift is real:** my §1 said "build a NEW `pane.live`" without naming `live.tupleset` (frame 145c7a9, hiveMind:1324) — which already IS the identity/topology single-source. Two single-sources = the drift §7 kills. Reconciled by MEASUREMENT:

**Measured pipeline (mcdonges.latest):**
- `agents.discover` (1260) emits `pane|role|state|uuid|title|is_claude` — it **already computes `state` via `sweep.detect` (1301)**.
- `live.tupleset` (1324) projects that to `host|session|address|tty|role|uuid|kind|title|cwd` — **deliberately DROPS `state` and `model`** (lean; `model` comment: "derive-on-demand, slow per-pane JSONL, never part of the enumeration tuple").
- ctx% (`from.jsonl.reading`, 7673) is per-pane slow-JSONL — same cost class as the dropped `model`.

### RULING — option (b), with a layering law (NOT naive (c))
1. **ONE identity/topology source stays `live.tupleset`, UNCHANGED and LEAN.** No parallel identity derivation anywhere. `pane.live` must NOT re-derive host/session/address/tty/role/uuid/kind — it takes them VERBATIM from `live.tupleset`. That kills the two-competing-sources drift.
2. **`pane.live` = a strict SUPERSET-projection of `live.tupleset`** = its row + `base_state | ctx_used_k | ctx_pct | ctx_denom_k | low_ctx | drawer_detail`. It is a view over the base, not a competitor.
3. **Reuse state, don't re-run it.** `base_state` is the §2 6-state NORMALIZATION of the `state` that `agents.discover` ALREADY computes (sweep.detect) — surface it through the pipeline (discover already has `status|action|severity|detail`, so `drawer_detail` comes free from detail). pane.live does NOT independently re-capture.
4. **Fix robust-kind (g.4) UPSTREAM in `agents.discover`'s `is_claude`** (the process-subtree walk) — then BOTH `live.tupleset.kind` AND `pane.live` inherit correct kind. Fix at the source, once; not in pane.live.
5. **REJECT naive (c) — do NOT fold ctx/JSONL into `live.tupleset`.** That would tax every topology-only caller (and every REMOTE ossh-exec read) with per-pane slow-JSONL — violating the exact leanness (`model` dropped) the base reader was built on. ctx lives ONLY in the enriched `pane.live`.
6. **The 3 views (team.sweep, context.status, dashboard) all PROJECT `pane.live`** → view-agreement by construction. Topology-only callers keep using `live.tupleset`. Two readers, ONE identity truth (pane.live derives identity FROM tupleset).

**Net:** (b) as the expert leaned — `pane.live` composes OVER `live.tupleset` (identity) + normalized-state (already in `agents.discover`) + `from.jsonl.reading` (ctx). Plus two source-fixes: kind→upstream in `agents.discover`; keep base lean. Partial (c) ONLY for state (state is already in discover, so surfacing it there is free); NEVER fold ctx into the lean base.

**§7 handoff AMENDED:** expert builds `pane.live` as the superset-view over `live.tupleset`; surfaces `agents.discover`'s state through + normalizes to §2; adds ctx via `from.jsonl.reading`; moves g.4 kind into `agents.discover.is_claude`. RED gate `test.sweep-live-state`: PART A canonical-state recognition + PART B view-agree / ctx-from-jsonl / registry / self — ADD an assertion that `pane.live`'s identity columns are byte-identical to `live.tupleset`'s for the same pane (proves single-identity-source, no re-derivation).
