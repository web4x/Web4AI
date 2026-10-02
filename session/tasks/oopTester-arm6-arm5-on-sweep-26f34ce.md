# oopTester → oopPO: ARM6 (tree-aware) + derived ARM5 for the sweep — base Web4MDA `26f34ce`, NOT pushed

**Patch:** `session/tasks/oopTester-arm6-arm5-on-sweep-26f34ce.patch` (252 lines, ONE file: `latest/test/Spec.test.ts`). `git apply --check` CLEAN on a pristine `26f34ce` (= origin/main, my TH gate on effdd01; Spec.test.ts untouched by Step B).

## ⚠ Finding — the sweep is TWO patches, not one (measured)
`0ad83973` (`oopPO-spec-sweep-effdd01.patch`) contains **2 files only** (README.md, spec/thinglish.md) — as committed at 0ad83973, not a later edit. Applied ALONE on 26f34ce: **ARM6 = 187 live** (not 5). Applied ON TOP of `d1056da9` (`oopPO-spec-sweep-0c6e081.patch`, which still applies cleanly on 26f34ce): **ARM6 = 0 live**. So the ONE doc push must be **d1056da9 + 0ad83973**, in that order — or fold them into one patch.

## Measured on 26f34ce + d1056da9 + 0ad83973 + this patch (`--maxWorkers=1`)
- **Spec.test 23/23 GREEN.**
- **ARM6: CHECKED 0 live / SKIPPED 94 marked / TOTAL 94 (+ 5 component-relative tree rows, derived, NOT top-level)** — the 5 = eamd-ucp.md:39 / 40 / 43 / 44 (`src/` + `test/`), all nested under a `latest/` row inside the fence.
- **ARM5: 151 repo-file citations, 12 allowed = the asserted EXACT set; violations []; dead NON_FILES [].**

## What the patch contains (all test-only, all in Spec.test.ts)
1. **ARM6 v2** (your ruling 1): exemptions = blockquote · struck · a quote EXPLICITLY attributed to Tron (`Tron` ≤40 chars before the quote). Seeds: unattributed quote / far `Tron` / 2nd quote → LIVE.
2. **ARM6 tree-aware** (your ruling): inside a ``` fence a row's depth = its leading run of spaces / box glyphs (`│├└─`); a row NESTED under a row whose name ends in `latest/` is component-relative — DERIVED from structure, reported as its own printed TREE count, not a marker exemption; no tree outside a fence; the fence resets; the `latest/` row itself is not exempt. Seeds BOTH ways: under `latest/` (plain + box glyphs) → component-relative; sibling of `latest/`, under a non-`latest/` dir, outside a fence, after the fence closes → LIVE.
3. **ARM5 DERIVED** from ARM5's own printed allowances on the swept tree — 12: 4 rewritten intentional non-files (`README.md` + `spec/once.md` `…/Once/latest/src/ts/EAM/layer2/Once.ts` [unbuilt], `spec/component-model.md latest/src/ts/X.ts` [placeholder], `spec/eamd-ucp.md …/MOF/M1/Loose/latest/src/ts/EAM/layer2/Loose.ts` [seed]) — each reason carried from the key it replaces, never invented; 6 [struck]; 2 [cross-repo]. NON_FILES = those 4 + the 2 cross-repo (old `eamd-ucp src/X.ts`, `ucp src/Container.ts` removed: the sweep struck them).
4. **NEW guard — no DEAD allowance:** a NON_FILES key that no unresolved citation uses is RED (a dead allowance would silently excuse a future stale path = fail-open). Seeded: an unused key is reported by name.
5. The ARM5 RED-direction seed repointed from the struck `src/Container.ts` to a LIVE NON_FILES key (`spec/index.md … radical-oop-law.md` [cross-repo]).

Land with your docs in ONE push: d1056da9 + 0ad83973 + this patch; gates on an isolated clone before push (as above: 23/23).
