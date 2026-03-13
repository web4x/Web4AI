# Task: Add `hiveMind task.delegate` method for remote agent delegation

**Assigned to**: hiveMind-expert (implement), hiveMind-tester (verify)
**Priority**: HIGH (Tron directive 2026-03-13)

## Problem

When the PO (or any coordinator) runs on a local machine but agents run on a remote tmux server (e.g. MacStudio), delegating a task requires manual steps:
1. Write task file locally
2. scp it to the remote machine
3. Send the agent a message to read it
4. Verify submission

This is error-prone — PO just wrote a local file and told a remote agent to read it (file didn't exist there).

## What to implement

### `hiveMind task.delegate` — one command to delegate a task to a remote agent

```bash
hiveMind task.delegate <sshHost> <pane> <taskFile> <?message>
```

**Parameters:**
- `sshHost` — SSH config host name (e.g. `MacStudio.native`). Uses ossh/SSH config for connection details.
- `pane` — target agent pane on the remote tmux (e.g. `otmuxTeam:0.0`) or role name (e.g. `otmux-expert`)
- `taskFile` — local path to the task file (e.g. `session/tasks/otmux-setup-default.md`)
- `message` — optional custom message (default: `"Read session/tasks/<filename> — new task"`)

**What it does:**
1. Verify local task file exists
2. Determine remote tasks directory (same relative path: `session/tasks/`)
3. `scp` the file to the remote machine's tasks directory via `sshHost`
4. Send the agent a message to read it (via remote `otmux send` or `hiveMind send`)
5. Report success/failure with human-readable messages

**Example:**
```bash
hiveMind task.delegate MacStudio.native otmuxTeam:0.0 session/tasks/otmux-setup-default.md "Implement otmux setup.default. Enter plan mode first."
```

### Completion

```bash
hiveMind.task.delegate.completion.sshHost() {
  # from ossh — list SSH config hosts
  ossh.parameter.completion.sshConfigHost
}

hiveMind.task.delegate.completion.pane() {
  # list remote panes — could query remote otmux or use local registry
  private.complete.panes
}

hiveMind.task.delegate.completion.taskFile() {
  # list local task files
  ls session/tasks/*.md 2>/dev/null
}
```

### Error handling (human-readable!)
- `"task file not found: session/tasks/foo.md"` — not EPERM
- `"cannot reach MacStudio.native — check SSH config"` — not connection refused raw error
- `"scp failed: file not transferred"` — with the actual scp error
- `"agent message not submitted — check pane state"` — if send fails

## Design considerations

- The remote machine's working directory may differ. Use the same relative path (`session/tasks/`) from the workspace root. Detect workspace root via `$OOSH_DIR` or project conventions.
- Role name resolution: if `pane` is a role name (e.g. `otmux-expert`), resolve it to the actual pane address on the REMOTE tmux server, not local.
- The scp needs to go through the SSH host config — use the same connection that `ossh` would use.

## Verification (tester)

1. `hiveMind task.delegate MacStudio.native otmuxTeam:0.0 session/tasks/test-task.md` — file appears on remote, agent receives message
2. Missing task file → human error message
3. Bad SSH host → human error message
4. Tab completion works for all 3 parameters
5. File arrives in correct remote directory
