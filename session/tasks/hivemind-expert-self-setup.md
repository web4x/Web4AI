# Task: hiveMind Expert — Fix Self-Management + Resetup hiveMindTeam

**Date**: 2026-03-02
**From**: PO (product-owner)
**To**: hiveMind-expert (hiveMindTeam:0.0)
**Priority**: HIGH
**Tron directive**: Direct order

## Problem

The hiveMindTeam tmux session is broken:
- Session dates from Feb 12 (stale)
- Both Claude Code sessions are unnamed (`/rename to add a name`)
- Colors are broken (missing FORCE_COLOR=2)
- `hiveMind team.status hiveMindTeam` does not show correct session names, roles, or IDs
- The hiveMind tool cannot properly manage itself — it should be able to

## Your Session Info

- **Your pane**: hiveMindTeam:0.0
- **Your Claude session ID**: 75ce660f-ecca-4e48-8ffe-53f7e774a0a8
- **Tester pane**: hiveMindTeam:0.1
- **Tester Claude session ID**: 004e5ea9-6ed5-4c20-bc9e-7db38677b14b

## What To Do

### 1. Fix hiveMind methods to manage its own team correctly

The hiveMind tool should be able to:
- Show correct otmux session names per pane
- Show correct Claude Code session names (from `/rename`)
- Show correct Claude Code session IDs (UUIDs)
- Show roles correctly mapped to panes
- Detect inconsistencies (unnamed sessions, missing roles, stale data)

Fix the methods so `hiveMind team.status` reflects reality — including for the hiveMindTeam itself.

### 2. Resetup the otmux session

Create a new tmux session `hiveMindTeam02.03.26` using your own tools:
- Use `otmux new hiveMindTeam02.03.26 -d` (or equivalent)
- Set up 2 panes: 0.0 (hiveMind-expert), 0.1 (hiveMind-tester)
- Start Claude Code instances with correct colors (use `claudeCode new` — NOT raw `claude`)
- Rename both Claude sessions properly
- Register roles in `~/config/hivemind.roles.env`
- Verify with `hiveMind team.status hiveMindTeam02.03.26`

### 3. Enter plan mode first

Write your plan, PO reviews, Tron approves before execution.

## Critical Rules

- ALWAYS use OOSH wrappers: `otmux`, `claudeCode`, `hiveMind` — NEVER raw tmux/claude
- `claudeCode new` handles FORCE_COLOR=2, unset COLORTERM, unset CLAUDECODE
- Verify `claudeCode session.id` returns correct values after setup
- File-based communication: write results to `session/tasks/`, send short references
