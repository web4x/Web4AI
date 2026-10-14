# R3+R4 landing — whole-suite failure classification (base vs landing)

*oopBashExpert@WODA.prod, 2026-10-14, for oopPO. Derived mechanically from the two suite logs (failing test titles, `comm` of base vs landing), not retyped.*

| run | head | failed | passed | skipped | files failing |
|---|---|---|---|---|---|
| BASE (oopExpert rebased 6 increments) | `8241543c2` | 72 | 907 | 2 | 30 / 121 |
| LANDING (+3 increments) | `61ec97b60` | 73 | 911 | 2 | 31 / 122 |

Reference: main `280fb08d8` = 963 passed / 0 failed. So the 72 pre-existing failures were brought by the 6 rebased increments (tsc-only, never suite-run).

## Summary: 72 PRE-EXISTING (fail on base AND landing) · 1 INTRODUCED (landing only) · 0 fixed by the landing

Fixed since, on the preserve branch (file-level gates GREEN, whole suite NOT re-run — awaiting oopPO): `c5bacea7e` = PrimitiveAttributes, PartsStorage, NullEnds (oopPO rulings: derived values, failable seed); `6977cd08c` = ModelJson AC4 (JsonValue on Model, alias set read from spec).

Preserve branch: `preserve/oopBashExpert-r3r4-landing` = `6977cd08c` (stack: 8241543c2 → eb71c2226 → 4083a158d → 61ec97b60 → c5bacea7e → 6977cd08c).

## INTRODUCED (1)

- `latest/test/ModelJson.test.ts` — spec/model-json.md — toJSON() + typed init() on every Model (Tron; spec owned by oopPO) > AC4 — generated from the model: the mechanism is ONE base method pair on Model, carried by every catalogued XModel; the base is reproduced by the generator — **FIXED by `6977cd08c`**

## PRE-EXISTING (72), grouped by file

### `latest/test/ReferencesByIor.test.ts` — 8
- R3 — references BY REFERENCE (spec/model-json.md Storage form; AC12 as amended at 09d2982c) > (A3) every LINK end stores the link's CANONICAL STRING — its path or IOR, exactly Link.toString() — and reads back as a Link (spec/model-json.md A3; LANDED GREEN in R3 s3)
- R3 — references BY REFERENCE (spec/model-json.md Storage form; AC12 as amended at 09d2982c) > (a) EVERY end is stored BY REFERENCE — IOR string(s), or the class-tagged JSON of an owned IOR part; never a unit by value (FLIPPED in R3 s1)
- R3 — references BY REFERENCE (spec/model-json.md Storage form; AC12 as amended at 09d2982c) > (c) a case-B end READS back as a typed Ior, and `await end.resolve()` answers its EXACT class (FLIPPED in R4 s2b)
- R3 — references BY REFERENCE (spec/model-json.md Storage form; AC12 as amended at 09d2982c) > (c) every case-B end stores the target's EXACT own IOR (write side; FLIPPED in R3 s1)
- R5 — OoshUnit transports IOR strings: a model with reference ends round-trips through the .env form BYTE-IDENTICAL > AC12d is FAILABLE: readers that disagree with the writer's owner RED BY SITE NAME (Model.init, OoshUnit.parse), in both directions; agreement -> GREEN
- R5 — OoshUnit transports IOR strings: a model with reference ends round-trips through the .env form BYTE-IDENTICAL > AC12d — the owner SEEDED to a different suffix: every case round-trips byte-identical through JSON AND .env, and the SEEDED key is what travels
- R5 — OoshUnit transports IOR strings: a model with reference ends round-trips through the .env form BYTE-IDENTICAL > every derived end (case A, LINK, case B) and an A1 Ior WITH a tagged component: render → parse → render is BYTE-IDENTICAL
- R5 — OoshUnit transports IOR strings: a model with reference ends round-trips through the .env form BYTE-IDENTICAL > is FAILABLE (seed by injection): a reader that DROPS the end REDs every case, BY NAME

### `Ior/latest/test/IorAcceptance.test.ts` — 7
- Ior — spec 14 I1+I2+I3 acceptance (IOR1-IOR7, IOR3b, port rule, Link, UnrepresentableIorError) — oopTester gate > IOR2 round-trip BOTH ways over EVERY concrete IOR string of the repo (derived scan, I3 canonical: typed instance + address list) — CHECKED / SKIPPED / TOTAL, SKIPPED 0
- Ior — spec 14 I1+I2+I3 acceptance (IOR1-IOR7, IOR3b, port rule, Link, UnrepresentableIorError) — oopTester gate > IOR3 backward compatible: every SC4 COMPONENT and every SC4 INSTANCE string round-trips byte-identical (I1 < I3) — both kinds present
- Ior — spec 14 I1+I2+I3 acceptance (IOR1-IOR7, IOR3b, port rule, Link, UnrepresentableIorError) — oopTester gate > IOR3b legacy instance IORs are NEVER typed by invention (I3, rule 4 amended): every legacy untyped instance string parses UNTYPED and round-trips byte-identical; an Ior BUILT with a type emits the typed form
- Ior — spec 14 I1+I2+I3 acceptance (IOR1-IOR7, IOR3b, port rule, Link, UnrepresentableIorError) — oopTester gate > IOR6 at RUNTIME + JSON unchanged: a ScenarioUnit read from scenario JSON (built from the derived canonical + local strings) holds NO raw ior: string anywhere in its model, and toJSON() is byte-identical
- Ior — spec 14 I1+I2+I3 acceptance (IOR1-IOR7, IOR3b, port rule, Link, UnrepresentableIorError) — oopTester gate > IOR7 CORBA extensions (I3): every derived address-list IOR keeps ALL its profiles; a SecureTransport survives the scenario-JSON round-trip as EXACTLY a SecureTransport; an UNKNOWN tag is preserved as EXACTLY an UnknownTaggedComponent — stable over two round-trips
- Ior — spec 14 I1+I2+I3 acceptance (IOR1-IOR7, IOR3b, port rule, Link, UnrepresentableIorError) — oopTester gate > Link (I2): BOTH variants round-trip byte-identical over the derived strings — remote = every canonical IOR, local = every spec .scenario.json path — and each is exactly one variant
- Ior — spec 14 I1+I2+I3 acceptance (IOR1-IOR7, IOR3b, port rule, Link, UnrepresentableIorError) — oopTester gate > UnrepresentableIorError (I3 follow-up): tagged components on a NON-own Ior — ownerIor, a copy, a remote link — are REFUSED by toJSON with a named error naming that IOR, never silently dropped

### `Ior/latest/test/Ior.test.ts` — 5
- Ior — an IOR is a typed graph of CORBA-shaped units (spec/scenario.md §3, spec 13 S3, spec 14 I1) > SC4 — toString(): ior:component://<host>:<port>/<ns>.<Name>.<version> and ior:instance://<host>:<port>/<uuid>, rendered FROM THE PARTS
- Ior — an IOR is a typed graph of CORBA-shaped units (spec/scenario.md §3, spec 13 S3, spec 14 I1) > component vs instance is WHAT THE OBJECT KEY KEYS (rule 2) — the type itself, or an instance uuid
- Ior — an IOR is a typed graph of CORBA-shaped units (spec/scenario.md §3, spec 13 S3, spec 14 I1) > static parse(text) builds the typed parts and round-trips both SC4 forms both ways
- Ior — spec 14 I3 (CORBA extensions: typed instances, multi-profile, tagged components) > rule 4 (amended): a LEGACY untyped instance string parses UNTYPED — no type invented — and round-trips byte-identical
- R4 s0 — Ior.resolve(): the ONE way back from a reference to a unit (IOR9; RED-first, s2 flips) > an UNTYPED legacy instance IOR (rule 4) throws a NAMED error — its class cannot be known, so none is invented

### `MOF/M2/M2ThingClass/latest/test/ThinglishTarget.test.ts` — 4
- PURE Thinglish TARGET gate (oopTester, spec/thinglish.md TH1–TH7) — the whole catalog vs the committed .thing files > TH3 lossless except EXACTLY the held set — facts on their OWN type (no inlining); DERIVED explicit; held(c) exact; no uuid leak
- PURE Thinglish TARGET gate (oopTester, spec/thinglish.md TH1–TH7) — the whole catalog vs the committed .thing files > TH4 only GRAMMAR keywords: every keyword-position token in every .thing belongs to the set DERIVED from ThinglishGrammar — `entry` is not one
- PURE Thinglish TARGET gate (oopTester, spec/thinglish.md TH1–TH7) — the whole catalog vs the committed .thing files > TH5 no invention, no silent drop: per shown type the committed lines match the MODEL (own + inlined) one-to-one, nothing unclassified
- PURE Thinglish TARGET gate (oopTester, spec/thinglish.md TH1–TH7) — the whole catalog vs the committed .thing files > TH6 is failable: an out-of-order member is RED by name; grammar order is GREEN

### `ScenarioUnit/latest/test/ScenarioUnit.test.ts` — 4
- ScenarioUnit — one scenario.json (spec/scenario.md §2, spec 13 S3) > R7b: typePath is derived from the TYPED ior only — an untyped ior refuses by name (no folder is guessed)
- ScenarioUnit — one scenario.json (spec/scenario.md §2, spec 13 S3) > S4 link names: '/' and space -> '_' (the name never makes a folder), an EMPTY name -> the uuid alone; the uuid is ALWAYS the last segment before .scenario.json
- ScenarioUnit — one scenario.json (spec/scenario.md §2, spec 13 S3) > getters: ior, ownerIor, identity = model.uuid, links and copies are arrays
- ScenarioUnit — one scenario.json (spec/scenario.md §2, spec 13 S3) > spec 14 I2 — the JSON is UNCHANGED: from(json).toJSON() equals the source JSON exactly, links and copies in their string form

### `latest/test/TestPlacement.test.ts` — 4
- H5m — every test lives in the component it tests (plan 2026-10-06, gates a + c) > gate (a) is failable: a misplaced test, a name-only test, and a declared non-class are each RED (seed -> RED)
- H5m — every test lives in the component it tests (plan 2026-10-06, gates a + c) > gate (a): EVERY test sits in its derived home component; no class name is held by two components
- H5m — every test lives in the component it tests (plan 2026-10-06, gates a + c) > gate (c) RATCHET: the components with src/ but no test EQUAL the baseline — a new gap is RED, a closed gap forces lowering it
- H5m-3 — a test stays in Web4MDA/latest/test ONLY as A or derived test-support (subject by ASSERTIONS) > no central test asserts ANOTHER component strongly (>2); the derived test-support set EQUALS the header list

### `Link/latest/test/Link.test.ts` — 3
- Link > LOCAL without a folder: a bare file name is its own relative path
- Link > LOCAL: a relative path becomes a folder chain (in memory, by name) + the file name; the path is DERIVED, never stored
- Link > REMOTE: an ior: string becomes a Link holding a typed Ior (no folder), and round-trips byte-identical

### `MOF/M1/M1Catalog/latest/test/TypedReferences.test.ts` — 3
- D2 / Spec 7 AC12 (oopTester I6) — every model round-trips through JSON TEXT and the OOSH reader, references TYPED > R4-END seeds by INJECTION (failability of formOf + exactly, oopTester): every wrong read-back is REJECTED by name, the right ones accepted
- D2 / Spec 7 AC12 (oopTester I6) — every model round-trips through JSON TEXT and the OOSH reader, references TYPED > SET references (R3 s2 + R4, rulings C + A): EVERY end of EVERY model comes back as its EXACT stored class on BOTH paths — a part by its class tag, a unit end as a TYPED Ior whose resolve() is the exact stored unit, an Ior end as its identical IOR string; no refusal remains
- D2 / Spec 7 AC12 (oopTester I6) — every model round-trips through JSON TEXT and the OOSH reader, references TYPED > UNSET references: every model round-trips on BOTH paths without a throw (failures named)

### `ThinglishGrammar/latest/test/ThinglishGrammar.test.ts` — 3
- ThinglishGrammar — SC8 clause 2: every keyword maps to an M3 element (Tron 2026-10-01 ruling) — oopTester gate > SC8 clause 2 (plan of record G1 + G4, Tron-approved 2026-10-02): every MODIFIER / KIND keyword is a derived keyword, maps to NO M3 element, and resolves to an attribute of the catalog model of EVERY element its rows name (per member kind) — CHECKED/SKIPPED/TOTAL, SKIPPED 0
- ThinglishGrammar — SC8 clause 2: every keyword maps to an M3 element (Tron 2026-10-01 ruling) — oopTester gate > SC8 clause 2: the grammar's declared modifiers == EXACTLY the derived map — keyword → [M3X.attribute] over the spec rows × the catalog models (sorted)
- ThinglishGrammar — SC8 clause 2: every keyword maps to an M3 element (Tron 2026-10-01 ruling) — oopTester gate > SC8 modifiers is failable: the catalog resolver finds NOTHING for an unknown keyword or a model without the attribute, and reaches visibility ONLY through its union literal

### `Ior/RepositoryId/latest/test/UcpComponentMove.test.ts` — 2
- plan d729ecd I4 — UcpComponent.move(target): a PURE STATE CHANGE of the model JSON, realised by generate > move(X -> out of Ior) changes exactly X's Definition AND its owned model's (ruling A: same mutation) — each ONE value, INSIDE its JSON literal
- plan d729ecd I4 — UcpComponent.move(target): a PURE STATE CHANGE of the model JSON, realised by generate > the next generate REALISES the move; move(X -> back) + generate returns the tree BYTE-IDENTICAL (round trip)

### `MOF/M1/M1Catalog/latest/test/Folder.test.ts` — 2
- File + Folder as Thinglish INTERFACES; DefaultFile / DefaultFolder as components; every UcpComponent is a Folder (Tron, design A) > EVERY UcpComponent is a Folder (Tron: "all ucpComponents are folders holding their unit class and model files"): parent, children: File[], path
- File + Folder as Thinglish INTERFACES; DefaultFile / DefaultFolder as components; every UcpComponent is a Folder (Tron, design A) > generated Thinglish.js executes the same structure: interfaces, cumulative implements as a set, every component a Folder

### `MOF/M1/M1Catalog/latest/test/M1Catalog.test.ts` — 2
- R7a — the live store holds EVERY catalogued class, once, idempotently (EAMD.ucp/Scenario/Index) > S2 seeds (oopPO ruling 2) — a new relationship of kind part APPEARS as a part end; an ATTRIBUTE never does, whatever its type
- R7a — the live store holds EVERY catalogued class, once, idempotently (EAMD.ucp/Scenario/Index) > S2 — M1Catalog.partEnds() DERIVES exactly the part members spec/model-json.md rule C names today (7), each with its part class

### `MOF/M1/M1Graph/latest/test/M1Graph.test.ts` — 2
- AC4 (spec/mof-self.md) — MOF diagrams are GENERATED from catalog ClassModels, never from src/ > INC 4b is failable: a WRONG instanceOf target in the model is RED against the oracle (seed -> RED)
- AC4 (spec/mof-self.md) — MOF diagrams are GENERATED from catalog ClassModels, never from src/ > INC 4b — every M2 class is modelled instanceOf EXACTLY ONE M3 element (spec rule 2): 15 edges, each target agreeing with an INDEPENDENT oracle (the model type both bind)

### `MOF/M2/M2AbstractRelationship/latest/test/M2AbstractRelationship.test.ts` — 2
- M2AbstractRelationship ← M2AbstractCollection — a relationship end with multiplicity (Tron) > EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/src/ts/EAM/layer3/Tree.ts is the TreeNode (Tron 2026-09-30): parent 0..1 AND children C 0..n (C = Tree), extends Interface; Container retired — reproduced from the model
- M2AbstractRelationship ← M2AbstractCollection — a relationship end with multiplicity (Tron) > in a CLASS (not an interface) an end is a field: parent = undefined, children = []; an end the class implements by its OWN accessor is that accessor

### `MOF/M2/M2PlantUmlClass/latest/test/M2PlantUmlClass.test.ts` — 2
- M2PlantUmlClass > carries abstract, extends, visibility, static and getters in PlantUML syntax
- M2PlantUmlClass rule 2 / AC P2 — headed sections (spec/puml.md; was U2): all five headers always > every class and interface box has Attributes / Properties / Relationships / Collections / Methods, in order, each member in exactly its section

### `Package/latest/test/Package.test.ts` — 2
- UCP — Unit · Component · Package (spec/ucp.md) > C: a component is a TREE NODE, a unit — and a FOLDER (Tron, design A): Component extends Tree; UcpComponent implements Folder, holding its unit class + model files
- UCP — Unit · Component · Package (spec/ucp.md) > C: the tree: Tree extends Interface; File extends Tree; Folder extends File; a component has a parent (its Package) — the Package holds it

### `latest/test/ModelSource.test.ts` — 2
- plan d729ecd I4 FOUNDATION — every model source is a PURE FUNCTION of its JSON state: render(load(D)) == D (oopPO C1+C2) > is failable: a drift in the JSON state, in the header, or in the text form is SEEN (seed -> RED)
- plan d729ecd I4 FOUNDATION — every model source is a PURE FUNCTION of its JSON state: render(load(D)) == D (oopPO C1+C2) > render(load(D)) is BYTE-IDENTICAL to D for every Definition (counted by git, not by the walk)

### `latest/test/ModelStyle.test.ts` — 2
- spec/model-json.md AC5–AC7 — the generator enforces the init({ … }) style, prettified; defaults are central > AC5 — the catalog IS init literals: every entry returns new ClassModel().init({ and nested units are init({ too; no helper assignments
- spec/model-json.md AC5–AC7 — the generator enforces the init({ … }) style, prettified; defaults are central > AC7 — central defaults: ItemModel carries no empty placeholder; Defaults is the one place; changing it changes every model relying on it

### `latest/test/MofIncorporating.test.ts` — 2
- Mof.incorporating — ONE incorporating component per stored model, from ONE authored typed mark (P3, ruling 4) > TOTAL + UNIQUE: every stored model type has exactly ONE incorporating component; ClassModel → M2AbstractClass (Tron, Q2 A)
- Mof.incorporating — ONE incorporating component per stored model, from ONE authored typed mark (P3, ruling 4) > the derived stored model types are exactly the 6 the store writes (7 measured 2026-10-11; U1 S3 ruling oopPO 2026-10-14 removed ImportModel — imports are DERIVED from the stored dependency units, never stored) — the set is not empty, not a guess

### `MOF/M2/M2AbstractAttribute/latest/test/PrimitiveAttributes.test.ts` — 1 — **FIXED by `c5bacea7e`**
- Convention 10 (R4 commit 1): attributes are explicitly typed; M2AbstractAttribute.isPrimitive owns the primitive set > EVERY catalogued attribute is explicitly typed (derived over the catalog, CHECKED/TOTAL reported) — 0 untyped

### `MOF/M2/M2AbstractClass/latest/test/M2AbstractClass.test.ts` — 1
- M2AbstractClass > creates the existing abstract M1 classes: the model bases, the Thinglish interfaces, UcpComponent

### `MOF/M2/M2AbstractRelationship/latest/test/NullEnds.test.ts` — 1 — **FIXED by `c5bacea7e`**
- R3 (plan 2026-10-14, rule 5) — every 0..1 relationship end is `T | null`, never `undefined` > is failable: an `undefined` end SEEDED into a real held source is named by class.end (field, abstract getter, getter, init literal — seed -> RED)

### `MOF/M2/M2MermaidClass/latest/test/M2MermaidClass.test.ts` — 1
- M2MermaidClass > carries abstract, inheritance, visibility, static and getters in Mermaid syntax

### `MOF/M2/M2TypescriptClass/latest/test/M2TypescriptClass.test.ts` — 1
- M2TypescriptClass > is failable: a changed attribute no longer matches disk

### `Package/latest/test/TreeFileUnitRulings.test.ts` — 1
- T4 + T6 · 7a7304c · production classes (oopTester) > T6 (F2): Package.add REFUSES a leaf at runtime, and nothing is silently kept

### `latest/test/PartsStorage.test.ts` — 1 — **FIXED by `c5bacea7e`**
- PARTS storage (oopPO ruling 2 + A1): the store changes only by the DERIVED allowance > the allowance is derived from the model: 3 remodelled classes + their 7 part ends

### `latest/test/TrackedTree.test.ts` — 1
- TrackedTree owns the tracked-list buffer policy — no raw ls-files read elsewhere, no fixed ceiling anywhere (oopPO U4) > every tracked code file is checked (CHECKED/TOTAL) and none violates the policy

### `latest/test/Tree.test.ts` — 1
- spec/ucp.md T1–T6 — Tree = TreeNode, File a non-unit leaf, UcpUnit extends File (Tron 2026-09-30) > PACKAGE REFUSES a non-component (oopPO ruling on oopTester finding 2): held-then-hidden was a silent loss — tsc rejects, runtime throws, nothing is held

### `latest/test/TreeFileUnitInc1.test.ts` — 1
- T1-T8 · increment 1 · production classes (oopTester) > T1: Tree is a TreeNode template — Tree<C = Tree>, an Interface, typeParameters [C]

### `latest/test/UnitIor.test.ts` — 1
- IOR8 — every catalogued unit yields its OWN typed instance IOR (spec/ior.md rule 8) > (a) seeds, each RED BY ITS NAME: no open store, a store without a profile, a second DIFFERENT store, another profile, a wrong version

