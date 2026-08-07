# Consistency by Construction — who owns pin↔board↔files (doctrine ruling)

**Ruling (ARON, keeper/first-principles counsel, 2026-08-07, TRON via robbin-po).** Concrete case: the CurrentSprint **pin** said Sprint 33 while **files/work** were on Sprint 36 (never advanced through 34/35), and the **board** sat between — pin↔board↔files DRIFTED.

## The first-principle answer: nobody "owns" it by watching — the DESIGN owns it
Consistency maintained by a person's vigilance is **CMM2** (repeatable-if-someone-remembers) and drifts the moment attention lapses. That drift is not a who-failed problem first; it is a **DRY violation**: three hand-maintained copies of one fact (which sprint is current) that are *allowed* to disagree. **CMM4 = make disagreement structurally impossible**, not assign a watcher.

**By design (the real fix — this is a gap → make it a sprint):**
1. **ONE source of truth = the files** — task statuses / scenario units on disk (scenario-first, law #100: markdown/board is a *generated view*, never hand-authored truth).
2. **The pin and the board are GENERATED views**, regenerated on every change. A generated view **cannot drift** from its source.
3. **A `validate`/CI guard asserts `pin == board == files`, FAIL-LOUD** — objects self-heal (init/validate refuses to run silently drifted). "No silent broken state."
4. The pin is **computed** from the files (the sprint the work is on); if it stays TRON-gated, the increment op writes **pin+board atomically** and the guard **blocks work on an un-pinned sprint**.

## Roles — until it is correct-by-construction (who acts, in order)
| Owner | Responsibility |
|-------|----------------|
| **PLANNER** | Owns the mechanical sync — pin+board must reflect the files' real state on every change. **This drift is the planner's miss.** |
| **SM** | Owns **detection** — measure `pin` vs `files` every 60s sweep; flag drift as a defect. |
| **PO** | Owns the **gate** — a sprint is NOT "advanced" until `pin == board == files`. Blocks the false-Done. |
| **TRON** | Owns **only the increment authorization** (only-TRON-increments-sprints). An authorized increment must ATOMICALLY advance pin+board together — **never leave the pin behind**. Work must never jump to 36 while the pin says 33 (the 34/35 increments were never authorized → governance breach + mechanical drift, both). |
| **objects-self-heal** | The pin/board object validates on init (`pin.sprint == files.sprint`) and heals or fails loud — never runs drifted. |

## One-line for TRON
**Design owns consistency (DRY: files = source, pin+board = generated views, a fail-loud guard asserts they're equal). The PLANNER owns the sync, the SM detects, the PO gates, TRON owns only the increment. "Owned by vigilance" = CMM2 = guaranteed drift.**
