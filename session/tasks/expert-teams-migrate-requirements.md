# Requirements: `hiveMind teams.migrate <host>`
**From**: hiveMind-tester
**To**: hiveMind-expert
**Date**: 2026-03-08
**Priority**: HIGH — cross-computer restart must be one command

## Goal
One command to migrate (restore) the current team to a remote machine:
```bash
hiveMind teams.migrate MacStudio.native
```

## What was tested manually (2026-03-07)
1. `ossh login MacStudio.native` → SSH to remote
2. `bash` → start OOSH environment
3. `git pull` in oosh repo → get latest code
4. `ossh push.dir MacStudio.native ~/config` → transfer config files
5. `export PATH=/opt/homebrew/bin:$PATH` → fix tmux PATH
6. `hiveMind teams.restore` → FAILED: "no server running" for most sessions
7. `otmux new testSession` → started tmux server
8. After server running, sessions could be created

## Bugs found during testing

### BUG-Z1: teams.restore fails without running tmux server
- `tmux new-session -d` fails if no server is running: "no server running on /private/tmp/tmux-501/default"
- **Fix**: Before any session creation, ensure tmux server is running. Start one if needed:
  ```bash
  if ! tmux list-sessions 2>/dev/null; then
    otmux new __tmux_init -d
  fi
  ```
- Clean up `__tmux_init` after restore completes.

### BUG-Z2: No prerequisite check on remote machine
- `teams.restore` assumes: tmux on PATH, claude installed, OOSH on PATH, config files present
- Remote machine may be missing any of these
- **Fix**: Add prerequisite check function

### BUG-Z3: /opt/homebrew/bin not in bash PATH on macOS (Apple Silicon)
- macOS with Homebrew on Apple Silicon: tmux at `/opt/homebrew/bin/tmux`
- OOSH bash doesn't include this in PATH
- **Fix**: Either OOSH `this` should detect and add `/opt/homebrew/bin` if it exists, or teams.migrate should check

## Required: `hiveMind teams.migrate <host>` method

### Signature
```bash
hiveMind teams.migrate <ossh-host> [snapshot-file]
```

### Steps (in order)
1. **Validate locally**: Check snapshot file exists (default: latest `teams.save` output)
2. **Transfer config**: `ossh push.dir <host> ~/config` — roles.env, sessions.env, teams.env, snapshots
3. **Transfer oosh**: `ossh push.dir <host> $OOSH_DIR` OR `ssh <host> "cd ~/oosh && git pull"`
4. **Check prerequisites on remote**:
   ```
   ssh <host> bash -c '
     command -v tmux || echo "MISSING: tmux"
     command -v claude || test -x ~/.local/bin/claude || echo "MISSING: claude"
     command -v hiveMind || echo "MISSING: OOSH on PATH"
   '
   ```
5. **Ensure tmux server running on remote**: `ssh <host> "tmux list-sessions 2>/dev/null || tmux new-session -d -s __init"`
6. **Run teams.restore on remote**: `ssh <host> "bash -l -c 'hiveMind teams.restore [snapshot]'"`
7. **Verify**: `ssh <host> "bash -l -c 'hiveMind team.status'"` — show result
8. **Report**: Print summary of what was restored, what failed

### Important constraints
- Use `ossh` for SSH, not raw `ssh` (if possible — may need raw ssh for remote commands though)
- Use `bash -l` on remote to ensure OOSH PATH is loaded
- Handle the `/opt/homebrew/bin` PATH issue (Apple Silicon macs)
- teams.restore itself must handle "no tmux server" gracefully (BUG-Z1 fix)

### Also fix in `teams.restore` itself
- **Add tmux server check** at the top of teams.restore:
  ```bash
  # Ensure tmux server is running
  if ! tmux list-sessions 2>/dev/null; then
    "$OOSH_DIR/otmux" new __restore_init -d 2>/dev/null
    RESTORE_CLEANUP_SESSION="__restore_init"
  fi
  ```
- At end of restore, clean up init session if we created it:
  ```bash
  if [ -n "$RESTORE_CLEANUP_SESSION" ]; then
    tmux kill-session -t "$RESTORE_CLEANUP_SESSION" 2>/dev/null
  fi
  ```

## Priority
1. **BUG-Z1 fix in teams.restore** (tmux server check) — blocks all remote restore
2. **teams.migrate method** — the one-command solution
3. **BUG-Z2 prerequisite check** — nice to have, prevents confusing failures
4. **BUG-Z3 PATH fix** — either in `this` or in teams.migrate

## Verification
After implementation:
1. `hiveMind teams.save` on local machine
2. `hiveMind teams.migrate MacStudio.native` — should complete without manual steps
3. `ossh login MacStudio.native` → `bash` → `hiveMind team.status` — all sessions running
4. `hiveMind consistency.audit` on remote — agents should be consistent
