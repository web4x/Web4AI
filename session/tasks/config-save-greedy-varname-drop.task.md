# config.save GREEDY varname extraction → silent var DROP (any value containing ' ident=')

**From**: oosh-po@WODA.prod (oosh-expert flag during task-18 root-cause, 2026-07-03)
**Owners**: config-expert/oosh-architect (contract) → oosh-expert (impl) → config-tester
**Priority**: HIGH — SILENT data loss (a persisted var vanishes with no error)
**Date**: 2026-07-03
**Related**: task-18 cyan (the symptom), fix `9d65d12` (the 2 sites already anchored)

## Problem / Why
`config.save`'s varname extraction sed was GREEDY (`s/^.*[ ]\(name\)=.*/`). For any var whose VALUE contains ` identifier=` (e.g. `FORMAT_PARSE_METHOD`, value has `METHOD_DESCRIPTION=`), the `.*[ ]` matched INTO the value → wrong varname → the allow-list `case` failed → **var SILENTLY DROPPED from the .env**. Cost: line.format lost FORMAT_PARSE_METHOD → METHOD_PARAMETER always empty → cyan never fired (task-18). The 2 known sites are fixed (`9d65d12`, anchor on `declare -<flags> ` prefix), BUT the expert flagged: **this class could silently lose ANY var with ` ident=` in its value** — needs a broader check.

## Design / Approach
1. AUDIT: grep all config.save call sites / varname-extraction paths for the greedy pattern; confirm all anchor on the `declare -<flags> ` prefix (first real identifier).
2. HARDEN: one canonical varname extractor (DRY) used everywhere config parses `declare` lines — anchored, never greedy.
3. DETECT: config.save/validate should FAIL-LOUD if a var it was asked to persist did not round-trip (save→reload count mismatch) → no silent drop.
4. SWEEP: check existing persisted .env files for already-dropped vars (any var expected but missing).

## Acceptance Criteria
- [ ] No config.save path uses greedy varname extraction (all anchored on declare-prefix)
- [ ] A var whose value contains ` ident=` round-trips (save→reload) intact
- [ ] config.save fails-loud on a persist round-trip mismatch (no silent drop)
- [ ] T-CONFIG-SAVE-VALUE-IDENT: persist a var with ` x=` in its value → reload → present
- [ ] DRY: single canonical declare-line varname extractor

## ARCHITECT CONTRACT (oosh-architect, 2026-07-03)
Two deliverables: (A) ONE canonical anchored varname extractor (makes greedy UNREPRESENTABLE), (B) config.save FAIL-LOUD round-trip (catches ANY drop, not just this one). Correct-by-construction: don't "fix the sites" — remove the ability to extract wrongly, and add a net that makes a silent drop impossible.

### Measured state (config)
- Anchored sed at **332** + **361** (post-9d65d12) — CORRECT (`s/^declare -[^ ]* \([A-Za-z_][A-Za-z0-9_]*\)=.*/\1/p`) but **DUPLICATED**.
- Export-line extraction at **352** + **388**: `vn="${line#export }"; vn="${vn%%=*}"` — correct but a DIFFERENT method (divergent).
- Dead **greedy** comments at **323-324** (`\(.*$name\)`) — landmines, delete.
- So: 2 methods, the sed one copy-pasted → the DRY target.

### (A) ONE canonical extractor — `private.config.declare.varname <line>`
- **Returns** the varname (rc0) for `declare -<flags> <IDENT>=…` OR `export <IDENT>=…`; **empty + rc1** otherwise. `<IDENT>` = `[A-Za-z_][A-Za-z0-9_]*`.
- **Anchored, never greedy**: strip the EXACT prefix (`^declare -[^ ]* ` | `^export `), then capture the leading identifier up to the FIRST `=`. **NO `.*` before the identifier** — the capture is pinned to position-0-after-prefix, so the value (which comes AFTER `=`) is structurally unreachable. A value containing ` x=` CANNOT corrupt the name.
- **THE invariant (correct-by-construction)**: because the capture matches only a valid identifier anchored right after the prefix, extracting a token from inside a value is **unrepresentable** — not "the 2 sites are fixed." This is the DRY chokepoint.
- **ALL** config declare/export parsing calls this: single-file save (332), harvest (361), export sites (352/388) → ONE definition, zero duplicates. **Delete** dead greedy comments 323-324.

### (B) config.save FAIL-LOUD round-trip (the general net)
- As save emits lines, collect `intended` = the set of allow-listed varnames written (via the canonical extractor on each emitted line).
- **Write to `$file.tmp`, NOT in place.** Re-parse `$file.tmp` via `private.config.declare.varname` → `persisted` set.
- `dropped = intended \ persisted`. **If non-empty → `error.log "config.save: round-trip DROPPED: <names> — refusing silent data loss"`, return 1, and LEAVE THE ORIGINAL FILE INTACT** (never mv the lossy temp over good data). On match → atomic `mv $file.tmp $file`.
- This is a GENERAL guard: it catches THIS greedy bug AND any future drop cause (quoting, value edge, allow-list miss). **No silent loss is possible** — either the save round-trips or it fails loud with the old file preserved. Atomic-tmp makes the failure path itself lossless.

### (C) Sweep (enabled by A+B — tester)
Run `config.save` against the live env → the round-trip check now surfaces any currently-droppable var; plus diff a fresh live-harvest against each persisted `.env` (`user.env`, `oosh.env`, `log.env`) to find already-dropped vars from before the fix.

### Acceptance mapping
- No greedy path (323-324 deleted; 332/361/352/388 → the one extractor) → AC#1, AC#5.
- ` ident=`-in-value round-trips → AC#2 (guaranteed by the anchored capture, verified by B).
- fail-loud on mismatch, original preserved → AC#3.
- **T-CONFIG-SAVE-VALUE-IDENT**: `config set FOO 'a b=c'` → save → reload → FOO present, value intact; NEGATIVE: force a drop (e.g. stub a greedy extractor) → assert `config.save` returns 1 + errors + `user.env` UNCHANGED (not half-written) → AC#4.

## Report-back (owners edit here; one line + commit)
- Architect (canonical extractor contract): **DONE 2026-07-03** — (A) ONE `private.config.declare.varname` anchored extractor (`declare -flags IDENT=` | `export IDENT=`, capture pinned post-prefix → greedy UNREPRESENTABLE, value-with-` x=` structurally safe); ALL 4 sites (332/361/352/388) converge on it, delete dead greedy 323-324. (B) config.save writes to `$file.tmp`, re-parses via the extractor, `dropped=intended\persisted` → FAIL-LOUD rc1 + KEEP original (atomic-mv only on match) = no silent loss for THIS or ANY drop cause. (C) sweep via the new round-trip + live-harvest diff. T-CONFIG-SAVE-VALUE-IDENT incl. the negative (forced drop → rc1, file unchanged).
- Expert (audit + harden + fail-loud): **ALREADY LANDED on `origin/dev` via `7a56863`** ("massive config change - suspicious", Marcel Donges, Jul 7 — config-only +68/-16). VERIFY-not-REDO finding (2026-07-14 oosh-expert@ooshTeam:0.3): the "1fb7bb1 LOST" premise was measured on `/root/oosh`=mcdonges.latest (WRONG tree); the impl lives on origin/dev. Verified read-only: (A) canonical `private.config.declare.varname` present (dev:config:291), **all 6 call-sites converge** (312/366/396/404/431/446), DRY ✓; old greedy `grep " ${name}"` + dead greedy comments **removed** ✓ → AC#1/#5. (B) fail-loud round-trip: writes `${CONFIG}.tmp.$$` (362/416) → re-parse persisted (312) → `error.log "config.save: round-trip DROPPED — refusing silent data loss (kept original)"` (318), atomic-mv only on match ✓ → AC#3. `bash -n` clean. STATUS = **unverified, not lost** (author self-flagged "suspicious"). NEXT = tester runs T-CONFIG-SAVE-VALUE-IDENT (positive+negative) on a clean origin/dev checkout to clear the flag → PO gate → Tron. Expert stands ready to patch any gap the test surfaces. Do NOT reimplement (would conflict with 7a56863).
- Tester (T-CONFIG-SAVE-VALUE-IDENT + sweep):

---
## ✅ PO SIGN-OFF on contract (oosh-po@WODA.prod, 1fb7bb1) — APPROVED, ready for expert
Correct-by-construction — approved. This is the right shape (pin correctness structurally, don't patch heuristics):
- **(A) canonical `private.config.declare.varname`** — anchored on exact prefix, IDENT pinned position-0-after-prefix, NO `.*` before → extracting a token from inside a value is **UNREPRESENTABLE** (structural, not a fixed-up regex). 4 sites converge; delete dead greedy comments.
- **(B) fail-loud round-trip** — tmp→re-parse→dropped=intended−persisted→rc1 + KEEP ORIGINAL (atomic mv only on match): lossless even on the failure path, catches THIS bug AND any future drop cause. This is the net that makes silent loss impossible.
- **(C) sweep** for already-dropped vars in live .env files.
- **T-CONFIG-SAVE-VALUE-IDENT** + NEGATIVE (force-drop → rc1 + user.env UNCHANGED) = proves both the fix and the net.
**Expert**: implement A+B+C against the contract; tester runs T-CONFIG-SAVE-VALUE-IDENT (positive + negative) → PO gate → Tron.

---
## PO RULING — target branch + stray topology (oosh-po@WODA.prod, 2026-07-14)
Expert measured git topology before editing (CORRECT — measure-a-stable-state, never edit broken/stray ground) → live tree is on wrong branches; 1fb7bb1 was the PO-SIGNOFF, the impl was never landed (truly lost).
- **TARGET CONFIRMED: clean `origin/dev`** (the contract lineage — `9d65d12`/`9937799` base + allow-list). Checkout clean origin/dev, land A+B (canonical `private.config.declare.varname` + fail-loud round-trip) THERE, verify CAPTURED (tester, clean box).
- **DO NOT mutate the LIVE `OOSH_DIR` checkout (`dev-teampush-astray`) mid-run** — the running team uses it; a branch switch disrupts them. That is a SEPARATE, deliberate coordinated op → `live-box-stray-branch-topology.task.md` (HIGH). No cowboy live-checkout surgery, no `oo mode` on this box.
- Land A+B on clean origin/dev NOW (that's uninterrupting); the live-checkout switch is planned separately (architect safe-switch plan → Tron-aware).
- Report-back (commit + dual-link) before idle.
