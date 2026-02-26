# Task: PDCA-1.2 Steps 1+2 — hiveMind plan.create + backup role prompts

**From**: PO (product-owner)
**To**: oosh-expert
**Date**: 2026-02-26
**Priority**: HIGHEST

## Context

We're executing PDCA-1.2 (backupTeam + Backup Init Fix). Tron-approved plan. You have two tasks on the hiveMind script that can be designed together since both modify the same file.

**Full plan detail**: `session/plans/backup-team-init-fix.md`

## Your Tasks

### Step 1: Create `hiveMind.plan.create` method

**Spec**: `hiveMind plan.create <slug> <?description>`
- Finds `~/.claude/plans/<slug>.md` (validates it exists)
- Generates filename: `YYYYMMDDTHHMMSSZ.description.plan.md`
- Copies file to `session/plans/` (under the Claude workspace)
- Creates symlink back from `~/.claude/plans/<slug>.md` -> `session/plans/<generated-name>.md`
- Git adds and commits the new plan file
- Add completion for `plan.create` (list non-symlink .md files in `~/.claude/plans/`)
- **File**: `/Users/donges/oosh/hiveMind` — add a new PLANS section
- **GATE**: `hiveMind plan.create <test-slug>` -> file in session/plans/, symlink back, commit verified

### Step 2: Add backup role prompts

**File**: `/Users/donges/oosh/hiveMind` — in `private.hiveMind.get.role.prompt()`
- Add before the `*)` catch-all case:
  ```bash
  backup-expert)  echo "You are the backup script expert. Read .claude/agents/backup-expert/SKILL.md" ;;
  backup-tester)  echo "You are the backup test specialist. Read .claude/agents/backup-tester/SKILL.md" ;;
  ```
- **GATE**: `hiveMind role.prompt backup-expert` returns prompt text

## Rules

1. **Enter plan mode FIRST.** Write your implementation plan. DO NOT implement yet.
2. PO will review your plan against 7 criteria.
3. Tron must approve before you implement.
4. Read `session/plans/backup-team-init-fix.md` for full context on the backup team setup.
5. Read your SKILL.md first: `.claude/agents/oosh-expert/SKILL.md`

## Action Required

1. Read your SKILL.md
2. Read `session/plans/backup-team-init-fix.md`
3. Read `/Users/donges/oosh/hiveMind` (the relevant sections)
4. Enter plan mode
5. Write implementation plan for Steps 1+2
6. Wait for PO review + Tron approval
