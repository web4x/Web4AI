# Task 3: Naming Conventions for tmux Sessions, Windows & Claude Sessions

## Goal

Establish consistent naming conventions so that `claudeCode list` and `otmux list` produce output that makes sense — every session, window, and pane should be identifiable by role/purpose at a glance.

## Problem

Currently tmux pane titles, session names, and Claude Code sessions have ad-hoc names that don't follow a pattern. When you run `claudeCode list` or `otmux list`, the output doesn't clearly show which agent is in which pane.

## Requirements

1. **tmux session names**: Should identify the team (e.g., `oosh-team`, `hivemind-dev`)
2. **tmux window names**: Should identify the workspace context
3. **tmux pane titles**: Should match the agent role name exactly (e.g., `agent-teacher`, `oosh-expert`, `oosh-tester`, `scrum-master`)
4. **Claude Code session names**: Should include the role name so `claudeCode list` shows which agent owns which session

## Naming Convention

| Element | Pattern | Example |
|---------|---------|---------|
| tmux session | `<team>` | `oosh-team` |
| tmux window | `<context>` | `agents` |
| tmux pane title | `<role>` | `scrum-master` |
| Claude Code session | auto (from first prompt) | contains role name |

## Delegation

| Step | Agent | Task |
|------|-------|------|
| 1 | ScrumMaster | Own this task. Understand the naming requirements. |
| 2 | ScrumMaster → Expert | Delegate: update hiveMind methods (team.setup.full, team.setup.oosh, agent.bootstrap) to apply naming conventions. Update otmux and claudeCode if needed. |
| 3 | ScrumMaster → Tester | Delegate: verify naming appears correctly in `claudeCode list` and tmux pane/session listing. |
| 4 | ScrumMaster | Monitor, approve permissions, enforce roles throughout. |

## Acceptance Criteria

- `tmux list-panes -t <session> -F "#{pane_title}"` shows role names
- `claudeCode list` shows sessions identifiable by agent role
- `otmux list` (or `tmux list-sessions`) shows meaningful session names
- hiveMind bootstrap methods apply these names automatically
- Each agent's context file is updated after changes

## Files Likely Modified

- `components/OOSH/dev.claude/hiveMind` — naming in setup methods
- `components/OOSH/dev.claude/claudeCode` — session naming
- `components/OOSH/dev.claude/otmux` — if session naming logic lives here
- `test/test.hiveMind` — verify naming
- `session/agents/*.context.md` — each agent updates their own
