# R2-END verify (s0..s3) — Web4MDA ca6b7bb6

oopTester@WODA.prod (914c8cad), 2026-10-07. Order: oopPO R2-END window (ca6b7bb6 = origin, porcelain 0, oopExpert paused). Seeds in an ISOLATED copy only (git archive ca6b7bb6 → `Web4MDA/latest/test/gen/r2end-iso`, node_modules symlinked, every seed restored from git objects, copy removed after; shared tree never written: porcelain 0 throughout).

**CHECKED 7 / SKIPPED 0 / TOTAL 7 — 6 GREEN, 1 FINDING (a seed that is not named).**

| # | claim | result |
|---|---|---|
| 1 | full suite twice, porcelain identical | **GREEN** — both runs 97/97 files, 731 = 729 passed / **0 expected-fail** / 2 skipped, exit 0; porcelain 0 before/after both |
| 2 | IOR8 arm (a) AND arm (b) GREEN | **GREEN** — UnitIor 3/3; arm (b) flipped from `it.fails` to `it` (s3) and passes |
| 3 | `ownIor instanceof Ior` | **GREEN + RED-proven** — asserted at UnitIor.test.ts:48; seed S1 (copy: `ownIor` returns the bare string cast `as Ior`) → RED "BrowserFile: an Ior object, never a bare string (rule 3, I2)" → restored 3/3 |
| 4 | registry keyed `<namespace>.<Name>` (never the simple name) | **GREEN + RED-proven** — seed S2 (copy: `Mof.register` keys `Mof.key('', name)`) → arm (b) RED "Web4MDA.BrowserFile: expected undefined to be [Function BrowserFile]" (arm (a) also RED: ownIor's own `Mof.loadedClass('Web4MDA.Ior')` misses) → restored |
| 5 | static namespace getter on EVERY catalogued class | **GREEN + RED-proven** — measured on disk: own `static (override) get namespace()` in 75/75 non-Model class files of src/ts, thinglish.ts, js, thinglish.js (`Mof.namespaceOf` reads only the OWN descriptor — an inherited base constant is never borrowed). Seed S3 (copy: Ior.ts loses its own getter) → arm (b) RED "Web4MDA.Ior: expected undefined to be [Function Ior]" → restored. (An earlier 5/75 count was my pattern missing TS `override` — instrument, discarded.) |
| 6 | in-process seeds RED by their NAMED message, then GREEN | **GREEN for 5**: no store (`no store is open`), no uuid (`has no uuid — not initialized`), 2nd store (`Mof.open: a store is already open — ONE store`), other profile ("another profile is NOT the authority"), wrong version ("a wrong version is SEEN", reverted → GREEN) |
| 7 | the "store without a profile" seed | **FINDING (naming, not a red):** UnitIor.test.ts:71 expects `no store is open` — the SAME message as the no-store seed (:65), because `ownIor` tests `Mof.store?.profile === undefined` for both. The two seeds are not distinguishable by name, and the message is FALSE when a store IS open (no profile). Fix (oopExpert): a distinct guard + message, e.g. "the open store has no profile (rule 8)", and :71 asserting it |

Evidence (on disk, *.log gitignored): h5m3/r2end-run1-ca6b7bb6.log, r2end-run2-ca6b7bb6.log.
