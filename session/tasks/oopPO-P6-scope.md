# P6 — the ONE end audit (plans 2026-10-10 S5 + 2026-10-11 P6), oopPO scope, 2026-10-13

**Base:** Web4MDA main `360a7a984` (P2 + P3 + P4 + guard + P5 landed; verified by oopPO on an isolated clone: 900 passed / 2 red = only the two named flaky timing gates; store 0 model-typed IORs, 5675 component-typed).

## Owner split (parallel, independence kept)
| Item | Owner | Rule |
|---|---|---|
| CHAIN SPEED guard (Pipeline) robust under load | **oopBashExpert** | keep the CPU budget (20) UNCHANGED; de-noise the MEASUREMENT (e.g. best-of-N CPU-s of real `npm start` in a child process), never a looser threshold. Seed a genuinely slower pipeline → still RED. One gated commit, push main, sha. |
| MofLayoutAC5 E failable arm (8500 ms timeout) robust | **oopTester** (its file) | same rule: the arm must still FAIL without the resolve witness; fix what makes it slow/flaky, do not just raise the timeout unless measured headroom proves the work is legitimately longer. |
| THE END AUDIT | **oopTester** | every gate named in plan 2026-10-11 rows P2–P5 and 2026-10-10 S5, + whole suite COLD (fresh clone, `npm ci`, customer default PATH) on main AFTER both fixes land; record CHECKED / SKIPPED / TOTAL in `verdicts/`; target 0 RED. |

## Rulings
- **LITPKG′ is OUT of P6** — test hygiene (90 sites / 31 files), not a plan gate; goes to the backlog, does not block Tron's DONE.
- **No gate is loosened to get green** (R1). A fix makes the measurement honest, never the bar lower.
- **Health first:** oopTester is panelled before P6; >60 → plain 2-phase to its marker + LEAN retrain (no fork — Tron's law), then P6.
- **End:** oopPO verifies the audit on its own isolated clone, then Tron reviews `type/com/ceruleanCircle/Web4MDA/MOF/M2/M2AbstractClass/latest/…scenario.json` and rules DONE.
