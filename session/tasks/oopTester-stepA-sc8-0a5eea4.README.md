# oopTester → oopExpert: Step A SC8 gate patch (plan of record Web4MDA `0a5eea4`, Tron-approved G1–G5)

**Patch:** `oopTester-stepA-sc8-0a5eea4.patch` — ONE file, `ThinglishGrammar/latest/test/ThinglishGrammar.test.ts`, gate-only. Base `0a5eea4`. Apply it **verbatim** in your ONE atomic Step A push together with oopPO's spec patch (`oopPO-stepA-thinglish-grammar-0a5eea4.patch`, AI/Claude `eb19e1bb`) and your `ThinglishGrammar` model change. **Not pushed by me** (oopPO's order). Supersedes my HELD draft (`held/`, `830ba79b`).

## The contract your model must meet (all expectations DERIVED in the gate: spec table × catalog — nothing hand-listed)
1. `ThinglishGrammarModel.ebnf` == the spec's one ```ebnf block, byte-identical (existing SC8 one-source).
2. A new model record **`modifiers: Record<string, string[]>`** (keyword → `'M3X.attribute'` list) and a getter **`ThinglishGrammar.modifiers`** returning it (read via `Reflect`, like `instances`). It must equal EXACTLY (order inside a list irrelevant):

| keyword | targets |
|---|---|
| `abstract` | `M3Class.isAbstract`, `M3Method.isAbstract` |
| `entry` | `M3Class.isEntry` |
| `static` | `M3Attribute.isStatic`, `M3Method.isStatic` |
| `private` / `protected` | `M3Attribute.visibility`, `M3Method.visibility` |
| `override` | `M3Attribute.isOverride`, `M3Method.isOverride` |
| `async` | `M3Method.isAsync` |
| `readonly` | `M3Attribute.isReadonly` |
| `contains` / `containedBy` / `references` / `instanceOf` | `M3Relationship.kind` |
| `redefines` | `M3Relationship.redefines` |

3. A modifier / kind keyword is **NOT** in `elements` (never an M3 element) and not in `held`; `instances` unchanged.
4. **HELD facts (G5)** — `TypeAliasModel`, `ImportModel.isTypeOnly` — are mapped by NO keyword. Nothing to declare for them in Step A.

## What the patch changes in the gate
- `KeywordTable`: 4th kind **attribute** (ruling "an ATTRIBUTE of **M3X**"); each row resolves on the model ITS OWN row names (col 3); camelCase keywords (`containedBy`, `instanceOf`); `elementModels` cross-check (an attribute row's element/model pairing must agree with the element rows — a spec typo cannot propagate into the model).
- Catalog resolver `attributeFor(keyword, model)`: exact name · `is<Keyword>` · union literal (`visibility`, `kind`).
- Clause-2 exactly-one gains state **modifier**; "documented" accepts attribute rows.
- New arms: **G1+G4** every (keyword, element) pair resolves — CHECKED 18 / SKIPPED 0 / TOTAL 18; **declared map == derived map**; **G5** held facts exist in the catalog and no keyword reaches them; failable twin of the resolver + held check.
- **Two EXISTING arms re-written alignment-independent** (my own earlier gate, a finding): the one-source non-vacuity literal `'unit         = namespace'` and the "SC8 is failable" seeds were bound to the OLD column alignment — oopPO's re-aligned EBNF turned the seeds into no-ops (RED even with the spec alone). Now regexes, and the model seed asserts it actually applied.

## Measured (isolated `--no-hardlinks` clone of `0a5eea4`, nothing applied to the live tree)
| State | Result |
|---|---|
| S0 gate alone | RED (no modifier rows / held table) — must ride with the spec |
| **S1 oopPO spec alone** | **RED by SC8 one-source** (Step A claim TRUE) |
| S2 spec + gate, no model | 3 RED: one-source, G1, declared map |
| **S3 spec + gate + correct model** (simulated in scratch) | **13/13 GREEN**; tsc test config 0 errors |
| seeds on S3: `async` missing · `abstract` also an element · `private`→invented `isPrivate` · `references` unmapped · `readonly`→held `isTypeOnly` | each RED by its named guard |
| spec seeds: stale held row · attribute row on the wrong element | RED by G5 · RED by G1 cross-check + declared map |
Residual 0.
