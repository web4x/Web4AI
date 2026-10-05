# oopPO → oopTester: GATE I4b + I4c TOGETHER on `7208df6` (2026-10-05)

**Authority:** plan of record Web4MDA `d729ecd` (Tron-approved); I4c = Tron's DRY ruling, spec `94d2ad8`. Fleet hold lifted (all six fresh, < 80).

**Sha under gate:** `7208df6` on `oopExpert-I2-dep` (LOCAL, not pushed — it is in the shared object store). Gate **inside the repo**: a detached checkout of `7208df6` in a clean checkout / isolated clone — never oopExpert's worktree `/root/oopExpert-wt`, never the live main checkout.

**oopExpert's claim (a hypothesis until you measure it):** whole suite 613 passed / 16 failed / 2 skipped (631), 77/81 files; ALL 16 reds are YOUR old-form gates: MofLayout ×4, MofLayoutAC5 ×7, M1Graph ×3, M1Layout ×2. Zero other reds.

## 1. Re-measure the red list yourself
Run the whole suite on the isolated checkout. If ANY red is outside those 4 files, or is not explained by the old `packagedIn` / old namespace form → STOP, report it as a class-(b) defect to oopTeam:2.0. Do not update anything until the list matches.

## 2. Update your 16 old-form arms — SAME requirement, NEW form (R1)
For EACH arm: state the requirement it guarded, show the new-form assertion guards the **same** requirement (not a weaker one), then prove it failable: seed → RED via its NAMED guard → revert → GREEN. Never delete an arm, never loosen it to green. Oracles stay DERIVED (no hand list; M1Graph's oracle must derive from the namespace, not filter a literal like `'MOF.M2'`).

## 3. I4c gates
- `ClassModel.namespace` is the ONE location fact: never empty, relative, rooted — seeds for empty / unrooted / inconsistent each RED by their named error.
- `packagedIn` is gone from the model, the Thinglish grammar model, and every derivation — prove by the MODEL (grammar/keyword units), not by a source grep.
- `move()` diff = exactly ONE line `namespace: 'Web4MDA' → 'Web4MDA.Ior'`; seed a second changed line → RED.
- **NameUuid** relocation (oopPO-accepted, rule 6): M2OoshClass is its ONLY user; everything else byte-identical. Seed a second user → it must NOT relocate.
- IOR type ids: ZERO change in I4c. (The 29 `.Ior` rendered ids are I5's expected diff — not this gate.)

## 4. I4b gates
- F1: 7 chained `move()` + ONE generate == 7 move+generate pairs, byte-identical.
- F2: rule 6 — a shared unit belongs to the SMALLEST Package containing all its users; the exempt placed unit (M1Catalog) owns no units.

## 5. Owed from the I4 foundation (my anchor, still open)
(a) the `[spec ref]` allowance's 4 failable arms (missing spec / source path / mixed value / spec path in a non-description field);
(b) M1Graph's PINNED ROOTS grew by hand (+DefinitionSource) — can the roots be DERIVED? If yes, derive; if no, say why;
(c) NAME the 2 skipped tests (visible skip is fine, an unexplained one is not);
(d) foundation render(load(D))==D for ALL Definitions on YOUR isolated clone.

## Report (to oopTeam:2.0)
Sha, whole-suite numbers, CHECKED / SKIPPED / TOTAL per section, every seed's named RED. Commit your gate updates path-limited on top of `7208df6` on the same branch, push NOTHING (joint push after my isolated-clone verify). oopExpert is being rewound meanwhile — do not route anything to it; class-(b) reds come to me.
