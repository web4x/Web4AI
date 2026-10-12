# oopPO DRIVE — current plan to DONE, then the next plan (2026-10-11)

**Authority (TRON, verbatim):** 2026-10-10 *"WORK THE PKAN OFF!!! let the sm monitor!!!"* · 2026-10-11 *"continue on what you did when the limit hit. finish it and take into account what you just found. plan the current and next plan diligently and drive them till done monitored by sm"* · on the next plan: *"do not mark the current plan as paused. add yours as next plan"*.
**Supersedes** `oopPO-S3-resume-GO-20261010.md` for everything not yet shipped (its OVERRIDE, laws and Done-line still hold).
**Roles:** oopPO ranks + rules + specs, never builds. Experts build in their OWN clone. oopTester gates. **SM monitors health** (fresh panel at every push; panel + next slice > 80 → rewind at that boundary, trainer drives). **TRON rules DONE.**

## Laws in force for everyone (each one was paid for)
- Gate on an **isolated clone of the exact sha** you name, never the shared live tree.
- **Never push behind an unread test run**; never run a gate and its push in parallel calls.
- On an expected-red file, compare **WHICH** tests fail, never just red-vs-green.
- `otmux send.raw` only (never C-u); read the target composer first; verify delivery by capture/transcript.
- Report every gate as **CHECKED / SKIPPED / TOTAL**; seeds RED **by their named guard**.

---

## A. CURRENT plan — `spec/plans/2026-10-10-subscenarios-by-ior.md` (runs to its end UNCHANGED)

Shipped + gated: S0, S1, S2, S3.1–S3.3, S4a, prune+O1, F-B/C/D/E. Spec for S4b/S4c on origin `052a1de9`.

### A1 — S4b: oopBashExpert finishes its clone (carrier 8a93787e, rebase onto origin main)
Its triage at the limit: M1Catalog reds ~18 → 3, IorAcceptance/MofLayoutAC5/MofPlainNode/Thinglish green. **oopPO rulings on its four flagged items — MINIMAL: the NEXT plan's P5 removes S4b's carrier special cases, so make it green and correct, do not polish what P5 deletes:**

- **R1 — realise vs derived links:** links under `<Component>/latest/model/scenarios/` are **store OUTPUT, not held sources**. A move/realise must not be blocked by them: the old component's derived-link subtree is removed and the store **regenerates** the links at the new place (the S3.3 O3 law: the store EQUALS the model, a regeneration that leaves stale links is RED). Do NOT teach realise to treat derived links as sources.
- **R2 — "spec 13 §4 allowance":** NO spec change. scenario.md §4 = `NodeJSFile` stays the ONLY `node:fs` user; every link goes through `DefaultFile.link()`. Route the S4b relink through the owning class; the allowance gate stays as it is and must be GREEN by construction.
- **R3 — the extra `Web4MDA/` folder:** it IS layout B — for the package class, Component = Web4MDA and Class = Web4MDA, so `Web4MDA/latest/model/scenarios/Web4MDA/<PartType>/…` is correct. **The ORACLE is wrong, not the layout:** an oracle that finds anchors by name must search HELD SOURCES only (derived from the layout), never the derived link folders. Fix the oracle; seed a duplicate SOURCE → still RED by name.
- **R4 — 1793 misnamed links (scratch package under placeholder `X/`):** a test bug. The scratch `packageHome` must mirror the REAL domain path, **derived from `M1Layout`, never a hand-written `com/ceruleanCircle`** (the next plan's P2 deletes that literal — do not add another).

Then: whole suite on a fresh clone, READ (CHECKED/SKIPPED/TOTAL), path-limited commit, push ONE green slice, sha to oopTeam:2.0.

### A2 — oopTester gates S4b (checklist `f68917d2` + N1 conditions)
Seeds RED by named guard incl. R1 (stale link after a move → RED), R3 (duplicate source → RED, link folder ignored), R4 (no `X/` placeholder); N1 mechanism gate + coarse load-guard ratio.

### A3 — F-A: oopBashExpert re-derives the 5 store-walking wall budgets (2.5× full-load max at S4b's FINAL store cost). Gated by oopTester.

**STATUS 2026-10-12 (oopPO, measured):** A1 + A3 ON MAIN `f707537f` (`514e7215` S4b + (c), `f707537f` A3 = 20 derived arms; censored pair measured uncensored IOR2 9871→25000, AC5 9381→24000). oopPO isolated clone: 98/98 files, 821 pass / 2 skip / 0 fail. **A2 GREEN** — oopTester verdict `2bbeef2c` (21/0/21, 13 seeds RED by name, 8 controls). Two boundary rewinds taken at bank points (oopBashExpert 74→47, oopTester 79→55), nothing lost.

### A3b — FIX SLICE F1–F4 (oopTester findings, BEFORE S4c — S4c must not build on these gates). Builder **oopBashExpert** (SM fresh panel 60.0, slice ~+15 → ~75, no rewind; oopExpert 78.1 would need exit+refork).
- **F1** R7b fs-caller gate alias-evadable → detect by RESOLVING `node:fs` import bindings, never name-match; seed aliased call → RED by name.
- **F2** (c) skip fail-open → skip ONLY the exact M1Layout-derived scenarios location; assert SKIPPED == derived count; rogue dir → RED by name.
- **F3** false claim `M1Catalog.test.ts:686–687` + stale 571/572.
- **F4** load-ratio false-RED 1/6 → diagnose; never loosen blindly; derived threshold or the N1 mechanism gate; seeded slowdown REDs AND 10 clean runs 0 false-RED.
Then oopTester re-gates the fixes + their seeds.

### A4 — S4c (domain on the package model; index reaches it by its own package IOR; interim root deleted; refuse, never guess) — MUST land before S5.
Builder chosen by **measured** SM panel at A2-green: oopExpert designed it (idle at 77.5, floor ~60 → if it builds, **exit+refork** to beat the floor, phase-1 pushed + composer rescued first; NOT a floor rewind), else oopBashExpert if its panel allows. Built minimal — P5 removes the `domain` attribute and the `package` end again.

### A5 — S5 plan-end audit (oopTester): every S1–S4 seed RED by name then GREEN; whole suite twice in real clones, porcelain identical; GarbageSweep 0; verdict file.
### A6 — oopPO re-runs the whole suite on its own clone of the final sha → brings the CURRENT plan to **TRON for DONE**.

---

## B. NEXT plan — `spec/plans/2026-10-11-namespace-root-and-component-typed-iors.md` (APPROVED by Tron 2026-10-11; starts when A is DONE)

- **B0 = P0 (oopPO, NOW):** the plan lived only on branch `claude/laughing-fermi-rsu7tf` (`2ab6dc4c`, `8c0009f0`) — not landed. Land it on main (fast-forward over `052a1de9`) after the doc gates pass on an isolated clone. Touches only a NEW plan file + one index row, so it cannot disturb A.
- **B1 = P1 (oopPO, AFTER A is DONE — never before):** strike-and-correct the 10 spec places (measured sweep first, CHECKED/CHANGED/TOTAL; doc gates + whole suite before push). Waits for A because two of the ten are the CURRENT plan's own rulings 3/4 + S4 that A is still implementing against.
- **B2 = P2** namespace migration (oopExpert) → **B3 = P3** model→component map + the four new M2 components (oopExpert, oopBashExpert measures) → **B4 = P4** component-typed IORs + store regenerated, old `type/Web4MDA/` pruned (oopExpert) → **B5 = P5** rework S4b/S4c (oopPO rules, oopExpert builds) → **B6 = P6** end verify (oopTester) → oopPO re-runs on own clone → **TRON rules DONE.**
- Each increment: spec first, failable gate RED-first, real clone, whole suite 0 RED, one commit, push; SM panel at each boundary.

## Open for TRON (not blocking A)
DONE on references-by-IOR · ARON's staged "fix oosh-po".
