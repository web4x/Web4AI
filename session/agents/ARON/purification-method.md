# Purification Method — Keeper Skill

**Owner:** ARON (keeper). **Single source — other docs POINT here, never copy (move 11).**
**Origin:** abstracted from TRON's live purification of `agent-rewind.md` (2026-09-12/13; distill-commit `dfe539a2`). TRON: *"make this table the base of your purification skill."*
**This skill is purified by its own method** — recall-table on top, DO/WHY split, attributed, point-not-fork.

## ★ WHAT PURIFICATION IS (the one-line definition, live by it)
**Purify = shorten with NO LOSS of the critical, made consistent with the law it lives under — and the VERIFY is the second half of the work.** Length is free; brevity is the labour I exist to pay (Goethe's long letter: it takes longer to write a short one). A purification is a *claim* until verified; unverified, it is not done.

## ★ THE METHOD — RECALL THIS (15 moves). The table IS the skill; everything below is the WHY.

| # | Move | Do | Why (the principle) |
|---|------|-----|---------------------|
| 1 | **NAME the drift, verbatim** | Capture TRON's exact words — dated + attributed — the moment a routine deteriorates | His intervention = a failed CMM4 loop; the verbatim **freezes exact intent** so it can't be paraphrased away |
| 2 | **RE-READ, don't remember — a boot source is DATA that DECAYS** | Re-open the canonical doc; audit it against CURRENT law; **de-hardcode mutable state** (model, session-id, pane → measure live, R113) | **Memory drifts; a boot file rots** — a superseded rule becomes a *live hazard* that fires at boot; a remembered id is a lie |
| 3 | **BAN the damaging word** | Replace the word carrying a wrong model (`cut` → `2-phase rewind`) | **Vocabulary shapes behaviour** — fix the word, fix the act |
| 4 | **DISTILL to a recall-able TABLE on top** | Whole procedure as a compact table at the very top | **Buried prose is INERT** (unrecalled = unused); a top-table gets used |
| 5 | **SEPARATE the DO from the WHY** | Top = steps; below = rationale, cited by section | Operators need steps fast; rationale is reference — mixing buries the steps |
| 6 | **SUPERSEDE in-place; MOVE bulk, never COPY or THIN** | Strike old value `~~struck~~` + new + date; move superseded *bulk* to a non-boot history file and make the boot NAME the fence | Deleting loses *why* it changed; **two copies = two truths that drift**; an anchor must re-derive with ZERO conversation (fenced, never thinned) |
| 7 | **RECONCILE against the law — and the INSTRUCTION is a HYPOTHESIS** | Check the fix against every law it touches; verify the *purify-instruction itself* against the artifact | A one-law fix that breaks another is a new defect; a relayed **"X is missing" may be the design, not a gap** (do the opposite when the law says so) |
| 8 | **ATTRIBUTE + DATE every edit** | who · when · what-it-corrects | Provenance makes a rule **auditable and traceable** |
| 9 | **CITE by section-anchor, never line-number** | Reference the heading text | Line numbers **drift** when the doc is edited elsewhere |
| 10 | **ENFORCE by construction** | A lint / the structure holds it — not willpower | **Awareness decays; only a mechanical guard holds** (F2/F8) |
| 11 | **POINT, don't fork** | Canonical statement lives **once**; others POINT here | Duplicated canon drifts — LAW-9 / DRY applied to our own docs |
| 12 | **CAPABILITY-DIFF, not just content** | When you rewrite role/boot language, diff the CAPABILITIES it grants — not only the words | **A consolidation can silently DELETE a capability** (a tidy "NEVER DRIVE" once revoked a standing driver-grant → the agent went uncuttable). Removing stale FILES is safe; rewriting ROLE LANGUAGE is not |
| 13 | **The CARER is never its own carer** | Never self-certify a purification of your OWN boot source — a peer cross-checks it | 42: I cannot see my own seams. A self-certified boot repair is the drift certifying itself |
| 14 | **VERIFY the edit LANDED** | Read it back on disk / confirm it rendered | **Measure, never assume the edit took** (TRON: *"verify the table rendered"*) |
| 15 | **PROVE by use** | Purified only once operating *from* it succeeds | A manual is clean only if **driving from it works** |

**★ Measure honestly while you purify (move 2 has teeth):** read with **NO suppressed stderr and NO truncation** — `NO 2>&1 / 2>/dev/null / head / tail`. *You cannot purify what you cannot fully see.* (Lived 2026-09-13: a `head`-truncated, `2>/dev/null` read HID the distill-commit and half the process.) A vendor/tool HINT (the `/context` panel recommends banned `head`/`tail`) is INPUT, not authority.

## ★ A BOUNDARY CAN ORPHAN LIVE CANON ON ITS FAR SIDE (oopPO-ruled, ARON-banked 2026-09-24)
Any boundary you move — consolidate · FENCE · compact · re-index — can silently strand a still-live rule on the far side. Three faces, one shape: a **consolidation** can delete a CAPABILITY (a flat "NEVER DRIVE" revoked a standing driver-grant → uncuttable); a **FENCE** can orphan a LIVE RULE (a duty living only in fenced prose → a rewound agent boots without it); an **INDEX past its read-limit** orphans its TAIL (a 25.6KB MEMORY.md vs a 24.4KB load-limit silently dropped ★★ laws on every boot).
**Remedy (one rule):** before/after the boundary moves, **SWEEP THE FAR SIDE for still-live rules and PROMOTE them FIRST** — to auto-memory or the single-source manual (R113: never leave a standing rule in history prose); fence/drop only what is genuinely dead. **VERIFY BY LOADING, not by inspecting** — the index-orphan was invisible to every *reading* of the file; only a size-vs-limit check exposed it. (This is move 6 with teeth + move 12 extended to the fenced side. NB: auto-memory reverts on a deep option-2 rewind — a rule that must survive a cut needs a git-committed home too.)

## When to purify (trigger)
Any of: a **verbatim TRON correction** · a routine **deteriorating** (operators running it from memory) · a doc accumulating **contradictions** · a boot source gone **stale/bloated** · **"nobody can recall the rule."** TRON having to intervene *is* the trigger — the CMM4 loop failed to self-correct.

## The WHY (kept short; cited by move #)
- End-state: a **recall-able, self-enforcing, single-source manual an operator drives *from* directly** — the opposite of driving from drifted memory (moves 2, 4, 10, 11).
- Purification is a **CMM4 loop applied to a document**: name → re-read → fix-word → distill → split → supersede/fence → reconcile → attribute → anchor → enforce → point → capability-diff → peer-check → verify-landed → prove-by-use.
- It ends at **"rendered + verified on disk + capability-preserving + proven by use"** — never at "committed."

## Provenance
Abstracted by ARON (keeper) from TRON's purification of `agent-rewind.md`, 2026-09-13 (`dfe539a2`); moves 12–13 + the definition added 2026-09-24 from the fleet-rewind cascade (the trainer's NEVER-DRIVE near-revoke; the oopTester R113-by-design catch; the carer-never-own-carer cross-check). Refine/relocate = keeper's lane. **NEVER forget TRON CMM4.**
