# oopPO — I1b FULL SPEC REVIEW against `7208df6` (I2–I4c understanding + I5's IOR paths), 2026-10-05

**Method (honest coverage — a review that reports only findings cannot tell NOTHING-BROKEN from NOTHING-EXAMINED):** a HAZARD scan, not a cover-to-cover read. Each class of claim the plan of record (`d729ecd`) + Tron's I4c (`94d2ad8`) invalidates was scanned across every living doc at `7208df6` (git grep on the commit, never a worktree).

| | Count | |
|---|---|---|
| **CHECKED** | 16 | README.md + 15 `spec/*.md` (all living docs) |
| **SKIPPED (by rule)** | 12 | `spec/plans/*.md` — DATED plans of record; rewriting them would falsify what was approved when |
| **TOTAL** | 28 | |
| **CHANGED** | 1 | README.md row 27 (2 paths) — lands WITH I5 |

## Hazard classes and results
1. **`packagedIn` presented as current** (I4c removed it) — 7 mentions in 5 files (component-model, eamd-ucp, mof ×2, thinglish ×2, ucp): **all 7 already struck in place with the I4c reason** (my `94d2ad8`). Clean.
2. **namespace empty / absolute / defaulting to ''** — 0 surviving claims. The fully-qualified ids in ior.md / thinglish.md / scenario.md (`com.ceruleanCircle.Web4MDA.…`) are RENDERED ids of NON-moved classes (Ior, ScenarioUnit, MOF.*) — consistent with a relative stored namespace. Clean.
3. **IOR sub-components at their OLD location** (RepositoryId, ObjectKey, TaggedProfile, InternetProfile, TaggedComponent, SecureTransport, UnknownTaggedComponent; NOT Link, NOT Ior) — **1 hit: README row 27 cites `Web4MDA/SecureTransport/latest/test/…` and `Web4MDA/UnknownTaggedComponent/latest/test/…`** → `Web4MDA/Ior/<Sub>/latest/test/…`. Patch: `oopPO-I1b-spec-review-7208df6.patch`. **MUST land in the SAME commit as I5**: ARM4 asserts every cited path EXISTS, so either side alone is RED.
4. **move() / location / dependency semantics** — component-model rule 7, eamd-ucp rule 4/6, ucp P, mof dependency kind were rewritten by I1 part 2 (`65b5d83`) + I4c (`94d2ad8`); hazard-1/2 scans over the same files found no residue. Clean.

## Residual (not covered by this method)
Prose that contradicts the new understanding WITHOUT using any of the scanned tokens is not caught by a token scan. Mitigations already in force: ARM3 (npm-script names), ARM4 (README status rows derivable from disk), the doc-rot index arm. If Tron wants a cover-to-cover read in addition, it is a fresh-panel task for me after I5.
