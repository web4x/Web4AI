# hiveMind registry context-tracking (TRON ORDER 2026-07-19) — replaces the lying sweep ctx%

**Owner:** oosh-po. **Origin:** Tron via SM (2026-07-19T16:27Z). **Folds:** team-loop **G5** (live ctx% field).
**WHY:** the live sweep `ctx%` column is GARBAGE — SM has seen 858%, 2%, 73%, 5% contradicting measured reality (robbin-po sweep-ctx=5% but real /context=25%). Manual /context gather is unreliable (the `N/1M tokens` header scrolls out of capture; agents go active mid-read). Tron wants context tracked RELIABLY for SM's cliff-prevention.

## SCENARIO-FIRST ACCEPTANCE UNITS (build targets these — do NOT mint others)

### Scenario A — RECORD
GIVEN an agent in the registry
WHEN `hiveMind context.record <agent> <used_k> <pct> [<denom_k>]`
THEN registry stores for that agent: `used_k`, `pct`, `denom_k` (real window: 1000 for 1M / 200 for 200k), UTC ISO-8601 `ts`
AND `hiveMind context.get <agent>` (or status) returns those exact values.
Edge: unknown agent → fail LOUD; non-numeric used/pct → reject.

### Scenario B — DISPLAY with visible staleness
GIVEN some agents have recordings, some don't
WHEN `hiveMind team.sweep` / `hiveMind status`
THEN each agent shows LAST-RECORDED ctx as `<pct>% (<used_k>k/<denom>) <age>` where age = now−ts (`3m`, `2h`)
AND agents with NO recording show `—`/`never`, NOT a fabricated live %
AND the OLD lying live-computed ctx% column is REMOVED (replaced, not shown alongside)
AND a stale reading (> ~30m) is flagged (e.g. `⚠2h`).

### Scenario C — GATHER (idle-only, robust parse)
GIVEN an IDLE agent pane (not generating)
WHEN `hiveMind context.gather <agent>` (and `context.gather.all` for all idle)
THEN it sends `/context` to the pane, waits, captures, and PARSES the real header (`N/1M tokens` / `N/200k` / the /context readout) — handling header scroll-out (zoom/scroll/retry) — then calls `context.record` with parsed used_k+pct+denom
AND it SKIPS active/generating agents (never /context mid-generation) → reports `skipped: active`
AND a parse failure fails LOUD (records nothing false).

## PO DESIGN CONSTRAINTS (first-principles)
- **HONEST DENOMINATOR:** store + show the real window (1M vs 200k). The garbage %s come from wrong-denominator math ([[context-read-1M-denominator-stale]]). Record the ACTUAL /context %, never re-derive a live guess.
- **MEASURE-SOURCE-NOT-COPY:** displayed value = the real recorded /context reading + its AGE. Never a live-recomputed lying number.
- **REPLACE, don't augment:** remove the unreliable live ctx% so SM sees ONE honest number, not two.
- **Robust parse:** the gather must beat the exact header-scroll-out pain SM hit (zoom pane wide / scroll to the header line / retry).
- DRY; fail-loud on parse/record errors; idle-only for gather.

## OWNERS (scenario-first: design → build → gate; WIP=1 sequenced)
- **design (hiveMind-expert):** registry schema/storage + method signatures + sweep/status display format + gather/parse approach, against A/B/C. Review by PO before build.
- **build (expert):** implement to the reviewed design.
- **gate (tester):** A/B/C RED→GREEN + no sweep/status regression.

## DESIGN — ACCEPTED (PO-reviewed 2026-07-19)
Design spec delivered by hiveMind-expert subagent (in its transcript), grounded file:line. Root cause confirmed: team.sweep:7947 → claudeCode context.read → max.tokens.for.jsonl:1523 GUESSES the denom (ps-args `[1m]` fails for remote + observed-max heuristic) → 1M agent ÷ 200k = the 858%/5% garbage; plus remaining-vs-used confusion + per-sweep live recompute flicker. Design: new `HIVEMIND_CONTEXT` store (separate from roles.env), pipe `key|used_k|pct|denom_k|ts_iso`; methods context.record/get/gather/gather.all; sweep DELETES the live column (7945-7953) → recorded+age; **parse reads used_k/denom/pct straight from the `/context` token line (`250k/1000k tokens (25%)`) so the denominator comes from the readout — no guessing**; idle-gate reuses pane.activity:1212; net-DRY (2 gather blocks→1). 
**PO RULING — registry key = `role@host`** (fleet-safe; multiple teams share roles like product-owner; matches identity convention; bare-role fallback in lookup).
Out-of-scope (tracked separately): the claudeCode context.read denom defect itself ([[context-read-1M-denominator-stale]]) — this feature just stops team.sweep from using it.

## NOTES
- Reliable dispatch to live team is itself gated on the S-9 fix (ghosting) — until S-9 deploys I drive this via subagents (reliable) rather than live-team otmux sends. context.gather (C) also needs S-9 at runtime (it sends /context via otmux).
- STATUS: ✅ **DELIVERED — deployed live `4ff09df` on mcdonges.latest 2026-07-19.**

## GATE + DEPLOY (2026-07-19) — DONE
- **Build:** hiveMind-expert subagent, +299/−69 single file, own smoke 28/28+7/7+11/11.
- **Independent gate:** hiveMind-tester subagent — **8/8 PASS** (mixed sweep renders all agents, set-u safe, denom-from-readout 1M vs 200k, parse-fail records nothing, old garbage gone, idle-gate, regression-clean). PO-reviewed the diff.
- **Deployed:** `git apply` (NOT cp -a) → commit `4ff09df` (hiveMind only) → pushed origin/test/mcdonges.latest. Live smoke GREEN: record→get round-trip (role@host key `scrum-master@v60211`, UTC ts), unknown-agent rc1, non-numeric rc1. Store cleared to honest-empty. SM notified how to use.
- ⚠ **DEPLOY-HAZARD found by the gate (recorded for all future subagent deploys):** `cp -a`/hardlink-preserving copy of /root/oosh inherits a hardlink to the LIVE inode → a scratch write goes THROUGH to live. ALWAYS deploy via `git apply`/`install`/temp+mv, never cp -a. (Live was verified byte-identical after; no harm.)

## POST-DEPLOY DEFECT (SM, evidence-backed 2026-07-19) — gather can't populate → fix in flight
The record/get/display parts work; **context.gather's idle-gate is broken** so the store stays `— never`.
1. **Over-strict idle-check:** gather gates on `private.hiveMind.pane.activity` (hiveMind:1218, idle = last non-blank line is a bare `❯`) → false-negatives a parked agent whose capture ends in other text. SMOKING GUN: robbin-skill-expert (robbinTeam2:0.2) parked-idle many min → gather says 'active'+skips, but team.sweep 1s later (via `sweep.detect` hiveMind:8681) correctly shows IDLE. FIX: align gather's gate to `sweep.detect` (DRY — one detector, the one team.sweep uses).
2. **Bogus tron-skip:** `case *.4) skipped: tron` wrongly skips robbin-req (robbinTeam2:0.4, an agent) as Tron. FIX: drop the pane-index heuristic (gather.all filters to registered agents; single gather skips self).
**Gate gap that let this ship:** gate #1 tested "busy→skip" but never "genuinely-idle-quiet→gathered" against a REAL parked agent. Re-gate MUST cover that + assert gather's idle verdict == team.sweep's for the same pane.
**STATUS: FIXED + DEPLOYED `5ea3a8f` + LIVE-VERIFIED on the real failing case.**
- idle-gate now uses `sweep.detect` (gatherable=idle|just-compacted) → robbin-skill-expert PROCEEDS (no more false skip-active); tron `*.4` guard removed → robbin-req = skip-active (agent), not skip-tron. Gate 13/13 fix + 28/28+7/7 regression; PO-reviewed; live-verified.
- **FINDING the fix surfaced:** robbin-skill-expert (%7) + robbin-architect (%8) are at BASH SHELLS (Claude not running — capture = bash completion output only), so /context parse-fails (correctly records nothing). They're dead-to-shell, not live-idle-Claude → flagged to SM (may need re-join). Store populates for LIVE-Claude-idle agents (modulo S-9 for send reliability).
- **FAST-FOLLOW:** gather should emit `skipped: shell` for non-Claude panes (isClaudeCode pre-check) instead of sending /context + parse-failing.

## PARSE-RELIABILITY FIX — DEPLOYED `880b3e5` + LIVE-VERIFIED (2026-07-19)
- **Root cause (I was wrong on dead-shell):** the `/context` TOTAL header (`N/1M tokens`) renders at the TOP of a panel taller than the ~19-row agent pane → after settle it's neither on-screen nor in scrollback; only the `File reads (5%)` SUBSECTION is capturable (misread trap). SM's scroll-out lead was right.
- **Fix (design pivot, PO-accepted — physics-justified):** JSONL total tokens (exact, no scroll-out) is now the PRIMARY gather source; `/context` still sent to freshen the JSONL + kept as on-screen cross-check/fallback. Denom hardened 3-way: **pane-tree `[1m]` arg (survives sid-drift, correct even for low-usage 1M)** → legacy sid-match → observed-max (>200k⇒1M). The garbage was ALWAYS the denom, not the token count.
- **LIVE GATE (real condition):** gather.all robbinTeam2 populated **6/7** honest readings, all denom=1000; **robbin-architect 48% (477k) matches independent JSONL ground truth exactly**. 1 edge: robbin-skill-expert sid-drift → JSONL not found → records NOTHING (fail-loud). Regression 28/28+7/7+13/13+6/6+2 e2e green; PO-reviewed + live-cross-checked.
- **FAST-FOLLOW 2:** robust JSONL lookup under sid-drift (pane→session mapping) so drifted agents still read.
- **STATUS: ✅ FEATURE WORKING at safe `880b3e5` behavior (6/7 read + honest-stale on drifted skill-expert). Cliff-prevention data live (SM caught+rewound 4 near-wall agents).**

## ⚠ REGRESSION + REVERT (2026-07-19) — uuid-drift fix over-reached
- The uuid-drift/whole-file-scan fix (`10fde7f`) FIXED skill-expert but REGRESSED architect/req/planner → `0% (0k/1M)` = **FALSE-LOW** (masks the cliff — worse than `— never`). My live gate SHOWED the 0k values; I failed to flag them as impossible (a live 67% agent can't be 0k). SM caught it.
- **REVERTED `b1f2bf7`** (back to safe 880b3e5 behavior; whole-file resolver gone) + purged the 3 false 0k rows from the store (→ honest `— never`). Verified safe (no 0k producible). Lesson banked: [[false-low-worse-than-absent-sanity-check-values]].
- **DEFERRED (future, carefully-gated as ONE task):** uuid-drift completeness (skill-expert refresh) + the 0-GUARD (empty/tot==0 → record NOTHING, never 0) + a VALUE-SANITY gate (reject impossible readings; cross-check vs known-recent). NOT rushed. `880b3e5` behavior is acceptable meanwhile.

## ✅ PROPER FIX — DEPLOYED `17d5a2d` + HARD-GATED (2026-07-20)
- **0k root (definitive):** long-running JSONLs contain ZERO-total assistant records (`usage.input_tokens=0` stop_sequence/mid-stream stub frames — architect had 55). Old code picked the LAST record with the `input_tokens` KEY regardless of value → a trailing zero-frame = `0k` false-low. NOT uuid-drift.
- **Fix (defense-in-depth):** (1) resolver + whole-file reading require a NON-ZERO usage record; (2) **MANDATORY 0-guard at `context.record`** — the single chokepoint — refuses usedK<=0/pct<=0 → false-low is STRUCTURALLY un-storable; (3) value-sanity in python + bash. denom: pane.get + process-TREE [1m] walk.
- **HARD LIVE GATE — PASS:** all 7 robbinTeam2 read real non-zero (4 stale long-runners fixed: expert 64% skill 12% architect 53% req 66%); explicit assertion = ZERO 0k/0% rows; values cross-check independent full-scan + known-recent. Regression 28/28+7/7+13/13+6/6+5/5+8/8 green.
- **STATUS: ✅ FEATURE FULLY WORKING incl the highest-risk long-running agents. Cliff-blind-spot CLOSED.** Cliff-watch climbers logged (planner 71%, oosh-architect 75%).

## FAST-FOLLOWS (minor, non-blocking — from the gate)
1. bare-role fallback grep should `grep -F`/escape metachars (a `.`-containing value exists in the registry). 2. corrupt store row could validate-in-display → `— never`. 3. bare-no-args emits the kernel return-trap msg not Usage (pre-existing framework, affects resolve too). 4. raw-token (non-k) /context form fails closed (unreachable today).
