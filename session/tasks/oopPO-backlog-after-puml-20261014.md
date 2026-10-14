# oopPO BACKLOG — after the PUML plan (2026-10-13) closes, ranked 2026-10-14

**Authority:** oopPO ranks; owners build; oopTester gates; TRON rules DONE. Nothing here starts before Tron's DONE on the PUML plan (Web4MDA main `f41134102`, U4 by oopTester, findings `held/u4-f41134102/findings.md` @ 1cc06334).

## IN-SCOPE fix before DONE (not backlog)
- **JSDoc above `AssertionSubject` lists 4 tools, `TOOLS` has 5 (`TrackedTree` missing)** — introduced by `e1047668e`. Owner oopBashExpert, one doc line, AFTER U4's remaining arms; oopTester verifies at END the diff is comment-only.

## RANK 1 — TestPlacement INTEGRITY: three holes in the ONE gate behind Tron's "tests live in their component" law (merged 2026-10-14 after U4 C.3)
- **(a) C.3 finding (a6dc2227, findings.md L76): a COMPONENT-FOLDER test is placed by FILENAME PREFIX + one touch of the class; its ASSERTIONS ARE NEVER CHECKED — `AssertionSubject` runs only over CENTRAL tests.** (U4 watch item "test-subject-by-filename" — confirmed.)
- **(b) re-export laundering** (below) · **(c) `TOOLS` hand list** (RANK 2, folded in here as part of the same gate).
- **Direction:** ONE subject oracle for EVERY test, central and component-folder alike, derived from what its assertions actually exercise (re-exports resolved to origin; tool-ness a declared type); seeds per hole → RED by name. One plan, one owner, not three patches.

### (b) RE-EXPORT LAUNDERING evades the TestPlacement gate
- U4 C.6 finding (3): a root test asserting `M1Catalog` 3x through a helper that RE-EXPORTS it gets verdict A; H5m-3 stays GREEN with the file on disk. `AssertionSubject` credits the import owner and never opens the helper — independent of `TOOLS`. Only compensating control: TestFolder's helper SHA pin (a reviewable diff, not a RED).
- **Direction:** resolve every re-export to its ORIGIN (derived, never by name); seed = the laundering helper → RED by name. Owner: the TestPlacement/AssertionSubject builder (H5m lineage) — assign at open.

## RANK 2 — `TOOLS` is a hand list, not derivable
- U4 C.6 finding (2): no structural property separates tools (counterexample `Source` vs `TestFolder`). Gate scan lists must be DERIVED.
- **Direction:** tool-ness as a DECLARED TYPE (e.g. a Thinglish `Tool` role helpers implement) → membership derived by construction. Fold in: `isTool` matches by SUBSTRING (`SourceMap` shields foreign asserts) → name EQUALITY.

## RANK 3 — two STALE-FALSE skip placeholders (pre-existing, empty bodies)
- `TreeFileUnitInc1.test.ts` L185 T8 "NOT BUILT" (false: `DefaultFile.ts` + `layer4/BrowserFile.ts` on main); L159 T5.2–5.5 "HELD (store) / increment 2" (likely delivered by the IOR + sub-scenario plans). ~~oopTester maps each to its covering gate (placeholder → pointer) or names a GAP (server-side `BrowserFile` has no named test).~~ **MAPPED by oopTester (d23c5a23): NO GAP.** T8: BrowserFile IS gated server-side (`FileServer.test.ts` L111/L123 round trip both ways == NodeJS + `FileScenarioContract` L29); the "Node fs wrapper" role moved to `NodeJSFile` (gated L101–275). T5.2–5.5: T5.4 delivered + gated (`UnitReferencesInc2` L116–210); T5.2/3/5 still held, the held state itself a failable gate (L381–452). ⇒ **cosmetic only:** replace both empty placeholders with POINTERS to those gates. Never un-skip an empty body.

## OPEN QUESTIONS FOR TRON (carried, not ours to decide)
1. `CHAIN_CPU` in-suite ~19.1–19.8 vs budget 20 (suite noise ~±0.7 swamps code gains) — measure SOLO (oopPO recommends) / budget / accept.
2. Two FLOORED agents (oopExpert ~64, oopTester ~58; creep 5–6k/drive): durable fix = fresh relaunch from anchor, under Tron's no-fork law. Matters for the next heavy plan (ONCE).
3. Older DONEs: plans 10-10 + 10-11 (`1488dbdf7`), `npm test` (`52c5ace`), README ARM4 (`f7629d1`).
