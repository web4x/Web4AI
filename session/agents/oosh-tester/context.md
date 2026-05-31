# OOSH Tester Agent — Session Context

**Updated**: 2026-05-30
**Role**: oosh-tester
**Pane**: ooshTeam:0.3
**Test Shell**: ooshTeam:0.5 (oosh-tester-shell)
**Expert**: ooshTeam:0.2 (oosh-expert), ooshTeam:0.1 (oosh-architect)
**Expert Shell**: ooshTeam:0.4 (oosh-expert-shell)
**Machine**: MacStudio.native
**Branch**: test/macos.latest

## Current Sprint: Sprint 1 — State Correctness

### Delivered this session

| Commit | Tests | Topic |
|--------|-------|-------|
| `334d016` | 8 | SC-H.3 MVC consistency invariants |
| `7a5e2bc` | 8 | Gap A defer-probe pattern |
| `1427be6` | 8 | D5 stale-client cleanup |
| `e3b223a` | 10 | SC-F.2/F.3 snapshot row validation |
| `b951b52` | 14 | SC-E.2 P2/P3 ingress defense |
| `1eb8cf6` | 8 | Rate-limit scroll detection |
| `82c2397` | 12 | SC-B.3 event dispatch isolation + idempotency |
| `ce65556` | 11 | SC-C handler integration (25 handlers) |

### Bug verifications (written to task files)
- `82213a6` — agent.send visibility fix: VERIFIED
- `4338d2c` — c2 apostrophe completion fix: VERIFIED (9 methods)
- `3a4bfbc` — rate-limit invisible to sweep: VERIFIED
- `e7d5a8a` — naming convention @hostname: VERIFIED (robbinTeam + ooshTeam)

### PO assignment (remaining)
- SC-D.3 — reconcile roundtrip (degrade→reconcile→audit-clean) — NEXT
- SC-A.3 — invariant detection fixtures (expand) — QUEUED

### Full regression
- hiveMind full test suite extremely slow (~2min per test with 18 sessions)
- Test 1+2 alone take 10+ minutes (agents.discover scans all sessions)
- Performance issue filed as BUG-T5 (fixed: source hiveMind fast, but test calls still slow)

## Recovery Steps
1. Read this file
2. Read `session/agents/oosh-tester/learnings.md`
3. Run `otmux tree` to verify pane layout
4. Check with PO (ooshTeam:0.0) for priorities
5. Read task files in `session/tasks/` before asking questions (SM directive)

## Key Rules
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep on commands)
- NEVER use run_in_background with until-loops — they dangle
- Use oosh-tester-shell (ooshTeam:0.5) for running test commands
- Write findings to task files, not ad-hoc messages (SM CMM4 directive)
- BRE vs ERE: grep -qE uses | not \| for alternation
- Tests must be self-contained
- Read specs BEFORE testing
- Prefix only applies to Claude Code target panes, not bash shells
