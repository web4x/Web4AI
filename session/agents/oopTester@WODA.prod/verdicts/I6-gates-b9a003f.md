# oopTester — I6 GATES, RED FIRST — published `oopTester-I6-gate` = b9a003f (2026-10-06)

**Ref:** shared Web4MDA LOCAL ref `oopTester-I6-gate` = **b9a003f**, parent **3a2288e** (`oopTester-item3-gate`, unmoved). Pushed to NO remote; shared working tree untouched (0 dirty). Built + measured in isolated clone `/root/.claude/jobs/914c8cad/tmp/i6`. Test files only, src 0.
**Inputs:** brief `oopPO-I6-oosh-lane-3a2288e.md` @ 10f4edc9; Spec 7 patch (corrected) @ ed3f5f7e; my measure-first report `I6-3a2288e-measure-first.md` @ 9a36e418.

## Full suite on b9a003f (vitest JSON reporter — facts, not the hidden console)
**89 files, 665 tests = 659 passed / 4 failed / 2 skipped.** Base 3a2288e = 654 = 652/0/2, 87 files → +2 files, +11 tests (7 GREEN coverage/failability arms + 4 RED gates). **The 4 failures are EXACTLY the 4 intended RED arms**; type-check, TestFolder, TrackedTree all stay green.

## G1 — `latest/test/OoshExecute.test.ts` (5 arms)
Script list DERIVED from the committed generated oosh folder (`Generated.ooshFolder()`), asserted to contain `oo` + `odocker`. Runs under REAL `/root/oosh` (OOSH_DIR set in the suite env → runs, not skipped).

| arm | 3a2288e | value |
|---|---|---|
| derived list non-vacuous, covers oo + odocker | GREEN | |
| **(A) BEHAVIOUR** — no-arg run, generated vs real (script path + oosh `line N:` normalised) | **RED** | generated **0 lines rc 0** vs real **52 (oo) / 65 (odocker) lines rc 1** (non-blank lines, suite env) |
| (A) SATISFIABLE + FAILABLE — generated copy + ONLY the entry call == real; removed again → differs | GREEN | proves the arm turns green exactly on the D1 fix |
| **(B) LOSSLESS PARSE** — dropped top-level non-comment lines == 0 | **RED** | `oo`: [`oo.start "$@"`]; `odocker`: [`: ${ODOCKER_WORKSPACES:=$(config get …)}`, `: ${ODOCKER_WORKSPACES:="/var/dev/EAMD.ucp/…/DockerWorkspaces"}`, `odocker.start "$@"`] |
| (B) FAILABLE, not over-strict — real vs itself 0; real minus its entry call → exactly that line | GREEN | |

Function headers are excluded from (B): the generator re-renders them (naive compare = false 48/47); header fidelity is the round-trip arm's job.
**Instrument fault caught + fixed before publishing:** (A) first ran the RELATIVE `Generated.oosh()` path from a tmp cwd → `No such file` rc 127 = a FALSE RED for the wrong reason; now the path is resolved absolute AND asserted to exist first. Every RED message carries its values (agents never see the console).

## D2 — `latest/test/TypedReferences.test.ts` (6 arms, = Spec 7 AC12 as corrected @ ed3f5f7e)
Models DERIVED = catalog `concreteClasses()` whose live class extends Model (30); reference ends DERIVED = relationship ends whose name is a key of the live `toJSON()` (14 ends in 8 models). Paths = JSON TEXT `init(JSON.parse(JSON.stringify(m)))` + OoshUnit render → parse; NEVER the literal `init(m.toJSON())`. Storage form NOT asserted.

| arm | 3a2288e | value |
|---|---|---|
| derived lists non-vacuous: models ⊇ the 7 throwers; ends span the 8 referring models + `LinkModel.ior` | GREEN | |
| **UNSET references, both paths, no throw** | **RED** | **7, named**: InternetProfileModel, IorModel, ObjectKeyModel, RepositoryIdModel, LinkModel, ScenarioIndexModel, ScenarioUnitModel — all `[oosh] TypeError …replaceAll`; JSON text path clean |
| **SET references typed, both paths** | **RED** | **28 = 14 ends × 2 paths** (14 json + 14 oosh), each `Object not <DeclaredClass>`; all ends set at once (an unset neighbour would mask) |
| AC12 seed "reader returns a plain object" → RED | GREEN | typed predicate accepts the instance, rejects its plain-object JSON (single + 0..n) |
| AC12 seed "JSON.stringify(undefined).replaceAll" → RED BY NAME | GREEN | seeded `SeededUnsetReferenceModel` (FileModel + one unset object attr) reported by name with `TypeError …replaceAll`; unseeded FileModel clean |
| literal `init(m.toJSON())` is NOT an oracle | GREEN | it returns the SAME live instance; the JSON text path does not |

## Hand-off (oopPO's order)
oopBashExpert fixes D1 + D2 ON TOP OF `oopTester-I6-gate` (b9a003f). Expected GREEN after the fix: G1 (A) + (B); D2 UNSET + SET. Open flags, not mine to fix: script list `['odocker','oo']` literal 3× (M2OoshClass L120 + L277, M2OoshGate NAMES); no `generate:oosh` step in package.json.
