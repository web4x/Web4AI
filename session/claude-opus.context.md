# Claude Code (Opus 4.6) Session Context

> Multi-agent tmux workspace on Intel Mac. 11-agent projectTeam bootstrapped, renamed, and running.

## Session Goals

- **Set up project agent team**
  - [x] Created `projectTeam` tmux session with 11 agents (2 windows)
  - [x] All registered in hivemind
  - [x] Bootstrapped all 11 agents via `hiveMind agent.bootstrap`
  - [x] Locked pane titles to role names
  - [x] `/rename` all 11 agent sessions to `role@sonnet` format
- **Fix otmux tree** — correct session name + ID display
  - [x] Fixed `claudeCode session.name` — added Method 2: check JSONL `custom-title` entries before firstPrompt fallback
  - [x] Fixed `claudeCode session.id` — added Method 3: match pane title to JSONL `custom-title` pattern (`role@model`)
  - [x] Fixed `$TMUX_CMD` → `tmux` bug in session.id (claudeCode doesn't use $TMUX_CMD)
  - [x] All 11 agents now show correct names + unique session IDs in tree
  - [x] Added tab-completion to `claudeCode session.name` (reuses `join.completion.session`)
  - [ ] **Performance**: tree is slow — calls session.id + session.name per pane (subprocess-heavy)
  - [ ] **Optimization idea**: read hivemind registry + sessions-index.json once upfront, no per-pane subprocesses
  - [ ] **sessions-index.json is stale**: agent sessions not in index; consider updating it ourselves or building own cache
  - [ ] `claudeCode list.named` doesn't show agents (reads stale index only)

## Last Update

- **UTC Time**: 2026-02-11 ~16:45 UTC
- **Session started**: 2026-02-11 ~14:00 UTC (post-compact)

## Pane Layout

### Main session: claudeOpus2kTMUX
```
0.0 claudeSonnet1mSession       | 0.1 oosh@McDonges-4.fritz.box
    Claude Code (Opus 4.6)      |     OOSH bash shell (control pane)
--------------------------------|---------------------------------
0.2 cursor.agent@auto           | 0.3 zsh@McDonges-4.fritz.box
    Cursor Agent CLI (node)     |     plain zsh (utility)
```

### projectTeam (11 agents, ALL RUNNING, ALL RENAMED)
```
Window 0: orchestrator | oosh-expert | oosh-tester | scrum-master | product-owner | agent-trainer
Window 1: woda-writer | woda-scribe | task-agent | developer | script-product-owner
```
All panes running Claude Code 2.1.39 (Sonnet), titles locked to role names.

### Agent Session IDs
| Pane | Role | Session ID | Custom Title |
|------|------|-----------|-------------|
| 0.0 | orchestrator | 3b2af60c | orchestrator@sonnet |
| 0.1 | oosh-expert | 2120c2ee | oosh-expert@sonnet |
| 0.2 | oosh-tester | e93582de | oosh-tester@sonnet |
| 0.3 | scrum-master | 0f0755a8 | scrum-master@sonnet |
| 0.4 | product-owner | b2563d89 | product-owner@sonnet |
| 0.5 | agent-trainer | 564326f2 | agent-trainer@sonnet |
| 1.0 | woda-writer | f5de0cee | woda-writer@sonnet |
| 1.1 | woda-scribe | 0c0d6e13 | woda-scribe@sonnet |
| 1.2 | task-agent | 5fff44f4 | task-agent@sonnet |
| 1.3 | developer | 02fab423 | developer@sonnet |
| 1.4 | script-product-owner | 41686d26 | script-product-owner@sonnet |

## Files Modified This Session

| File | Change |
|------|--------|
| `/Users/donges/oosh/claudeCode` | `session.name()`: added Method 2 (JSONL custom-title lookup before firstPrompt). `session.id()`: added Method 3 (match pane title → JSONL custom-title). Added `session.name.completion.sessionId()`. Fixed `$TMUX_CMD` → `tmux`. |
| `/Users/donges/oosh/otmux` | No changes this session (tree code from previous session) |
| `/Users/donges/oosh/hiveMind` | No changes this session |

## Key Learnings

- **`sessions-index.json` is lazy**: Active sessions never appear in the index. Only populated when Claude Code lists sessions (e.g., welcome screen). Agent sessions NOT in index even 30+ min after `/rename`.
- **JSONL `custom-title` entries**: `/rename` writes `{"type":"custom-title","customTitle":"..."}` to the JSONL file — this is the real-time source of truth for session names.
- **Double `/rename` corruption**: Sending `/rename` twice concatenates into multi-line customTitle (`name\n/rename name`). Fix: take first line only with `${ct%%$'\n'*}`.
- **`$TMUX_CMD` is otmux-only**: The `claudeCode` script uses bare `tmux`, not `$TMUX_CMD`. Using `$TMUX_CMD` in claudeCode silently fails.
- **`/rename` in busy agents**: If agent is in a confirmation dialog, `/rename` text goes into the dialog, not processed as slash command. Must wait for idle `❯` prompt.
- **`hiveMind.sweep`**: Iterates hivemind registry (`/tmp/hivemind.roles`) per session, captures pane output. Same pattern useful for batch operations.
- **`hiveMind.broadcast`**: Sends same message to all agents. Not useful for per-agent commands (like unique renames).
- **Tasks directory**: Only 4 of 11 agents have `~/.claude/tasks/<sid>/` dirs (those with background tasks). Others don't — that's why `session.id` Method 2 (lsof for tasks/) fails for idle agents.
- **OOSH remote control**: Use OOSH pane (0.1) for all hiveMind/claudeCode/otmux commands, not raw tmux from Claude.
- **OOSH re-sourcing**: After editing a script, the FIRST OOSH call still uses old code, SECOND call picks up changes (re-sourced via `source this`).
- **Never use `--dangerously-skip-permissions`** in automated agent startup — user preference.

## Pending / Next Steps

1. **Optimize otmux tree performance** — replace per-pane subprocess calls with upfront lookup table (read hivemind registry + session data once)
2. **Fix `sessions-index.json` staleness** — either update it ourselves after `/rename`, or build own cache file
3. **Fix `claudeCode list.named`** — currently reads stale sessions-index.json only, doesn't show agent sessions
4. Verify all agents understood their roles, assign first tasks

## Recovery

1. Read this file
2. Run `otmux` via OOSH pane to see all agents with session IDs
3. Run `hiveMind team.status` to check agent health
4. Next: optimize tree performance (see Pending above)

## History

1-35. (Previous sessions — see git history)
36. **Renamed all 11 agent sessions** to `role@sonnet` via `/rename` — first manual, then via hiveMind registry loop through OOSH pane
37. **Fixed `claudeCode session.name`** — added Method 2: JSONL `custom-title` lookup (before firstPrompt fallback)
38. **Fixed `claudeCode session.id`** — added Method 3: match pane title to JSONL `custom-title` pattern. Fixed `$TMUX_CMD` bug.
39. **Added tab-completion** to `claudeCode session.name` — reuses `join.completion.session`
40. **Identified performance issue**: tree slow due to per-pane subprocess calls (session.id + session.name). Discussed optimization: upfront lookup from hivemind registry + single JSONL scan.
41. **Identified `sessions-index.json` staleness**: agent sessions never indexed. `/rename` writes to JSONL only, not to index. Index has only 11 old entries.
