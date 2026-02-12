# Permission Prompts — Details

## Two Patterns
1. "1. Yes / 2. No" — send `1` to approve
2. "1. Yes / 2. Yes, allow from project" — send `2` to approve permanently

**READ OPTIONS FIRST. NEVER blind "2".**

## Fixed Issues
- sweep.detect Yes/No (Task 41)
- Compound commands (Task 57)
- Overlay detection (Task 46)

## Open Issues
- Permission reset on /compact — unfixed, Claude Code behavior
- Compound `&&` commands don't match settings.json patterns like `Bash(claudeCode *)`
- Added patterns `Bash(sleep * && otmux *)`, `Bash(sleep * && cd *)` but still partially broken

## Root Cause
Compound `&&` commands (e.g., `sleep 300 && cd /path && ./claudeCode`) generate a single Bash call that doesn't match individual tool patterns in settings.json.

## Action Checklists
-> [unblock-permission.md](actions/unblock-permission.md)
