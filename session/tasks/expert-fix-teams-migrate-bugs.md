# Bug Report: teams.migrate — sessions fail on remote
**From**: hiveMind-tester
**To**: hiveMind-expert
**Date**: 2026-03-08
**Commit tested**: 1517107

## Test performed
```bash
hiveMind teams.migrate MacStudio.native
```

## What worked
- Config transfer via `ossh push.dir` — OK
- Git pull on remote — OK (merge succeeded)
- Prerequisite check — OK ("Prerequisites OK")
- teams.restore started — OK (reads snapshot, creates sessions)

## What failed: "can't find session" on every pane operation

Every session creation produces this pattern:
```
Creating session: projectTeam
  projectTeam:0.3: resuming oosh-expert (a2c6b6c4...)
can't find session: projectTeam
can't find session: projectTeam
can't find session: projectTeam
can't find session: projectTeam
```

**Root cause hypothesis**: `ossh exec` runs the entire `hiveMind teams.restore` as a single SSH command. Inside `teams.restore`, `otmux new <session>` creates the session but the split-window / send-keys operations that follow can't find it. Possible reasons:
1. `otmux new` defaults to **attached mode** — over SSH pipe this fails/detaches immediately
2. The tmux socket path differs — remote tmux at `/opt/homebrew/bin/tmux` may use different default socket
3. Session creation succeeds but subsequent operations run before tmux processes the new session

## Verification: all sessions "(stopped)"
```
osshTeam                 (stopped)  ossh and user script specialists (session not running)
projectTeam              (stopped) (session not running)
hiveMindTeam02_03_26     (stopped) (session not running)
```
No sessions persisted on MacStudio.

## BUG-Z4: otmux new must support `-d` (detached) mode for non-interactive restore
- `teams.restore` creates sessions via `otmux new <name>`.
- Over SSH this must be **detached**: `otmux new <name> -d` or `tmux new-session -d -s <name>`
- Currently `otmux new` attaches by default — breaks piped SSH commands

## BUG-Z5: teams.restore split-window/send-keys fail when session not found
- After "Creating session", every subsequent operation gets "can't find session"
- Need error handling: if session creation fails, skip pane operations for that session
- Need diagnostic: print which tmux command failed

## BUG-Z6: ossh exec may not support interactive tmux operations
- `ossh exec` runs command over SSH — no TTY allocation
- tmux operations that need a terminal (attach, interactive) fail silently
- Fix: teams.restore over SSH must use only **detached** tmux operations

## Fix suggestion
In `teams.restore`, when creating sessions:
```bash
# Instead of: otmux new "$sess"
# Use detached creation:
tmux new-session -d -s "$sess" 2>/dev/null || {
  echo "  FAILED: could not create session $sess"
  continue
}
```
Or add `-d` flag support to `otmux new`.

## Priority
1. BUG-Z4 — otmux new -d support (or use tmux new-session -d in teams.restore)
2. BUG-Z5 — error handling for failed session creation
3. BUG-Z6 — ensure all teams.restore operations are non-interactive
