# P2b re-classified under eamd-ucp rule 7a (ONE ROOT = EAMD.ucp)

*oopBashExpert@WODA.prod for oopPO — RE-PLAN STEP 1 (analysis + doc only, NO code). 2026-10-12.*
*Base: preserve `30ee919ad` (origin/preserve/oopBashExpert-p2b) vs P2a `cb221965f`; target: origin/main `985e23841` (rule 7a). Every fact below was measured on disk with git; nothing from memory or scrollback.*

## 0. The law being applied (rule 7a, `985e23841`, read verbatim)

`EAMD.ucp/` is the ONLY root; `EAMD.ucp/Components/` holds the namespaces as folders; a UcpComponent's folder is itself a namespace segment; **a namespace is READ from its folder path below `Components/` — never computed from class names, never "found" by prefix.** Supersedes D1 and AC9.

Classification key:
- **KEEP** = consistent with 7a as it stands.
- **DROP** = computes or finds a root from classes.
- **REWORK** = the intent is right; the source must become the folder path.

## 1. Two measured facts that drive the whole re-plan

**F1 — the P2b DATA is already 7a; only the DERIVATION is wrong.** Across all 106 model `*Definition.ts` that declare a `component`:

| Ref | `component` equal to its folder path below `EAMD.ucp/Components/` |
|---|---|
| P2b `30ee919ad` | **106 / 106** — e.g. `Link/latest` is `com.ceruleanCircle.Web4MDA.Link`, which is `Components/com/ceruleanCircle/Web4MDA/Link` |
| P2a `cb221965f` (= main) | **0 / 106** — e.g. `Web4MDA.Link` |

The migration wrote exactly the values 7a demands. What 7a forbids is how P2b *finds and checks* the root: D1.

**F2 — P2a's root is class-derived too, so it is not a safe base.**
- **P2a**, `M1Catalog.packageModel()`: "the one class whose `namespace === name`".
- **P2b (D1)**, `M1Catalog.packageModel()`: "the one class whose `namespace.name` prefixes every other namespace". It also refuses "found 0" by name.

Both compute the root from classes. Both `packageQualifiedName()` versions sit on top of `packageModel()`:
- P2a: `packageModel().namespace`
- P2b: `Mof.key(pkg.namespace, pkg.name)`

So `packageQualifiedName()` itself is **REWORK** in *both* versions. The P2b value `com.ceruleanCircle.Web4MDA` is right; the method that produces it is not.

**A 7a reader already exists.** `M2ThingClass.packageFolderNamespace(c)` (on main) reads the folder trail below `Components/`:
```
names.slice(start, pkgFolder + 1).join('.')
```
It still locates the package folder by `layoutOf().packageName`, which comes from the class-derived `packageModel()`. So the mechanism is 7a, but one identity it uses is not.

## 2. Classification — every P2b change, plus P2a's `packageQualifiedName()`

### 2a. Model and source logic

| # | Change (where) | Verdict | Why |
|---|---|---|---|
| S1 | `M1Catalog.packageModel()` → D1 prefix-finding + "found 0 refused by name" (`49ed28e1d`, `30ee919ad`) | **DROP** | Finds the root from classes by prefix, which is exactly what 7a forbids. Under 7a there is no "find the root" step, so there is nothing to refuse "found 0" for. |
| S2 | `M1Catalog.packageQualifiedName()`: P2a `packageModel().namespace` / P2b `Mof.key(namespace,name)` | **REWORK** | The value (`com.ceruleanCircle.Web4MDA`) is right. The source must become the package component's folder path, READ below `Components/`. P2a's R1 intent — ONE method every reader asks, no `slice(1)`, no literal — is DRY and compatible with 7a, so keep it as "the ONE reader of the folder-read root". ⚠ R1 sat in the paragraph `985e23841` struck as a whole; **oopPO to confirm R1 survives 7a.** |
| S3 | Data migration: 106 `namespace`/`component` literals now carry the full folder path (`49ed28e1d`) | **KEEP values / REWORK authority** | The values are 7a (F1, 106/106). But a hand literal that must equal the folder is a second copy of the folder fact. Either gate it, or remove it (see Q2). |
| S4 | 428 generated `src/<lang>` files + 5,724 scenario-store files (`49ed28e1d`, plus small regenerations in `7ebf52518` / `0e82a0deb` / `30ee919ad`) | **REGENERATE — don't carry** | These are derived output. Carrying them across a rebase by hand risks a stale or partial tree. Re-run `npm start` on the rebased branch and commit what it prints (the "gen/ deletions" check applies). |
| S5 | `ClassModel.sourceUnit` "package AT root" exemption: `namespace.name === packageQualifiedName → name` (`7ebf52518`) | **REWORK (keep logic)** | 7a: a UcpComponent folder is a namespace segment, so the package sitting at its own root is correct. It must compare against the folder-read root (S2), not D1. |
| S6 | `M1Layout.populate`: `Namespace.declare(catalog.packageModel().namespace, …)` replaces the literal `'com.ceruleanCircle'` (`49ed28e1d`) | **REWORK** | Killing the literal is right. But the parent of the package folder is the folder trail itself (`com/ceruleanCircle`), not `packageModel()`. |
| S7 | `M2ThingClass.namespaceOf`: `above = rooted.slice(0, rooted.length - qualified.length)` (on main) | **REWORK → simplify** | Once namespaces ARE folder paths, `above` is always empty (the code comment says so). `namespaceOf` becomes "the folder path", and `packageFolderNamespace` stops locating the package by a D1-derived name. |
| S8 | `UcpComponent.move`: `model.namespace = target === '' ? packageQualifiedName() : …` (P2a, on main) | **REWORK (flag)** | Under 7a a namespace is *read* from the folder, so a move must be a **folder move**. A written `namespace` can only be a checked copy of the new path. This touches backlog row F (UcpComponentMove ×2). |
| S9 | P2a: 5 hand-typed Ior registry keys now derived from `packageQualifiedName()` (`cb221965f`, on main) | **KEEP** | No literal; the value follows the root once S2 is reworked. |

### 2b. Tests (groups A–I) and their oracles

| # | Commit | Verdict | Why |
|---|---|---|---|
| T1 | `PackageRoot` oracle (D1 from DATA) used by group A (`cb3958ee5`: MofLayout, MofLayoutAC5, M1Graph), C (`7ebf52518`: M1Layout), B (`c03545cae` FolderNamespace, `2959824c2` OwnedModelPlacement + MirrorDisk), I (`fa46d4b3f`: M3Class), E (`30ee919ad`: NamespacePlacement) | **DROP the derivation · REWORK into ONE folder oracle** | `PackageRoot` = "the class whose `namespace.name` prefixes every namespace", i.e. D1 again. **Keep the intents:** the oracle never asks the code under test; drop ALL root segments, never one; package at root by rule; every proof arm is RED by name. Under 7a the oracle can read the root from the **disk folders below `EAMD.ucp/Components/`** (ls-tree / fs). That is *more* independent of the catalog than `PackageRoot` ever was. |
| T2 | `d51507482` group D (WIP, "NOT consistent — preserve only"): `CarrierAudit.packageName` re-derived by D1 from loaded carriers | **DROP** | Pure D1. |
| T3 | `0e82a0deb` group D: S4b carrier — the package keys as its QUALIFIED name (package-at-root exemption in `owners()`) | **REWORK** | Keying by qualified name is right; the qualified name must be folder-read (S2). |
| T4 | `10b24f44b` group D: R7b class links — the `type/` folder derived from the catalog, not the old `'type/Web4MDA/'` literal | **KEEP** | Derives from the class's model namespace, which equals the folder path (F1, gated by G7a below). No root-finding involved. |
| T5 | `e84d12740` group D: IOR prefixes + seeded UNLOADED ghost name derived from the catalog | **KEEP** | Reads model namespaces, not a found root. |
| T6 | `7651788b5` group G: Ior.test names the class by its MODEL namespace (data; never a hand root, never `packageModel`) + proof arm (old bare-root IOR is RED) | **KEEP** | Same reason as T5. |
| T7 | `6036e59c1` group E: "below the package" measured against the QUALIFIED name, not the first segment (StoreOutputRoots, TreeFileUnitRulings) | **REWORK** | The intent (all segments, never one) is consistent with 7a. "Below the package" = below the package **folder**, read from the path. |
| T8 | `TwoRoots` test (M1Catalog.test) **+ my pending TwoRoots→StrayRoot rename** | **DROP** | Models "two roots found by prefix". Under 7a a second root is **unrepresentable** (one `EAMD.ucp/` folder), and unrepresentable beats gated. The rename becomes moot; I will not do it. |
| T9 | AC9 arms (`slice(1)` / drop-one-segment bans) | **DROP** | AC9 is struck. Its hazard (a namespace computed by arithmetic) is covered by G7a. |

## 3. Proposed rebased P2b scope onto `985e23841`

**P2b′ = "the namespace is READ from the folder"**, in this order, each a gated commit:

1. **ONE folder reader.** A single method that reads a namespace from a path below `EAMD.ucp/Components/`, generalised from the existing `packageFolderNamespace` trail logic. The owning class is open (Q1).
2. **`packageQualifiedName()` := the package component's folder path, read** (S2). `packageModel()` becomes "the component whose home folder is that folder", or retires (Q3). D1 (S1) is not carried.
3. **Carry the namespace values** (S3, 106/106 already 7a) **plus a new failable gate, G7a:** every model's declared `namespace`/`component` equals its folder path below `EAMD.ucp/Components/`.
   - Proof arm: seed one mismatch → RED by name.
   - Proof arm: seed a folder outside `Components/` → RED.
4. **Rework the readers to the folder-read root:** S5 (sourceUnit), S6 (populate), S7 (namespaceOf / packageFolderNamespace collapse), T3 (carrier keys). S8 (move = folder move) is flagged into row F rather than done here (Q5).
5. **ONE folder oracle** (T1) replaces every `PackageRoot`. It reads disk folders, never the catalog. The group A/B/C/E/I tests re-point to it with their proof arms intact.
6. **Keep as-is:** T4, T5, T6, S9. **Drop:** S1, T2, T8 (incl. the StrayRoot rename), T9.
7. **Regenerate** (S4): `npm start` on the rebased branch; commit exactly what it prints; check `src/` for deletions before commit.

**Not P2b′ (re-scope note for rows F / J / K):**
- **F** (UcpComponentMove ×2) inherits S8.
- **J** (M2ThingClass, stale ThinglishTarget `.thing`) overlaps S7, so it is cheaper after P2b′.
- **K** (M2ThinglishClass ES2020, GenClaims 32v31, Spec ARM7) has no observed 7a dependency.

**Rebase mechanics:** `985e23841` is spec-only (`eamd-ucp.md`, `index.md`, `mof.md`), so the code base is P2a. P2b′ should be **re-applied** onto `985e23841` in the order above, not rebased commit by commit. Of the 13 P2b commits, only the test bodies of T4/T5/T6 and the S3 values carry over as-is. `30ee919ad` stays preserved on origin as the reference.

## 5. RULINGS (oopPO, 2026-10-12, on `a66a20e4`) — these govern P2b′

- **Q1 → the Namespace (Folder) owns it:** a DERIVED `qualifiedName` getter walking `parent` up to `Components`, the same mechanism as rule 1's path/breadcrumb.
- **Q2 → END STATE = derive; REMOVE the stored literals** (rule 1: no model stores a path). G7a seeded RED is the *transitional* proof; regeneration must be byte-identical.
- **Q3/Q4 → PROVISIONAL (oopPO asked Tron):** keep `packageModel()` as the UcpComponent whose folder holds the running catalog, SELF-LOCATED from the catalog's own module location — never by class prefix.
- **Q5 → folder-move stays in row F** (not P2b′).
- **Q6 → R1's principle survives** (ONE reader, now folder-derived; rule + data change atomically when the literal is removed). Its D1 half is gone. oopPO restates it in spec.
- **Order ACCEPTED:** re-apply onto `985e23841` (not rebase). Start with P2b′ step 1, the folder reader.
- **Slice laws:** preserve per chunk · never force · fresh-clone whole suite · push · STOP for the SM panel.

## 4. Open questions — oopPO / Tron rule, I do not invent (ANSWERED in §5)

- **Q1** Which class owns "read a namespace from a folder"? Candidates: `Namespace`, `M1Layout` (it already owns the trail), or the UcpComponent folder itself ("the object owns its answer").
- **Q2** Keep the per-model `namespace`/`component` literals (gated by G7a), or remove them and derive at load (single source = the folder)? DRY favours remove; gate-first is the smaller step.
- **Q3** `packageModel()` under 7a: keep it as "the component at the package folder", or retire the concept?
- **Q4** How is **"the package folder"** itself identified under 7a, without finding it by class prefix? Candidate: the component folder that holds the running catalog's own `latest/` (self-located), i.e. today `EAMD.ucp/Components/com/ceruleanCircle/Web4MDA`. This needs a ruling.
- **Q5** S8: does P2b′ include making `move` a folder move, or does that stay in row F?
- **Q6** R1 (the ONE `packageQualifiedName()` reader) lived in the paragraph `985e23841` struck. Confirm it survives 7a.

*Measurements: `git log`/`--name-status cb221965f..30ee919ad` (13 commits; `49ed28e1d` = 109 source + 3 test + 428 generated + 5,724 store files; the other 12 small, mostly test-only); per-definition `component` vs folder-path comparison at both refs (106 files); `M1Catalog.ts` `packageModel`/`packageQualifiedName` read at `cb221965f`, `30ee919ad`, `985e23841`; scenario units 686ef429 / 4205ac70 / 3bf00e45 / 87435b62 / a9a257dc read at `30ee919ad`; `PackageRoot` read in MofLayout.test.ts @`30ee919ad`; `packageFolderNamespace` read @`985e23841`.*
