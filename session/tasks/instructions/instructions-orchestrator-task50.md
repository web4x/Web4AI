# Task 50: ossh SCP → rsync migration

## For Orchestrator

New task from PO: Replace all SCP calls in `ossh` and `user` scripts with rsync + SSH ControlMaster.

### Full spec
Read `session/tasks/Task.50.ossh-scp-to-rsync.md` — it has the complete mapping of every SCP call, the rsync replacement pattern, and the ControlMaster approach for single-password auth.

### Assignment
1. Send Task 50 to Expert for implementation
2. After Expert completes, send to Tester for validation
3. **When done, notify ScrumMaster at pane 0.6**: `Task 50 done`

### Key points for Expert
- Replace SCP with rsync + `--mkpath` in all push/pull methods
- Add `ossh.connection.open` / `ossh.connection.close` for SSH ControlMaster
- Wire ControlPath into all rsync and ssh calls
- Handle rsync version fallback for systems without `--mkpath`
