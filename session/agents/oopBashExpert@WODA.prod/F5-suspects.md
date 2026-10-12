# F5 — chain CPU regression: suspect shortlist + bisect plan (CPU-free read)

*oopBashExpert, 2026-10-12, per oopPO order: "read the 26 commits 4a1d6f87..8c0009f0 (and the 11 before it for segment 1), shortlist the suspects for the +2.2 CPU-s zero-link growth and the 1.62 ms/link, write the shortlist + planned bisect order to a file, push it." **No test or timing run was made** — git reads only. Measurements wait for oopPO's quiet window.*

## Entry facts (from context.md anchor ef4b6ae1; gate quantity = CPU of the npm-start child tree, interleaved ×5)

| sha | links | chain CPU-s |
|---|---|---|
| c03a203d | 106 | 12.73–13.07 (**doc number**, load 7–9.5, **instrument not in tree**) |
| 4a1d6f87 | 106 | 15.24 (sd .43) |
| 8c0009f0 | 1865 | 18.09 / 18.32 |
| 514e7215 S4b | 3688 | 19.32 |
| f707537f A3 | 3688 | 19.47 (control) |

Segment 1 = c03a203d→4a1d6f87 (11 commits): **+2.2 CPU-s, 0 new links.** Segment 2 = 4a1d6f87→8c0009f0 (26 commits): **+2.85 for +1759 links = 1.62 ms/link.** S4b: +1.00 / +1823 = **0.55 ms/link.**

## What the read eliminated

- **32 of 37 commits cannot move npm-start CPU**: they change only `test/`, `gen/`, verdicts, `held/`, or spec `.md`. Segment 1 cleared: 3933d8d6, d98acc87, 973529a5, 9c06a6fa, 0af9928d, 9f3d427e, d2677dd2, 4a1d6f87. Segment 2 cleared: 24 of 26 (all except 51482d16 and 38fea371), incl. 4fe7ab4b = the ChildCpu **instrument** refactor (inline now() → around(), quantity identical).
- **No hidden non-TS production change**: across c03a203d..8c0009f0 the 21 non-.ts production files are all generated renderings (js / thinglish.js / thinglish) of classes already counted — no package.json, script, or config change.

## Shortlist — segment 1 (+2.2 CPU-s, zero links), ranked

0. **S0 — INSTRUMENT / CONDITION CONFOUND (check FIRST, cheapest).** The c03a203d baseline is a *doc* number taken at load 7–9.5 with the ChildCpu instrument **not in the tree** (it arrives with 4a1d6f87). Some or all of +2.2 may be method, not product. Test: inject the 4a1d6f87 instrument at c03a203d and measure interleaved with 4a1d6f87.
1. **★ fa971b9a — S3.1 "store as units" (strongest).** `ScenarioIndex.storeModel` now **recurses**: every part (≈1748) is written as its own unit — `shardOf(uuid).create()` + `JSON.stringify` + `file.write` per part — and parts get **no type link** (`links` only when `ownerIor === ''`). That is exactly +work with 0 new links. Also `modelOf` turns **EAGER** on read: `await this.get(...)` per part, each through a registry `Ior.parse` (`Mof.loadedClass('Web4MDA.Ior')`, twice per call) — if the chain reads models back, +1748 reads/parses.
2. **d6d74855 — S2 derived partEnds (weak).** `M1Catalog.partEnds()` / `partHeirs()` rebuild `classes()` and scan per attribute, but the M2 cache is reset only in `resolving()`, called once per `createExisting` per language → a handful of small passes per run (ms, not seconds). Adds a generated `static get partEnds()` per model class (small output growth).
3. **22141bb0** (4 files, ±8) — negligible; only if 0–2 do not explain.

## Shortlist — segment 2 (1.62 ms/link vs S4b's 0.55), ranked

Only **two** of 26 commits touch production TS:

1. **★ 38fea371 — O3 PRUNE + O1 (strongest for the EXCESS ≈1.07 ms/link).** Every run, `ScenarioIndex.prune(classes)`: (a) re-derives `typePathOf` + `typeFile`/`descend` a **second time** for every kept unit (≈1854) to build the keep-set; (b) walks **all of Index/** (≈1854 files) and (c) **all of type/** (≈1865 links) recursively via `filesUnder`, classifying every entry (`instanceof DefaultFolder` — a stat per entry) with `exists()` per folder, and a file object born per entry. Membership is `Set` (no quadratic) — the cost is linear but heavy per link, and it scales with links.
2. **51482d16 — S4a "every unit linked" (legit part).** The `ownerIor === ''` guard is removed, so every part pays `ScenarioUnit.from` + `typeFile()` → `descend()` + `link()`. `descend()` is **unchanged and pure** 8c0009f0→f707537f (no fs) — its cost is one Folder object birth per path segment (each a UcpComponent/TypedModel: init + `crypto.randomUUID`). This is the same per-link cost S4b pays (0.55 ms/link) — expected, not the regression.

**Falsifiable prediction:** chain at 51482d16 ≈ 15.24 + 1759 × 0.55 ms ≈ **16.2**; the jump to ≈ **18.1** lands at **38fea371**.

## Planned bisect order (when oopPO grants the quiet window)

Method = `tmp/f4-chain-attr.sh` conditions (pristine tree per run: `clean -fdx -e node_modules` + checkout; bash `time` user+sys; interleaved; K ≥ 5). **Re-measure 4a1d6f87 and 8c0009f0 as controls in every interleave** (load drift).

1. **S0:** c03a203d **+ injected instrument** vs 4a1d6f87. If c03a203d reads ≈15.2 → segment 1 is instrument/condition → stop segment 1.
2. **Segment 1 (only if S0 shows real growth):** d6d74855, fa971b9a (2 new points; expect the jump at fa971b9a). 22141bb0 only if the jump does not land there.
3. **Segment 2:** 51482d16, 38fea371 (2 new points; endpoints known). Expect excess at 38fea371.
4. **Profile the named culprit(s)** (e.g. `node --cpu-prof` on the npm-start child): confirm the mechanism named above before proposing anything. Candidate fixes to propose (not to apply without ruling): prune reuses the keep-set/type paths derived during the store pass; walk with `readdir` withFileTypes instead of a stat per entry; reuse the `scenarioRoot`/type Folder objects instead of re-birthing them per link. **Never raise the budget** (oopPO chain ruling).

**Total: 4–6 new interleaved measurement points instead of a 37-commit bisect.**
