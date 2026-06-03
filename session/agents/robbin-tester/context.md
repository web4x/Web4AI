# robbin-tester Context — 2026-06-03

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = ME | 0.4 = robbin-expert-shell | 0.5 = robbin-tester-shell

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.75** | Suite: **834/834**
- Scenario: 297 units, 238 reachable, 7 types, ci:gates PASSED

## SESSION — Latest verified

- **T175** ✓ (v0.5.75) Tree hierarchy (TraceObject parent/children), ellipsis+hover, localStorage expand persist
- **T174** ✓ (v0.5.74) /scenario route, scoped subtree, reroute .scenario.json→/scenario?ior=, R-M1/M2/M3a/M4 PASS. R-M3d/M3e code grep-verified but headless SSL blocks ES module exec — Tron device QA.
- **T173** ✓ (v0.5.70) 302→/trace?ior= all access paths, /api/trace/roots+children
- **T172** ✓ 238/238 reachable, trace:audit:strict PASSED
- **T170** ✓ ci:gates PASSED | **T167** ✓ desktop split + mobile overlay
- **T166** ✓ 7/7 types | **T164** ✓ 41/41 clean | **T128.2** ✓ S10-S16

### Headless limitation
SSL cert error blocks `<script type="module" src="...">` in headless Chromium — `ignoreHTTPSErrors` doesn't cover ES module fetches. Tree HTML renders but wired JS (rAF, navigate, expand handlers) never executes. Affects /scenario behavioral tests. Real browser on prod = fine.

## Queued
- T176 (headless module-JS exec fix)

## Rules (Eternal)
- CMM4: task files = single source of truth
- GREP-VERIFY code present, then behavioral test
- P15: NEVER filter output | I do NOT implement | NEVER ASSUME — ALWAYS MEASURE
