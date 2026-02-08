# Task 31 — Add Monitoring Commands to settings.json Permissions

**Created**: 2026-02-04T15:07Z
**Status**: Done (commit 8d79b31, local only)
**Priority**: High — permission prompts are the #1 cause of team stalls
**Requested by**: Product Owner (via Orchestrator)
**Assigned to**: oosh-expert

## Original Directive (verbatim)

> Permission prompts are the #1 cause of team stalls. Common monitoring commands trigger prompts every time. Fix: Add to `.claude/settings.json` → `permissions.allow[]`.

## Problem

Agents constantly get blocked by permission prompts for routine monitoring commands (pane capture, send, team status). Every blocked agent requires manual intervention from ScrumMaster or Orchestrator to unblock, causing cascading stalls.

## Commands to Add

Add to `.claude/settings.json` → `permissions.allow[]`:
- `./otmux pane.capture *`
- `./otmux send *`
- `./hiveMind send *`
- `./hiveMind monitor *`
- `./hiveMind team.status`
- `./hiveMind resolve *`
- `./otmux tree`
- `sleep *`
- `bash -n *`

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-expert | Add all listed commands to `.claude/settings.json` permissions.allow array |
| 2 | oosh-expert | Verify no duplicates with existing permissions |

## Acceptance Criteria

- [ ] All 9 command patterns added to `.claude/settings.json` → `permissions.allow[]`
- [ ] No duplicate entries
- [ ] Agents can run monitoring commands without permission prompts
- [ ] No overly broad permissions (specific to listed commands only)
