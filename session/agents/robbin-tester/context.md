# robbin-tester Context — 2026-06-10

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.123** | Suite: **879/879 vitest + 47/47 7-hop**
- Scenario: 47 Test units, all 7-hop reachable

## Latest verified (2026-06-09/10)
- **T190** champagne closed (b27b21df) — Test 1070b9cd wired Impl d8f406ce.tests[], verifies R18.6 "no full re-render". 1/1 PASS append-only + scroll preserved + DOM identity (pre-tags survive). Chain: Test→Impl→Method nodeEl→Class RbTraceTree→UC traceTree.renderAllTypes→T165→Req.
- **T188** champagne closed (442237d6, v0.5.123) — Test 9dbf5538 wired Impl ee738f5f.tests[]. `npm run check:sprint-md` AC1/AC3/AC4/AC5 all pass (--check exit 1 on hand-edit T188 desc, mismatched name surfaces, revert restores baseline).
- **R18.34.B** champagne closed (82ddae97) — Test 10c2e3ca wired Impl 094c18a4.tests[]. 2/2 PASS: synthesized 2-touch pinch + 10x repeated, scale commits after release with no pan. Tron device acceptance remains final (#27).
- **WebKit iPhone Safari** real engine — R18.34.B 3/3 PASS via `document.createTouch()` + `initTouchEvent()` (WebKit blocks `new Touch()` constructor). Screenshot at /tmp/svg-verify/webkit-iphone-safari.png.
- **T187** 10/10 TS GREEN with architect's corrected spec — `?mode=trace` narrows UC→1 Class→1 Method→1 Impl; `?mode=scenario` full fan-out. TS6/TS7/TS9 PASS.

## Earlier verified
- R18.9-15, R18.29-31 | T184/T185 | T179 SW activation | T193/T194/T198
- Champagne 37/71 → 47/47 (sprint-18 dogfood)
- s17-usecases.svg verified (95KB, 5273×627px, 193 text+34 rects+70 paths)

## Queued
- Tron device acceptance on R18.34.B (iPhone+Mac trackpad/touch)
- Live unitLinks verify when expert populates
- R18.13 re-verify when Method/Sprint/UC/Class get real .ts source paths

## Critical patterns
- **WebKit Touch synthesis**: WebKit blocks `new Touch()` — use `document.createTouch()` + try `initTouchEvent()` then fallback to `new TouchEvent({ touches, targetTouches, changedTouches })`.
- **Champagne chain wiring**: Test scenario unit + `Test.implementations[]=[<impl>]` + `Test.verifies[]=[<req>]` + `Test.parent=<impl>` + Impl.tests[] back-ref (push, don't overwrite).
- **--check exit codes via npm**: `npm run` may mask child exit code; use raw `npx tsx ... > /tmp/out 2>&1; echo $?` or direct command.

## Rules (Eternal)
- CMM4: task files = single source of truth; chat = one-line pointer
- GREP-VERIFY code present, then behavioral test
- Sprint-18 dir for new tasks, real v4 UUIDs via uuidgen
- P15: NEVER filter output | I do NOT implement | NEVER ASSUME — ALWAYS MEASURE
