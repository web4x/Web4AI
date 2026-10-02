# HELD — SC8 extension "keyword → attribute of an M3 element" (Thinglish src/thinglish, Tron 2026-10-02)

**Status: HELD by oopPO 2026-10-02 — Tron: "always work with plans". NOT handed to oopExpert, NOT applied to Web4MDA, NOT pushed there.** Resume only on oopPO's approved plan (re-derive against that plan; the base may have moved).

- `sc8-modifier-attributes-c41c2a8.HELD.patch` — gate-only diff to `ThinglishGrammar/latest/test/ThinglishGrammar.test.ts` on Web4MDA `c41c2a8`.
- `sc8-modifier-states.HELD.sh` — the Step A state matrix (isolated clone; S3 simulates a correct model ONLY to prove the gate can pass — that model edit is not a deliverable).

## What the patch adds (all derived: spec table × catalog — no hand list)
- `KeywordTable` 4th kind **attribute** (ruling "an ATTRIBUTE of **M3X**"), merged over rows (`abstract` sits in two); element rows exclude it; element → model from the table's own element rows.
- Catalog resolver `attributeFor(keyword, model)`: exact name (`redefines`) · `is<Keyword>` (`isAbstract`) · union literal holding the keyword (`visibility`).
- Clause-2 exactly-one gains state **modifier** (declared `ThinglishGrammar.modifiers`, read via Reflect).
- New arms: modifier keywords are derived grammar keywords, map to NO M3 element, resolve on ≥1 element's catalog model; declared `modifiers` == derived map `{keyword → [M3X.attribute]}`; resolver failable twin.

## Measured state matrix (clone of `c41c2a8`, 2026-10-02)
| State | Result |
|---|---|
| S0 gate alone | 1 RED (modifier rows missing in spec) — the gate needs the spec |
| **S1 oopPO spec patch ALONE** | **1 RED = "SC8 — ONE source"** (ebnf ≠ spec block) — Step A's claim MEASURED TRUE |
| S2 spec + gate, no model | 3 RED: one-source, modifier arm, declared-map arm |
| S3 spec + gate + correct model (simulated) | **12/12 GREEN** — the gate is passable |
| S3a seed `async` missing | RED: exactly-one + declared-map |
| S3b seed `abstract` also mapped as element | RED: exactly-one + modifier-not-element |
| S3c seed `private` → invented `isPrivate` | RED: declared-map |
Residual 0.

## Ground truth + findings for the plan (catalog at `c41c2a8`)
- ClassModel: `isAbstract`, `isEntry` · MethodModel: `visibility`, `isStatic`, `isOverride`, `isAbstract`, `isAsync` · AttributeModel: `visibility`, `isOverride`, `isStatic` (**no `isAbstract`, no `isAsync`**) · RelationshipModel: `redefines`.
- **F1:** the patched grammar admits `{ modifier } "attribute"` incl. `abstract` / `async`, which AttributeModel cannot hold → a parser would have to drop them (TH5 in reverse). Restrict the attribute production, or rule it.
- **F2:** `AttributeModel.isReadonly` (and MethodModel `isGetter`, ClassModel `isInterface` — the latter two expressed by `property`/`interface`) — **`readonly` has no keyword** → TH3 "lossless" cannot hold for readonly attributes unless the grammar gains it or TH5 reports it.
- **F3:** the spec row "M3Method / M3Attribute: isAbstract, isStatic, visibility, isOverride, isAsync" reads as if every modifier applies to both; the catalog says per-(keyword, element) — the gate resolves per pair and reports the pairs the model cannot hold.
- **F4:** Step A ordering — the gate alone (S0) is RED without the spec; it must land in the same atomic push as the spec + model (as oopPO's increment A says).
