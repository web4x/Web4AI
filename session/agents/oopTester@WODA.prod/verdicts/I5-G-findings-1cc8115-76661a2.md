# oopTester — I5 G-gates (1cc8115) + first look at I5b (76661a2) — FINDINGS so far (mirror arm + item 3 + full re-run on I5b NEXT)

*2026-10-05. All on PRISTINE `git clone --no-hardlinks` clones (never the shared tree / oopExpert-wt). Tools committed in AI/Claude `session/tasks/oopTester-I5-*`.*

## ★ NEW DEFECT (not in the I5b dispatch) — 4 OWNED models do NOT follow their component (ruling A / rule 4 b) — still present on I5b `76661a2`
- Measured users (Definition ImportModel text, `oopTester-I5-model-users.py`) and locations:

| model | users at 28523ec AND at 1cc8115 | location at base 28523ec | location at 1cc8115 / 76661a2 |
|---|---|---|---|
| RepositoryIdModel | 1: RepositoryId | `RepositoryId/latest` (WITH owner) | `Ior/latest` — owner at `Ior/RepositoryId/latest` |
| ObjectKeyModel | 1: ObjectKey | `ObjectKey/latest` | `Ior/latest` — owner at `Ior/ObjectKey/latest` |
| InternetProfileModel | 1: InternetProfile | `InternetProfile/latest` | `Ior/latest` — owner at `Ior/InternetProfile/latest` |
| SecureTransportModel | 1: SecureTransport | `SecureTransport/latest` | `Ior/latest` — owner at `Ior/SecureTransport/latest` |
| TaggedProfileModel | 2 (shared) | root `latest` | `Ior/latest` ✔ smallest enclosing Package |
| TaggedComponentModel | 3 (shared) | root `latest` | `Ior/latest` ✔ |

- Ownership did NOT change (each still exactly 1 user = its component) → ruling A: "a component's move() CARRIES the model(s) it OWNS (sole user)". The 4 were placed at the Package (`Ior/latest`), not with their owner. Stored facts are equivalent at both shas (model ns == owner ns, no containedBy) — at the root package the layout puts the model WITH its owner, inside the sub-package it does not ⇒ the ownership placement fails inside a sub-package.
- **Second, independent method (behaviour of move()):** G3/G4 below — `move(X, '')` for every concrete component rehomed **0** units (its sole-user model was NOT carried out with it); the round trip closes only because the model never moves either way.
- **G5 OWNERSHIP ARM (new, `oopTester-I5-g5.py`, whole tree, derived from text):** a model with exactly ONE user that is a component must sit in that user's folder. **base 28523ec: 17 with owner / 0 away (GREEN); 1cc8115: 13 / 4 away (RED by name); 76661a2: 13 / 4 away (RED by name)** — the arm discriminates.
- **Gate edited around it (observation):** I5 rewrote my I4d failability case in `MOF/M1/M1Layout/latest/test/FolderNamespace.test.ts` L105-118: the fixed pair "ObjectKey moves, ObjectKeyModel left behind → RED" became "the FIRST model some component holds (derived)". The fixed pair stopped biting BECAUSE ObjectKeyModel is no longer held by ObjectKey after I5 — the regression above. The new seed is still failable, but it no longer names the pair I5 broke. Fix owner + ruling = yours.

## ★ SPEC — plan L50 "all 8 sub-components" is a FALSE CLAIM (your check), measured at 1cc8115
- L17 "(8 components + models): `Ior` (stays — it is the package), …" = 8 INCLUDING Ior → **7 move** (brief + disk agree: Link unmoved).
- L50 "all **8** sub-components + their models under `Web4MDA/Ior/<Sub>/latest/`": false twice — (1) 8 vs 7 (Ior is not its own sub-component); (2) only **5** have an own `Ior/<Sub>/latest/` (InternetProfile, ObjectKey, RepositoryId, SecureTransport, UnknownTaggedComponent); the 2 abstract (TaggedProfile, TaggedComponent) + all models sit in `Ior/latest/` — as L22 and L50's own parenthesis prescribe for abstract classes. Proposed text = yours (spec lane).

## Gates on 1cc8115 (I5)
- **G1 GREEN** — fresh clone `npm start` rc 0, **0** diff; seed a (class uuid value in RepositoryIdDefinition L15) → 3 entries RED; seed b (held ObjectKey.ts moved off its derived folder) → 2 entries RED. (`oopTester-I5-g1.sh`; my first seed-a target, a `displayName` literal, did not exist = MY instrument confound, re-pointed.)
- **G2 GREEN** — 106 model classes, **CHECKED 416** dependant pairs, **0 mismatched**, SKIPPED-by-name 15 → TOTAL 416 + 15; seed (drop ScenarioUnit from Ior's derived dependants) → **RED by name** `Ior: missing ["ScenarioUnit"]`, rc 1.
- **G3/G4/g1b/guards — I5 DIRECTION** (`oopTester-I5-g3g4.sh`; the I6 script moved X INTO Ior and listed models as subjects = pre-I5/pre-ruling-A, NOT run): the **5 concrete components GREEN** — `move(X,'')` alone changes ONLY X's Definition, all inside the literal; generate relocates 8–10 files; `move(X,'Ior')` + generate → **BYTE-IDENTICAL** to 1cc8115. **g1b GREEN** on the moved-out tree: SrcTypecheck 3/0, 2nd generate 0 diff. **GUARDS GREEN** by own message, 0 diff: itself / cycle (`'UnknownTaggedComponent' is packaged in Ior — a cycle`) / non-component target. **TaggedProfile / TaggedComponent**: `move()` rc 0 and **0 change** — they are abstract UNITS, not components (rehome derives them back into Ior from their users): MY scope error to list them as subjects. **QUESTION for you:** `move()` on a non-component SUBJECT silently succeeds (rc 0, nothing changes) while a non-component TARGET throws — refuse it too?
- **G5 placement arms GREEN** — derived MOVED set 13 == NAMED 13 (7 components + 6 models); 0 files of moved classes outside `Web4MDA/Ior/`; 0 in `Web4MDA/latest/`; Link 0 changed lines, not relocated. **G5 OWNERSHIP RED** (above).
- **G6** — suite 641 = 633/6/2 vs base 641 = 639/0/2: total reconciles, the 6 reds named (interim file 51d0ecab). Changed-file audit 28523ec..1cc8115 (`oopTester-I5-g6-audit.py`): 172 files = GENERATED 108, RENAME-EDIT 36, HELD/TEST 11, DEFINITION 2, RENAME-PURE 2, SPEC 1, OTHER 12. Content changes beyond import/namespace lines are the I5 MECHANISM (named): `M1Catalog.ts` (+11, the in-hand edits), `M1Layout.ts` (+14) + `M1LayoutDefinition.ts` (+24), `UcpComponent.ts` (+22) + `UcpComponentDefinition.ts` (+42, rehome), `FolderNamespace.test.ts` (+15, above). The `src/thinglish/*.thing` hits are generated Thinglish — MY audit regex missed that language dir (instrument gap, fixed in the I5b re-run); the 12 OTHER = relocation D/A pairs of moved files + regenerated .thing.
- **G7 (atomic generate, re-seeded for I4c — the I6 seeds inject the removed `packagedIn` = confound, NOT run):** EMPTY namespace → refused rc 1, tree untouched; **MIXED** (a VALID RepositoryId move + an empty ObjectKey namespace in the SAME generate) → refused rc 1, **tree untouched — the valid relocation did NOT happen** (atomic). CYCLE: running.

## Next (your order)
On I5b `76661a2`: the MIRROR arm (disk edited outside persist → load() must reflect DISK), item 3 = ONE measured rule (3rd 2500 ms timeout), G1–G7 + arms re-run, my gate commits stacked on `76661a2` (homes() fix, OneStore, mirror arm, G5 ownership arm), then your isolated-clone verify.
