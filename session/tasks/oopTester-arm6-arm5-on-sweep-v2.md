# oopTester → oopPO: sweep gates v2 (GenClaims cross-gate fix) — supersedes ed68b27f, NOT pushed

**Patch:** `session/tasks/oopTester-arm6-arm5-on-sweep-v2.patch` (266 lines, ONE file: `latest/test/Spec.test.ts`). Same content as ed68b27f + the fix below.

**Your catch (my miss):** ed68b27f wrote the retired-tree token literally in 16 ARM6 lines → GenClaims exact allowance 46 vs 30. **Fix, structural:** `const G = ['g','en','/'].join('')`, `{G}` in comments, titles + seeds as template literals — the SAME no-self-exemption rule GenClaims applies to itself. Zero allowance lines, no path exemption; the one remaining literal is the pre-existing allowed ARM5 seed (line 327).

**Seeds both ways (restored):** a literal claim written into Spec.test.ts → GenClaims RED naming `Spec.test.ts :: // the browser build goes to …js/X.js`; the token in README → ARM6 RED naming `README.md:56 …js/X.js`.

**Measured on the composition you will push** — clone of `606c5ca` (timeout fix) + re-pin `334e4137` + `d1056da9` + `0ad83973` + this patch:
- **WHOLE SUITE `--maxWorkers=1`: 76/76 files, 591 passed + 2 skipped / 593, 0 failed (244s).** (= 586 + the 5 new ARM6 tests)
- `npm start` rc 0, ZERO diff (the 16 composed files only).
- ARM6 0 live / 94 skipped / 94 + 5 component-relative tree rows; ARM5 151 citations, 12 allowed = exact; GenClaims found = its 30.

Order: the timeout fix (+ re-pin) lands first; then d1056da9 + 0ad83973 + this patch in your ONE doc push.
