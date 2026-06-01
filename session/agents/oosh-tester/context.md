# OOSH Tester Agent — Session Context

**Updated**: 2026-06-01
**Role**: oosh-tester
**Pane**: ooshTeam:0.3
**Test Shell**: ooshTeam:0.5 (oosh-tester-shell)
**Expert**: ooshTeam:0.2 (oosh-expert), ooshTeam:0.1 (oosh-architect)
**Machine**: MacStudio.native
**Branch**: test/macos.latest

## Sprint 1 — State Correctness: Test Delivery

| Commit | Tests | Topic | Status |
|--------|-------|-------|--------|
| `334d016` | 8 | SC-H.3 MVC consistency invariants | DONE |
| `7a5e2bc` | 8 | Gap A defer-probe pattern | DONE |
| `1427be6` | 8 | D5 stale-client cleanup | DONE |
| `e3b223a` | 10 | SC-F.2/F.3 snapshot row validation | DONE |
| `b951b52` | 14 | SC-E.2 P2/P3 ingress defense | DONE |
| `1eb8cf6` | 8 | Rate-limit scroll detection | DONE |
| `82c2397` | 12 | SC-B.3 event dispatch isolation + idempotency | DONE |
| `ce65556` | 11 | SC-C handler integration (25 handlers) | DONE |
| `58fdcbf` | 9 | SC-D.3 reconcile roundtrip | DONE |
| **Total** | **88** | | |

## Bug Verifications (written to task files)
- `82213a6` — agent.send visibility: VERIFIED
- `4338d2c` — c2 apostrophe completion (9 methods): VERIFIED
- `3a4bfbc` — rate-limit invisible to sweep: VERIFIED
- `e7d5a8a` — naming convention @hostname: VERIFIED
- `e7d5a8a` claim verification (5 claims all PASS): VERIFIED

## Remaining Work
- **SC-A.3** — invariant detection fixture suite (expand from 2 refs to full I1-I10) — NEXT
- **D4.2** — tronMonitor.fit verification (fit ooshTeam/web4team, N=0, oversized, idempotency) — QUEUED

## Recovery Steps
1. Read this file
2. Read `session/agents/oosh-tester/learnings.md`
3. Check PO (ooshTeam:0.0) for priorities
4. Write to task files, not ad-hoc messages (SM CMM4 directive)

## Key Rules
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- NEVER use run_in_background with until-loops
- Write findings to task files (SM CMM4 directive)
- Use oosh-tester-shell (ooshTeam:0.5) for commands
- Read specs BEFORE testing
- Tests must be self-contained (__test_ prefix, cleanup on exit)
