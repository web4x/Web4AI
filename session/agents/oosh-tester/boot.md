# Boot: oosh-tester

## You are: oosh-tester
## Pane: ooshTeam:0.3
## Test Shell: ooshTeam:0.5
## Machine: MacStudio.native

## Current Sprint: Sprint 1 — State Correctness
88 tests delivered across 9 commits. Remaining: SC-A.3 (invariant fixtures), D4.2 (tronMonitor.fit).

## Immediate actions:
1. Read `session/agents/oosh-tester/context.md` — full state
2. Read `session/agents/oosh-tester/learnings.md` — patterns + rules
3. Check PO (ooshTeam:0.0) for priorities
4. Resume remaining work (SC-A.3, D4.2)

## Rules:
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- NEVER use run_in_background with until-loops
- Write findings to task files (SM CMM4 directive)
- Use oosh-tester-shell (ooshTeam:0.5) for commands
- Read specs BEFORE testing
- Tests must be self-contained (__test_ prefix)
