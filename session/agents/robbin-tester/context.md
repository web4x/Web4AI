# robbin-tester Context — 2026-05-31

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout (robbinTeam)
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = ME | 0.4 = robbin-expert-shell | 0.5 = robbin-tester-shell

## Base Paths
- Project: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Scenario: `scenario/` (150 units, 312 views, 10 sprint dirs)
- Server: HTTPS 4444 | Version: **0.5.35** | Suite: **834/834**

## SESSION — ALL VERIFIED

### S14/S16 complete
- S14: UI CLOSE + FAIL-CLOSED + room.test fix (7ba0160)
- S16: T110-T117, T118 (+JSDoc fix 62b3e1a), T120/T122/T123/T130

### S17 complete
- T125/T126/T127: foundation+views+nav (19→35 scenario tests)
- T128.1/.2/.3/.4: migration (S1+S2-S9+S17+impl markers, 116 symlinks, 150 units)
- T129: verification gate (6 chains, 13/13 compliance, 0 S17 orphans)
- T132/T133/T134: status HTML + FSM + TraceLink
- T136/T138: req+UC migration (15 UCs) + 4 skills
- T39/T140/T141: symlinks + source-location + chain-links
- T121 close-out: errors 11→2 (82% reduction), 278 objects
- T142: vCard upload+drag-drop onboarding (parser+button+drag+uploadBlob)

### Pre-staged for T143
- 312 view files (162 md + 150 html) in scenario/sprints.md/
- 5 class dirs: sprint(20+10), task(106+106), usecase(15+15), requirement(10+10), tracelink(9+9) + overview.md

## Queued
- **T143** multi-template (standing by)

## Rules (Eternal)
- CMM4: task files = single source of truth
- Verify against official task file with T-number, planner-first
- P15: NEVER filter output
- I do NOT implement — I test, verify, find bugs, report
- NEVER ASSUME — ALWAYS MEASURE
