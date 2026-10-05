# I4 verdict — Web4MDA `6cceba6` (branch oopExpert-I2-dep: eba88d4 → 6c209cf WIP → edd5fd6 foundation → c740c71 move() → 6cceba6 catalog-arm gate), local — oopTester 2026-10-05

**VERDICT: GREEN for I4's scope (foundation + `UcpComponent.move()`).** Every gate passes on isolated throwaway clones of `6cceba6`. **TWO FINDINGS against the I5 step of the plan** (not I4 defects) + one weak literal + one slip of mine (caught). Nothing pushed.

## Gates

| Gate | Result | Number |
|---|---|---|
| **Foundation (d)** render(load(D)) == D, own clone, EXACT count (`oopTester-I6-foundation.mts`) | GREEN | git lists **104** (103 + DefinitionSource), CHECKED 104, DRIFTED 0. Seed (1 trailing byte on the first render) → DRIFTED 1, named (BrowserFileDefinition) |
| G1 no-move generate | GREEN | rc 0, 0 diff |
| G2 whole catalog vs independent text oracle | GREEN | 105 model classes, **416/416** pairs, 0 mismatched; SKIPPED-by-name 15 |
| G6 whole suite | GREEN | 80 files, 625 = **623 pass / 2 skipped / 0 failed**, rc 0, clone clean after |
| **(c) the 2 skips, NAMED** | visible + explained | both unconditional `it.skip` in `latest/test/TreeFileUnitInc1.test.ts`: **T5.2–T5.5** ("HELD — the Unit/scenario store") and **T8** ("DefaultFile as layer-2 fs wrapper + layer-4 BrowserFile — NOT BUILT, spec'd LATER"). Measured: that file alone = 14 pass / 2 skipped = the suite's 2. All conditional skips (PlantUML, OOSH_DIR, old node, external IP) RAN on this box. |
| **G3 round trip — EVERY IOR component** (`oopTester-I6-g3g4-move.sh`) | GREEN 7/7 | RepositoryId (generate moved 14), ObjectKey (14), InternetProfile (8), SecureTransport (10), UnknownTaggedComponent (9), TaggedProfile (7), TaggedComponent (9): each move(X→Ior) + generate, move(X→'') + generate → **BYTE-IDENTICAL to 6cceba6** |
| **G4 move() touches only Definition JSON** — every component | GREEN 7/7 | move() alone: exactly ONE file changed (X's Definition), every hunk INSIDE its `return new ClassModel().init({ … });` literal |
| Guards | GREEN 3/3 (by their OWN message, 0 diff) | itself: "Ior.move: a component is never packaged in itself" · non-component TARGET: "'RepositoryIdModel' is not a component" · cycle (measured AFTER generating the first move): "'UnknownTaggedComponent' is packaged in Ior…" |
| **Catalog arm on REAL gen/js + gen/thinglish.js** | GREEN + proven failable | committed: generated js 0, thinglish.js 0 mentions of M1Catalog; held ts + thinglish.ts: `import type { M1Catalog }` only. SEED in the MODEL (`UcpComponentDefinition` ImportModel M1Catalog `isTypeOnly: false`) → generate rc 0 → generated js AND thinglish.js each carry `import { M1Catalog } …` → RED. (A value import in the HELD ts is a real ESM cycle: generate dies with TDZ `Cannot access 'DefaultFile' before initialization` — type-only is structurally required, not style.) |
| **(a) [spec ref] allowance — 4 failable arms** | GREEN + each arm proven to BITE | `latest/test/UcpComponent.test.ts:218`: B missing spec, C source path, D mixed, E spec path in a non-description field — each asserted RED by exact name; A (resolving spec) the only allowed. Widening each condition of the real scanner (L90/L94), one at a time: W1 drop existsSync → RED · W2 every→some → RED · W3 any key → RED · W4 drop the spec/ prefix → RED; clean → GREEN; file restored byte-identical |
| **(b) M1Graph pinned roots** | DERIVABLE (hazard, not a defect today) | `M1Graph.test.ts:35` pins `['Defaults','DefinitionSource','Interface','Mof']` by hand (+DefinitionSource added in edd5fd6). The `roots` getter itself IS derived (`superclass === ''`). INDEPENDENT derivation from the 104 Definition texts (no `kind: 'generalization'` fact) = exactly `{Defaults, DefinitionSource, Interface, Mof}`. Recommend: replace the hand list with this derived oracle so the next root is not a hand edit. |
| G7 preflight (both seeds) | GREEN | rolenamed + twocontainers: rc 1, own guard named, 0 diff, nothing moved |
| G1b relocation round trip + fresh-clone npm start | GREEN | fresh clone 0 diff; valid packagedIn → rc 0, 9 renames; 0 body / 18 import lines; tsc rc 0, **408** files, 0 errors; 2nd generate 0 diff; unseed → byte-identical |

## FINDINGS for oopPO (I5 plan — "move the 8 IOR sub-components (+ models) into Ior via move() + ONE generate")

- **F1 — moves cannot be chained without a generate between them.** After a JSON-only `move(RepositoryId→Ior)`, the next `move(ObjectKey→Ior)` cannot even load the catalog: `ERR_MODULE_NOT_FOUND …/Ior/RepositoryId/latest/src/ts/…` (M1Layout.load imports classes from the DERIVED folder, not yet realised). 0 diff — safe, nothing corrupted — but **"move() × 8 + ONE generate" is impossible as written**: either generate after every move, or load must tolerate an unrealised placement.
- **F2 — models do not move.** Models are not UcpComponents (`move` is not a function on them), and a ROOT model does NOT follow its component: after move(TaggedProfile→Ior) + generate, TaggedProfile is in `Ior/latest` but **TaggedProfileModel stays in the Web4MDA root `latest`** (InternetProfileModel too). The plan's G5 ("abstract/models inside the Ior package, none in the Web4MDA root") needs a mechanism for the 4 root models (TaggedProfileModel, TaggedComponentModel, InternetProfileModel, SecureTransportModel). Models inside a component folder (RepositoryIdModel, ObjectKeyModel) DO travel with it.
- **F3 — weak literal:** the foundation test asserts the git count `> 100`, not `== 104`. Every listed file is compared (drift is caught), but a DELETED Definition would pass it. My exact-count arm covers it here.

## My slip (caught before reporting)

My G3/G4 script's first cycle check counted an unrelated `ERR_MODULE_NOT_FOUND` as the cycle guard (false GREEN), and its error capture truncated messages. Probed with full stderr: the cycle guard is GREEN only when the first move is generated first (= F1). Script fixed (full error lines; generate before the cycle; a guard counts only on its OWN message; non-component target added) — the corrected cases were measured by the probes above, not by a re-run of the script.

Tools: `oopTester-I6-foundation.mts`, `oopTester-I6-g3g4-move.sh`, `oopTester-I6-g2-model-arm.mts`, `oopTester-I6-g7-preflight.sh`, `oopTester-I6-g1b-relocate.sh`.
