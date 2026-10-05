> ~~ACTIVE~~ **SUPERSEDED 2026-10-05 late by `oopPO-I5-dispatch-28523ec.md`** — base moved da035dc → 28523ec (I4d gate), the 29 is re-measured, tonight's rulings added. Do not build from this file.

# oopPO → oopExpert: I5 — APPLY move() TO THE IOR SET (2026-10-05)

**Authority:** plan of record Web4MDA `spec/plans/2026-10-05-ucpcomponent-move-ior-package.md` @ `d729ecd` (Tron-approved); I4c namespace ruling `94d2ad8`. Base verified GREEN by oopTester (verdict AI/Claude `36f38024`) AND by me on an isolated clone of `da035dc`: 81/81 files, 633 passed + 2 skipped (635).

## Base
Fast-forward your branch `oopExpert-I2-dep` from `7208df6` to **`da035dc`** (local ref `oopTester-I4bc-gate`, oopTester's test-only gate commit on top of your I4c). Build I5 on top of it. Push NOTHING — ONE joint push after my isolated-clone verify.

## What I5 is
`move()` each IOR sub-component into Ior: **RepositoryId, ObjectKey, TaggedProfile, InternetProfile, TaggedComponent, SecureTransport, UnknownTaggedComponent + their models**. NOT `Link`. `Ior` KEEPS its folder and becomes a Package beside its own version: `Web4MDA/Ior/latest/` + `Web4MDA/Ior/<Sub>/latest/`. Each move = ONE namespace value (`Web4MDA` → `Web4MDA.Ior`) in the stored model, realised by generate (F1: chained moves + one generate is byte-identical to pairs).

## Lands IN THE SAME COMMIT
1. **The README patch** — AI/Claude `e77b16b2` `session/tasks/oopPO-I1b-spec-review-7208df6.patch`, applied VERBATIM (README row 27: SecureTransport + UnknownTaggedComponent test paths → `Web4MDA/Ior/<Sub>/latest/test/…`). ARM4 asserts every cited path exists, so README and I5 must land together or main is RED.
2. Any other spec line I5 makes false that my hazard scan missed — report it to me, do not silently edit spec prose (spec is mine; you apply my patches).

## The 29 rendered ids — DERIVED, never a hand list
Your `/root/oopExpert-patches/i5-29-ids.txt` lives OUTSIDE the repo (not durable on origin) and is a hand-kept list — the gate-scan-list-must-be-DERIVED hazard. The I5 gate derives the expected set from the model: every rendered `dependency …` id whose target class's namespace changed. Assert the derived set equals the measured diff AND that its size is 29. Your file is a cross-check only; do not commit it as the oracle.

## Expected, and only this
- Stored IOR strings: ZERO change (oopTester measured 48 == 48 at I4c).
- Rendered dependency ids: exactly the derived set (29).
- Every moved class: one namespace line in its Definition; folder relocated by generate; dependants' import lines re-derived.
- `Ior.test.ts` + `IorAcceptance.test.ts`: the 2 test-path imports of moved classes (my earlier ruling).

## Report to oopTeam:2.0
Sha, whole-suite numbers on an ISOLATED CLONE of that sha (never the shared tree), the git-stat of the commit, and any red classed (a) gate written for the old location / (b) anything else. Then HOLD for oopTester's I5 gate (G1–G7 + g1b, design AI/Claude `03e7b4a5`).

**NOT in I5:** the tsconfig test-exclude finding (no test file is ever type-checked) — measured first, ranked separately.
