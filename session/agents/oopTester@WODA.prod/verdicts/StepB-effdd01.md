# Verdict — Step B (pure Thinglish target) on Web4MDA `effdd01` — oopTester, 2026-10-02

**VERDICT: TH1 GREEN · TH2 GREEN · TH3 RED (8 facts, one ruling) · TH4 GREEN · TH5 GREEN.** Not ruled DONE (Tron rules DONE).
**Gate:** `session/tasks/oopTester-stepB-TH-gate-effdd01.patch` — ONE new test file `MOF/M2/M2ThingClass/latest/test/ThinglishTarget.test.ts`, test-only, **NOT pushed** (TH3 RED would turn main red; lands with the ruling).

## Pre-checks (measured, not relayed)
- `effdd01` = origin/main (fresh clone from GitHub). One commit set since `0c6e081`; test files changed: only my 3 target-listing files + oopExpert's own `M2ThingClass.test.ts`.
- My target-listing patch landed **VERBATIM**: `cmp` byte-identical for M1Catalog.test / M1Layout.test / Pipeline.test vs `d4ba49b` + `83b2428d` patch.
- `.thing` files: **102 = 94 class + 8 interface** (git ls-files).

## Suite health on effdd01 (cold, isolated clone)
- Default: **570 pass, 2 skipped, 2 RED = both `Test timed out in 2500ms`** (M1Layout AC6 pair).
- `--maxWorkers=1`: **571 pass, 2 skipped, 1 RED = timeout** (PlantUML render, 3955ms). Every test passed in ≥1 run; every failure a timeout → **timeout class, not a defect**; no budget touched.
- A third run WITH my gate was **load-confounded** (load average 52): 34 RED = 33 timeouts + 1 non-timeout (TH3). Not used for suite health.

## Oracles (never the code under test)
TH1 set from the **catalog** (name + kind); folder from the layout, whose rule is gated independently by M1Layout AC6. TH3 facts from the **model** (ClassModel and its units), checked against the **committed text**. TH4 keyword set **derived from `ThinglishGrammar`** (25: namespace dependency abstract entry class extends implements containedBy instanceOf interface static private protected override readonly async attribute property get set relationship redefines collection contains references; version values latest/prod excluded). Reported at the WEAKEST literal: TH3 = each model fact's identifying token on its line kind in the committed text — not a full parse-equality.

## Per gate
- **TH1 GREEN** — CHECKED 102 / SKIPPED 0 / TOTAL 102; missing [] extra []; interface files = `interfaceClasses()` = 8. Seeds RED by name: a missing file; a wrong-kind file (missing + extra).
- **TH2 GREEN** — every `.thing` is in the REAL pipeline's byte-compare scope (`isGenerated`; `thinglish` ∈ homeDirectories) → Pipeline.test "reproduces them byte for byte" compares it. **Real seed** (scratch clone, local commit, never pushed): a hand-edited `BrowserFile.class.thing` → that Pipeline test RED, drift names `…/DefaultFile/latest/src/thinglish/EAM/layer4/BrowserFile.class.thing`; reverted.
- **TH3 RED — 8 facts, all `ClassModel.isAbstract` of the 8 INTERFACES** (File, Component, Displayable, Folder, Process, Tree, Unit, View). Everything else present: 102 classes, 1219 fact groups (namespace, dependencies, kind, type params, extends/implements, F4/F5 header clauses, attributes incl. multi-line initializers, ends with `?`/`redefines`, methods incl. params `...`/`?`/defaults/return/modifiers/body or `;`). `held(c)` EXACT vs the set re-derived from the model (G5 + F3) for all 102; no held uuid leaks. Derived counted present: RelationshipModel.source, ClassModel.level, ImportModel.isInterface, typeArguments. Seeds RED by named fact: dropped initializer, dropped `?`, dropped `redefines`, dropped body line, dropped dependency, dropped F4 `containedBy` header clause, leaked uuid, mutated held set.
  - **RULING NEEDED (not decided by me, gate NOT weakened):** the grammar's interface rule has no `abstract` modifier, so `interface X` carries no explicit abstract. The invariant "every interface isAbstract" IS gated (M1Catalog.test:147, green) → derivable from kind, i.e. lossless **iff** ruled a 5th derived fact (`ClassModel.isAbstract` for an interface = derived from kind). Otherwise the grammar must render it (builder change).
- **TH4 GREEN** — every keyword-position token in all 102 files ∈ the derived 25. Seed RED by name: invented `mixes` (header clause) and `frozen` (member modifier).
- **TH5 GREEN** — per class the committed lines match the model ONE-TO-ONE (namespace 1, dependencies = imports, header 1, attributes, member ends, members = methods), nothing unclassified, across all 102. Seeds RED: an invented attribute line (+1), a dropped one (−1); an INEXPRESSIBLE relationship kind is a NAMED error (`cannot express: mixes 'blend'`), never made up or dropped.

## Instrument bugs I found in MY OWN gate before this verdict (fixed, disclosed)
1. Getters WITH bodies (`property x: T get {`) were unparsed → their bodies looked "unclassified" (TH5 false RED) AND their keywords were never scanned (TH4 green-by-omission). Fixed; TH4 re-measured green with getters included.
2. Multi-line template-literal initializers (ThinglishGrammarModel.ebnf) — TH3 checked only the first line, TH5 counted continuations as unclassified (false REDs). Fixed: whole-text initializer match; the parser consumes the literal.
