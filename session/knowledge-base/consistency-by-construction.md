# Consistency by Construction — who owns pin↔board↔files (doctrine ruling)

**Ruling (ARON, keeper/first-principles counsel, 2026-08-07, TRON via robbin-po).** Concrete case: the CurrentSprint **pin** said Sprint 33 while **files/work** were on Sprint 36 (never advanced through 34/35), and the **board** sat between — pin↔board↔files DRIFTED.

## The first-principle answer: nobody "owns" it by watching — the DESIGN owns it
Consistency maintained by a person's vigilance is **CMM2** (repeatable-if-someone-remembers) and drifts the moment attention lapses. That drift is not a who-failed problem first; it is a **DRY violation**: three hand-maintained copies of one fact (which sprint is current) that are *allowed* to disagree. **CMM4 = make disagreement structurally impossible**, not assign a watcher.

**By design (the real fix — this is a gap → make it a sprint):**
1. **ONE source of truth = the files** — task statuses / scenario units on disk (scenario-first, law #100: markdown/board is a *generated view*, never hand-authored truth).
2. **The pin and the board are GENERATED views**, regenerated on every change. A generated view **cannot drift** from its source.
3. **A `validate`/CI guard asserts `pin == board == files`, FAIL-LOUD** — objects self-heal (init/validate refuses to run silently drifted). "No silent broken state."
4. The pin is **computed** from the files (the sprint the work is on); if it stays TRON-gated, the increment op writes **pin+board atomically** and the guard **blocks work on an un-pinned sprint**.
5. **SURFACE-TO-TRON** — the guard + SM don't just fail-loud, they **proactively ASK TRON** (see below). Detection without surfacing is a silent gate.

## SURFACE-TO-TRON — ask, don't silently defer (refinement, TRON 2026-08-07)
Making TRON the **sole** increment-owner **without the team ASKING him** turns TRON into a **BLIND BOTTLENECK.** PROOF (this very case): the pin drifted **3 sprints** (33 vs work-36), and **NOBODY surfaced it** — it sat until TRON himself noticed and asked. **Deferring silently to TRON ≠ involving TRON.** A gate the authority never hears about is a *false* gate; it fails exactly like having no gate.
- The instant `pin ≠ board ≠ files`, the **fail-loud guard AND the SM (every sweep) PROACTIVELY ASK TRON**: *"pin=33, work=36 — increment?"*
- **TRON DECIDES** the atomic increment — governance stays his. **The TEAM DETECTS + ASKS.** → TRON is never blind, never the silent bottleneck; the decision reaches him the instant it's needed, not weeks later.
- **General principle:** whenever a human owns a decision, the team's duty is to **detect the trigger and SURFACE it**, not to sit idle "deferring." Silent deferral is not respect for the gate — it's a dropped ball wearing the gate's uniform.

**Full model = GENERATE + GUARD + SURFACE-TO-TRON.**

## Roles — until it is correct-by-construction (who acts, in order)
| Owner | Responsibility |
|-------|----------------|
| **PLANNER** | Owns the mechanical sync — pin+board must reflect the files' real state on every change. **This drift is the planner's miss.** |
| **SM** | Owns **detection** — measure `pin` vs `files` every 60s sweep; flag drift as a defect. |
| **PO** | Owns the **gate** — a sprint is NOT "advanced" until `pin == board == files`. Blocks the false-Done. |
| **TRON** | Owns **only the increment authorization** (only-TRON-increments-sprints). An authorized increment must ATOMICALLY advance pin+board together — **never leave the pin behind**. Work must never jump to 36 while the pin says 33 (the 34/35 increments were never authorized → governance breach + mechanical drift, both). |
| **objects-self-heal** | The pin/board object validates on init (`pin.sprint == files.sprint`) and heals or fails loud — never runs drifted. |

## One-line for TRON
**Design owns consistency (DRY: files = source, pin+board = generated views, a fail-loud guard). Team GENERATES + GUARDS + SURFACES-TO-TRON: planner syncs, SM detects, PO gates, and the instant pin≠board≠files they ASK TRON ("increment?") — TRON decides the atomic increment. "Owned by vigilance" = CMM2 = drift; "silently deferred to TRON" = TRON blind = the bottleneck that just cost 3 sprints. Detect-and-ASK, never detect-and-wait.**
