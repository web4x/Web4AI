# Backup Config Lifecycle Bugs — Expert Task

## Summary
Manual testing of `backup config.create` + `backup run` revealed path generation bugs and a missing rsync exclude. Three bugs total.

## Bug #1: `config.create` generates wrong target for local paths
**File**: `/Users/donges/oosh/backup` line 257
**Code**: `local target_path="$target_base$current"`
**Tested**: `cd /Users/donges/oosh/test/test.data/test.backup.source && backup config.create /Users/donges/oosh/test/test.data/test.backup.target`
**Got**: `BACKUP_TARGET="/Users/donges/oosh/test/test.data/test.backup.target/Users/donges/oosh/test/test.data/test.backup.source"`
**Expected**: `BACKUP_TARGET="/Users/donges/oosh/test/test.data/test.backup.target"`
**Root cause**: The concatenation `$target_base$current` is designed for remote targets (mirrors local path on remote host). For local targets, the user gives the exact target path — it should be used as-is.
**Fix**: Detect local vs remote (check for `@`). Local = use target_base directly. Remote = keep current concatenation.

## Bug #2: `.backup.env` synced to target
**File**: `/Users/donges/oosh/backup` line 722
**Tested**: After `backup run`, `.backup.env` appeared in the target directory.
**Fix**: Add `--exclude .backup.env` to the rsync command in `backup.run`.

## Bug #3: Existing registry entries have same double-path
**Evidence**: `backup config.list.all` shows entry [5]: `donges@MacStudio.native:/Users/Shared/Workspaces/Users/Shared/Workspaces` — same root cause as Bug #1, even for remote targets where the user passed a full path.

## Test Data (already created)
- Source: `/Users/donges/oosh/test/test.data/test.backup.source/` (file1.txt, file2.txt, subdir1/nested1.txt, subdir2/nested2.txt)
- Target: `/Users/donges/oosh/test/test.data/test.backup.target/`

## Plan
1. **Expert**: Fix bugs #1 and #2 in `/Users/donges/oosh/backup`
2. **Tester**: Creates `test/test.backup` with assertions for the full config lifecycle
3. **Both**: Verify manually in test pane `backupTeam:0.1` (bash/OOSH ready)
4. **Coordinate**: Slow-pace monitoring via `otmux pane.capture` of each other's panes

## What I (tester) will do in parallel
- Write `test/test.backup` covering: config.create (local + remote), config.save, config.register/unregister, config.discover, backup.run (exclude .backup.env), verify.sync, normalize.filename/file/revert
- Run tests after your fixes, report results back
