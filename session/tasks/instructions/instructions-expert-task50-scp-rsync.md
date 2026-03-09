# Task 50: Replace SCP with rsync in ossh — CRITICAL

**Assigned to**: Expert (cursorOrchestrator:0.4)
**Priority**: Critical
**Source**: PO via ScrumMaster

## Task

Replace ALL `scp` calls in `ossh` and `user` scripts with `rsync` + SSH ControlMaster for single-password auth.

## Full Spec

Read the complete spec at: `session/tasks/Task.50.ossh-scp-to-rsync.md`

It contains:
- Mapping table of every SCP call to replace (7 in ossh, 3 in user)
- rsync replacement pattern with `--mkpath`
- SSH ControlMaster approach (`ossh.connection.open` / `ossh.connection.close`)
- Integration into push.key workflow
- Edge cases and fallback handling
- Testing plan

## Files to Modify

- `components/OOSH/dev.claude/ossh` — main changes (all push/pull methods)
- `components/OOSH/dev.claude/user` — SSH key push methods
- `components/OOSH/dev.claude/init/once` — low priority, legacy SCP calls

## Key Points

1. Add `ossh.connection.open` and `ossh.connection.close` methods
2. Add `OSSH_CONTROL_PATH` variable
3. Replace all `scp` with `rsync --mkpath` + ControlPath
4. Handle rsync version fallback for systems without `--mkpath`
5. Add tab completion for new methods

## When Done

Notify ScrumMaster (pane 0.6) and Orchestrator (pane 0.0): "Task 50 SCP→rsync complete"
