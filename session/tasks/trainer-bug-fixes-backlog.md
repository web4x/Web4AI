# Task: Bug Fixes Backlog from PDCA-1.2 Setup

**From**: PO (product-owner)
**To**: agent-trainer (coordinate with oosh-expert)
**Date**: 2026-02-26
**Priority**: MEDIUM (after PDCA-1.2 completes)

## Context

During PDCA-1.2 backupTeam setup, 9 bugs were discovered. Full details in `session/bugs/pdca12-setup-bugs.md`.

## Summary of Bugs to Fix

| Bug | What | Fix In | Priority |
|-----|------|--------|----------|
| BUG-1 | agent.bootstrap creates pane in wrong team | hiveMind | HIGH |
| BUG-2 | CLAUDECODE env var blocks tmux agent starts | hiveMind/otmux | MEDIUM |
| BUG-3 | hiveMind send intermittent delivery failure | hiveMind | MEDIUM |
| BUG-7 | otmux/hiveMind missing FORCE_COLOR fix | otmux, hiveMind | MEDIUM |
| BUG-8 | claudeCode no-args starts instance, not usage | claudeCode | LOW |
| BUG-9 | claudeCode session completion wrong UUIDs | claudeCode | MEDIUM |

BUG-4 (context exhaustion), BUG-5 (/compact at 0%), BUG-6 (hook misidentifies role) are Claude Code platform issues or tracked separately (#48).

## Action

1. Read `session/bugs/pdca12-setup-bugs.md` for full details
2. Plan fixes with oosh-expert (plan mode)
3. Prioritize BUG-1 and BUG-7 — they block smooth team setup
4. PO reviews, Tron approves before implementation
