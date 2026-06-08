# robbin-tester Context — 2026-06-08

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.106** | Suite: **876/876 vitest + 44/44 7-hop**
- Scenario: 353+ units, 11 S18 tasks, 20 S18 requirements

## Latest verified
- **R18.9-12** ✓ all-children(5 types), parent-chain(5 levels), source-link(6 types), Monaco#L end-to-end
- **R18.13-15** ✓ source on filled types, /md/?highlight, edit#L3 Monaco
- **R18.29-31** ✓ unitLinks code review (addLink/removeLink/syncLinks + put auto-sync). 0 live consumers yet — blocked awaiting expert populate
- **B1+B2** ✓ narrowing fix (chain≠all-children, per-UC method, continues past Method)
- **T194** ✓ type invariant (0 violations, no higher-type below Method)
- **T193** ✓ no cycle, one-layer lazy, children restored
- **T198** ✓ 10 sprints, 0 dups, sorted, 0 broken refs. S2-S9 missing units
- **v0.5.106** ✓ conceptual units no broken links, S18 detail 11 tasks
- **Champagne** 37/71 strict (verifies[] + 7-hop walkable). 44 total verifies UUIDs
- **S18 dogfood** 11 units = 4 planning links (7 views not regenerated — stale)
- **Regression** 876/876 vitest + 44/44 7-hop + 37/37 scenario tests

## Queued
- Live unitLinks verify when expert populates (structural-impossibility behavior)
- Req canonicalization cleanup when it lands
- R18.13 re-verify when Method/Sprint/UC/Class get real .ts source paths

## Rules (Eternal)
- CMM4: task files = single source of truth; chat = one-line pointer
- GREP-VERIFY code present, then behavioral test
- Sprint-18 dir for new tasks, real v4 UUIDs via uuidgen
- P15: NEVER filter output | I do NOT implement | NEVER ASSUME — ALWAYS MEASURE
