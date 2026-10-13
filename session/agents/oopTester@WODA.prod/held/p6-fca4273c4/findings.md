# P6 END AUDIT — findings on Web4MDA main fca4273c4 (oopTester, 2026-10-13)

Instrument: `held/p6-fca4273c4/p6.sh`. Clones c1, c2 = `git clone --no-hardlinks` + `checkout --detach fca4273c4`, tree b52e80f90, REAL `npm ci` (38 pkgs, real dir).
Env: `env -u CLAUDECODE -u TMPDIR PATH=/opt/node22/bin:$PATH` (bare login PATH = node v16.11.0, cannot run the repo). Box quiet (0 node vitest) before + after every run.

## A. Whole suite
- **A1 c1:** rc=0 · Test Files 113/113 · Tests 909 passed | 2 skipped (911) · 0 failed · 0 timeouts · porcelain 0 after suite.
- **A1 c2:** identical: rc=0 · 113/113 · 909 | 2 (911) · 0 failed · 0 timeouts · porcelain 0.
- porcelain files after suite: c1 == c2 (both empty). **A2** 2nd generate (`npm start`) rc=0, porcelain 0 in BOTH clones (identical, empty).
- **The 2 skips, DERIVED:** exactly two unconditional `it.skip` exist at the sha — `TreeFileUnitInc1.test.ts:159` (T5.2–T5.5) and `:185` (T8). Total skipped = 2 ⇒ ZERO conditional `ctx.skip` fired (PlantUML-server, /root/oosh, /proc, old-node, OOSH gates all RAN).
- NOTE: a first "skip lists identical" comparison was HOLLOW (default reporter prints no per-test lines; both lists empty) — discarded, replaced by the derivation above.
- **A1 VERDICT: GREEN** (CHECKED 911 / SKIPPED 2 / TOTAL 911 per clone, ×2 clones).
- A3 GarbageSweep / A4 F5 chain-speed: carried by named tests inside the green suite — to be cited by label (naming law) in block F/D pass.

## Instrument incidents (mine)
- First A1 launch rc=126: driver called `"$0"` without exec bit → nothing ran (c1 never created). Fixed to `bash "$0"`; rerun clean.

## E/C. S4b seeds, batch 1 (clone c2, harness g.sh re-pointed to fca4273c4; anchors re-derived BY CONTENT — anchors.sh)
- BASE via the same instrument (bootstrap test): rc=0, 909 | 2 skipped, 0 failed.
- N1REVERT (7 files) → RED by N1 mechanism gate "F1 MECHANISM — a FRESH store … ONLY RELATIVE type/ links" (1/66). ✓
- R7BODY → RED by link-API scan exact-allowance (1/21). ✓  FSLINK → RED same scan (1/21). ✓  FSLINKPLAIN → RED (1/21). ✓
- DYNALIAS (whole suite) → RED ×3: node:fs-importer scan ×2 ("node:fs imported ONLY by NodeJSFile and NodeJSFolder") + pipeline reproduce. ✓
- ROGUE → RED BY NAME: "F2 round 2 … an unowned one is RED by name" → `…/ScenarioIndex/latest/model/Rogue`. ✓
- DUPFOLDER → RED BY NAME: BOTH WAYS `+ MOF/Web4MDA/latest`; package folder count 2≠1. ✓
- DUPSRC → RED by NAMED REFUSAL at load: `M1Catalog.load: two model sources define 'ScenarioIndex'` (whole file fails at collection, naming the class). ✓
- FSCALLER → GREEN 21/21 on UnitReferencesInc2 = WRONG SCOPE (instrument): the node:fs-importer scan lives in `NodeJSFile.test.ts` (git grep by title). Re-run on that file pending.
- FSCALLER2 → NOT RUN (instrument, mine): COMMIT's `git add -A -- . ':!node_modules'` errors on an ignored path. Fix: plain `git add -A` in the isolated clone. Pending.
- **XPKG → GREEN 66/66 = SEED WENT INERT (reclassify → oopPO):** its anchor `M1Catalog.test.ts:521` only mkdirs a scratch package folder; since P5 removed the interim root search ("the interim `locate` is gone") the store never reads it. R4 hazard (an `X/` placeholder package folder) is still REPRESENTABLE in the real tree → re-expressed XPKG′: real `EAMD.ucp/Components/X/latest` folder in the clone → expect BOTH WAYS RED by name (as DUPFOLDER). Pending.
- **Re-derived anchors (moved code, same hazard):** R1STALE → `ScenarioIndex.ts:275 … && !partLinks.has(path)) removed.push` (chain fix renamed file.path→path); DERIV → TreeFileUnitRulings `isStoreOutput` `=== this.tail;` (F2 StoreOutputRoots derivation); DRIFT → `scenarios/BrowserFile/M2AbstractMethod/read.scenario.json` (P4/P5: <PartType> = incorporating component). Pending runs.

## D. P2′ gates (oopPO decision A, 10-13)
- **P2-ROOT′ NOT subsumed:** namespace is still AUTHORED — 113/113 Definitions carry a `namespace:` literal; generated `static get namespace()` follows; nothing in src reads it from the folder chain ⇒ a mismatch is REPRESENTABLE ⇒ built. Existing I4d (`FolderNamespace.test.ts:79`) is NOT it: its oracle reads the LAYOUT's placement (both sides from the namespace) and roots at `packageQualifiedName()` (D1-pkg).
- Built from my held draft `OneRootNamespace.test.ts` (placed `MOF/M1/M1Catalog/latest/test/`). P2-ROOT′ GREEN 3/3 at fca4273c4 (disk reader, gate, failable arm).
- **P2-LIT′ oracle drift fixed (mine, P5):** 116 false RED — P5 removed `ClassModel.component` (component is DERIVED; generated `get component()` returns the QUALIFIED name). Allowance's own-component value re-derived INDEPENDENTLY = the file's disk folder chain (never the generator's derivation). Comment lines excluded (doc text ≠ code literal). Placed unit (STRUCTURAL: no `<Name>Definition.ts` on disk) may declare its own `namespace:` model fact in code (`M1Catalog.ts:562`).
- **P2-LIT′ at baseline = RED by file:line, ONE REAL DEFECT: `M1Layout.ts:87 Namespace.declare('com.ceruleanCircle', components)`** — the P2 row says "M1Layout declares from the namespace, literal deleted"; derivable from the `packageQualifiedName()` read on line 85.
- GREEN proof: scratch-only fix in c1 (root = packageQualified minus its last segment, NOT delivered) → OneRootNamespace + FolderNamespace + M1Layout 25/25. Whole suite with gate + scratch fix: running.
