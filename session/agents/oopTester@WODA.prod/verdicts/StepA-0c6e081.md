# Verdict — Thinglish **Step A** (grammar: G1 modifiers, G4 kind keywords, G5 held) on Web4MDA `0c6e081` — **QA-GREEN**; cold default rc=1 = the known AC6 timeout INSTRUMENT (disclosed), serial rc=0

Gated by oopTester@WODA.prod, 2026-10-02, on oopPO's order. Candidate `0c6e081` = origin/main, parent `0a5eea4` (plan of record), tree `5447923`. Isolated `git clone --no-hardlinks`; nothing written to the live tree.

## Verbatim (measured, not taken from the report)
oopPO's spec patch (`eb19e1bb`) + my SC8 patch (`22fbe36d`) applied to `0a5eea4`, diffed against `0c6e081` for `spec/thinglish.md` + `ThinglishGrammar.test.ts`: **0 diff lines**. Commit touches 18 files: those two + oopExpert's `ThinglishGrammar` model (definition + every generated target).

## Arms on the SHIPPED model — `ThinglishGrammar.test.ts` **13/13**
- **G1 + G4:** 13 modifier / kind keywords, (keyword, element) pairs **CHECKED 18 / SKIPPED 0 / TOTAL 18**, each resolved on its own row's model in the catalog; element/model pairing cross-checked against the table's element rows.
- **declared `ThinglishGrammar.modifiers` == derived map** (spec rows × catalog) — exact.
- **G5:** held = `TypeAliasModel`, `ImportModel.isTypeOnly` — both exist in the catalog, no keyword reaches them.
- SC8 one-source (model ebnf == the spec block) GREEN; clause-2 exactly-one (mapped / held / instance / modifier) GREEN; alignment-independent failable seeds apply (no no-op).

## Seeds on the shipped implementation — each RED by its named guard, residual 0
| Seed | RED by |
|---|---|
| M1 `async` missing from `modifiers` | exactly-one · declared map |
| M2 `abstract` ALSO mapped as an element | exactly-one · G1 (modifier is never an element) |
| M3 `private` → invented `M3Method.isPrivate` | declared map |
| M4 `references` unmapped | exactly-one · declared map |
| M5 `readonly` → held `M3Import.isTypeOnly` | declared map · G5 held |
| S6 spec: stale held row (`isTypeOnlyX`) | G5 held |
| S7 spec: attribute row on the wrong element | G1 cross-check · declared map |

## Cold, isolated, default PATH
| Run | Result | load1 |
|---|---|---|
| `npm test` default | **rc=1** · 562 passed / **2 failed** / 2 skipped = 566 | 3.83 → 5.51 |
| `npx vitest run --maxWorkers=1` | **rc=0** · 564 passed / 2 skipped = 566 · 0 failed | 5.51 → 2.63 |

Both failures = `Test timed out in 2500ms` on **M1Layout AC6 conformance + AC6 is-failable** — the timeout class measured in `verdicts/timeout-class-c41c2a8.md` (concurrency; budget kept). Removing concurrency → rc=0, so no correctness red hides in it this run. Part 0 (de-concurrent fix) is still in flight; until it lands, every default cold run can carry this red. · **AC3 46/46** by name · tsc test config **0** errors · `npm start` rc=0, **zero diff**. Count 562 → 566 = my 4 new SC8 arms.

## Verdict
**QA-GREEN on Step A** — the grammar of record (modifiers per member kind, relationship kind keywords, `redefines`, `block`, TypeScript-shaped params) is one source with the spec; every modifier / kind keyword maps to an attribute of an existing M3 element and to nothing else; the held facts are held. Every arm proven failable on the shipped code. **Disclosed:** default cold rc=1 = AC6 timeout instrument (serial rc=0). Evidence `/tmp/oopTester-sa` (ephemeral, removed).
