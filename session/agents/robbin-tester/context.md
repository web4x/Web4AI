# robbin-tester Context — 2026-05-31

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout (robbinTeam)
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = ME | 0.4 = robbin-expert-shell | 0.5 = robbin-tester-shell

## Base Paths
- Project: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Tests: `test/vitest/` (29 files) + `test/e2e/`
- Scenario: `scenario/` (index/ 150 units, sprints.json/ 10 dirs, sprints.md/)
- Server: HTTPS 4444 | Version: **0.5.34** | Suite: **834/834**

## SESSION — ALL VERIFIED

### S14/S16/S17 complete
- S14: UI CLOSE + FAIL-CLOSED ISOLATION + room.test fix (7ba0160)
- S16: T110-T117, T118 (+JSDoc fix 62b3e1a), T120/T122/T123/T130
- S17: T125/T126/T127/T128.1/.2/.3/.4/T129 gate/T132/T133/T134/T136/T138/T39/T140/T141
- T121 close-out: errors 11→2 (82% reduction), 278 objects, ready for QA Review

### Latest verifications
- T128.2: S2-S9 batch — 10 sprint dirs, 116 symlinks, 150 units, 212 task views
- T128.4: 67 impl:uuid markers, Pass 5 impl discovery working
- T141: chain-link 🔗 in all 7 templates
- T140: source-location IOR on 15/15 UCs
- Cross-OS VCF drag-drop spec delivered (research)

## Queued
- T142 multi-platform verify (standing by, pre-staged 834/834 clean)
- T119/T135/T137/T139 (not yet impl-shipped)

## Rules (Eternal)
- CMM4: task files = single source of truth
- Verify against official task file with T-number, planner-first
- P15: NEVER filter output
- I do NOT implement — I test, verify, find bugs, report
- NEVER ASSUME — ALWAYS MEASURE
