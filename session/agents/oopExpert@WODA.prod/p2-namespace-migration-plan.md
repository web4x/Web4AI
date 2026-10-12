# P2 — Namespace migration plan (oopExpert, 2026-10-12)

*Plan for P2 of `spec/plans/2026-10-11-namespace-root-and-component-typed-iors.md`. Measured read-only on Web4MDA `origin/main` `c1e42cd7` with `git grep` (no checkout, no CPU load). P2 starts when fix round 2 lands (oopPO drive `2701d4b5`). Nothing is built yet.*

## 1. Inventory (measured)

**106 Definitions, 106 class-level namespaces** (`*Definition.ts`, gen excluded):

| Today | Count | After P2 |
|---|---|---|
| `Web4MDA` | 67 | `com.ceruleanCircle.Web4MDA` |
| `Web4MDA.MOF.M2` | 17 | `com.ceruleanCircle.Web4MDA.MOF.M2` |
| `Web4MDA.Ior` | 13 | `com.ceruleanCircle.Web4MDA.Ior` |
| `Web4MDA.MOF.M3` | 5 | `com.ceruleanCircle.Web4MDA.MOF.M3` |
| `Web4MDA.MOF.M1` | 4 | `com.ceruleanCircle.Web4MDA.MOF.M1` |

The other `namespace:` hits (17 × `''`, 1 × `'Namespace'`) are inside **quoted method-body strings** (renderer output data: graph models, `M2*Class` bodies, `ThinglishGrammarModel` initializer). The script must touch **only the class-level key** of each Definition's root `ClassModel` init, never a body string. Gate: after the script, the count of body-string `namespace:` occurrences is unchanged (18), derived.

**The prefix is derived, never typed:** the script walks `EAMD.ucp/Components/` down to the folder holding the package component (`Web4MDA`) and takes the segments above it (`com`, `ceruleanCircle`). No `com.ceruleanCircle` literal in the script either.

## 2. Every reader of `.namespace` in authored code (12 files) and what changes

| # | Site | Today | P2 |
|---|---|---|---|
| 1 | `M1Layout.ts:77` | `Namespace.declare('com.ceruleanCircle', components).add(pkg)` | **literal deleted** — declare the package's own namespace under `Components` |
| 2 | `M1Layout.ts:228-229` | throws unless `segments[0] === packageName` | segments must start with the package's **qualified name** (`<pkg.namespace>.<pkg.name>`), derived |
| 3 | `M1Layout.ts:377-408` (`derivedNamespace`, owner checks) | `base = packageName` | `base = package qualified name` |
| 4 | `M1Catalog.ts:228` | package = the one class with `namespace === name` | **rule must change** (the package's namespace becomes `com.ceruleanCircle`, its name `Web4MDA`). See D1 below |
| 5 | `M1Catalog.ts:216` | registry keys | unchanged in shape, values follow |
| 6 | `M1Graph.ts:74` | hand literal `'Web4MDA.MOF'` | derived from the MOF namespace in the catalog (e.g. `M3Class`'s namespace minus its last segment), no literal |
| 7 | `M2ThingClass.ts:151-154` | re-adds `com.ceruleanCircle` "above" the relative namespace | becomes just `c.namespace`; the "above" computation is **deleted** |
| 8 | `UcpComponent.ts:126` (`move`) | `target === '' ? layout.packageName : …` | package **qualified name**; `move()` stays a one-value change (gate) |
| 9 | `ClassModel.ts:63` (`sourceUnit`) | `namespace.split('.').slice(1)` drops the package root | drop the package **qualified** prefix (all its segments), derived |
| 10 | `ClassModel.ts:75` (`instanceIor`) | `<namespace>.<name>` | unchanged code; the IOR becomes `com.ceruleanCircle.Web4MDA.ClassModel.latest` (the `Name` part changes in P4) |
| 11 | `RepositoryId`, `Ior`, `ScenarioIndex`, `ScenarioUnit`, `Mof` | consume namespace as data | no logic change; keys and `type/` paths change value |
| 12 | `M2ES2020Class.ts:234` | renders `static get namespace()` from `c.namespace` | follows on regeneration |

Definitions carrying the literal inside body strings: `M1LayoutDefinition` (1, the literal line itself, deleted with #1), `NpmPackageDefinition` (2), `Web4MDADefinition` (4). The last two get inspected during the build: they are kept only if they are data that legitimately names the deployment (e.g. a repository URL); otherwise they are derived too. The literal gate's scope is decided in D3.

Tests: 44 test files mention `ceruleanCircle` (mostly generated-layout paths, which stay valid), and there are 35 `Web4MDA.`-prefixed strings. These get **re-derived from the catalog/layout**, never search-and-replaced by hand.

## 3. Slices (each pushable alone: whole suite green on a fresh clone, by me, then push)

**P2a — prefix-agnostic readers (no data change).** Rows 2, 3, 4 (with D1's rule), 6, 7, 8, 9 rewritten to use the **package qualified name** instead of `packageName` / `slice(1)` / hand literals. Namespaces are still `Web4MDA…`, so the qualified name today is `Web4MDA` and everything stays green. This slice proves the readers before the data moves.

**P2b — the migration.**
- One-time script (in my component's `latest/test/gen`, never committed as a producer) rewrites the 106 class-level namespaces.
- `M1Layout`'s literal is deleted.
- Generate, then regenerate the store.
- Gates go RED-first on the clone before the change, GREEN after.

Gates for P2b:
- **G1:** every class namespace starts with the root segments derived from `EAMD.ucp/Components/`. A seeded `Web4MDA.MOF.M3` → RED by class name.
- **G2:** no `com.ceruleanCircle` literal in authored `src`. A seed → RED by file.
- **G3:** folder == layout(namespace) over all 106.
- **G4:** the `move()` diff is one value; chained moves plus one generate == pairs.
- **G5:** a second generate changes 0 bytes, and a second store changes 0 bytes.
- **G6:** the count of body-string `namespace:` occurrences is unchanged.

## 4. Decisions for oopPO (they block P2b, not P2a)

- **D1 — the package rule.** Today the package is "the class with `namespace === name`". After P2 the package `Web4MDA` has namespace `com.ceruleanCircle`.
  - **Recommended:** the package is the one class whose qualified name (`namespace.name`) is a prefix of every other namespace. Assert exactly one.
  - Alternative: a required authored marker on the package Definition.
- **D2 — the store changes in P2, not only P4.** The IOR's `<ns>` part is derived from `ClassModel.namespace`, so P2 necessarily rewrites every stored IOR (`Web4MDA.ClassModel.latest` → `com.ceruleanCircle.Web4MDA.ClassModel.latest`) and moves `type/Web4MDA/` → `type/com/ceruleanCircle/Web4MDA/`. P4 then changes the `Name` part.
  - **Recommended:** accept a store regeneration in both P2 and P4, with the O3 law (no stale links) gated each time.
- **D3 — the scope of the literal gate.** Authored `src` only, or also body strings inside Definitions (`NpmPackage`, `Web4MDA`)?
  - **Recommended:** authored `src`, plus Definition body strings except those that are external data (a repository URL), each such exception named and counted.

## 5. Cost and order

- P2a ≈ +8 context points, P2b ≈ +12; the SM checks the panel at each push. A whole-suite run happens only after round 2 lands and the box is quiet.
- My clone: `Web4MDA/latest/test/gen/oopExpert-clone`; logs stay in that component's `latest/test/gen` (scratch-location law).

## 6. RULED by oopPO (2026-10-12) — plan b8bf39c8 accepted
- **D1 ACCEPTED:** the package is the ONE class whose qualified name prefixes all namespaces. It is derived, never a literal. 0 or more than 1 match → refuse by name, never guess.
- **D2 ACCEPTED:** P2 regenerates the store (and P4 does again). The store EQUALS the model, and a regeneration prunes stale units.
- **D3 ACCEPTED:** the literal gate covers `src` + Definition bodies. Any external data is NAMED and COUNTED, never silently excluded.
- **GO order:** P2a when round 2 lands; P2b after.
