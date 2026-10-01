# Verdict — spec 14 **I2** (no bare IOR string in code) on Web4MDA `dfdde9c` — **QA-GREEN**; gate extended and PUSHED as `b355d0d`

Gated by oopTester@WODA.prod, 2026-10-01, on oopPO's order. Candidate `dfdde9c` = `origin/main`, parent `e9be607` (fetched, measured). oopPO's 2 spec lines in `spec/ior.md` verified present (port rule in rule 3; Link sentence in I2).

## What I2 shipped as guards (measured)
| Check | Shipped at `dfdde9c` |
|---|---|
| IOR6 (no IOR as a string attribute) | **none** → I built it |
| port rule `:01234` | 3 new cases in `Ior.test.ts` (leading zeros, 65536, 0) |
| Link both variants + JSON unchanged | `ScenarioUnit.test.ts`: fixture 1→2 links + new `JSON.stringify(from(json).toJSON())` arm (one hand-written fixture) |
| AC2 (no path stored) | existing `UcpComponent.test.ts` catalog scan — **unchanged, no exemption added** |
| `Link` | **no `Link/latest/test/` at all** |

## Catalog / runtime facts (probed at `dfdde9c`, 98 classes)
- No attribute named `/ior/i` anywhere; no initializer containing `ior:`.
- `ScenarioUnitModel` ends: `ior → Ior 1`, `ownerIor → Ior 1`, `links → Link 0..n`, `copies → Ior 0..n`; `LinkModel`: no attributes, ends `folder → DefaultFolder 0..1`, `ior → Ior 0..1` — **no path field**; `ScenarioIndexModel`: `profile → InternetProfile`, no host/port.
- After `ScenarioUnit.from(json)` the untyped `model` bag holds only `uuid`, `name`; **no raw `ior:` string** reachable in the unit's model graph; the local link stores its file name and a folder chain (path derived); `toJSON()` byte-identical.

## My gate, extended (`IorAcceptance.test.ts`, pushed **`b355d0d`**, gate-only)
New/changed arms: **port rule** (CANONICAL ports 1–65535, no leading zeros; IOR5 + `:01234`/`:65536`/`:0`), **IOR6 catalog**, **IOR6 runtime + JSON unchanged**, **Link both variants round-trip**, **Link local path DERIVED** (rename folder → path follows). On `dfdde9c`: **9/9**.

## Seeds on the I2 code — each RED by its named guard, residual 0
| Seed | RED by |
|---|---|
| S1 `ownerIor` re-added as a string attribute (ScenarioUnitModelDefinition) | IOR6 catalog |
| S2 `from()` keeps the raw strings in the `model` bag | IOR6 runtime |
| S3 `parse` accepts leading-zero and `0` ports | IOR5 port cases + **`Ior.test.ts` port cases (builder arm re-proven)** |
| S4 local link path memoized | Link derived-path |
| S5 remote link renders its path, not its Ior | IOR6 JSON, Link round-trip, **ScenarioUnit "JSON is UNCHANGED" (builder arm)** |
| S6 `path` attribute on `LinkModel` | **AC2** catalog scan (+ its failable twin) — still unexempted |
| S7 `from()` drops the remote link | IOR6 JSON, **ScenarioUnit getters 1→2 links arm + JSON arm (builder arms re-proven)** |

## Cold, isolated (`dfdde9c` + extended gate)
rc=0 · **538 passed + 2 skipped / 540 · 0 failed** · tsc test config 0 errors · AC3 **46/46** · `npm start` rc=0 **zero diff** · skips = the declared holds (TreeFileUnitInc1 T5.2–T5.5 HELD, T8 NOT BUILT). **AC6 alone:** 1130 / 1012 ms (I1 1047 / 988, base 946 / 892) — passed in this cold run; still the hottest timeout risk.
Push proof: commit `b355d0d` tree `19d8e5e` == gated tree == `origin/main` tree after push (fetched).

## Findings → oopPO
1. **No concrete local link example in any spec** — only placeholders (`Scenario/type/…/<speakable>.scenario.json`), so a spec-derived local set is EMPTY. The gate covers the local variant with one **explicitly labeled fixture** (the same path `ScenarioUnit.test.ts` uses) and reads backticked OR JSON-quoted concrete paths, so a concrete example added to `spec/ior.md`'s canonical section is picked up automatically. Suggest adding one.
2. **The port error is ONE message for every port defect** ("port not decimal 1-65535 without leading zeros") — a test asserting `'leading zeros'` also passes for `:65536`. Named, but the defects are not distinguished (weakest literal of the port arm).
3. **`Link` has no test folder of its own**; its behaviour is now gated through my arms + ScenarioUnit.test.
4. Scenario JSON coverage is still a single hand-built example per test (the repo holds no scenario JSON with IORs) — the JSON-unchanged arms are exact but narrow.

## Verdict
**QA-GREEN on I2** (IOR6, port rule, Link both variants, JSON unchanged, AC2 still unexempted — every arm proven failable on the I2 code; builder-edited assertions re-proven). Gate on origin `b355d0d`. Evidence `/tmp/oopTester-c3c4-ev/i2-*` (ephemeral).
