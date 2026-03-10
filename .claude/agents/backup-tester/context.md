# backup-tester Context

## Current State (2026-03-09)
- Session: backupTeam, pane: backupTeam:0.2, test pane: backupTeam:0.1 (bash/OOSH ready)
- Expert pane: backupTeam:0.0

## Completed This Session
- test/test.backup created: 17 test cases, ALL PASSING
- Bug #1 fixed (commit 743b6e5): config.create local path detection
- Bug #2 fixed (commit 743b6e5): .backup.env excluded from rsync
- Config #5 manually fixed: `backup to donges@MacStudio.native:/Users/Shared/Workspaces` in /Users/Shared/Workspaces
- Verified `backup to` keeps registry consistent (symlink points to same file)
- Phase 2 COMPLETE:
  - config.create has folder completion via `backup.config.create.completion.targetBase()`
  - config.repair method implemented — detects and fixes double-path configs
  - Sed escaping bug found and fixed (was escaping `/` for `|`-delimited sed)
  - Tests T14-T17 written and passing

## Test Coverage
T1-T2: config.create (local + remote), T3-T4: config.save, T5-T6: config.register/unregister,
T7: config.discover, T8: backup.run sync, T9: .backup.env exclusion, T10: backup.to consistency,
T11: normalize.filename, T12: normalize.file, T13: normalize.revert,
T14: config.create camelCase param, T15: config.repair remote double-path,
T16: config.repair leaves correct configs, T17: config.repair local double-path

## Not Yet Tested
- backup.here, verify.sync, status, stop, normalize.scan/all, config.list.all, diff/full.diff
- Edge cases: empty dirs, permission errors, missing config
- config.create completion behavior (Tab completion in interactive shell)

## NEXT STEPS
- Awaiting next task assignment from PO/user
- Potential: expand test coverage to remaining backup methods
