# oopPO → oopExpert: I5 — APPLY move() TO THE IOR SET (2026-10-05, REBASED on the I4d gate)

**Supersedes** `oopPO-I5-dispatch-da035dc.md` (22e80b24) — same WHAT, new BASE, tonight's rulings added, the "29" no longer carried.

**Authority:** plan of record Web4MDA `spec/plans/2026-10-05-ucpcomponent-move-ior-package.md` @ `d729ecd` (Tron-approved); Tron's rulings tonight in spec (namespace = folder, AI/Claude `55b7dbde`; ruling 4, `85c31c86`). **Base verified GREEN by oopTester (verdict `87baab0f` + conditions `54eabcdb`) AND by me on an isolated clone of `28523ec`: 641 = 639 pass / 0 fail / 2 named skip.**

## Base
Your I4d branch `oopExpert-I4d-wip` is at `3b0b50f`. Fast-forward it to **`28523ec`** = local ref `oopTester-I4d-gate` (chain `28523ec` Type.test budget → `aa36014` I4d gate → `3b0b50f` your I4d). Build I5 on top. **Push NOTHING** — ONE joint push after my isolated-clone verify.

## What I5 is (unchanged)
`move()` each IOR sub-component into Ior: **RepositoryId, ObjectKey, TaggedProfile, InternetProfile, TaggedComponent, SecureTransport, UnknownTaggedComponent + their models**. NOT `Link`. `Ior` KEEPS its folder and becomes a Package beside its own version: `Web4MDA/Ior/latest/` + `Web4MDA/Ior/<Sub>/latest/`. Each move = ONE namespace value (`Web4MDA` → `Web4MDA.Ior`), realised by generate.

## Rulings in force (this evening — the brief did not have them)
- **(A)** a component's `move()` carries the model(s) it OWNS; `move()` stays the ONLY mutation path. Ownership per **rule 4 (b)**: a component owns its RESOLVED model only as its SOLE user (`M1Layout.boundModel`).
- **(1)** each `move()` re-derives by **rule 6 over ALL USERS** (not binders) the namespace of every unit whose home changed, **in the SAME mutation** — and rule 6 picks ONLY the Package segment. A shared model moves only when all its users share a package.
- **Guard 2:** folder == namespace-derived folder for EVERY class, after EACH of the 7 moves, **ZERO exemptions** (a new gate born with allowances is green by omission).
- **Radical OOP (my narrowed ruling):** the folder PATH comes from the model; the folder OBJECT stays an instance of its class.

## Lands IN THE SAME COMMIT
1. **The README patch** — AI/Claude `e77b16b2` `session/tasks/oopPO-I1b-spec-review-7208df6.patch`, applied VERBATIM (ARM4 asserts cited paths exist → README and I5 together or main is RED). **It was cut against 7208df6: if it does not apply cleanly at 28523ec, STOP and report the hunk — do not hand-fix spec prose.**
2. Any other spec line I5 makes false — report it to me; spec is mine, you apply my patches.

## The rendered dependency ids — DERIVED, and the SIZE is re-measured
The "29" was measured at `da035dc`. I4d has since moved M3Element and NameUuid, so **the expected size is NOT carried — measure it at 28523ec and state it in your report.** The I5 gate derives the expected set from the model (every rendered `dependency …` id whose target class's namespace changed) and asserts derived set == measured diff. `/root/oopExpert-patches/i5-29-ids.txt` (outside the repo) is a cross-check only, never the oracle.

## Expected, and only this
- Stored IOR strings: ZERO change (48 == 48 at I4c — re-confirm at your base).
- Rendered dependency ids: exactly the derived set.
- Every moved class: one namespace line in its Definition; folder relocated by generate; dependants' import lines re-derived.
- `Ior.test.ts` + `IorAcceptance.test.ts`: the 2 test-path imports of moved classes.

## Report to oopTeam:2.0
Sha, whole-suite numbers on an ISOLATED CLONE of that sha (never the shared tree — your own banked law 1c4e6a56), the git-stat, the derived id-set SIZE, and any red classed (a) gate written for the old location / (b) anything else. Then HOLD for oopTester's I5 gate (G1–G7 + g1b, design `03e7b4a5`).

**NOT in I5:** the tsconfig finding — oopTester lands its own-exclude + a child-process tsc arm ON TOP of I5, after your sha.
