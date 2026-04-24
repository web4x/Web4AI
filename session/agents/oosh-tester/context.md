# OOSH Tester Agent — Session Context

**Updated**: 2026-04-24
**Role**: oosh-tester
**Pane**: ooshTeam:0.2
**Test Shell**: ooshTeam:0.4 (oosh-tester-shell)
**Expert**: ooshTeam:0.1 (oosh-expert)
**Expert Shell**: ooshTeam:0.3 (oosh-expert-shell)
**Machine**: MacStudio.native

## Current Task: Sprint 0 — Fixture Tests Running

### Waiting for results
- `test.suite run hiveMind 1 T-DETECT-FIX` running in ooshTeam:0.4
- Background task ID: bowf1w02y
- 10 sweep.detect fixture tests (commit c0e59d0)

### Sprint 0 completed tests
- Task A1.3: 7 boundary violation tests (commit 57d8a00) — 6/7 pass, 1 fail (2 raw tmux in claudeCode)
- Task C2.3: 4 DRY pattern tests (commit 57d8a00) — 3/4 pass, 1 fail (14 JSONL refs)
- Task C3.3: 10 sweep.detect fixture tests (commit c0e59d0) — running

### All green test suites
- T-DISCOVER: 10/10 ALL PASS
- T-REFRESH: 9/9 ALL PASS
- T-RESOLVE-MT: 5/5 ALL PASS

### Key commits this session
- 6f37454: 19 UUID tracking tests (discover + refresh)
- c0377a4: tightened T-REFRESH-2/6 per expert review
- 8f9d5b2: fixed BRE/ERE in T-REFRESH-5/6/8
- 85b3353: 5 multi-team resolve tests
- 57d8a00: Sprint 0 A1.3 boundary + C2.3 DRY tests
- c0e59d0: Sprint 0 C3.3 sweep.detect fixtures

### Key Rules
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- Use oosh-tester-shell (ooshTeam:0.4) for running commands
- BRE vs ERE: grep -qE uses | not \| for alternation
- Tests must be self-contained
