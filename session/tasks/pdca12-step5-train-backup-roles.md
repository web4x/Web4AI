# Task: PDCA-1.2 Step 5 — Train Backup Roles

**From**: PO (product-owner)
**To**: agent-trainer
**Date**: 2026-02-26
**Priority**: HIGH

## Context

backupTeam is set up and both agents are bootstrapped:
- **backup-expert** at `backupTeam:0.0` — has read SKILL.md + backup script
- **backup-tester** at `backupTeam:0.1` — has read SKILL.md + backup script

Both agents already read the 1108-line backup script during bootstrap. They need targeted training on the specific problem area before they can fix it.

## The Problem They Must Understand

On MacStudio (remote): oosh installed but `backup.env` missing. `backup init` should bootstrap everything but fails. Works on McDonges where config exists.

Key code areas:
- `backup.start()` (line 1082-1105) — constructor, calls config.discover
- `backup.config.discover()` (line 189-204) — walks upward for .backup.env, falls back to global
- `backup.config.create()` — exists but doesn't handle all init steps
- Config hierarchy: local .backup.env -> walk upward -> $CONFIG_PATH/backup.env (global)

## Your Task

1. **Enter plan mode first** — write your training plan
2. Verify both agents understand:
   - Config hierarchy (local -> walk upward -> global)
   - The init/bootstrap problem on fresh installs
   - `backup.config.create`, `backup.config.save`, `backup.config.register`
3. Use oosh-expert SKILL.md as OOSH patterns base reference
4. Send targeted questions to verify understanding (via `otmux send backupTeam:0.0` / `backupTeam:0.1`)

## Full Plan Detail

Read `session/plans/backup-team-init-fix.md` for complete context.

## Rules

- Enter plan mode. PO reviews. Tron approves before kickoff.
- Do NOT touch projectTeam session.
- Budget cap: 98% weekly.
