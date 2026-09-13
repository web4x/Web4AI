# Purification Method — Keeper Skill

**Owner:** ARON (keeper). **Single source — other docs POINT here, never copy (move 11).**
**Origin:** abstracted from TRON's live purification of `agent-rewind.md` (2026-09-12/13; distill-commit `dfe539a2`). TRON: *"make this table the base of your purification skill."*
**This skill is purified by its own method** — recall-table on top, DO/WHY split, attributed, point-not-fork.

## ★ THE METHOD — RECALL THIS (13 moves). The table IS the skill; everything below is the WHY.

| # | Move | Do | Why (the principle) |
|---|------|-----|---------------------|
| 1 | **NAME the drift, verbatim** | Capture TRON's exact words — dated + attributed — the moment a routine deteriorates | His intervention = a failed CMM4 loop; the verbatim **freezes exact intent** so it can't be paraphrased away |
| 2 | **RE-READ, don't remember** | Re-open the canonical doc; never operate from (drifted) memory | **Memory drifts; the doc is ground truth** |
| 3 | **BAN the damaging word** | Replace the word carrying a wrong model (`cut` → `2-phase rewind`) | **Vocabulary shapes behaviour** — fix the word, fix the act |
| 4 | **DISTILL to a recall-able TABLE on top** | Put the whole procedure as a compact table at the very top | **Buried prose is INERT** (unrecalled = unused); a top-table gets used |
| 5 | **SEPARATE the DO from the WHY** | Top = steps; below = rationale, cited by section | Operators need steps fast; rationale is reference — mixing buries the steps |
| 6 | **SUPERSEDE in-place, never delete** | Mark old values `SUPERSEDED` + new value + date; keep the history | Deleting loses *why* it changed; a silent contradiction is the drift |
| 7 | **RECONCILE against ALL governing laws** | Check a fix against every law it touches, not one | A one-law fix that breaks another is a **new defect** |
| 8 | **ATTRIBUTE + DATE every edit** | who · when · what-it-corrects (`"corrected here"`) | Provenance makes a rule **auditable and traceable** |
| 9 | **CITE by section-anchor, never line-number** | Reference the heading text | Line numbers **drift** when the doc is edited elsewhere |
| 10 | **ENFORCE by construction** | A lint tool / the structure holds it — not willpower | **Awareness decays; only a mechanical guard holds** (F2/F8) |
| 11 | **POINT, don't fork** | Canonical statement lives **once**; others POINT here | Duplicated canon drifts — LAW-9 / DRY applied to our own docs |
| 12 | **VERIFY the edit LANDED** | Read it back on disk / confirm it rendered | **Measure, never assume the edit took** (TRON: *"verify the table rendered"*) |
| 13 | **PROVE by use** | Treat it purified only once operating *from* it succeeds | A manual is clean only if **driving from it works** |

**★ Measure honestly while you purify (move 2 has teeth):** read the doc with **NO suppressed stderr and NO truncation** — `NO 2>&1 / 2>/dev/null / head / tail`. *You cannot purify what you cannot fully see.* (Lived, 2026-09-13: an 83-line `head`-truncated, `2>/dev/null`-suppressed read HID the actual distill-commit and half the process; the clean re-read surfaced it. TRON-caught.)

## When to purify (trigger)
Any of: a **verbatim TRON correction** · a routine **deteriorating** (operators running it from memory) · a doc accumulating **contradictions** · **"nobody can recall the rule."** TRON having to intervene *is* the trigger — it means the CMM4 loop failed to self-correct.

## The WHY (kept short; cited by move #)
- The end-state of a purified doc: a **recall-able, self-enforcing, single-source manual an operator drives *from* directly** — the opposite of "driving from drifted memory" (moves 2, 4, 10, 11).
- Purification is itself a **CMM4 loop applied to a document**: name → re-read → fix-word → distill → split → supersede → attribute → anchor → enforce → point → verify-landed → prove-by-use.
- The process ends at **"rendered + verified on disk + proven by use"** (moves 12–13), never at "committed."

## Provenance
Abstracted by ARON (keeper) from TRON's purification of `agent-rewind.md`, 2026-09-13 (distill-commit `dfe539a2`; header-ban `NO 2>&1/head/tail`). Refine/relocate = keeper's lane. **NEVER forget TRON CMM4.**
