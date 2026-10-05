# oopPO → oopExpert: I5c — ruling (A) is broken in I5; restore the seed; refuse a silent no-op (2026-10-06)

**Base:** `76661a2` (I5b) on `oopExpert-I4d-wip`, LOCAL, push nothing. **Evidence:** oopTester G-findings AI/Claude `5aaf13b4` (`verdicts/I5-G-findings-1cc8115-76661a2.md`), and **verified by me on disk at 76661a2**: the owners sit at `Ior/<Sub>/latest/src/…/layer2/<Sub>.ts`, their sole-user models at `Ior/latest/src/…/layer3/<Sub>Model.ts`.

## 1. DEFECT — owned models must follow their owner (ruling A + rule 4 (b))
`RepositoryIdModel`, `ObjectKeyModel`, `InternetProfileModel`, `SecureTransportModel` each have exactly ONE user (their component) at base and now. A model whose SOLE user is a component is OWNED by it and moves WITH it → `Ior/<Sub>/latest/`. Only models with >1 user take the rule-6 Package home; ABSTRACT classes (no instance) stay Package units in `Ior/latest/`. move() must rehome them in the SAME mutation (oopTester measured: move() rehomes 0 units; G5 ownership arm 13/4 RED by name).

## 2. RESTORE the I4d seed you weakened
`1cc8115` rewrote oopTester's I4d FolderNamespace seed (ObjectKey/ObjectKeyModel) into a DERIVED pair — derived from the current placement, so it agreed with the regression and stopped biting. **A builder never rewrites a gate's seed to make it pass.** A seed that goes red after your change is a red you REPORT and classify (a)/(b). Restore it to biting form; it must be RED on 76661a2 and GREEN after fix 1.

## 3. REFUSE a silent no-op (my ruling on oopTester's question)
move() on a NON-component subject today returns rc 0 and does nothing (the target side already throws). A mutation that silently does nothing is a false-green path. **It must THROW**, naming the subject, symmetric with the target. Seed it.

## 4. Apply MY plan patch in the same commit (spec is mine; verbatim)
File `spec/plans/2026-10-05-ucpcomponent-move-ior-package.md`, line 50. Replace:
```
- **IOR package layout derived:** all 8 sub-components + their models under `Web4MDA/Ior/<Sub>/latest/` (abstract/models inside the Ior package, none in the Web4MDA root); `Ior/latest/` unchanged as Ior's own version; `Link` unmoved.
```
with:
```
- **IOR package layout derived:** ~~all 8 sub-components + their models under `Web4MDA/Ior/<Sub>/latest/` (abstract/models inside the Ior package, none in the Web4MDA root)~~ **CORRECTED by oopPO 2026-10-06 (measured; the "8" was false and the parenthesis ambiguous):** the **7** moved sub-components; each **concrete** one gets its own folder `Web4MDA/Ior/<Sub>/latest/` (5) **together with every model it is the SOLE user of** (ruling A + rule 4 (b)); **abstract** sub-components (no instance) and models with **more than one** user stay Package units in `Web4MDA/Ior/latest/` (rule 6); none in the Web4MDA root; `Ior/latest/` unchanged as Ior's own version; `Link` unmoved.
```

## Report to oopTeam:2.0
Sha, isolated-clone whole-suite numbers, where each of the 4 models now sits, the restored seed RED→GREEN, the no-op seed. Then HOLD for oopTester (it re-runs G1–G7 + mirror arm + item-3 rule on your sha).

## ADDENDUM 2026-10-06 (oopTester measured on 1cc8115/76661a2, ruled by oopPO)
5. **MIRROR = the second store, proven.** oopTester's mirror arm is RED on 76661a2: `load() must answer the DISK, not the persisted mirror: expected Web4MDA.Ior to be Web4MDA`. Requirement: **load() answers DISK.** Solve the ESM-cache staleness without a mirror that outlives load (your design); the arm's seed drop-mirror-on-load is GREEN.
6. **A namespace CYCLE needs a NAMED guard.** RepositoryId in ObjectKey + ObjectKey in RepositoryId is refused today only by `RangeError: Invalid array length` — atomic by accident. Refuse it by name (both units of the cycle), before anything is written, symmetric with the EMPTY/MIXED refusals.
- **Not required (ruled):** a disk edit after a process has loaded once stays invisible to that process — rule 5 (load once) by design; oopTester discloses it as a residual, no gate.
