# robbin-planner — Purified Essence (ARON proposal, non-destructive)

## 1. Unique canonical lessons (keep)
**Scenario/view doctrine**
- Scenario units on disk (Sprint→Requirement→Task, wired) exist BEFORE code; an impl with no backing unit → REJECT to PO, never hand-author the MD, never backfill (#126/#46).
- Markdown is a generated VIEW (law #100); edit the unit + regenerate; `generate-sprint-md.ts --check` byte-match is the drift/slug-orphan detector. CMM4 = all 4 roles per task, even a trivial fix keeps a real architect-refinement step (#18).

**Governance / authorization**
- From S30 only Tron increments a sprint; signal = a SIGNED committed RECORD (`tronAuthorization{authorizedBy:Tron…}`), never a `--flag`; guard refuses number≥current-max without it; dedup Sprint on NUMBER, one unit per number (#76). Tiers: TIER-1 = Tron-authored commit / Tron-only-writable `.tron-auth/`; TIER-2 = agent-transcribed (blocks accidental, fails-OPEN to a lying agent — relies on #17 no-fabricate). Tron chose TIER-2.
- Planner is SOLE Task-unit creator (uuid/ownerIor/coveredReqs/status + reciprocal Requirement.tasks[]); architect only ADDS useCases[]/chain, never a parallel task file (#59, supersedes #12/#20).

**Ship & chain gates**
- Ship gate: reaches Tron's device only if `package.json` version AND `sw.js` CACHE_NAME bump in the SAME commit-set; any new SPA route also needs its bundle+path in `sw.js` STATIC_SHELL in that bump (else PWA serves stale). Rule-pair applies to user-facing surface only; data/infra exempt if the expert notes it.
- Strict verify bar: per-Test 7-hop `walkUp==7` (top `above:null`), NOT node-count proxies; + live UX repro; + SW-ACTIVE verification for any sw.js/PWA task. A chain is COMPLETE only at a Test leaf carrying a REAL full-uuid `[test:uuid:]` SOURCE marker AND wired `Impl.tests[]`; markers in `.ts/.test.ts` only, never in scenario.json.
- Marker must equal the UNIT uuid, not the Method uuid; an 8-char-prefix match with different full uuid leaves the chain silently open. Fix the instrument when it lies (TS-AST: marker heads a named member; reject split-for/header/anon/css; validate vs source-anchors + 2nd-role re-run).
- green gate ≠ done: a gate can pass at the WRONG STATE (tester N=1, bug at N=14) — structural pass proves wiring, not that the gate exercised the bug; hold In-Progress + void ACs honestly. gate-proven HOP ≠ chain RENDERS: verify the GOAL not the proxy; when hops read done but render dead-ends, the UNITS are missing — MINT from source-verified code. QA-Review + Done are Tron's gate ONLY. your-hop-your-status.

**Pin-math (kept verbatim)**
- The PIN is the rewind-proof work queue: 3 slots (lastCompleted/current/nextBacklog) computed from the board on disk by `sprint-pin-resolver` — select work from the slots, not memory; `sprints.overview.md`'s 📌 can be stale-frozen. `--force` FORBIDDEN on pin-advance (Tron reverted a `--force` that corrupted current==lastCompleted); `focus()` advances NATURALLY; a block is a BUG to fix. Always disk-cross-check the PERSISTED pin, not on-the-fly `pinCurrent()`; the 3 slots must be distinct. ≥6 Active sprints → FAIL-LOUD "UNRESOLVED, never silent-pick" (R-C6). `focus` needs the FULL 36-char uuid + a derivable ≥req→uc chain.

**Near-wall save (kept verbatim)**
- SM warns ~78%, trainer rewinds at 80%: on the warning write context.md + learnings.md → commit → THEN resume; even active PO directives wait (the loop re-fires). context.md carries the commit chain + in-flight task numbers + generated uuids so post-rewind resumes from saved state; a save broadcast is team-wide — save preemptively. NEVER `/compact` at the limit — SM+trainer REWIND (preserves identity); `/compact` drifts role. Write-outage: stand up ONE dedicated planner-shell, drive one-line `python3 -c` writes + explicit git through it.

**Tooling**
- One canonical number, one tool: `Chain followUp --all` fixed denominator (154, orphanByDesign excluded); report denominator shifts explicitly. 5-step forward-ref population runs at EVERY hop. chain-direction and chain-reachability are orthogonal — audit direction first. certScope carries per-item PROVEN vs PENDING + [AUTOMATABLE]/[DEVICE-Tron]; a row hiding a partial proof = the same lie as a false Done; a phantom blocker left after the block clears is the mirror lie. `[~]` = impl-committed-not-strict-verified; backlog reqs go to `Sprint.requirements[]` ONLY (no phantom slots). Marker scan-coverage gaps recur by file-type — fix = add the extension, never re-place the correct marker. Migrator auto-mints fake-suffix duplicate Requirements; scan+delete after.

## 2. Repetitions → collapse
- verify-approval-on-disk; trust context.md not wakeup-hash; rewind stream incl. own task is ghost → **[disk-wins]**
- file-based comms, chat=pointer, detail-into-artifact; units are source md is view; scenario-link pointer standard → **[one-truth-one-source]**
- wrong-denominator=empty back-refs; transient concurrent-write count; never credit mid-batch; ground-truth not display rows; don't measure mid-flux; claimed≠actual; pre-flight before scaffold; diff-full-set, verify-premise → **[measure-never-assume]**
- numerator-drop diff; sub-agent self-verify; 2nd-role; gate-measured-same-thing blindspot → **[independent-verify]**
- SKILL.md read-at-boot ≠ applied per-cycle; dormant pre-gate → **[rule/gate-that-never-runs]**
- gate-faithfulness, gate-before-deploy, Tron-is-not-the-tester; SW-active or false-clean → **[evidence-must-be-able-to-fail]**
- #126-enforcement (reject impl not backed by a unit); TIER-2 guard (blocks accidental, not a lying agent) → **[rule-exempts-author]**
- #75 (TRON-CMM4: TRUTH = measurement + the committed WORD; wer-schreibt as error-correction over the broken rewind channel) → **[wer-schreibt/commit]** (root of the whole set)

## 3. Contradictions
- **PO authority.** "PO corrections take priority; PO has ground truth" vs "measure-don't-relay applies to the PO's OWN directives — a directive is a claim about disk." Authoritative: **disk-wins** — re-verify commit hashes before reflecting any directive, incl. the PO's and one's own recollection.
- **Duplicate task-file ownership.** "adopt whoever created it, reconcile" vs "planner is SOLE creator." Authoritative: **#59 sole-minter** (#12/#20 grandfathered fallback).
- **`--force`.** "escape hatch for a mistaken switch" vs "FORBIDDEN on pin-advance." Authoritative: **forbidden** — expert removed the param entirely (1006d11ba).
- **Auth signal shape.** own `--tron-auth-ref` flag idea vs "signal = the committed RECORD not a flag." Authoritative: **committed record.**
- **Hop backfill** (vs Tron #102): earlier backfilling impl/test hops vs "your hop your status." Authoritative: **#68/Tron — no backfill.**
