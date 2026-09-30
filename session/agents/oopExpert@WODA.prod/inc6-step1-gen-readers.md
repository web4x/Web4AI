# inc 6 STEP 1 — who reads `gen/`? (measured at Web4MDA `2b5f5830`, no code changed)

*oopExpert, 2026-09-30. Classification by CODE PATH, not string match. Method: grep for the `gen` path token in every `Components/**/*.ts`, then every fs call site and every `NodeJSFile`/`NodeJSFolder` construction in production src read in context; for tests, every literal `gen` root plus every user of the `Generated` helper (which defaults to the committed `gen`).*

## 0. The fact that frames everything
The component folders hold **only `src/ts`** (75 files). `gen/EAMD.ucp` holds a **mirror of those 75 TS** plus every language the components do NOT hold: js 75 · thinglish.ts 75 · thinglish.js 75 · puml 79 · svg 79 · mmd 74 · oosh 2 · sample 1.
So "what the components hold" = **TS only** today; the `gen/…/src/ts` tree is a pure duplicate of it.

## 1. Counts (vs oopPO's "22")
Files with a `gen` path token: **35** = 9 component `src/` + 5 model Definitions (same method bodies as their src) + 21 tests. Plus **9 more tests** that reach the committed `gen/` WITHOUT the literal, through `test/Generated.ts` (`init(root = 'gen')`). `scripts/`: 0. I cannot reproduce 22 exactly; the split above is derived and re-runnable.

## 2. PRODUCTION (src + Definitions) — **zero content READERS of gen/**
| Site | Class | What it does with gen |
|---|---|---|
| `M1Catalog.generate(root='gen')`, `.layout(root='gen')`, `.place()` | WRITE | layout folders → `create()` + `M1Class.save` / `writeAtomic` |
| `M1Class.save(dir)` | WRITE | `writeAtomic` |
| `M2PlantUmlClass.derived()` | WRITE | svg `writeAtomic` |
| `M1Graph.generate(root='gen')`, `M1Sample.generate(root='gen')` | WRITE | puml/svg/sample `writeAtomic` |
| `M2OoshClass.generate(…, root='gen')` | WRITE (reads OOSH scripts OUTSIDE the repo, not gen) | `save(dir)` |
| `M1Layout.layOut(catalog, rootDirectory='gen')` | NONE | in-memory tree (addresses only) |
| `Web4MDA.clean()` `rm -rf dist gen` | WRITE (delete) | — |
| `Web4MDA.generate():84` `shell.exists('gen/EAMD.ucp')` | **PROBE** — existence of its own output after the steps ran | not content; flag: it is the ONE production touch of gen that is not a write |
| NodeShell:35, ImportModel:8, M2ES2020Class:48 | comment | — |
Other production reads (none of gen): M1Catalog `placedSource` reads its own src; `M1Catalog.load` lists `*/latest/model`; OoshUnit/M2OoshClass read explicit paths; FileServer reads client paths under the repo root (generic API, no gen default); NodeShell probes ancestor markers.

## 3. TESTS — the READERS
**R1 — read gen's TS mirror = what the components hold (AC6 violations proper, 4 sites):**
- `ModelStyle.test:68` — style scan over `gen/EAMD.ucp/**/src/ts` (AC5 style).
- `Pipeline.test:142,147` — `gen.classFile('Web4MDA','ts')`.
- `M1Layout.test:118` → AC7 "every generated import RESOLVES" over ts + thinglish.ts modules (the ts half).
- `ComponentModelInc2.test:64` — node:fs-only-in-NodeJSFile/Folder over ts, js, thinglish.* (the ts half).

**R2 — read gen-only languages (components do not hold them yet):**
- js executed: `ComponentModelInc1:56`, `ComponentModelInc3:41,131`, `UnitReferencesInc2:265`, `Unit.test:216`, `NodeJSFile.test:212`, `TreeFileUnitInc1:195`, `TreeFileUnitRulings:199`, `M1Layout.test` AC7-executes.
- thinglish.js: `ModelJson.test:116-117`.
- puml/svg/sample: `M1GraphFocus`, `M1Graph.test`, `M1Sample.test`, `M1SampleObjectDiagram`, `Node22.test`, `Pipeline.test:108-160`.
- oosh: `M2OoshGate.test` (committed vs a tmp generate).

**R3 — structure/equality gates over the committed tree (AC6's second half, legitimate):** `Pipeline.test` (git ls-files/status gen, committed == scratch pipeline via `git diff --no-index`), `MofLayout.test:54-55`, `MofLayoutAC5` LayoutOnDisk + cpSync copy, `M1Layout.test:182-183`, `TreeFileUnitRulings:231`.

**R4 — copies:** `Scratch.ts:12` and `BootstrapSeed.test:23` copy `gen/` into a scratch before running the pipeline.

**Not reads (address math / data):** `catalog.layout('gen')` path computations (MofLayout:38/76, M1Layout:158, ModelStyle:138, M1Catalog.test:58, MofLayoutAC5 probe 327-331), `UcpComponent.test:222` (string in a seed), `M2ThinglishClass` (its own tmp tree).

## 4. What reads `gen/EAMD.ucp` (rule 6 retires it LAST)
Every R1–R4 test + the production PROBE `Web4MDA.generate:84`. No production path reads its content.

## 5. The decision this exposes (oopPO / Tron)
Rule 6: gen/EAMD.ucp is retired "for whatever the component folders hold". Today they hold TS only, so strictly only the TS mirror retires. To retire `gen/EAMD.ucp` ENTIRELY the components must hold every generated language:
- **(a) recommended:** generate each language INTO `Components/<…>/<Owner>/latest/src/<lang>/…` (the repo already mirrors the layout, rule 6). Then gen/ disappears; readers repoint through ONE place (`Generated` / `M1Layout` root).
- (b) keep gen/EAMD.ucp for generated-only languages; then rule 6 never completes and AC6 reduces to R1.

## 6. Proposed chunks (assuming (a); each ends green + isolated cold clone)
- **C1: retire the TS mirror.** The generator stops writing `gen/…/src/ts`. R1 readers read `Components` TS (ModelStyle:68 drops the gen half; Pipeline ts via the component; AC7 resolve + ComponentModelInc2 run the ts half on Components). The reproduce gate (catalog → TS == src) already proves TS equality.
- **C2: code languages into the components.** js, thinglish.ts, thinglish.js written to the component folders. `M1Layout` root = the repo root for code languages. The R2 js readers repoint through `Generated`.
- **C3: diagrams + oosh + M0 sample into the components.** puml, svg, mmd, package graphs, oosh, sample.
- **C4 (LAST): delete `gen/EAMD.ucp`.** `Web4MDA.targets`/`clean`/`generate:84` probe retargeted; R3/R4 gates retargeted to the committed component outputs; `gen/` removed.

## 7. Proposed AC6 gate (failable)
- **G-A — nothing READS gen (runtime, not a string match):** run every pipeline step (`npm start`'s steps) and the production entry points under an fs trap. Reuse the AC5 probe machinery: resolved path, every spelling, plus the module-load hook. REPORT any read or module load under `gen/`; writes (`writeAtomic`/`mkdir`/rename) pass. Seed: a step that `readFileSync`s a `gen/EAMD.ucp/**/X.ts` → RED via the named guard, and a module `import()` from gen → RED. For tests (static, derived): no test helper defaults to the repo `gen` root (`Generated.init()` requires an explicit root). Seed: restore the default → RED.
- **G-B — committed == fresh pipeline output:** keep `Pipeline.test`'s scratch run + `git diff --no-index` + clean `git status` (exists; seeded drift → RED already), retargeted at C4 to the component outputs.
- The PROBE at `Web4MDA.generate:84` must pass G-A. Either make the step list the proof (what `generate` wrote is what it returns), or sanction it by name as an existence stat of its own output. Your call; I recommend the former (no sanction needed).
