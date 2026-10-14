# Model JSON — `toJSON()` + typed `init()` (the scenario-unit foundation)

*Spec 7 — Tron, 2026-09-18. **Owned by oopPO** (Tron: "you need to own the spec updates for all I tell you"). oopExpert implements the framework mechanism against this spec; oopTester gates against the acceptance criteria. This spec is faithful to Tron's word; its mechanics are refined with oopExpert, never overriding Tron's intent.*

## Tron's directive (verbatim, 2026-09-18)

> "we started with an empty json in the model. all further model are add attributes to the xyzModel class. but all models need a toJSON method that is like adding attributes to a component is adding attributes to the model json. and the init should init such a json in a typed way in init. … so we need to assign in init a plain json to a model that is then typescript type checked for all attributes. later we will use these jsons to specify the scenario units in a specific way."

## The contract

1. **Empty JSON at birth** (radical-oop §3, unchanged): before `init()` an object holds the empty JSON `{}`; a concrete `XModel` builds a model by **adding typed attributes** to the `XModel` class.
2. **`toJSON()` on every Model**: returns the model's attributes as a **plain JSON object**. Adding an attribute to a component *is* adding that attribute to the model's JSON — the attributes ARE the JSON.
3. **Typed `init(json)`**: `init` assigns a **plain JSON** to the model, and TypeScript **type-checks that JSON against ALL of the model's attributes** — a missing required attribute, a wrong attribute type, or an unknown key **fails `tsc`**. The JSON literal is the model's typed input; state still enters through `init()`, never the constructor (radical-oop §3).
4. **Round-trip**: `init(model.toJSON())` reconstructs the model — the JSON is the model's transport form (radical-oop §7: the scenario unit is the model, and the only transport).
5. **Scenario-unit foundation**: these typed JSONs ~~will later~~ **specify the scenario units** (the one-store law); **since 2026-10-07 a reference inside them is stored BY REFERENCE as an IOR string and the store's `put`/`get`/`has` are released (§Storage form; [scenario.md](scenario.md)) — every other store member stays held.** This spec builds the typed-JSON mechanism only; the **store itself is separate and** ~~**HELD** pending Tron's program-level ratification~~ **HELD except `put`/`get`/`has` (released 2026-10-07 by the approved references-by-IOR plan; `link`/`unlink`/`copy`/`sync`/`remove`/`list`/`unitFor` stay held).** The component-folder that later *holds its unit-class + model files* holds this `toJSON()` output as its model file — so this mechanism precedes that population step. **→ 2026-10-01 (Tron, spec 13): the scenario export of a UcpComponent = `{ ior, model: model.toJSON() + links[] + copies[], ownerIor }` — [scenario.md](scenario.md) §2; `UcpComponent.scenario` / `initFromScenario` are stubbed this iteration.**

## Acceptance criteria (oopTester gates each, every one failable)

- **AC1 — typed init**: `init` accepts a plain object literal typed against the `XModel`'s attributes; seed an unknown key or a wrong attribute type → **`tsc` RED** (a real type-check gate, run by `tsc`, not a runtime shim).
- **AC2 — `toJSON()` == attributes**: `toJSON()` returns exactly the model's declared attributes as JSON; add or remove an attribute and it appears/disappears in the output; seed a divergence → RED.
- **AC3 — round-trip** ~~deep-equals~~ **is CLASS-AWARE (tightened 2026-10-06, oopPO, from I6 D2):** `init(JSON.parse(JSON.stringify(m)))` — the round-trip MUST cross the JSON TEXT boundary (the literal `init(m.toJSON())` re-attaches live instances and proves nothing) — equals `m` on all attributes **including the class of every object-valued attribute** (a structural deep-equal is GREEN while a reference has decayed to a plain `Object` — measured by oopTester on `LinkModel.ior` / `.folder`); seed a lossy `toJSON()` → RED; seed a rehydration that returns a plain object → RED.
- **AC4 — generated from the model**: the mechanism belongs to the model machinery (a base method and/or generated per `XModel`), **not** hand-written per class — consistent with the MDA (the generator produces `toJSON()` + typed `init` for every model). oopExpert decides base-class vs generated-per-class; the gate asserts every catalogued `XModel` has it.
  - Model declares exactly these JSON-machinery type aliases: Writable, Json, JsonValue, Optional, Init, DefaultedKey.

## Mechanics (oopExpert's design, folded here by the spec owner)

- **`Json<M>` is a named type alias, not code.** TypeScript refuses an inline self-referential mapped type, so `Json<M>` is a module-level `type` alias in `Model.ts`. A type alias is *erased* at build — a name for a type, never runtime code — so it is **not** "code outside a class" in the radical-oop §2 sense (precedent already in the tree: `Instantiable<T>` in `M3Element`). oopExpert modelled type aliases as first-class (`TypeAliasModel`, `ClassModel.typeAliases`; the TS family renders them, the JS family drops them and strips the `as` casts) — thinglish.md convention 6, mof.md §10d. **A radical-oop §2 clarification that type aliases are allowed is Tron's doctrine call — surfaced, not self-applied.**
- **The typed JSON is assigned to the MODEL** (Tron: "assign in init a plain json to a model"): `Model.init(json: Json<this>)`. A component's `init(model)` stays radical-oop §3 — a component takes its `Model`, and the `Model` was built from the typed JSON. A component-level typed `init(json)` would require generics on `UcpUnit` (every subclass's signature changes) — not built; available if Tron wants it.

## Tron's rulings and refinements (2026-09-20)

### Ruled — the component-level typed init is the TARGET; generics are POSTPONED

> "while this [`new DefaultFile().init({ uuid, name, path, … })`] is where we want to go we need to postpone your generics decision."

`Model.init(json: Json<this>)` (model-level) **stands** as today's mechanism. The one-step component-level typed init is the **declared target**, but the `UcpUnit<M extends Model>` generics propagation is **NOT built** and must not be introduced meanwhile — postponed until Tron opens it.

### The GENERATOR must enforce the style, with prettified JSON

> "currently none of your code uses init this way. the generator has to enforce this coding style but with a prettified json for human readability and reviewability."

A mechanism nothing uses is not proven. Therefore:

- **Enforce**: generated code constructs a model as `new XModel().init({ … })` — the typed-JSON init style — never attribute-by-attribute assignment.
- **Prettified**: the emitted JSON is multi-line and indented, one attribute per line, with a stable key order — readable and reviewable in a diff, because **these JSONs become the scenario units**.
- **AC5 (style enforced)**: generated model construction uses `init({ … })`; seed an attribute-assignment sequence where an `init` is possible → RED.
- **AC6 (prettified)**: the emitted JSON is multi-line, indented, stable-ordered; a single-line blob → RED.

### Centralized meaningful defaults, not empty fields

> "additionally we need to centralize meaningful defaults for the attributes instead of empty fields."

- Attribute defaults are **meaningful** and live in **ONE central place** — not `''` placeholders repeated per model class (`displayName = ''`, `icon = ''`, `badge = ''`, `description = ''`).
- *Meaningful* = derived or sensible (e.g. `displayName` falling back to `name`, already `UcpComponent`'s behaviour; `icon` / `badge` / `description` carrying real defaults).
- **AC7 (centralized)**: changing a default in the one central place changes every model that relies on it; no model class carries an empty-string placeholder where a central default applies; seed a second defaults site → RED.
- The mechanism (defaults registry, base-model defaults, per-attribute-type defaults, and whether the prettified JSON omits attributes equal to their default) is **oopExpert's design**.

## Refinements forced by AC5–AC7 (folded by the spec owner, 2026-09-20)

**(a) Required-ness — `Init<M>` vs `Json<M>`.** AC1 ("a missing *required* attribute is `tsc` RED") and AC7 ("central defaults") collide if *every* key is required: a literal that must restate every default makes the central default dead. Resolution:

- `Init<M>` (the init-literal type) makes **optional**: the centrally-defaulted keys (`uuid`, `displayName`, `icon`, `badge`, `description`, **`version`** — `ClassModel.version`, default `'latest'`, [ior.md](ior.md) rule 10; added 2026-10-07 by R2 s1 `de02a396`, so `'latest'` lives in ONE place instead of 123 restated literals, and a Definition omits it when it equals the default) and every **boolean / array / record** attribute — `false` / `[]` / `{}` are a meaningful "none".
- **String attributes stay REQUIRED** — a file without a `path`, a class without a `level`, is nonsense.
- **AC1 (clarified, not weakened)**: an **unknown key** and a **wrong type** are RED for every attribute; a **missing REQUIRED (string) attribute** is RED. Omitting an optional/defaulted key is GREEN — that omission is exactly what lets the central default live, and is what makes the literals readable.

**(b) Derived getters are not data.** `Json<M>` excludes derived getters (`ClassModel.superclass`, `ClassModel.interfaces`) — they are computed from the relationships, never stored attributes. Only data attributes are in the JSON.

**(c) One sanctioned `init` override.** `ItemModel.init` is the **single** sanctioned override of the base pair — it derives `displayName` from `name` when omitted. **AC4 (adjusted)**: every `*Model` inherits the base `toJSON`/`init` except this one sanctioned override; a **second** override is RED.

**(d) `import type` is modelled** — `ImportModel.isTypeOnly`: a type-only import is a modelled fact, not a string convention.

**(e) A renderer must not print a central default** as if it were authored (the OOSH renderer no longer emits the default `description`).

## Component initialization — the framework carries the boilerplate (Tron, 2026-09-21)

> "its the UcpComponent that has to care for the initialization. DefaultFolder().init(json) is it and all other boilerplate has to be done by the init and super init. DefaultFile must be simple user centric code while ucpComponent init has to care for the boilerplate and the correct model from a mof perspective. so also implements does not have to have code to inspect the super implements but just adds the necessary while the model and the ucpComponent start method initialize the mof model after loading the class code."

### The anti-pattern this removes

```ts
// NO — the caller builds the model and must know its class: boilerplate at the call site
const folder = new DefaultFolder().init(
  new FileModel().init({ uuid: '5b1c2e0a-…', name: 'sample', path: 'sample' }),
);
```

### The target

```ts
// YES — the JSON goes straight to the component; the framework does the rest
const folder = new DefaultFolder().init({ uuid: '5b1c2e0a-…', name: 'sample', path: 'sample' });
```

### Derived requirements

- **R1 — the call site is user-centric.** A component is constructed as `new X().init(json)`. The caller never constructs a model and never names a model class.
- **R2 — `UcpComponent.init` carries the boilerplate.** It determines the **correct model class from the MOF**, instantiates it, inits it with the JSON, and assigns it. A subclass's `init` does only what is its own and delegates the rest to `super.init`: boilerplate lives **once, in the chain**, never in the leaf.
- **R3 — concrete components are simple.** `DefaultFile` / `DefaultFolder` carry user-centric code only — no model construction, no assignment plumbing.
- **R4 — `implements` (and `typeArguments`) are DECLARATIVE, not computed.** A class returns **only what it adds** — `return [Displayable, Component]` — never `[...super.implements, …]`. No class inspects its super. The framework computes the cumulative set by walking the chain: the declaration states intent, the machinery does the union.
- **R5 — `start()` initializes the MOF model after the class code loads.** `Model.start()` / `UcpComponent.start()` initialize the MOF model of a class once its code is loaded (radical-oop §4: `start()` is the process constructor). That initialized MOF model is what **R2 reads** to know the correct model class — the framework describes itself, and initialization follows from the description.

### Acceptance criteria (each failable)

- **AC8 — component-level typed init**: `new DefaultFolder().init({ … })` compiles and yields a component whose model is the right class, populated; the JSON is `tsc`-checked against that model (unknown key / wrong type → RED); seed the two-step call at a site → RED.
- **AC9 — no boilerplate in the leaf**: `DefaultFile` / `DefaultFolder` contain no model construction or assignment plumbing; seed boilerplate into one → RED.
- **AC10 — declarative implements**: no `implements` / `typeArguments` getter references `super.`; seed a `[...super.implements, …]` → RED. The cumulative set still resolves correctly — removing a class's own addition loses exactly that member → RED.
- **AC11 — `start()` initialized the MOF model**: after a class's code is loaded its MOF model is initialized, and that is what `init` uses to pick the model class; seed a class whose MOF model was not initialized → RED (init must not guess).

### Consequence — the generics question is REOPENED

Tron postponed the `UcpUnit<M extends Model>` decision on 2026-09-20 *while naming* `new DefaultFile().init({ … })` as the target. **This directive makes that target current.** oopExpert must determine whether component-level typed init needs the generics propagation it costed earlier, or whether the MOF-initialized model (R5) supplies the type another way (an associated model type declared per component and read by the framework). Design lane is oopExpert's; if it forks, surface to the spec owner and Tron rules.

### Resolved — the generics call and the mechanics (folded by the spec owner, 2026-09-21)

**The generics call: OPT-IN WITH A DEFAULT, not propagation.** `UcpUnit<M extends Model = Model>` / `UcpComponent<M>`. A leaf that wants typed init writes `extends UcpComponent<FileModel>` (tsc: `Init<FileModel>`) **and** `static get typeArguments() { return { UcpComponent: [FileModel] }; }` (runtime) — the **same convention-5 pair already used for `Container<File>`**, no new concept. Classes that bind nothing compile unchanged (`M = Model`), so the propagation cost that forced the earlier postponement does not arise. The MOF-initialized model (R5) supplies the class at **runtime**; TypeScript still needs the type parameter for **AC8**'s compile-time check — **the two are one declaration in two dialects** (thinglish.ts keeps the generic, thinglish.js keeps the getter).

- **(a) `start()` is ONE method** — MOF-model init **and** the entry-guard (Tron named `start`); scripts delegate via `super.start(argv, entry)`, which answers *am I the entry*. Not two mechanisms wearing one name.
- **(b) The `modelClass` rule** — a class's model is **the binding it gives to a generic ANCESTOR** (`{ UcpComponent: [FileModel] }`, `{ M3Element: [ClassModel] }`). A `Container` binding is **not** a model.
- **(c) No declared model** — `init()` keeps `{}` (tooling such as `RadicalOopGate`); `init(json)` **throws rather than guess**. Explicit failure beats a silent wrong model.
- **(d) Modelling growth forced to keep reproduce green** — bounded generics, header-only forwards, optional parameters, and static/readonly attributes are now modelled: the generator must be able to express what the source needs, or reproduce goes RED.
- **`defaultModel()` is gone**; `defaults(): Init<M>` pre-fills (super-delegating) where M2/M3 classes name themselves.
- **Root declarations** — `Interface` and `UcpUnit` declare the roots (`[]` / `{}`) so the generator's override rule stays deterministic; the cumulative-set machinery lives in `Mof`, never in class bodies. AC10 ("no getter references `super.`") holds: the sole textual occurrence is the doc comment in `Interface.ts` explaining why the roots exist.

**Guard honoured**: `Mof` describes **loaded classes only** — the catalog, the store and the folder population remain untouched and held (except `ScenarioIndex.put`/`get`/`has` (released 2026-10-07 by the Tron-approved references-by-IOR plan); `Mof` itself still never touches the store).

## Typed references (oopPO, 2026-10-06 — from I6 D2)

A model attribute that refers to another component or unit is declared by a **relationship end** in the model's Definition (e.g. `LinkModel`: `ior → Ior 0..1`, `folder → DefaultFolder 0..1`). The shared `init(json)` is the ONE place that rehydrates it:
- **set, 0..1** → an INSTANCE of the declared target class, resolved by NAME through the catalog **at GENERATION time** and rendered into the XModel as `static get referenceEnds()` (e.g. `{ folder: DefaultFolder, ior: Ior }`, derived from the Definition's relationship ends, never a hand table); `Model.init(json)` reads that getter — **`Model` never imports the catalog at runtime** (layering + browser purity; ruled oopPO 2026-10-06, I6 plan option A); A render of a class WITH reference ends that is not given the catalog REFUSES LOUDLY by name — it never silently omits the getter.
- **set, 0..n** → an array of such instances;
- **unset** → the key is OMITTED on write (`JSON.stringify` already omits `undefined`) and the attribute takes its default on read — never a throw.

~~The storage FORM is unchanged (a referenced component is stored as its JSON, BY VALUE). **Whether a reference should instead be stored BY REFERENCE (uuid / IOR) is OPEN — a Tron decision tied to the one-store law and the held store; nothing here decides it.**~~ **DECIDED 2026-10-07 — see "Storage form: BY REFERENCE" below** (Tron approved the references-by-IOR plan in plan mode: *"cleanup done, reference by ior plan to be started"*; plan of record [plans/2026-10-06-references-by-ior.md](plans/2026-10-06-references-by-ior.md)).

- **AC12 — typed references, every path**: for every concrete model class with a reference end (list DERIVED from the catalog — today 14 ends in 8 models, wider than the 7 throwers), a set reference round-trips as `instanceof` its declared class through BOTH the JSON TEXT path `init(JSON.parse(JSON.stringify(m)))` and the OOSH `.env` reader (`OoshUnit` render → parse) — never the literal `init(m.toJSON())`, and an unset reference round-trips without a throw; seed a reader that returns a plain object → RED; seed `JSON.stringify(undefined).replaceAll` → RED by name.

**~~Polymorphic ends (amended 2026-10-06, oopPO, from the I6.5 measurement).~~ SUPERSEDED 2026-10-07 by "Storage form: BY REFERENCE" — kept struck as history; the decay and the refusal below were consequences of the BY-VALUE form and are RETIRED with it.** ~~**Polymorphic ends.**~~ The by-value JSON of a referenced component carries no type discriminator, so the rehydrated class depends on the declared target:
- **Concrete target without concrete subclasses** → an instance of the declared class (exact).
- **Abstract target with EXACTLY ONE concrete subclass in the catalog** (today `IorModel.profiles` → `TaggedProfile` → `InternetProfile`) → that subclass, DERIVED at generation time; generation fails LOUDLY by name when the count is ZERO (several is the next bullet: init refuses by name).
- **Abstract target with SEVERAL concrete subclasses** (today `TaggedProfileModel.components` → `TaggedComponent` → `SecureTransport` | `UnknownTaggedComponent`) → `init` REFUSES LOUDLY by name; it never guesses (a guess passes an `instanceof`-declared check while substituting the type — a false green).
- **Concrete target WITH concrete subclasses** (today `LinkModel.folder` → `DefaultFolder`, 5 subclasses; `RepositoryIdModel.namespace` → `Namespace`, a stored `Version` comes back a `Namespace`) → an instance of the DECLARED class. **Disclosed residual: a stored subclass instance (e.g. `NodeJSFolder`) comes back as the declared class.**

- ~~**AC12 (amended)**: for each end the rule above holds — exact / derived-unique (generation RED when not unique) / refused BY NAME / declared-class. The declared-class residual is gated as an INVERTED CANARY: a stored `NodeJSFolder` asserts back as `DefaultFolder` and a stored `Version` as `Namespace` (GREEN while the known decay exists, RED the day a discriminator lands — then retire this disclosure).~~ **RETIRED 2026-10-07 — the discriminator landed: it is the IOR's own type (below); the inverted canaries turn POSITIVE in R4.**

~~**OPEN for Tron (with the by-value vs by-reference fork):** a typed POLYMORPHIC reference needs a type discriminator, which is a storage-form change. Storing references BY REFERENCE (IOR, which already carries a `typeId`) would resolve both the one-store question and polymorphism.~~ **CLOSED 2026-10-07 — Tron chose BY REFERENCE (below).**

### Storage form: BY REFERENCE — a reference end is stored as an IOR string (DECIDED, Tron 2026-10-07)

A reference end is stored as an **IOR string** (its form is [ior.md](ior.md) rule 8 — **CORRECTED 2026-10-12, P1 of [plans/2026-10-11-namespace-root-and-component-typed-iors.md](plans/2026-10-11-namespace-root-and-component-typed-iors.md): the type part names the UcpComponent incorporating the target, rooted at `EAMD.ucp/Components/`; the uuid is the target's own**); a `0..n` end as an **array** of IOR strings; an unset end is **omitted** (unchanged). The stored JSON of a model therefore NEVER contains another unit's fields (`model`, `initialized`, `heldUnits` or any other) — a second copy of another unit is a second store by the back door (the ONE-store law). **One rule, two cases**, decided by the end's declared target:

- ~~**(A) the target is in the `Ior` family** (`Ior` and the parts it owns — `TaggedProfile`, `TaggedComponent`, `RepositoryId`, `Namespace`, `Version`): stored as `ior.toString()` with its `iorComponents` beside it ([ior.md](ior.md) rules 3/6); rebuilt by `Ior.parse(string).withComponents(...)` — **no store, no resolve**.~~ **AMENDED 2026-10-07 — TRON RULED (AskUserQuestion, option "C: parts as tagged JSON") on a gap measured by oopExpert before R3 s1: 11 of the 12 case-A ends target an IOR *part* (`Namespace`, `Version`, `InternetProfile`, `TaggedProfile`, `RepositoryId`, `ObjectKey`), and parts have NO complete string form. So case A splits:**
  - **(A1) the target is a whole `Ior`:** stored as `ior.toString()` with its `iorComponents` beside it ([ior.md](ior.md) rules 3/6); rebuilt by `Ior.parse(string).withComponents(...)` — no store, no resolve.
  - **(A1-owner) ONE owner for the companion key name (oopPO ruling 2026-10-08, radical-OOP: a rule has ONE owning class; disclosed by oopBashExpert at R5 `b219afed`):** the name `<end>Components` is answered by **`Model`** alone (one static method, name = owner's choice). `Model.toJSON`, `Model.init` and `OoshUnit.parse` — and every future reader/writer — **ask it; none spells the suffix**. **AC12d (mechanism, not a grep):** seed the owner to answer a different suffix → every reference end still round-trips byte-identical through JSON **and** `.env` (all sites moved together); a site that hard-codes the suffix breaks its round-trip → **RED by that site's name**; revert → GREEN.
  - **(A2) the target is an IOR PART:** stored as the part's **structured JSON inside its owner, WITH a class tag** naming its exact class (its `<namespace>.<Name>`, resolved through the `Mof` class registry, [ior.md](ior.md) rule 9) — so a stored `Version` comes back a `Version`, and each `TaggedProfile` component comes back its own concrete class. **BY VALUE is legal ONLY here: an owned part that lives nowhere else is its owner's value, not a second copy of a unit — a UNIT is never stored by value (case B).** `Ior.parse` builds `Namespace` / `Version` BY NAME ([ior.md](ior.md) rule 7), so a stored `Version` comes back a `Version`; tagged components travel beside the string, so `TaggedProfile.components` round-trips.
- **(A3) a LINK — `ScenarioUnitModel.links` → `Link` (RULED 2026-10-08 by oopPO on oopExpert's measured R3 s3 fork; Tron may override):** stored as the link's **canonical string** — its path or IOR, exactly `Link.toString()` — **byte-identical to the SC4 form of [scenario.md](scenario.md)** (Tron, spec 13). Reason: a scenario's `links` lists the LOCATIONS where the unit is linked (the `ln` links of [ucp.md](ucp.md) T5.3), not separate units stored elsewhere; storing a location as its string copies no unit's fields, so the ONE-store law is untouched — same principle as Tron's ruling C for owned IOR parts. Read back by `Link`'s own parse. ⇒ **case B is now ONE end: `LinkModel.folder`.** Rejected: keeping `Link` in case B (its ownIor) — contradicts SC4 byte-identity and makes the `ScenarioUnit` collapse impossible; a partial collapse — two forms of one end (DRY debt).
- **(B) the target is a unit**: stored as the target's **own typed IOR** — `ior:instance://<host>:<port>/<ns>.<Name>.<version>/<uuid>` ([ior.md](ior.md), "A unit's own IOR"); rebuilt by `Ior.parse(string).resolve()` → `ScenarioIndex.get(uuid)` → an instance of the **EXACT class the IOR names** — a stored `NodeJSFolder` comes back a `NodeJSFolder`, never the declared `DefaultFolder`.
  - **READ, ruled 2026-10-08 by oopPO on oopExpert's measured R4 s2 fork (init is synchronous, the store's `get` is async):** `init` keeps the end as a typed **`Ior`** — a reference stays a reference — and the exact-class unit is obtained by **`await end.resolve()`**, the ONE way back ([ior.md](ior.md) rule 9). Rejected: an EMPTY instance of the exact class built from registry + uuid (it looks loaded when it is not — a type that lies, the false-green shape this plan removes); synchronous file reads (break the async file contract `BrowserFile` depends on).

**Consequences (the BY-VALUE defects retire):** no type is ever guessed, so there is no refusal and no decay: (i) the `TaggedProfileModel.components` REFUSAL retires; (ii) the declared-class residual (`NodeJSFolder` → `DefaultFolder`, `Version` → `Namespace`) retires; (iii) an IOR string on a reference end is no longer dropped by `init`, so `OoshUnit` can carry one. `ScenarioUnit.toJSON/from` (which already write IORs as strings and read them with `Ior.parse`) is the precedent and collapses into the ONE generic by-reference `toJSON`/`init` in `ModelDefinition` (R3). `Model` still never imports the catalog at runtime: case B resolves through `Ior.resolve()` and the namespaced class registry, case A through `Ior.parse` — neither through `Model`.

- **(C) containment PARTS are their own units (Tron 2026-10-10; plan [2026-10-10-subscenarios-by-ior](plans/2026-10-10-subscenarios-by-ior.md)):** a member DERIVED as a part end (`partEnds`: an attribute of a Model class whose type names a catalogued `ModelUnit` that is NOT a `UcpUnit` — today `ClassModel.imports/attributes/methods/relationships/typeAliases`, `MethodModel.parameters`, `ModelUnit.references`) is STORED as an IOR string (`0..1`) / ARRAY of IOR strings (`0..n`), each part being its own scenario unit with `ownerIor` = its owner ([scenario.md](scenario.md) §1). **STORE PATH ONLY:** `ScenarioIndex.putModel` writes the parts and the IORs, `get` resolves them back to typed instances (eagerly, so a stored-and-read model is JSON-equal to the catalog); **`Model.toJSON` is unchanged** — the generators build class models from its shallow in-memory form. Contrast rule A2: an IOR PART stays class-tagged JSON inside its owner; a containment PART does not.
- **AC12 (REWRITTEN 2026-10-07)** — for every reference end (list DERIVED from the catalog — today 14 ends in 8 models): (a) the stored form is an IOR string / array of IOR strings and contains NO `{model, initialized, heldUnits}` — seed a by-value write → RED; (b) a set reference — an `Ior` (A1), an IOR part (A2, via its class tag; seed: drop the tag → RED, the decay returns) or a unit (B, R4) — round-trips through BOTH the JSON TEXT path `init(JSON.parse(JSON.stringify(m)))` AND the OOSH `.env` reader as an instance of its **EXACT stored class** (`constructor ===`, never only `instanceof` the declared class) — for a case-B (unit) end AFTER `await end.resolve()`; before resolution the end is a typed `Ior`, never a hollow instance — seed a resolver that returns the declared class → RED for `NodeJSFolder` and `Version`; (c) `TaggedProfile.components` round-trips with its concrete components — seed dropping `iorComponents` → RED; (d) an unset reference round-trips without a throw. The inverted canaries (`ReferencePolymorphism`, `TypedReferences`) turn POSITIVE.

## Ownership

- **Spec owner**: oopPO (Tron 2026-09-18). Keeps Tron's word as durable spec; PO is accountable for its faithfulness and completeness.
- **Implementation**: oopExpert — the exact TS typing (a mapped/derived type of the model's attributes) is its design lane.
- **Gate**: oopTester — AC1–AC4, failable, on the prod/render surface.
