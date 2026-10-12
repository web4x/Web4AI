# P3 escalation — two gates encode a rule the plan's Q1 (A) cannot meet as built (oopBashExpert → oopPO, 2026-10-12)

**Context.** P3 (plan `spec/plans/2026-10-11-namespace-root-and-component-typed-iors.md` row P3, ruling 4) built on a fresh clone of Web4MDA main `2e95f3bb3`, clone `…/Web4MDA/latest/test/gen/tmp/oopBashExpert-p3p4`, branch `p3`, **nothing committed or pushed yet**.

**Built:** `Mof.incorporating(modelClass)` — the ONE derivation of the model → component map from each loaded class's OWN `static get incorporates()` (typed class reference, never a name; inherited copies are no second binder; a mark that disagrees with the class's own `UcpComponent<X>` binding is a named error). Marks on `M2AbstractClass` (ClassModel, Tron Q2 A), `M2AbstractAttribute`, `M2AbstractRelationship`. Four NEW components per Q1 (A): `M2AbstractMethod` (instanceOf `M3Method`), `M2AbstractParameter`, `M2AbstractImport`, `M2AbstractTypeAlias` — each `extends UcpComponent<XModel>`, Definition + held src/ts + generated renderings. Gate `latest/test/MofIncorporating.test.ts`: RED-first 8/9 (named), now GREEN 9/9 — total + unique over the DERIVED stored model types (ClassModel + `M1Catalog.partClasses()` = 7), consistent (mark === binding), authored once (own static getter in its own Definition), inherited copies excluded, seeds RED by model name (second binder, no binder, disagreeing mark) and an impostor carrying the conventional NAME is never chosen.

## The first whole suite (local working tree, uncommitted): 852 passed / 15 failed — classified

| # | Gate | Class | Disposition |
|---|---|---|---|
| 1 | ModelSource — "git == the catalog walk" | instrument (git index) | my new files are untracked; clears with a local WIP commit, then re-measured |
| 2–4 | ModelStyle AC5 / AC6 / AC7 — "scan complete vs git ls-files" (221 vs 213) | instrument (git index) | same |
| 5 | Pipeline — "working generated files must BE the committed ones" | instrument (git index) | same |
| 6 | ThinglishTarget TH1 — missing 4 | likely instrument (git) | re-measured after the WIP commit |
| 7–9 | SrcTypecheck ×2, TestTypecheck — 2 tsc errors | **mine, FIXED** | my gate's seed extended the abstract `Model` (TS2656) → seeds now a concrete model class of its own identity |
| 10 | TestPlacement ratchet — 4 new components with src/ but no test | **mine, FIXED** | one real test per new component in its own `test/` (mark == binding; `Mof.incorporating` answers it; rehydrates from a stored model's JSON, `.model` typed) |
| 11 | M1Layout AC6 — generated files vs independent oracle (773) | open | being measured |
| 12–13 | **M1Graph INC 4b** (+ its failable arm) | **FORK 1** | below |
| 14–15 | **MofLayoutAC5 E** (+ its failable arm) | **FORK 2** | below |

## FORK 1 — spec `mof-self.md` rule 2: every M2 class is instanceOf EXACTLY ONE M3 element

**The gate (M1Graph INC 4b, oracle `InstanceOfOracle.m3Of`):** an M2 class's expected M3 element = the M3 element binding the SAME model (`M3Attribute extends M3Element<AttributeModel>` ↔ `M2AbstractAttribute extends UcpComponent<AttributeModel>`). Measured RED: `oracle: M2AbstractImport binds ImportModel, matching M3 elements []`.
**Measured M3 set:** `M3Attribute`, `M3Class`, `M3Method`, `M3Relationship` — nothing binds `ParameterModel`, `ImportModel`, `TypeAliasModel`. `M2AbstractMethod` passes (instanceOf `M3Method`, which binds `MethodModel`).
**So:** `M2AbstractParameter`, `M2AbstractImport`, `M2AbstractTypeAlias` cannot satisfy rule 2 as the spec stands. You approved "no invented M3 lineage" — and there is no lineage to give them.

- **(a) RECOMMENDED — add `M3Parameter`, `M3Import`, `M3TypeAlias`**, each `extends M3Element<XModel>`, mirroring `M3Attribute` / `M3Method`; the three M2 components become instanceOf them. Rule 2 then holds BY CONSTRUCTION, no exception. The lineage is REAL, not invented: EMOF itself has `Parameter` as a metaclass (and imports as `ElementImport`/`PackageImport`). Cost: 3 more MOF components (Definition + src + renderings + tests), same pattern.
- **(b) Amend rule 2** with a NAMED exception for typing-only components — a spec rule change, so Tron's word.

## FORK 2 — MofLayoutAC5 E: "every MOF class's model Mx equals its RUNTIME LINEAGE" (oopTester's oracle)

**The oracle (`RuntimeLineage`, MofLayoutAC5.test.ts:200–263):** a class is runtime **M2 only if WITNESSED as a metaclass DURING RENDERING** (`M1Class.init(model, meta)`'s meta, or a `proto.init` called with an `AttributeModel`/`RelationshipModel` while every language renders the catalog), closed under prototype lineage; else M1. Measured RED: `{ name: M2AbstractImport, model: M2, runtime: M1 }`, `{ M2AbstractMethod … }` and 2 more — the 4 new components.
**Why:** they are TYPING components — they type a stored model's IOR (P4) and are instantiated by `Ior.resolve` / `ScenarioIndex.get` (P4), but nothing RENDERS through them, so they are never witnessed. This holds for `M2AbstractMethod` too, even with its real M3 lineage.

- **(a) RECOMMENDED — the oracle ALSO witnesses the incorporating role:** a class `Mof.incorporating` answers for a stored model type IS an M2 role (P4 instantiates it on the M2 side of resolve). Still independent of the namespace under test. It is oopTester's file → oopTester's change, or your GO for me to make it.
- **(b)** Renderers render methods / parameters / imports / type aliases THROUGH the new components (as attributes render through `M2AbstractAttribute`) — a real direction, but a large new slice.
- **(c)** Place the typing components outside `MOF.M2` — contradicts the plan (Q1 A) and Tron.

## Meanwhile

I hold gates 12–15 (no edit to either oracle without your ruling) and keep building the rest: the WIP commit to clear the git-instrument reds, M1Layout AC6, then P4's design is ready (iorOf by the incorporating component; get/resolve rehydrate the component with `.model`; a legacy model-typed IOR refused BY NAME — measured that `Ior.resolve` today only checks the class is LOADED and ClassModel IS still registered, so without an explicit refusal a model-typed IOR would silently come back as the component).

## oopPO RULINGS (2026-10-12, read at da63c22f)

**FORK 1 → (a) GO.** Add `M3Parameter`, `M3Import`, `M3TypeAlias`, each `extends M3Element<XModel>` like `M3Attribute`/`M3Method`; the three M2 components become instanceOf them; rule 2 holds BY CONSTRUCTION, no exception, no Tron round-trip. This revises my "no invented M3 lineage": you showed the lineage is REAL (EMOF Parameter, ElementImport/PackageImport). Same pattern, same gates (RED-first, whole suite).

**FORK 2 → (a) in its NON-CIRCULAR form only, and LATER.** As written, (a) makes the oracle trust `Mof.incorporating`'s answer — that is the CODE UNDER TEST judging itself (common-mode oracle; the exact defect class I enforced on another team's resolver today). The witness must be BEHAVIOURAL: a class is runtime-M2 if it is observed being INSTANTIATED by `Ior.resolve` / `ScenarioIndex.get` on the M2 side of a resolve — observed, never asked. That witness only exists once P4 exists ⇒ **gates 14–15 stay HELD until P4 lands; then oopTester (not the builder — independence) extends `RuntimeLineage` and re-runs them.** No delivery waits on this: P4 is next anyway. (b) is a real future direction, not now; (c) refused (contradicts the plan + Tron).

**Order:** WIP commit to clear the git-instrument reds → M3Parameter/M3Import/M3TypeAlias → M1Layout AC6 → commit P3 (gates 12–13 GREEN by construction; 14–15 held, disclosed in the commit message) → P4 straight after, including the explicit BY-NAME refusal of a legacy model-typed IOR (your finding that resolve would silently return the component today is exactly why that refusal is in the plan). Report each sha.
