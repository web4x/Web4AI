# PUML fact sheet — Web4MDA main `1488dbdf7` (MEASURE ONLY, no code change)

*oopBashExpert@WODA.prod for oopPO, 2026-10-13. Read via `git show` / `git grep` at the exact sha (origin main verified `1488dbdf7a743601a174057f2b4710ff1a3914c3`). Paths are relative to `P = EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/`; line numbers are of the rendered `src/ts` file (the Definition in `model/` is the authored source).*

Target (Tron, for the new plan): a UcpComponent PUML with the component class in the centre; the full inheritance tree above; the components we depend on to the left; the components depending on us to the right; direct subclasses (one level) below; Thinglish interface → puml `interface`; attributes / properties / methods in headed sections; dependencies as TWO-WAY relationships with ImportModels DERIVED from them.

## (1) Every PUML producer today and what each draws

ALL `@startuml` text comes from ONE class, `M2PlantUmlClass` (`P/MOF/M2/M2PlantUmlClass/latest/src/ts/EAM/layer2/M2PlantUmlClass.ts`). Four builders; `PlantUmlServer.ts:52` only probes the server (`class Probe`).

| # | Builder | Line | Draws | Called by / output |
|---|---|---|---|---|
| a | `sourceOf(c)` | :38-47 | ONE class box: header (kind + name + generics + `extends X implements Y` as TEXT, :110-115), attributes, `+constructor()`, relationship ends, methods. **No other node, no edge** — neighbours appear only as names in the header. | M1Catalog generate, per class → `<owner>/latest/src/puml/EAM/<layer>/<Class>.puml` (+ svg via `derived` :91-99). **113 files** (one per catalogued class). |
| b | `interfaceSource(c)` | :125-131 | ONE `interface` box: ends + methods; **no attributes**, no constructor. | dispatched from `sourceOf` when `c.isInterface` (:39). |
| c | `graphSource(title, nodes, edges, placed)` | :53-59 | A class GRAPH: nodes as bare headers, **no members** (`nodeHeader` :118-122); edges `<|--` generalization, `<|..` realization, `..>` «instanceOf» (`edgeLine` :62-67); type-argument labels; `<<placed>>`. | `M1Graph.toSource` (`P/MOF/M1/M1Graph/latest/src/ts/EAM/layer2/M1Graph.ts:120`) → Package `latest/src/puml/<name>.puml` (:132-137). 4 views written by `M1Graph.start` (:196-202): `Web4MDA-graph` (`fromModel`, all classes :42-45), `Web4MDA-interfaces` (`focus(package)` = centre's superclass chain + interfaces along it + the whole interface family, :52-66), `Web4MDA-MOF` (`mof`, every MOF.* class + the placed unit, :72-78), `Web4MDA-M2AbstractClass` (`chain` centre→top, :81-91). Graph edges come ONLY from `generalization`/`realization`/`instanceOf` (`edges` :98-107). |
| d | `objectSource(title, units, links)` | :78-88 | An M0 OBJECT diagram: `object "<name> : <Class>"` with string fields, `*--` containment links named by the end. | `M1Sample` (`P/MOF/M1/M1Sample/latest/src/ts/EAM/layer2/M1Sample.ts:83`) → `Web4MDA-sample.puml` (:100, :150). |

Committed: **118 `.puml`** = 113 per-class + 5 package diagrams (`P/latest/src/puml/Web4MDA-{graph,interfaces,MOF,M2AbstractClass,sample}.puml`). **No producer draws a component-level view, a dependency edge, a "used-by" side, or subclasses-of-a-centre.**

## (2) RelationshipModel kinds in use + counts; how a dependency is modelled now

Kind union (`P/latest/src/ts/EAM/layer3/RelationshipModel.ts:14`): `contains | containedBy | references | generalization | realization | instanceOf | dependency | ''`. Fields :14-19: `kind, source, target, multiplicity, redefines, initializer`.

DECLARED in the 113 authored Definitions (`*/model/*Definition.ts`, method-body string lines excluded):

| kind | count |
|---|---|
| generalization | 108 |
| instanceOf | 21 |
| contains | 17 |
| realization | 8 |
| containedBy | 8 |
| references | **0** (test-only: `P/latest/test/UnitReferencesInc2.test.ts:114`) |
| dependency | **0** |

(Method-body strings additionally hold `contains` ×2 and `dependency` ×1 — the latter is `M2AbstractDependency`'s own default, not a declared relationship.)

**Dependency today = ONE-WAY stored, opposite derived — and stored AS IMPORTS, not as a relationship.** `M2AbstractDependency` (`P/MOF/M2/M2AbstractDependency/latest/src/ts/EAM/layer2/M2AbstractDependency.ts`): doc :8-13 ("the dependency end `dependencies` … is STORED once — the class's imports (`ImportModel.declaredBy`); its opposite end `dependants` … DERIVED"). `dependencies(name)` :46-48 → `dependenciesIn` :80-83 = the distinct `imports[].declaredBy` of the class, minus itself. `dependants(name)` :51-54 and `dependantsOfAll()` :57-68 = the reverse scan. Opposite end as a fact: `dependantsEnd` :41-43 via `M3Relationship.opposite('dependants')` (doc RelationshipModel.ts:10-11). Default end: `name 'dependencies', kind 'dependency', multiplicity '0..n'` :70-77. Callers: `M1Catalog.dependants(name)` :856-859 and `M1Catalog.dependencyUsers()` :861-864 (`P/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.ts`); consumer = M1Layout rule 6 (§4). **No `dependency` RelationshipModel exists in any model; nothing renders a dependency in PUML.**

## (3) Where ImportModels come from

**AUTHORED in the Definitions** — 110 of the 113 Definition files carry an `imports: [` list; **435 authored ImportModels** (`declaredBy: '…'` lines outside method bodies). Example: `P/MOF/M2/M2PlantUmlClass/latest/model/M2PlantUmlClassDefinition.ts:26-98` (15 imports). `ImportModel` fields (`P/latest/src/ts/EAM/layer3/ImportModel.ts:12-14`): `declaredBy` (the NAME of the declaring class — a reference, never a path; doc :4-9), `isInterface`, `isTypeOnly` (+ `name` from ModelUnit).

Derivations that exist all run FROM imports, none TO them:
- `M2AbstractDependency.dependenciesIn` :80-83 — dependencies derived from imports (§2).
- `M2ThingClass.dependenciesOf` (`P/MOF/M2/M2ThingClass/latest/src/ts/EAM/layer2/M2ThingClass.ts:116-120`) — the shown dependency list = own imports, minus self, minus `Interface` for interfaces, one per declaring unit.
- `M2OoshClass.parse` (`P/MOF/M2/M2OoshClass/latest/src/ts/EAM/layer2/M2OoshClass.ts:112-114`) — READ direction: an OOSH script's `source` lines become ImportModels.
- Specifiers are derived per language from the layout (M1Layout rule 8, the relative walk; `M1Layout.ts:138`, :312-341).

**Nothing derives ImportModels from a dependency relationship.** The target inverts today's source of truth (today: imports → dependency; target: dependency → imports).

## (4) How layers and a component's units are known

**Layer — DERIVED by rule, never stored:** `M1Layout.layerOf(c)` (`P/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.ts:147-151`; rule 5, doc :17): interface OR descends `Model` OR is `Model` → `layer3`; realises `View` → `layer5`; realises `Process` → `layer4`; else `layer2`. Computed per class at layout build (:91, :97). Rendered `src/ts` per layer at this sha: layer2 **70**, layer3 **42**, layer4 **2**, layer5 **0**. The layer is a path segment (`<owner>/latest/src/<dir>/EAM/<layer>/`, `classFolder` :256-260) — no `layer` field on ClassModel.

**A component's units — DERIVED by M1Layout's owner rules (rule 6, doc :18-21):** `ownerOf(c)` :155-162 (memoised) → `decideOwner(c)` :165-176, in order:
1. the package itself (:166);
2. a declared unit: a `containedBy` relationship with an empty name → its target (:167-168);
3. `isComponent(c)` → itself (:169);
4. an OWNED model: a component that binds it AND is its sole user (`ownsModel` :468-471) (:170-171);
5. the namespace container: the innermost component segment of its namespace (`containerOf` :215-223) (:172-173);
6. an interface realised by exactly one component → that component (:174-175);
7. else `enclosing(c)` :184-196 — the SMALLEST Package enclosing every USER, the users being the §2 derived `dependants`.

`M1Catalog.owners()` (`M1Catalog.ts:211-219`) = per class `layout.homeComponentOf(name)` (`M1Layout.ts:271-277` = qualified name of the component FOLDER holding its home Version); `ownersByUuid()` :233-236 feeds the store; rendered into every `static get component()`. **A component's units = the classes whose owner key is that component** — a reverse lookup of `owners()`; no stored list. Model↔component typing: `Mof.incorporating(model)` (`P/latest/src/ts/EAM/layer2/Mof.ts:93`) from each M2 component's `static get incorporates()` (e.g. `M2AbstractClass.ts:47`, `M2AbstractImport.ts:27`, `M2AbstractRelationship.ts:86`).

## (5) How M2PlantUmlClass renders interfaces, getters, sections today

- **Interface:** `classHeader` :110-115 emits the kind `interface` when `c.isInterface` (else `abstract class` / `class`); `interfaceSource` :125-131 draws ends + methods, **omits attributes** and the constructor. 9 class-level Thinglish interfaces carry `isInterface: true`: File, Authority, Component, Displayable, Folder, Process, Tree, Unit, View. `implements` targets appear only as header TEXT (`implements X, Y`, :113), not as edges, in a per-class diagram.
- **Getters:** `methodLines` :141-147 — a getter is the bare name with no parentheses (`+displayName: string`, :145); `{static}` / `{abstract}` modifiers (:142); visibility `+ # -` (:146); method generics kept (:144). Getters are mixed in with the methods — no separate "properties" group.
- **Attributes:** `attributeLine` :133-135 → `M2PlantUmlAttribute.toSource()` (visibility, name, type, initializer).
- **Relationship ends:** `relationshipMemberLines` :137-139 → `+name: Target [multiplicity] = initializer`.
- **Sections: NONE.** `sourceOf` :41-44 emits attributes, `+constructor()`, ends and methods as ONE flat member list — no `--`/`==` separators and no headers. (The target's headed sections attributes / properties / methods do not exist.)

## (6) What decides component-vs-class for a dependency

**Today a dependency is class→class only.** `ImportModel.declaredBy` names a CLASS (`ImportModel.ts:6`), and `M2AbstractDependency.dependencies/dependants` return CLASS names (:46-54). No code lifts a dependency to the component level, and no relationship has a component as its end.

What decides whether a NAME is a component (usable for the lift):
- `M1Layout.isComponent(name)` :413-420 — a concrete (`!isAbstract`) descendant of `UcpComponent` (superclass chain via `descends` :473-), not the package, and not a declared unit (no `containedBy` with an empty name); memoised by name. A component that contains components IS a Package (derived, :250-253; `isPackageSegment` :236).
- A class's component = its owner key `M1Catalog.owners()[name]` (§4) — so "the components we depend on" would be `{ owners()[d] | d ∈ dependencies(centre's units) } − self`, and "components depending on us" the same over `dependants`. **This lift is NOT implemented anywhere today.**
- The only current consumer of dependencies at a coarser grain is rule 6's `enclosing` (`M1Layout.ts:179-196`), which PLACES shared units by their users — layout only, never drawn.

## Gap summary (facts vs the target, no proposal)

| Target element | Exists at `1488dbdf7`? |
|---|---|
| Centre = the UcpComponent class | per-class box exists (`sourceOf`), but there is no component-centred diagram |
| Above: full inheritance tree | `M1Graph.chain` / `focus` filter a superclass chain (+ interfaces) into a GRAPH diagram, without members |
| Left: components we depend on | no — dependencies are class-level imports; no component lift; never drawn |
| Right: components depending on us | no — `dependants` is derived (class-level) but never drawn or lifted |
| Below: direct subclasses, 1 level | no producer (reverse `generalization` lookup not implemented) |
| Thinglish interface → puml `interface` | yes (`classHeader` :111) — but interface boxes omit attributes (:127-128) |
| Headed sections attributes / properties / methods | no — one flat list (:41-44); getters inside methods |
| Dependency = TWO-WAY relationship | partly — one end STORED as imports, the opposite DERIVED (`M2AbstractDependency`); 0 `dependency` RelationshipModels in models |
| ImportModels DERIVED from dependencies | no — the inverse: 435 imports AUTHORED; dependencies derived FROM them |
