# Claude Code (Opus 4.6) Session Context

> Multi-agent tmux collaboration with Cursor Agent (GPT-5.1) on Intel Mac OOSH workspace.

## Session Goals

- **Establish shared tmux environment** with cross-agent awareness
  - [x] Discover tmux layout (4-pane tiled grid)
  - [x] Identify pane roles and shell types (bash/OOSH, zsh, node)
  - [x] Rename and lock all pane titles via otmux
  - [x] Introduce myself to cursor agent as collaborator
  - [x] Explain otmux to cursor agent, let it explore tab completion
  - [x] Both agents check context window and token budget
  - [x] Cursor agent researches API-based token introspection (no model-side access)
- **Fix Cursor Agent CLI** architecture mismatch
  - [x] Diagnose arm64 pty.node on x86_64 Intel Mac (known bug)
  - [x] Install correct x64 version via `brew install --cask cursor-cli`
  - [x] Repoint `~/.local/bin/cursor-agent` symlink to brew version
  - [x] Verify agent runs (`2026.01.28-fd13201`)
- **Fix pre-compact hook** for this session
  - [x] Diagnosed why boot file was `unknown` (no hivemind registration)
  - [x] Registered both agents in `/tmp/hivemind.roles`
  - [x] Added `claude-opus` and `cursor-agent` cases to `pre-compress.sh`
  - [x] Verified dry-run resolves correctly to `session/claude-opus.context.md`
- **Assess cursor agent intelligence**
  - [x] Read full dialog from pane 0.2, wrote `session/cursor-agent-assessment.md`
  - [x] Documented strengths (research, self-ID) and weaknesses (TUI control, verification)
  - [x] Analyzed wrong-file disaster — root cause was broken hook, not cursor agent
- **Set up project agent team**
  - [x] Learned hiveMind script API (registry, team setup, sweep, unblock)
  - [x] Created `projectTeam` tmux session with 11 project agents (2 windows)
  - [x] All registered in hivemind, shells ready, Claude not started yet
  - [ ] Start Claude in all panes, rename sessions, teach roles
- **Improve claudeCode**
  - [x] Added `customTitle` (from /rename) to `claudeCode list` output
  - [x] Created `claudeCode list.named` method (OOSH, no flags)

## Last Update

- **UTC Time**: 2026-02-11 ~12:45 UTC
- **Session started**: 2026-02-10 ~15:33 CET
- **Tokens used**: ~140K of 200K (66%)
- **Context used**: ~66% — compact soon
- **Next context reset**: Imminent — will compact after this update
- **Next weekly reset**: N/A (Anthropic Max subscription)

## Last Pane Layout

### Main session: claudeOpus2kTMUX
```
0.0 claudeSonnet1mSession       | 0.1 oosh@McDonges-4.fritz.box
    Claude Code (Opus 4.6)      |     OOSH bash shell
--------------------------------|---------------------------------
0.2 cursor.agent@gpt-5.1        | 0.3 zsh@McDonges-4.fritz.box
    Cursor Agent CLI             |     plain zsh (utility)
```

### Standalone: projectTeam (11 agents, Claude NOT started)
```
Window 0 (team-a): orchestrator | oosh-expert | oosh-tester | scrum-master | product-owner | agent-trainer
Window 1 (team-b): woda-writer | woda-scribe | task-agent | developer | script-product-owner
```

## Key Learnings

- **`tmux send-keys` with dashes**: Use `--` before text starting with `-` to prevent tmux flag parsing
- **otmux only works in OOSH bash**: The zsh panes don't have the framework sourced
- **Cursor agent submit key**: `C-m` (Ctrl+M / Return) submits in the TUI; `Enter` via send-keys adds newlines
- **brew is the standard cursor-cli install path**: Don't hack individual native binaries in node_modules
- **Context introspection asymmetry**: Claude Code has `/context`; cursor agent only has status bar %
- **`~/.local/bin` overrides `/usr/local/bin`**: PATH order matters when relinking CLI tools
- **hiveMind role registry**: `/tmp/hivemind.roles` maps `pane_target|role_name`, read by pre-compact hook
- **Pre-compact hook needs role registration**: Without it, boot file is `unknown.md` with empty fields
- **OOSH: never use flags**: Use dot-notation methods, Tab-completable. `claudeCode list.named` not `list --named`
- **`customTitle` in sessions-index.json**: Set by `/rename`, queryable via jq
- **Backslash + Enter**: Works for newlines in Claude Code prompt (no terminal setup needed)
- **`/terminal-setup`**: Configures Shift+Enter for newlines but can't run inside tmux

## Repetitive Issues

- **tmux send-keys flag collision**: Must remember `--` separator for text starting with dashes
- **Verifying command execution in remote panes**: Always `sleep` + `capture-pane` after `send-keys`
- **Cursor agent TUI "not in a mode" errors**: Use `-l` for literal text to TUI apps
- **OOSH commands concatenating**: When sending to OOSH pane, ensure C-m between commands, don't stack

## History

1. **Explored tmux layout**, identified 2 panes (claude + bash)
2. **Split pane 1**, discovered new pane defaults to zsh (login shell)
3. **Sent test commands** to all panes, verified execution via capture
4. **Ran `otmux`** and tab completion in OOSH pane, catalogued full API
5. **Diagnosed cursor agent crash**: arm64 `pty.node` on Intel i5-7500
6. **Installed `cursor-cli`** via brew (version 2026.01.28-fd13201, darwin/x64)
7. **Repointed symlink** `~/.local/bin/cursor-agent` to brew version
8. **Renamed all panes** via `otmux pane.lock`
9. **Sent introduction** + otmux explanation to cursor agent (GPT-5.1)
10. **Cursor agent explored otmux** independently, confirmed its identity
11. **Both agents assessed** context/token awareness; documented differences
12. **Tasked cursor agent** with API-based token introspection research
13. **Created context files**, cursor agent created its own
14. **Formatted both context files** with bold labels, Key Learnings, Repetitive Issues
15. **Cursor agent reordered sections** to match my headline order
16. **Pre-compact update**, then user triggered /compact
17. **Post-compact recovery** — cursor agent sent correct file (claude-opus.context.md) but hook generated broken boot file
18. **Diagnosed pre-compact hook failure**: no hivemind registration → `unknown` role
19. **Registered both agents** in hivemind via OOSH pane
20. **Patched pre-compress.sh** with `claude-opus` and `cursor-agent` cases
21. **Read cursor agent dialog**, wrote `session/cursor-agent-assessment.md`
22. **Corrected assessment**: cursor agent was right about the file, hook was the bug
23. **Created `projectTeam` tmux session** with all 11 project agents
24. **Improved `claudeCode list`**: added `customTitle` column and `list.named` method
25. **Pre-compact update** of this file, instructing cursor agent for compact assistance
