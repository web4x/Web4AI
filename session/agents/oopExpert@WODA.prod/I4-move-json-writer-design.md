# I4 — `UcpComponent.move(target)`: JSON-writer design (STOP-REPORT, not built)

*oopExpert@WODA.prod, 2026-10-05. Branch `oopExpert-I2-dep` @ `eba88d4`. Plan of record `d729ecd` I4. Measured on the branch before designing; nothing written yet.*

## What I measured (facts the design rests on)

1. **The placement fact** is ONE `RelationshipModel { kind: 'packagedIn', target: '<Component>' }` in the class's `relationships` (`M1Layout.containerOf`). I3's `parentOf` lets a container **override** the namespace, and the catalog **derives** `namespace` from the container (`namespaceOf`). So placement has exactly one stored fact.
2. **Dependency facts are location-free.** The stored end is `ImportModel { name, declaredBy }`, which holds class names only and no path (rule 8, gated). The `dependants` end is **derived** (`M2AbstractDependency.dependants(name)`) and never stored.
3. **The model source** is `…/<Component>/latest/model/<X>Definition.ts`, with `get model()` returning ONE prettified `new ClassModel().init({...})` literal. There are 103 of them. Some have **no** `relationships:` key (e.g. `InterfaceDefinition`, `MofDefinition`, `DefaultsDefinition`). `M2TypescriptClassDefinition` has the word twice, the second inside a body string.
4. **No model→Definition renderer exists.** Definitions are read by `M1Catalog.load()` (by import) and are only ever written by hand or by the one-time migration.

## Consequence for "adjust every dependency fact that names its location"

**By (2), no dependency fact names a location, so `move()` writes ZERO dependant Definitions.** It still **navigates** the dependants through the derived end and **asserts** that none of their facts is path-like (any `declaredBy` containing `/` or `.` → throw). A future fact that does carry a location will then fail loudly instead of being left stale. The dependants' import LINES move with them in `src/` and `gen/`, but those are re-derived by the next generate (I3, atomic), as the plan says. The component's bound models (`XModel`) follow their binder by `ownerOf`, so they need no fact either.

## The writer: two options, one recommended

**A (recommended): render the Definition from the model.**
- A new catalogued M1 class, `DefinitionSource`, takes the class's `ClassModel` (one JSON literal) and returns the exact Definition file text: header imports, doc comment, the class, `get model()`, and the prettified literal in declaration-key order.
- `move(target)` is a pure state change. It loads its own model (from the catalog, which loaded the Definition), removes any `packagedIn`, adds `packagedIn target` (or nothing, to move back to the namespace), renders, and writes its own `model/<Self>Definition.ts` through the File class.
- **Foundation gate (built first, before `move()`):** `render(load(D)) == D` **byte-identical for all 103 Definitions**, failable by seeding a drift. That gate *proves* the writer can only change what the model changed, so "diff confined to JSON literal spans" holds by construction.
- **Risk to measure first:** a Definition whose literal holds something the model doesn't carry, such as a `//` comment inside the literal (M1Catalog's own placed model has one, but it is not a Definition file). Any such file shows up as a red in the foundation gate, and I report it before touching it.

**B (fallback): span-surgical text edit.**
- Locate the top-level `relationships: [` of the literal (or insert the key where it is absent) and replace only the one `packagedIn` block.
- The diff is small, but this edits model source as text, and the "top-level, not inside a body string" detection (fact 3) is exactly the fragility the AC8 tokenizer bug showed.
- I'd use it only if A's foundation gate finds Definitions that can't be reproduced and you rule against conforming them.

## `move()` itself (either writer)
- An **instance** method on `UcpComponent`, never static: `move(target: string): string[]` returns the written path(s) (normally 1).
- `target === ''` means "back to its namespace": the `packagedIn` fact is removed.
- Guards: the target must be a catalogued **component**; no cycle (a component cannot be packaged in itself or in one of its own sub-components); ONE fact (the I3 rule).
- It never touches `src/`, `gen/`, or any non-Definition file. The next `npm start` realises it.

## Gates I'll hand oopTester (per your dispatch)
1. A `move()` diff touches only Definition files, and only lines inside the `init({...})` literal span (`git diff -U0` hunks ⊂ the literal's line range).
2. Round trip: `move(X→Ior)` + generate, then `move(X→back)` + generate → tree **byte-identical** to before (Definitions + `src/` + `gen/`).
3. The foundation gate (A): render(load) == file for every Definition. Failable.
4. Dependants: navigated, with zero path-like facts asserted. Failable by seeding a path-like `declaredBy`.

## What I need from you
- **GO on option A**, with the foundation gate first. The I4 commits stay local; nothing is pushed.
- If the foundation gate finds irreproducible Definitions, I stop and report the list, and you rule conform-vs-B.
- I5 (moving the IOR set) is untouched until your GO.
