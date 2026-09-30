# inc 6 C3 (+C4 folded) — continuation (banked 2026-09-30 before the rewind; Web4MDA origin = shared tree = c56ef92, clean)

## Rulings (oopPO, 2026-09-30, from my read-only blast-radius measurement — oopPO records them in spec 12)
1. **SAMPLE** lives at its OWNER's `latest/src/sample/` beside every generated target — NEVER under `test/` (Tron's (a) ruling applied to the one target it did not name).
2. **FOLD C4 INTO C3**: `gen/EAMD.ucp` never exists as an empty shell (gates asserting on an empty dir go VACUOUS). Move + retarget/retire the gen-structure gates + delete `gen/EAMD.ucp` = ONE coherent change.
3. **SEQUENCE**: rewind FIRST (to ~48), then C3+C4 as one chunk (est. 15-20 pts + the C4 fold -> ~70). HARD STOP 85 -> bank patch + continuation map, clean tree.

## What moves (committed gen at c56ef92: 235 files -> gen/EAMD.ucp ends EMPTY, then deleted)
puml 79 · svg 79 (PlantUML-derived) · mmd 74 · oosh 2 (`latest/src/oosh/EAM/layer2/{odocker,oo}`, extensionless) · sample 1 (`latest/test/sample/readme.md` -> `latest/src/sample/`, ruling 1). Package diagrams: 10 `Web4MDA-*.puml/svg`.

## Production (no banked patch — write it)
- `M1Catalog.homeDirectories` += puml, svg, mmd, oosh, sample (isGenerated follows; C2 predicate). Then `layout(root='gen')` / gen root have NO remaining target -> retire the gen layout from generate() (C4).
- Writers to re-route to the home layout: `M1Catalog.generate` (puml/mmd + `language.derived` svg — M2PlantUmlClass), `M1Graph.generate` (package diagrams -> Package `latest/src/puml|svg`), `M1Sample.generate` (sample -> `latest/src/sample/`, object diagram), `M2OoshClass.generate` (own `root='gen'` param), `Web4MDA.ts` steps chain.
- Generators found: M1Catalog, M1Graph, M1Sample, M2ES2020Class (derived hook), M2OoshClass, M2PlantUmlClass, Web4MDA.

## Tests — 22 files, 51 real gen/ read-or-scan sites (grep of gen.classFile/packageFile/oosh, layout('gen'), Tree/files/walk('gen'), 'gen/ literals)
Pipeline 12 · MofLayoutAC5 10 · GenReaders 8 · M2OoshGate 5 · M1GraphFocus 5 · M1Graph 5 · MofLayout 4 · M1Layout 4 · Node22 3 · M1SampleObjectDiagram 3 · ModelJson 2 · Generated 2 · M1Sample 2 · M1Catalog 2 · gates/GenAtomicityProbe 2 · UcpComponent 1 · TreeFileUnitRulings 1 · TrackedTree 1 · Spec 1 · ModelStyle 1 · ComponentModelInc2 1.
- ~half route through `Generated` (home mode) / `isGenerated` -> follow automatically when homeDirectories grows. Source scans filter `.ts` -> puml/svg/mmd/oosh/sample do not pollute them (check the extensionless oosh in any non-.ts scan).
- **INVERTING gen-STRUCTURE gates (re-target to the component tree or RETIRE — never leave asserting on an absent gen/):** MofLayout committed-gen check · MofLayoutAC5 B/C/F + F (gen/ holds only EAMD.ucp) + arm A (puml now home) · TreeFileUnitRulings Placement (anchors under gen/EAMD.ucp) · M1Layout AC6/AC7 (`generated` = gen + home; gen half becomes empty) · GenReaders G-A non-vacuity (gen count) + its puml seed (no gen file left: seed must write one) · Pipeline ROOT GATE gen half (ls-files/status/diff over gen) · M1Layout AC7 "gen/ holds ONLY EAMD.ucp".
- TestFolder: sample must NOT land in test/ (ruling 1); its sha pins change only if Generated.ts/Source.ts change.

## Method (what worked in C2)
Clean baseline first (c56ef92 cold clone: 471 passed + 2 skipped / 59 files). Private `git worktree` + symlinked node_modules. Regenerate from EMPTY. Finish = same numbers (+/- retired/added gates, each named) on an ISOLATED fresh clone, cold install, clean tree. Rebase check before push; ff the shared tree only if clean. Tests that generate into a tmp root pass the tmp as HOME too (never write the real Components/).
