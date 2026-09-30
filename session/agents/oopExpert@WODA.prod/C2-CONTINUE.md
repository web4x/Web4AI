# inc 6 C2 — continuation (banked 2026-10-01 before the hard stop; tree CLEAN at origin f310e76)

## Done (in c2-production.patch — apply with `git apply`, then `rm -rf gen && npm start`)
- M1Layout: `layOutHome(catalog, base='')` roots at `[<base>/]Components`; shared private `populate()`; src + M1LayoutDefinition identical (reproduce gate GREEN).
- M1Catalog: `generate(root='gen', home='')` routes `homeDirectories` = js, thinglish.ts, thinglish.js to `homeLayout(home)`; placed M1Catalog copies go home too.
- tsconfig.json: exclude `Components/**/src/thinglish.ts/**` (generated dialect; type-checked by M2ThinglishClass's own tsc gate). DISCLOSE.
- Measured after regenerate from EMPTY gen/: gen = mmd 74, oosh 2, puml 79, svg 79, sample 1; Components src = ts/js/thinglish.ts/thinglish.js 75 each.

## Remaining: 41 reds in 21 test files (c2-reds.txt) — two causes
A. SOURCE scans that took every `Components/**/*.ts` (or all files) as hand-written now see generated `src/js|thinglish.*`:
   M1Catalog.test listing gate (M1SourceFiles), M3Class AC1 no-factories + coverage + reproduce (loads thinglish.ts?), ModelStyle AC5/6/7,
   ComponentModelInc1/2 src scans, NodeJSFile src scan, UcpComponent ONE-attach scan, SrcTypecheck, M1Graph (MOF on disk oracle),
   MofPlainNode. FIX: a component SOURCE file = `/latest/src/ts/` | `/latest/model/` (never `src/<generated language>`); derive the
   generated set from M1Catalog.homeDirectories if a scan needs it.
B. READERS of generated js/thinglish still in gen/: Generated('gen').classFile(..,'js'|'thinglish.*') and local walks of gen for /src/js/
   (ComponentModelInc1:57, Inc3:42, TreeFileUnitInc1:198, TreeFileUnitRulings:202/231, Unit:217, UnitReferencesInc2, NodeJSFile:213,
   ModelJson:116, M1Catalog.test (where() for js/thinglish, jsClass), M1Layout AC6/AC7 (generated = Tree gen), MofLayoutAC5 arm A (js -> puml),
   MofLayout committed gen, GenReaders (placed/produced counts; seeds read a gen js -> use a gen puml), Pipeline (committed==scratch must now
   cover Components/**/src/{js,thinglish.*}: ls-files + git status + diff over those dirs; stale-seed arm on a Components js; InodeStamps).
   FIX: Generated gets a home mode (layout = catalog.homeLayout()) for home languages; walks of gen for js -> walk Components.
- Then: full suite, commit, rebase check, push, isolated cold clone, ff shared tree, anchor, report.
