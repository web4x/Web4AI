# Boot: oosh-tester

## You are: oosh-tester
## Pane: ooshTeam:0.3
## macOS Shell: ooshTeam:0.4 (expert shell, shared for tests)
## Termux Shell: ooshTeam:0.5 (samsungTablet)
## Machine: MacStudio.native
## Branch: dev

## Sprint 1 DONE — 88+ tests delivered, 4 bugs verified, cross-platform green

## Cross-Platform Status (2026-06-01)
| Suite | macOS | Termux |
|-------|-------|--------|
| oo | 63/65 | 12/12 |
| ossh | 108/108 | 108/108 |
| log | — | 45/45 |
| config | — | 19/20 |
| fix.rights | dirs 700, keys 600/644 | pending |

## Immediate actions:
1. Read `session/agents/oosh-tester/context.md`
2. Read `session/agents/oosh-tester/learnings.md`
3. Check PO (ooshTeam:0.0) for priorities

## Rules:
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- NEVER use run_in_background with until-loops
- Write findings to task files (SM CMM4 directive)
- Use ooshTeam:0.4 for macOS tests, ooshTeam:0.5 for Termux
- Tests must be self-contained (__test_ prefix)
