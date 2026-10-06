# oopTester — I6 MEASURE-FIRST report on 3a2288e (2026-10-06)

**Instrument:** isolated `git clone` of the shared Web4MDA repo, branch `oopTester-I6-gate` = `origin/oopTester-item3-gate` = **3a2288e**; `node_modules` symlinked; shared tree untouched. Probes are throwaway `.mts` files in `/root/.claude/jobs/914c8cad/tmp/` (not committed). Real oosh: `OOSH_DIR=/root/oosh` (set in the suite env too — the OOSH gates RUN, they do not skip).
**Brief:** `session/tasks/oopPO-I6-oosh-lane-3a2288e.md` @ 10f4edc9 + Spec 7 patch `oopPO-I6-spec7-model-json-patch.md` @ 13aafec4.

## 1. G1 RED baseline — the generated scripts cannot dispatch (REPRODUCED)
No-argument run under real oosh (`OOSH_DIR=/root/oosh timeout 30 bash <script>`, cwd /tmp), line count = `grep -c ''`:

| script | REAL | GENERATED |
|---|---|---|
| oo | 59 lines, rc 1 | **0 lines, rc 0** |
| odocker | 68 lines, rc 1 | **0 lines, rc 0** |

(Brief says 58: my counter also counts a last line without a trailing newline — same defect, my number + my method.)

## 2. G1 lossless-parse arm — oracle VERIFIED exact
Oracle: every line of the REAL script that is trimmed-non-blank, not a comment, and **not a function header** must appear (trimmed) in the generated script.
- Naive compare (headers included) = **false RED 48 / 47**: the generator RE-RENDERS function header lines (e.g. `oo.new.method()   # …`). Header fidelity is the round-trip arm's job, so headers are excluded.
- With headers excluded the dropped lines are EXACTLY oopBashExpert's root cause:
  - **oo: 1** — `oo.start "$@"` (entry call)
  - **odocker: 3** — `: ${ODOCKER_WORKSPACES:=$(config get ODOCKER_WORKSPACES 2>/dev/null)}`, `: ${ODOCKER_WORKSPACES:="/var/dev/EAMD.ucp/…/DockerWorkspaces"}`, `odocker.start "$@"`
- A usage-only compare would MISS the 2 config defaults (confirms oopPO's second arm is necessary).

**Script list DERIVED** from the committed generated oosh folder (`Generated.ooshFolder()` = `oo`, `odocker`), never hand-written.
**DRY flag (oopBashExpert's lane, not fixed by me):** `['odocker','oo']` is a literal 3× — `M2OoshClass.generate(…, names = ['odocker','oo'])` L120, `M2OoshClass.start()` L277, `M2OoshGate.test.ts` `NAMES`. No `generate:oosh` step exists in `package.json` at 3a2288e.

## 3. D2 RED baseline — OoshUnit crashes on unset references (REPRODUCED)
Derivation: catalog `concreteClasses()` (88) → live ctor via `Generated.classFile(name,'ts',…)` → keep `ctor.prototype instanceof Model` = **30 models**. `render(new X())` → `parse` → `render`:
- **23 OK, 7 THROW `TypeError: Cannot read properties of undefined (reading 'replaceAll')`** (`OoshUnit.quote`, L83): InternetProfileModel, IorModel, ObjectKeyModel, RepositoryIdModel, LinkModel, ScenarioIndexModel, ScenarioUnitModel — the brief's 7.

### 30 vs 33 reconciled (oopPO ACCEPTED concrete-only)
33 = every catalog class whose live ctor extends Model **including abstract**; the 3 extra = **ItemModel, Model, ModelUnit** (all abstract). They "round-trip" only because JS ignores TS `abstract` at runtime (= the brief's 26 OK = my 23 + these 3). Both rules give the SAME 7 throwers. Ground truth = CONCRETE (an abstract model is never an instance; its attributes are exercised via every concrete subclass). Gate ASSERTS: derived count > 0 AND the derived set CONTAINS the 7 known throwers.

## 4. MEASURE-FIRST — does a SET object reference round-trip TYPED? **NO, on every real path.**
Reference ends DERIVED = catalog relationship ends whose name is a key of the live instance's `toJSON()` (the same rule `OoshUnit.parse` uses for its declared keys) — this excludes `extends X` ends and `containedBy` back-links (e.g. FileServerModel's unnamed `containedBy → DefaultFolder`). Result: **14 reference ends in 8 models**. ALL ends of a model filled at once (one-at-a-time leaves the others unset and the D2 throw MASKS the typed check). Abstract targets built via a catalog-derived concrete subclass (TaggedProfile via InternetProfile, TaggedComponent via SecureTransport).

| path | typed | plain Object |
|---|---|---|
| OoshUnit render → parse | **0 / 14** | 14 |
| JSON TEXT `init(JSON.parse(JSON.stringify(m.toJSON())))` | **0 / 14** | 14 |
| LITERAL `init(m.toJSON())` | 14 / 14 | 0 — **BY ACCIDENT** |

The 14: InternetProfileModel.objectKey, IorModel.typeId, IorModel.profiles[], TaggedProfileModel.components[], ObjectKeyModel.repositoryId, RepositoryIdModel.namespace, RepositoryIdModel.version, LinkModel.folder, LinkModel.ior, ScenarioIndexModel.profile, ScenarioUnitModel.ior, .ownerIor, .links[], .copies[].
- **TaggedProfileModel is NOT one of the 7 throwers** (its collection defaults to `[]`, not undefined) yet decays too → the typed arm must cover the 8 models, not the 7.
- OoshUnit: the referenced component is stored as its JSON `{"model":{…}}`; **the re-rendered TEXT is identical** → a text-equality round-trip gate is GREEN while typing is lost. D2 asserts BOTH (no throw on unset + typed on set). Storage FORM is NOT asserted (by-value vs by-reference is oopPO's fork to Tron).

## 5. SPEC FLAG — a false-green in the Spec 7 text (oopPO's to word; I do not reword)
`toJSON()` hands back the LIVE referenced instances, so the literal `init(m.toJSON())` re-attaches the same objects — nothing crosses a serialization boundary. **AC3 and the new AC12, as worded (`init(m.toJSON())`), are GREEN while the defect exists.** oopBashExpert's "JSON path has the same gap" is TRUE only through text. Ask: word AC3 + AC12 through JSON TEXT (e.g. `init(JSON.parse(JSON.stringify(m)))`). My D2 gate crosses the real text boundary regardless and does not use the literal path as its oracle.

## 6. Next (mine)
Build on `oopTester-I6-gate` (local, push nothing): G1 behaviour arm (generated vs real under real oosh, `$0` normalised) + G1 lossless-parse arm; D2 unset arm + typed arm on BOTH paths (OoshUnit + JSON text); each RED on 3a2288e, each with a satisfiability/failability arm; then report RED counts by pointer.
