# oopPO: I6 — OOSH lane defects found while I5 awaits Tron (2026-10-06)

**Source:** oopBashExpert's read-only lane check on an isolated clone of `3a2288e` (= local ref `oopTester-item3-gate`). **I5 broke nothing in the OOSH lane.** Everything below PREDATES I5 (present at origin `d729ecd`). Not a blocker for the I5 DONE package; disclosed to Tron as found-during-verification.

**Base for all I6 work:** `3a2288e`, LOCAL, push NOTHING (the I5 chain is still unpushed, awaiting Tron's DONE).

## D1 — generated OOSH scripts cannot dispatch (product defect)
Generated `oo` and `odocker` (`Web4MDA/latest/src/oosh/EAM/layer2/`) lack the top-level entry call that every real OOSH script ends with (`<name>.start "$@"`). Executed directly they define functions and exit 0 doing nothing: generated `oo` usage = 0 lines vs real 58. Proven by a 2nd method: appending only that line restores 58 lines rc 0, diff vs real = only the `$0` path. Suspected (UNVERIFIED) root cause: `M2OoshClass.parse` models functions only and drops top-level statements. **Fix must GENERATE the entry call from the model — never hand-append it.**

## G1 — gate gap: no gate EXECUTES the generated oosh
Lane gates are 30/30 green while the generated script cannot dispatch. Required gate: execute each generated script under REAL `/root/oosh` (no shim) and compare its observable behaviour to the real script (e.g. usage output, a method dispatch). Must be RED on `3a2288e` today.
**Consequence:** README row "OOSH as a generation target — built and gated" is a FALSE CLAIM until D1+G1 land. They land together so the row is true again.

## D2 — OoshUnit reader crashes on undefined optional references (product defect)
Sweep of every moved model class: 33 models → 26 round-trip both ways, **7 THROW a raw TypeError**: Ior, Link, ScenarioUnit, ScenarioIndex, InternetProfile, ObjectKey, RepositoryId. Cause: an optional object reference left undefined (ior, ownerIor, folder, profile, typeId, repositoryId) → `OoshUnit.ts` L83 `JSON.stringify(undefined).replaceAll` → TypeError. Makes spec oosh-mda §4a AC-R4 (round-trip both directions) FALSE for 7/33.
**OPEN, unmeasured — measure BEFORE fixing:** when SET, does an object-valued reference round-trip as the TYPED instance or as a plain object (R2/R4 typed fidelity)?

## Order and owners
1. **oopTester (gates, red first):** G1 (execute generated oosh vs real); D2 as a gate over ALL model classes DERIVED from the catalog (never a hand list of 33); and MEASURE the typed-fidelity question. Prove each RED on `3a2288e`. Publish as a local ref on `3a2288e`.
2. **oopBashExpert (in parallel, read-only first):** verify the D1 root cause in `M2OoshClass.parse`; then fix D1 + D2 on top of oopTester's gate ref. Report; no fix before the gates exist.
3. **oopPO:** isolated-clone verify → package I6 for Tron.
