# Claude Code (Opus 4.6) Session Context

> Multi-agent tmux workspace on Intel Mac. 11-agent projectTeam bootstrapped and running.

## Session Goals

- **Establish shared tmux environment** with cross-agent awareness
  - [x] All prior goals from previous session (see History 1-25)
- **Set up project agent team**
  - [x] Created `projectTeam` tmux session with 11 agents (2 windows)
  - [x] All registered in hivemind
  - [x] Bootstrapped all 11 agents via `hiveMind agent.bootstrap` (Claude running, roles taught)
  - [x] Locked pane titles to role names (prevents Claude overwriting)
  - [ ] `/rename` each agent session with a meaningful name
  - [ ] Verify all agents understood their roles, assign first tasks
- **Improve otmux tree** with AI agent awareness
  - [x] Added session ID detection using `claudeCode session.id`
  - [x] Added sub-line under agent panes showing session name + session ID
  - [x] Session name sourced from persistent `sessions-index.json` (customTitle from /rename)
  - [x] JSONL fallback for sessions not yet in index (firstPrompt, tags stripped)
  - [x] Cursor agent detection (node + cursor in title)
- **Improve claudeCode**
  - [x] Added `customTitle` (from /rename) to `claudeCode list` output
  - [x] Created `claudeCode list.named` method
  - [x] Created `claudeCode session.name <uuid>` method (persistent lookup)
- **Remove --dangerously-skip-permissions**
  - [x] Removed from `claudeCode agent.start`
  - [x] Removed from `hiveMind agent.bootstrap` and all 8 occurrences in hiveMind
  - [x] `claudeCode dangerously`/`yolo` kept (explicit user choice)
- **Fix hiveMind roles**
  - [x] Added `woda-writer` and `woda-scribe` to `private.hiveMind.get.role.prompt()` case statement

## Last Update

- **UTC Time**: 2026-02-11 ~14:30 UTC
- **Session started**: 2026-02-11 ~13:20 UTC (post-compact)

## Pane Layout

### Main session: claudeOpus2kTMUX
```
0.0 claudeSonnet1mSession       | 0.1 oosh@McDonges-4.fritz.box
    Claude Code (Opus 4.6)      |     OOSH bash shell (control pane)
--------------------------------|---------------------------------
0.2 cursor.agent@auto           | 0.3 zsh@McDonges-4.fritz.box
    Cursor Agent CLI (node)     |     plain zsh (utility)
```

### projectTeam (11 agents, ALL RUNNING)
```
Window 0: orchestrator | oosh-expert | oosh-tester | scrum-master | product-owner | agent-trainer
Window 1: woda-writer | woda-scribe | task-agent | developer | script-product-owner
```
All panes running Claude Code 2.1.39, titles locked to role names.

## Files Modified This Session

| File | Change |
|------|--------|
| `/Users/donges/oosh/otmux` | `tree()`: agent detection with sub-line (session name + ID from persistent data) |
| `/Users/donges/oosh/claudeCode` | Added `session.name()`, removed `--dangerously-skip-permissions` from `agent.start` |
| `/Users/donges/oosh/hiveMind` | Removed all `--dangerously-skip-permissions`, added woda-writer/scribe role prompts |

## Key Learnings

- **`claudeCode session.id` fallback limitation**: Method 3 (most recent JSONL) returns same ID for all agents in same project dir — needs improvement
- **`sessions-index.json` is lazy**: New sessions don't appear in index immediately; JSONL fallback needed
- **JSONL firstPrompt parsing**: First user messages contain `<local-command-caveat>` and `/clear` system tags — must strip tags and filter system lines
- **`otmux pane.lock`**: Sets title + `allow-rename off` + `pane-title-changed` hook — prevents Claude Code from overwriting role names
- **tmux pane user options**: `@agent_title` via `set-option -p` works but is TEMPORARY (lost on restart) — use persistent sources instead
- **`jq` string slice**: Use `[0:40]` not `[:40]` for substring in jq
- **Never use `--dangerously-skip-permissions`** in automated agent startup — user preference
- **OOSH remote control**: Use OOSH pane (0.1) to run hiveMind/claudeCode/otmux commands, not raw tmux from Claude
- **hiveMind agent.bootstrap**: Full lifecycle — pane.identify + start Claude + teach role. Pass 3rd arg for existing panes.

## Repetitive Issues

- **tmux send-keys flag collision**: Must remember `--` separator for text starting with dashes
- **Verifying command execution in remote panes**: Always `sleep` + `capture-pane` after `send-keys`
- **OOSH script caching**: After editing a script, next OOSH call picks up changes (re-sourced via `source this`)
- **Session ID collision**: Multiple agents in same project dir share fallback session ID — don't trust Method 3 for multi-agent setups

## Recovery

1. Read this file
2. Run `otmux tree` via OOSH pane to see all agents with session IDs
3. Run `hiveMind team.status` to check agent health
4. Next: `/rename` agent sessions, verify roles, assign first tasks
5. Consider fixing `claudeCode session.id` Method 3 for multi-agent disambiguation

## History

1-25. (Previous session — see git history for full log)
26. **Read context files** (claude-opus.context.md, boot/claude-opus.md, agent.context.md)
27. **Modified `otmux tree`**: added session ID detection for AI agent panes using `claudeCode session.id`
28. **Bootstrapped all 11 projectTeam agents** via `hiveMind agent.bootstrap` through OOSH pane
29. **Added woda-writer/scribe** role prompts to hiveMind (were missing from case statement)
30. **Removed `--dangerously-skip-permissions`** from claudeCode.agent.start and all hiveMind occurrences
31. **Restored pane titles** to original role names, stored Claude-set titles as @agent_title (temporary)
32. **Enhanced `otmux tree`** with sub-line showing session name + ID under agent panes
33. **Created `claudeCode session.name`** method — looks up customTitle from sessions-index.json, falls back to JSONL firstPrompt
34. **Replaced @agent_title** (temporary) with persistent `claudeCode session.name` lookup in tree
35. **Fixed JSONL firstPrompt parsing** — strip XML tags, filter system caveats, correct pipeline order
