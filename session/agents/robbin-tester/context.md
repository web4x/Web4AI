# robbin-tester Context — 2026-06-03

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = ME | 0.4 = robbin-expert-shell | 0.5 = robbin-tester-shell

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.73** | Suite: **834/834**
- Scenario: 297 units, 238 reachable, 7 types in graph (360 objects)

## SESSION 2026-05-29 → 2026-06-03

### Latest (2026-06-03)
- **T174** ✓ (v0.5.73) /scenario route + drawer UX. R-M1/M2/M3a/M4/reroute PASS. R-M3d code present (scrollIntoView+navigate) but drawer not auto-opening in headless (SSL cert issue). R-M3e children pre-rendered.
- **T173** ✓ (v0.5.70) .scenario.json 302→/trace?ior= (all access paths: click+bookmark+curl). /api/trace/roots + /api/trace/children endpoints.
- **T172** ✓ 100% chain-node reachability (238/238), trace:audit:strict PASSED
- **T171** ✓ trace:audit clean, matrix refreshed
- **T170** ✓ ci:gates PASSED (trace:audit:strict + rule-pair:strict)
- **T167** ✓ desktop split 480px + mobile overlay 60vh
- **T166** ✓ Class(12)+Method(40) in graph, tree 7/7
- **T164** ✓ 41/41 req titles clean
- **T128.2** ✓ S10-S16 migrated (243→297 units)

### Earlier
- S14/S16 complete | S17 T125-T165 | T118-T161

## Key Lesson (2026-06-03)
- GREP-VERIFY code changes exist before behavioral testing. Behavior alone can miss unshipped code (R-M3d caught by planner grep).

## Rules (Eternal)
- CMM4: task files = single source of truth
- Verify against official task file with T-number, planner-first
- GREP-VERIFY code present, then behavioral test
- P15: NEVER filter output | I do NOT implement | NEVER ASSUME — ALWAYS MEASURE
