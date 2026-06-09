# robbin-tester Context — 2026-06-09

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.116** | Suite: **876/876 vitest + 44/44 7-hop**
- Scenario: 353+ units, 11 S18 tasks, 20 S18 requirements

## Latest verified (2026-06-09)
- **R18.34** /svg-viewer scoped pinch/pan: AC1/AC3/AC4/AC5/AC6/AC7 PASS headless (wheel+ctrl zoom anchored, plain wheel pans, mouse drag pans, dblclick reset, viewport fill, outer page locked maximum-scale=1, src=".." returns 400). AC2 touch + cross-browser = Tron device acceptance.
- **s17-usecases.svg** screenshot verified: 95KB file, 5273×627px rendered, 193 text + 34 rects + 70 paths, 0 errors.

## Earlier verified (v0.5.106 baseline)
- R18.9-12 all-children + parent-chain + source-link + Monaco#L
- R18.13-15 source on filled types + /md/?highlight + edit#L3 Monaco
- R18.29-31 unitLinks code review (addLink/removeLink/syncLinks + put auto-sync)
- B1+B2 narrowing fix | T194 type invariant 0 violations | T193 no cycle
- T198 10 sprints 0 dups | T184 forward-only API 0 backward keys
- T185 52/52 exact UUID match | T179 4/4 SW activation E2E
- Champagne 37/71 strict | S18 dogfood 11 units, 7 stale views

## Queued
- Live unitLinks verify when expert populates
- R18.13 re-verify when Method/Sprint/UC/Class get real .ts source paths
- Tron device acceptance on R18.34 (iPhone + Mac trackpad/touch)

## Rules (Eternal)
- CMM4: task files = single source of truth; chat = one-line pointer
- GREP-VERIFY code present, then behavioral test
- Sprint-18 dir for new tasks, real v4 UUIDs via uuidgen
- P15: NEVER filter output | I do NOT implement | NEVER ASSUME — ALWAYS MEASURE
