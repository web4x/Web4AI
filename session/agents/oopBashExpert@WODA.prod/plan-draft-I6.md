# Plan — I6: the OOSH target becomes lossless (entry call + config defaults), the reader survives undefined references

*oopBashExpert, 2026-10-06. **Design APPROVED by oopPO** (2026-10-06: "parse sets isEntry, sourceOf renders it (reuse the field M2ES2020Class renders), config defaults as AttributeModels with the config-backed initializer, rendered in place"). **D2 fork RULED (ii) by oopPO 2026-10-06** (typed rehydration in the SHARED `init(json)`); Spec 7 patch by oopPO (AI/Claude `session/tasks/oopPO-I6-spec7-model-json-patch.md` @ `13aafec4`) applied VERBATIM in the plan commit; `thinglish.md` widening approved. **Plan-mode approval: PENDING** — this file is not "approved by Tron" until Tron says so in plan mode. Task: AI/Claude `session/tasks/oopPO-I6-oosh-lane-3a2288e.md` @ `10f4edc9`.*

## Context
oopPO's I5 lane check (isolated clone of `3a2288e`) found two product defects in the OOSH lane, both **predating I5** (present at origin `d729ecd`):
- **D1** — the generated `oo` / `odocker` cannot dispatch: executed directly they define their functions and exit 0 doing nothing (generated `oo usage` = 0 lines vs the real script's 58).
- **D2** — the §4a reader (`OoshUnit`) throws a raw `TypeError` on any model holding an undefined optional object reference: 7 of ~~33~~ **30 concrete** model classes (oopTester-derived from the catalog; my earlier sweep's 33 included 3 abstract classes) (Ior, Link, ScenarioUnit, ScenarioIndex, InternetProfile, ObjectKey, RepositoryId).

Both make committed claims false: README row "OOSH as a generation target — built and gated", `oosh-mda.md` §5 L139 ("…already exist in the parsed body/methods and round-trip verbatim"), and §4a AC-R4 (round-trip both directions) for 7/30.

## Measured baseline (Web4MDA `3a2288e`, isolated clone)
- Generation: `npm start` exit 0; regenerate = byte-identical; generated `oo` method set == real 33/33; no shim (`this` resolves to the real `/root/oosh/this`).
- **D1 root cause (read-only, verified twice):** `M2OoshClass.parse()` (L83–102) keeps only `source` lines (→ imports) and function headers (→ methods); every other top-level line falls through `i += 1` (L101) and is dropped. `sourceOf()` (L41–54) has no entry-call rendering. Second method: real `oo` has 1 top-level `oo.start "$@"`; the parsed model holds it 0 times, `isEntry=false`.
- **D1 scope = 4 dropped top-level lines:** `oo` L1497 `oo.start "$@"`; `odocker` L1296 `odocker.start "$@"` **and** L14–15 `: ${ODOCKER_WORKSPACES:=$(config get ODOCKER_WORKSPACES 2>/dev/null)}` / `: ${ODOCKER_WORKSPACES:="<fallback path>"}` (an attribute with a config-backed initializer).
- **Gate gap G1:** lane gates 30/30 green while the generated script cannot dispatch. §6 gate 5 (`parse(generate(parse(x))) == parse(x)`) is satisfied by a parse that drops the same lines every time — identity on a lossy parse proves nothing about the source.
- **D2 root cause:** `OoshUnit.ts` L83 `JSON.stringify(value).replaceAll(…)` — `JSON.stringify(undefined)` is `undefined`. The undefined attributes are optional object references: `typeId`, `folder`, `ior`, `ownerIor`, `profile`, `repositoryId`.

## Design

### D1 — model it, never hand-append
1. **Entry call ⇄ `ClassModel.isEntry`.** `parse()` sets `isEntry = true` on a top-level `<name>.start "$@"` line (the object's own process constructor, invoked with all arguments). `sourceOf()` renders `<name>.start "$@"` as the last line when `isEntry`. This is the **same** field `M2ES2020Class` already renders (L111, `<Name>.start();`) — one fact, rendered per language.
2. **Top-level config defaults ⇄ `AttributeModel`.** A top-level `: ${VAR:=<initializer>}` line becomes an `AttributeModel` (`name = VAR`, `initializer = <initializer>` verbatim, so `$(config get VAR …)` and a literal fallback both survive). `sourceOf()` renders the class's attributes **in place** — after the `source` lines, before the first method, in declared order — as `: ${VAR:=<initializer>}`. Two lines for the same `VAR` (config-get, then fallback) are two ordered `AttributeModel`s, rendered in that order (Bash evaluates the first; the second only fills it if still empty).
3. **No silent drop, ever.** Any other top-level non-comment line that is neither `source`, a function, an entry call, nor a `: ${VAR:=…}` default is a **loud, named error** from `parse()` (refuse rather than guess, AC-R3's law applied to the parser). Today's measured set has none, so this costs nothing on real input and turns any future idiom into a RED instead of a silent loss.

### D2 — scope set by oopPO (2026-10-06)
**Scope (verbatim intent):** (1) **no throw** on an undefined reference; (2) **typed rehydration** of a SET reference — oopTester measured that today it comes back a plain `Object` while the unit text is identical; (3) **do NOT change the STORAGE FORM** — the unit embeds a referenced component **by value**, as its whole JSON model. By-value vs by-reference (IOR/uuid) touches the one-store law and is **oopPO's fork to take to Tron — not decided here.**

1. **Undefined reference → the key is omitted.** `JSON.stringify` already omits `undefined` properties, so omitting the key IS the existing JSON storage form, not a new one (conform-to-scenario-unit-JSON law). Read: an absent key leaves the attribute at its declared default (`undefined`). Round-trip stays byte-identical. *(Alternative — an explicit empty marker — would be a new storage form; not proposed.)*
2. **Typed rehydration is DERIVED from the model, never guessed (AC-R3).** The references are already modelled as `RelationshipModel` ends in each model's `Definition` (measured: `LinkModelDefinition` → `folder` target `DefaultFolder` 0..1, `ior` target `Ior` 0..1). For each key that names a relationship end of the target model, the reader rebuilds the embedded JSON as an instance of the end's target class (`new <Target>().init(json)`; a `0..n` end → an array of instances), recursively. The target class is resolved **by name through the catalog**, never a hand table — *build-time check: if no catalog-derived name→class registry exists yet, the plan adds one under the catalog (derived from the same Definitions); it never hand-lists classes.*
3. **WHERE — RULED (ii) by oopPO, 2026-10-06:** typed rehydration lives in the **shared `init(json)`** (model-json.md, Spec 7), the ONE place both the JSON path and the OOSH `.env` path (`OoshUnit`, which already ends in `model.init(json)`) rehydrate through — generic behaviour in the shared component. The reader gains it by construction; it does not duplicate it. Storage form untouched (by value).

## Increments (each: on top of oopTester's RED gate ref → build → gate GREEN → oopPO verifies on an isolated clone; push NOTHING while the I5 chain awaits Tron)
| # | What | Gate that must flip RED → GREEN |
|---|------|------|
| I6.1 | D1 entry call: `parse` → `isEntry`, `sourceOf` renders it | G1 arm 1 (execute generated vs real under real `/root/oosh`): `oo usage` 0 → 58 lines |
| I6.2 | D1 config defaults: `: ${VAR:=…}` ⇄ `AttributeModel`, rendered in place; loud error on any other dropped line | G1 arm 2 (lossless parse: dropped top-level non-comment lines = 0, derived over every real source script): `oo` 1→0, `odocker` 3→0 |
| I6.3 | Regenerate the OOSH targets (`npm start`); commit the regenerated `odocker` / `oo` — check gen for deletions before commit | reproduce-consistency stays green; generated `odocker` now carries `ODOCKER_WORKSPACES` |
| I6.4 | D2a: undefined reference → key omitted on write, attribute default on read | oopTester's catalog-derived D2 gate over the **30 concrete** models: the 7 throwing → all 30 round-trip, no raw TypeError (AC12 unset arm) |
| I6.5 | D2b: typed rehydration of set references in the SHARED `init(json)`, derived from the Definition's relationship ends, target resolved by name through the catalog; storage form unchanged (by value) | Spec 7 **AC3 class-aware** + **AC12** (every concrete model with a reference end, catalog-derived): set ref `instanceof` its declared class through BOTH `init(json)` and `OoshUnit`; seeded plain-object rehydration → RED |

## Spec changes (full spec review, 2026-10-06 — every claim this work touches)
- **`oosh-mda.md` §3 Mapping** — add: `ClassModel.isEntry` ⇄ the top-level `<name>.start "$@"` (the process constructor invoked when the script is run).
- **`oosh-mda.md` §4 Mapping** — add the concrete idiom: a top-level `: ${VAR:=<initializer>}` ⇄ an `AttributeModel` with a config-backed initializer.
- **`oosh-mda.md` §5** — strike-in-place L139's false clause ("these already exist in the parsed body/methods and round-trip verbatim") for the entry call and the config defaults; add DELIVERED bullets **Entry** and **Top-level attributes**; add the **lossless-parse** rule (any other top-level line = loud named error).
- **`oosh-mda.md` §6** — add G1 arm 1 (execute) and arm 2 (lossless parse) under IMPLEMENTED once they land; annotate gate 5 that identity is only meaningful on a lossless parse (arm 2 is what makes it so).
- **`oosh-mda.md` §4a** — AC-R2 sharpened: a referenced component comes back as its TYPED instance (derived from the Definition's relationship ends), not a plain object; AC-R4 true for all catalogued models after I6.4/I6.5; record the undefined rule (key omitted = the JSON form). Storage form stated explicitly as **by value** (whole JSON model), with by-value-vs-by-reference noted as **open with Tron** (one-store law).
- **`model-json.md` (Spec 7)** — **oopPO's patch applied VERBATIM, never reworded** (source: AI/Claude `session/tasks/oopPO-I6-spec7-model-json-patch.md` @ `13aafec4`): **Edit 1** — AC3 "round-trip" becomes CLASS-AWARE (equality includes the class of every object-valued attribute; seeded plain-object rehydration → RED). **Edit 2** — new section **"Typed references"** inserted before `## Ownership`, with **AC12 — typed references, every path** (set 0..1 → instance of the declared target resolved by name through the catalog; set 0..n → array of instances; unset → key omitted, default on read, never a throw; storage form by value; by-reference OPEN for Tron).
- **`thinglish.md` L145** — approved by oopPO 2026-10-06. Exact edit, only the last clause of the cell changes:
  - **before:** `` `isEntry` is a TS/JS translation fact ``
  - **after:** `` `isEntry` is a TS/JS/OOSH translation fact — each language renders its own entry call (TS/JS `<Name>.start();`, OOSH `<name>.start "$@"`) ``
  - *Disclosed: this widens the wording of a ruling's consequence, not the ruling itself — the `entry` **keyword** stays removed (L145 head and L180 untouched).*
- **README** row "OOSH as a generation target — built and gated" — true again only once I6.1 + I6.2 and G1 land together (oopPO's condition).
- **`spec/index.md`** — link this plan in the plans table; **`oosh-mda.md`** — link it from §5.

## Verification (gates, all failable — R2)
- G1 arm 1 and arm 2 (oopTester), RED on `3a2288e`, GREEN after I6.1 / I6.2; each re-seeded RED by removing the rendered line / restoring the drop.
- The parser's loud error is seeded with a synthetic unknown top-level line → RED.
- Existing lane gates (OoshUnit 7, M2OoshClass 12, M2OoshGate 11) stay green; full suite green.
- oopPO verifies on an isolated clone; nothing pushed while I5 awaits Tron.

## Open (not invented here)
- **By value vs by reference** (IOR/uuid) for an embedded component — oopPO takes it to Tron (one-store law). This plan keeps by value.
- Is the machine-specific fallback path in the real `odocker` L15 acceptable to reproduce verbatim? It is ooshTeam's hand-written source, faithfully imported; AC-R5 ("no machine defaults") binds *our* code, not the imported text — flagged for oopPO.
- The three §5 open questions (name casing, interfaces in Bash, nested noun vs own script) are unaffected.
