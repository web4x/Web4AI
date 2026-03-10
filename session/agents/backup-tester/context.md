# backup-tester Agent Context

## Identity
- **Role**: backup-tester
- **Host**: MacStudio.fritz.box
- **Pane**: backupTeam:0.1
- **Session ID**: d45f08a4-fdcf-42e9-afc5-e1f8ba874f4f
- **Expert pane**: backupTeam:0.0

## Current State (2026-03-10)
- 38/38 tests passing in test/test.backup

## Completed This Session
- test/test.backup: 38 test cases, ALL PASSING
- Bug #1 fixed (commit 743b6e5): config.create local path detection
- Bug #2 fixed (commit 743b6e5): .backup.env excluded from rsync
- Bug #3 fixed: sed escaping for |‑delimited sed in config.repair
- Config #5 manually fixed
- Phase 2: config.create completion, config.repair method
- Phase 3: config.disable/enable with "here" support, [enabled]/[disabled]/[missing] labels
- Phase 4: run.mv (secure move), strategy-driven backup.run
- Strategies: full (--delete), incremental (no --delete), secureMove, replaceByFolderLinks
- strategy.help output, replaceByFolderLinks made safe (secure move + link)

## Test Coverage
T1-T2: config.create (local + remote), T3-T4: config.save, T5-T6: register/unregister,
T7: config.discover, T8: backup.run sync, T9: .backup.env exclusion, T10: backup.to consistency,
T11-T13: normalize (filename, file, revert), T14: camelCase param,
T15-T17: config.repair (remote, no-op, local), T18: backup list active config,
T19-T22: disable/enable + labels, T23-T25: disable/enable completions,
T26-T29: "here" param + no-param default + completion,
T30-T32: run.mv (move, clean dirs, preserve .backup.env),
T33-T38: strategies (full, secureMove, replaceByFolderLinks, incremental, completion, help)

## Not Yet Tested
- backup.here, verify.sync, status, stop, normalize.scan/all, diff/full.diff
- Edge cases: empty dirs, permission errors, missing config, remote targets
