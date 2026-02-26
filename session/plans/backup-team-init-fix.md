# PDCA-1.2 Detail: backupTeam + Backup Init Fix

**Parent**: PDCA-1 Team Coordination
**Date**: 2026-02-26
**Priority**: HIGHEST (Tron directive)

## The Problem

On **McDonges** (local): `backup.env` exists -> everything works.
On **MacStudio** (remote): oosh installed but `backup.env` missing -> `backup init` fails with errors.

> **Tron**: "on the remote computer MacStudio is also installed the same oosh, but the backup.env is missing. i would expect the backup init to initialize all the missing things so the backup script is fully operational. but it fails with errors. when the backup.env exists on the local machine McDonges, then all works pretty good."

**Root cause** (code analysis of `/Users/donges/oosh/backup`):
- `backup.start()` (line 1082-1105) calls `backup.config.discover()` -- walks upward for `.backup.env`
- No `.backup.env` found -> falls back to `$CONFIG_PATH/backup.env` (global)
- If global doesn't exist: return 0 but `RESULT` = path to nonexistent file
- Methods depending on config vars (BACKUP_SOURCE, BACKUP_TARGET) fail -- vars empty
- `BACKUP_CONFIGS_DIR="$HOME/config/backup.configs"` may not exist on fresh install
- `backup.config.create` exists but doesn't handle all initialization steps

**Expected behavior**: `backup init` should:
1. Create `~/config/backup.configs/` tracking dir if missing
2. Create default `~/config/backup.env` with template values
3. Register the config
4. Report what was initialized

## Step Details

### Step 0: Split plan files
- Extract PDCA-1.2 detail -> `session/plans/backup-team-init-fix.md` (THIS FILE)
- Create `session/plans/phase-b-activation.md` stub
- Commit all new files
- This plan index becomes the thin index only

### Step 1: `hiveMind plan.create` method
- **Spec**: `hiveMind.plan.create <slug> <?description>`
- Finds `~/.claude/plans/<slug>.md`
- Generates `YYYYMMDDTHHMMSSZ.description.plan.md`
- Moves to `session/plans/`, symlinks back, git commits
- Add completion for slug (list non-symlink .md files)
- **File**: `/Users/donges/oosh/hiveMind` -- new PLANS section
- **GATE**: `hiveMind plan.create <test>` -> symlink + commit verified

### Step 2: Add backup role prompts
- **File**: `/Users/donges/oosh/hiveMind` line ~71 in `private.hiveMind.get.role.prompt()`
- Add before `*)`:
  ```bash
  backup-expert)  echo "You are the backup script expert. Read .claude/agents/backup-expert/SKILL.md" ;;
  backup-tester)  echo "You are the backup test specialist. Read .claude/agents/backup-tester/SKILL.md" ;;
  ```
- **GATE**: `hiveMind role.prompt backup-expert` returns text

### Step 3: Register backupTeam
- `hiveMind team.register backupTeam "Backup script specialists"`
- Create tmux session + split: 2 panes (expert 0.0, tester 0.1)
- Add to `~/config/hivemind.roles.env`:
  ```
  backupTeam:0.0|backup-expert
  backupTeam:0.1|backup-tester
  ```
- **GATE**: `hiveMind team.list` shows backupTeam, 2 panes exist

### Step 4: Bootstrap agents
- `hiveMind agent.bootstrap backup-expert`
- Wait 10s
- `hiveMind agent.bootstrap backup-tester`
- **GATE**: Both alive, reading SKILL.md (pane captures)

### Step 5: Train backup roles
- agent-trainer reads oosh-expert SKILL.md as OOSH patterns base
- Sends backup script for deep reading
- Verifies understanding of:
  - Config hierarchy (local -> walk upward -> global)
  - Init/bootstrap problem on fresh installs
  - `backup.config.create`, `backup.config.save`, `backup.config.register`
- **PO reviews trainer plan, Tron approves before kickoff**

### Step 6: Fix backup init
- backup-expert analyzes `backup.start()`, `backup.config.discover()`, `backup.config.create()`
- Designs proper init that:
  1. Creates `~/config/backup.configs/` if missing
  2. Creates default `~/config/backup.env` with template
  3. Registers config
  4. Reports initialization
  5. Handles empty BACKUP_SOURCE/TARGET gracefully
- **Tron approves before implementation**
- backup-tester test cases:
  - Fresh install (no backup.env) -> init succeeds
  - Existing config -> init is idempotent
  - Partial config -> fills gaps
- **GATE**: Tests pass, commit exists

### Step 7: GATE

| Check | Command | Expected |
|-------|---------|----------|
| backupTeam registered | `hiveMind team.list` | backupTeam |
| Agents alive | pane captures | Active Claude |
| Role prompts | `hiveMind role.prompt backup-expert` | Text |
| plan.create | `hiveMind plan.create <test>` | Symlink + commit |
| Init fix committed | `git log --grep="backup"` | Commit hash |
| Tests pass | backup-tester results | All PASS |
| Init works fresh | `backup init` (no backup.env) | No errors |

### Step 8: Return to Phase B
- Mark PDCA-1.2 complete
- Resume Phase B

## Critical Files

| File | Changes |
|------|---------|
| `/Users/donges/oosh/hiveMind` | `plan.create` method + backup role prompts |
| `/Users/donges/oosh/backup` | Fix init (constructor + config.discover + config.create) |
| `~/config/hivemind.teams.env` | Add backupTeam |
| `~/config/hivemind.roles.env` | Add backup-expert + backup-tester |

## Tron Directives

> **Tron**: "leave the projectteam tmux session alone. do not reconfigure it. if an agent in it is stuck, reboot the agent in the otmux session base team"

- Do NOT touch projectTeam session layout
- Every agent enters plan mode. PO reviews. Tron approves before kickoff.
- Budget cap: 98% weekly
