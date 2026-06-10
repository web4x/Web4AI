# OOSH Tester Agent — Session Context

**Updated**: 2026-06-10
**Role**: oosh-tester
**Pane**: ooshTeam:0.3
**macOS Shell**: ooshTeam:0.4 (expert shell, shared for tests)
**Termux Shell**: ooshTeam:0.5 (samsungTablet)
**Machine**: MacStudio.native
**Branch**: dev

## Cross-Platform Status (final)

| Suite | macOS | Termux | Status |
|-------|-------|--------|--------|
| oo | 63/65 | 12/12 | GREEN |
| ossh | 108/108 | 108/108 | GREEN |
| log | — | 45/45 | GREEN |
| config | — | 19/20 | 1 fail (config.discover) |
| otmux | 130/146 (16 fail) | — | 16 failures unidentified |

## Current Task
- otmux 16 failing tests: need rerun with output capture to identify
- Previous runs interrupted or results file lost ($TMPDIR cleaned)
- tree.detailed test blocks for minutes (performance bottleneck)

## Verified This Session
- ossh fix.rights: dirs 700, keys 600/644 — PASS
- otmux.attach param naming (5db5b83) — test suite ran
- Branch migration Phase 3: dev fully synced
- /tmp/ bulk fix: 33+ mktemp across 7 files
- log 45/45 + config 19/20 on Termux after expert fixes

## Recovery Steps
1. Read this file + learnings.md
2. Check PO (ooshTeam:0.0) for priorities
3. Rerun otmux tests with tee to persistent path (not $TMPDIR)

## Key Rules
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- NEVER use run_in_background with until-loops
- Write findings to task files (SM CMM4 directive)
- Use ooshTeam:0.4 for macOS tests, ooshTeam:0.5 for Termux
- Tests must be self-contained (__test_ prefix)
- Save results to ~/config/ not $TMPDIR (gets cleaned)
