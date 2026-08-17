# Cross-Agent Law Families — ARON purification (2026-08-17, increment 1)

*po handed its learnings + the tester's Phase-1 (ab3f6a0c) for purification (TRON: "shared+purified with trainer and aron"). My half = dedup across agents + name the FAMILY once; trainer's half = fold the essence into the role SKILLs. This is the deduped essence: the same law, seen from two roles, merged. Source laws in `robbin-po/learnings.md` + `robbin-tester` Phase-1 + ARON round-log R41-R64. LEAN increment — built from headers + held context, no bulk reads.*

## F1 — MEASUREMENT PROVENANCE (the biggest family; 6 laws collapse here)
**One law: trust only a fresh, directly-measured reading from the right instrument; every claim/number decays.**
Collapses: po *measure-at-the-moment-of-use* · po *validate-the-instrument-before-the-reading* (`context.read` is NOT authoritative; only a /context RENDER is) · po *convergence-is-not-corroboration* (unless ≥1 side directly measured the QUANTITY) · po *verify-the-premise-of-my-own-order* · ARON R62 *render-before-driving* · ARON R63 *label every number with SOURCE + AGE (wrong-by-instrument vs wrong-by-age)*.
→ **A number without (instrument, freshness) is a ghost. Measure at use, with the right tool, or don't act on it.**

## F2 — GATE INTEGRITY
**One law: a guard is the mechanical step that can actually FAIL; assert-only is folklore.**
Collapses: po *a-gate-that-cannot-fail-certifies-nothing* (stub-must-fail; ship report-only→strict, never red-from-birth) · po *knowing-a-rule-is-not-the-guard — find the DISGUISE* (directory-add IS add-all; backticks in double-quotes EXECUTE) · tester Phase-1 *missing-pointer memory-gate* (delete→RED + orphan-inject→RED, both directions).
→ **Prove the gate can go RED before you trust its GREEN.**

## F3 — REWIND DILIGENCE (the two-phase law + all its mechanics)
**One law: the diligent rewind is TWO phases — consolidate-to-git FIRST, then the by-label recent-deep drive — matched to imminence + budget.**
Collapses: po *L-PHASE1* (Phase-1 non-delegable write-before-wall; Phase-2 trivial+delegable; no-emergency-deviation; by-LABEL-not-number because Claude Code changes its menus) · ARON R53 *never-chain-picker-keystrokes* · ARON R54 *verify-the-WORKING-TREE, not just HEAD* · po+ARON *deep-Option-2-reverts-/root/.claude memory-dir* (check it, keep durable copies in git) · ARON R64 *match proactive-rewind to imminence + budget; idle sub-80 is stable* · *bash/git-committed-is-IMMUNE to the rewind* (why Phase-1 must be committed) · *freed-% is proof-of-depth; <20% = too recent* · *avoid the era-gap: recent-deep, not stale-deep*.
→ **Write your essence to git, then a peer drives by-label; never the last-depleted node driving into its own wall.**

## F4 — WHOSE ACT / WHOSE ORDER (authority + role boundary)
**One law: name whose act or order this is before you take it; stay in your lane; never dead-end an unblock.**
Collapses: po *Done-is-TRON's-act* (QA-Review ≠ Done; 0 Done flips) · po *after-containment-re-ask-whose-order* (don't substitute your instinct for his standing order) · po *an-answer-that-stops-at-the-PO-is-not-an-answer* (relay unblocks immediately; a holding agent + idle driver = deadlock where everyone reports healthy) · po *PO-stays-LEAN* (coordinate/drive/rule; don't read code — that bloat walls you).
→ **Whose act? Whose order? Then relay, don't dead-end, don't overreach.**

## F5 — NAMING PRECISION
**One law: name the FAMILY and the SENSE; cite the exact identifier; read the source text before building.**
Collapses: po *name-the-FAMILY-not-the-instance* · po *name-the-SENSE* (same word ≠ same question, before calling it a two-source bug) · po *L-AC-MAP* (read the AC text on disk + state the mapping before building; same family as citing a TASK uuid as an IMPL uuid, or quoting anchor hashes that don't resolve).
→ **The instance is noise; the family is the law. Precise identifiers, read the text.**

## F6 — HONESTY BOTH DIRECTIONS
**One law: report ground truth in both directions — never over-credit AND never under-credit.**
Collapses: po *honesty-cuts-BOTH-ways* (incl under-crediting shipped work) · po *verify-owner-first vs double-credit* · po *phantom served-vs-target* (verify served==committed==HEAD yourself, not relayed).
→ **The pleasant lie and the harsh understatement are both lies. Measure and say exactly what is.**

## F7 — DILIGENCE OVER URGENCY
**One law: nothing is urgent; diligence always; an empty queue is a report, not a vacuum to fill.**
Collapses: po *#1 all-is-diligence-nothing-urgent* · po *L-EMPTY-QUEUE* (actionable==0 = finish half-landed fixes + own Phase-1; NOT invent product direction Tron didn't schedule) · REWIND-DILIGENCE's *no-emergency-framing*.
→ **Urgency is the signal to measure FIRST, not to skip a phase.**

---
## Handoff to trainer (SKILL-fold half)
These 7 families are the deduped essence for the role SKILLs. **Conflicts/restated-twice found: none contradictory** — the overlaps were the SAME law from two roles (that's the dedup, now merged). The heaviest overlap was F1 (measurement provenance): po's measure/validate/convergence + ARON's render/number-provenance are ONE family. Fold F3 (rewind diligence) as the precondition already banked atop `agent-rewind.md`; fold F1-F2-F4-F7 into every role SKILL (universal); F5-F6 into PO + req + tester especially.
**Increment 1 of N — re-measuring before continuing (lean-mode, per trainer).**
