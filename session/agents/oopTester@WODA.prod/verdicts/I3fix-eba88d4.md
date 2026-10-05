# I3 atomic-fix verdict — Web4MDA `eba88d4` (branch oopExpert-I2-dep: 73b0d06 → d55a72f spec part 1 + grammar model → eba88d4 generate ATOMIC), local — oopTester 2026-10-05

**VERDICT: GREEN.** G7 flipped RED → GREEN on both seeds by MY run; every other gate holds. Nothing pushed.

| Gate | Result | Number |
|---|---|---|
| **G7 preflight all-or-nothing** (`oopTester-I6-g7-preflight.sh`) | **GREEN both** (RED both at 73b0d06) | rolenamed: rc 1, guard "grammar cannot express" named, **0 diff**, no Ior/UnknownTaggedComponent · twocontainers: rc 1, guard "ONE container" named, **0 diff**, no folder. At 73b0d06 both were rc 1 + 17 diff (half-moved). |
| G1 no-move generate | GREEN | gate clone at eba88d4: rc 0, 0 diff |
| G2 whole catalog vs independent oracle | GREEN 409/409 | 104 classes, CHECKED 409, MISMATCHED 0, SKIPPED-by-name 14 |
| G6 whole suite | GREEN | 78 files, 616 = **614 pass / 2 skipped / 0 failed**, rc 0, clone clean after. Delta vs I3 (613/615) = +1 = `PackagedIn.test.ts` 5 → 6, the ONLY changed test file |
| SC8 | GREEN, now for the right reason | spec AND grammar model both carry packagedIn; `ThinglishGrammar.test.ts` 14 `it`, all pass |
| Spec patch verbatim | VERIFIED | `879bb2c5` applied to 73b0d06 → `spec/thinglish.md` byte-equal to d55a72f's |
| Changed-file audit 73b0d06..eba88d4 | GREEN | 14 files: M1Catalog (held ts + 3 generated = preflight + planned realise), PackagedIn.test.ts, ThinglishGrammar (Definition + held ts + 6 generated = the EBNF lines), spec/thinglish.md. Nothing else. |
| **G1(b) relocation round trip, VALID placement** (`oopTester-I6-g1b-relocate.sh`, NEW) — re-proven because realise() was rewritten | **GREEN** | fresh-clone npm start rc 0 / 0 diff → role-less packagedIn Ior → generate rc 0, 9 renames / 17 entries → held 0 body lines, 20 import lines → tsc rc 0, 403 files, 0 errors, moved file at new path → 2nd generate 0 diff → unseed → **BYTE-IDENTICAL to eba88d4**, moved folder gone |
| G1(b) failability | PROVEN | same script on pre-I3 95de092 → RED at step 1 ("grammar cannot express: packagedIn"), as it must |

Note: oopExpert also ran G7 (reported GREEN); this verdict is MY run on fresh throwaway clones, cleaned up after.
