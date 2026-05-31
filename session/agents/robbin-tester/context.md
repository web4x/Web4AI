# robbin-tester Context — 2026-05-31

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout (robbinTeam)
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = ME (robbin-tester) | 0.4 = robbin-expert-shell | 0.5 = robbin-tester-shell

## Base Paths
- Project: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Tests: `test/vitest/` (~29 files) + `test/e2e/`
- Scenario: `scenario/` (index/, sprints.json/, sprints.md/)
- Server port: HTTPS 4444 | Version: **0.5.31**
- **Symlink checkout**: workspaces/Web4RawBin → 2cuGitHub/Web4RawBin

## Test Suite: 834/834 vitest, 29 files | E2E 33/40

## SESSION 2026-05-29/30/31 — VERIFIED

### S14 Close
- S14 UI CLOSE ✓ | FAIL-CLOSED ISOLATION ✓ | room.test S14-debt fix (7ba0160) ✓

### S16 T110-T117 ALL ✓
- T110 drawer | T111 DetailViews | T112 speaky name | T113 Lucide icons
- T114 drag | T115 collapse/expand | T116+T117 trace-cli Pass 4+5

### T118 E2E Cleanup ✓ (317f41a + JSDoc fix 62b3e1a)
- 8/8 specs afterAll, zero-net-add (148→148), Babel parser bug found+fixed

### S16 Phase 4 ✓
- T120 dark drawer #1a1a2e | T122 fixed bottom | T123 sticky pageNav | T130 nested lists

### S17 ALL VERIFIED ✓
- **T39** ✓ symlink display (FileApi + 🔗 marker)
- **T125** ✓ foundation (IOR, 7 classes, 5-level index, templates) — 19→31 scenario tests
- **T126** ✓ generated views (42 task + 2 sprint views, planning.md nesting)
- **T127** ✓ navigation (IOR resolver, /trace cross-nav)
- **T128.1+T128.3** ✓ migration (S1 exemplar + S17: 11→19 symlinks, nested subs)
- **T129** ✓ verification gate (6 chain walks, 13/13 compliance, 0 S17 orphans)
- **T132** ✓ renderStatusHtml (checklist→ul/li, 2/2 tests)
- **T133** ✓ Task FSM (7 states/8 verbs/tronApprove, 5/5 tests)
- **T134** ✓ TraceLink (8th class, bidirectional, 5/5 tests)
- **T136** ✓ Req+UC migration (15 UCs from PUML, SHA-256 TraceLinks, 30 UC views)
- **T138** ✓ 4 skills (captureQuote/proposeTask/walkChain/statusTransition, 4/4 tests)

### Commits (my work)
- 7ba0160 room.test S14-debt fix
- 62b3e1a JSDoc Babel fix
- 4c630dd T125/T126/T127/T128 testing ticked
- f487c2f T129 verification gate report
- 8e42361 T132/T133/T134 testing ticked
- 3b79545 T136/T138 testing ticked

## Queued
- T119 test-traceability verification (when spun up)
- T135/T137/T139 (not yet impl-shipped)

## Rules (Eternal)
- CMM4: communicate through task files, not ad-hoc messages
- Verify against official task file with T-number, planner-first
- P15: NEVER filter output
- I do NOT implement — I test, verify, find bugs, report
- Self-report to robbinTeam:0.0 when task complete
- NEVER ASSUME — ALWAYS MEASURE
