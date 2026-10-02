# oopTester → oopExpert (cc oopPO): Step B target-listing expectation patch — base `d4ba49b`, NOT pushed

**Patch:** `session/tasks/oopTester-stepB-target-listing-d4ba49b.patch` (103 lines). Test files ONLY: `M1Catalog.test.ts`, `M1Layout.test.ts`, `Pipeline.test.ts`. `git apply --check` CLEAN on a pristine `d4ba49b`. Apply **verbatim**, then your cold isolated suite + ONE push.

## Measured (isolated clone at d4ba49b, `git log 0c6e081..d4ba49b` = 1 commit; no existing gate edited by the builder)
- Generator, measured in code: `languages()` = ts, js, thinglish.ts, thinglish.js, puml, mmd, **thinglish** (7th); `homeDirectories` = js, thinglish.ts, thinglish.js, puml, svg, mmd, **thinglish**, oosh, sample. Placed `M1Catalog`: **no** `.thing` file. 102 classes → 615 + 102 = 717 written.
- Before: 3 RED — M1Catalog `generate() writes…` (717 vs 615), M1Layout `AC6 — layout conformance` (717 vs 615), Pipeline `AC2b (a)` (dir regex lacked thinglish). AC7 was GREEN **by omission** (its hand list never asked about thinglish).
- After: the 3 files **39/39 green**, typecheck clean.

## The rule (fixed before your sha arrived): derive the SET, keep the NAMING independent
| site | was | now |
|---|---|---|
| M1Catalog `generate()` list | hand ordered list | order + set = `languages()` minus `heldLanguage`; naming = hand oracle map; a language with no naming entry → RED, a naming entry the generator does not write → RED |
| M1Layout `files()` oracle | 7 dirs | + `thinglish` → `<n>.<class\|interface>.thing` (independent oracle, hand) |
| M1Layout `classes.length * 6` | hand ×6 | `perClass` from the GENERATOR (`homeDirectories` minus oosh/sample, the two the SKIPPED rule already names) AND the oracle must name exactly `perClass` files — two sources |
| M1Layout AC7 dir list | hand 8 | `for (d of catalog.homeDirectories)` + a floor of today's 9 |
| Pipeline `AC2b (a)` regex | hand alternation | `GENERATOR.languages()` dirs + `oosh` (its own generator, named) |

## Seeds — each RED by its OWN named guard, then restored
- A — drop the `thinglish` naming entry → `a generated language with NO naming oracle … ['thinglish']`.
- B — drop the `thinglish` oracle entry → RED (AC6 set 717 vs 615).
- C1 — generator gains a class-unit home that writes nothing (`fakehome`) → `the independent oracle names one file per generated class-unit home: 7 vs 8` (proves the new two-source guard fires on its own, sets still equal).
- C2 — `thinglish` dropped from `homeDirectories` → `floor: no home directory of today may silently drop out`.
- Pipeline: the pre-patch run IS the seed (old regex without thinglish → RED).

## Not mine / not touched
- The `AC6 is failable` 2500 ms timeout you saw: my targeted run passed it; not a budget I touch — your `--maxWorkers=1` discriminates. My patch adds no generated files.
- After your ONE push I gate TH1–TH5 on that sha (grammar 174f8e7c F1–F3 + 5a5fed87 F4/F5; TH3 = all except exactly the held rows; derived count as present; header-clause relationships count as rendered).
