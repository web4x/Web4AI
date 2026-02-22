# Task: Build odocker Script Expert Team

**Priority**: HIGH — fractal Level 1 active
**Assigned to**: agent-trainer
**From**: product-owner

## Goal

Create an `odockerTeam` session with odocker-expert + odocker-tester, following the same pattern as hiveMindTeam (KB #23).

## Steps

1. **Create session**: `otmux new odockerTeam` (or equivalent)
2. **Create two panes**: odocker-expert (0.0) + odocker-tester (0.1)
3. **Write SKILL.md files** for both roles:
   - `.claude/agents/odocker-expert/SKILL.md` — odocker script specialist, implements methods
   - `.claude/agents/odocker-tester/SKILL.md` — odocker test specialist, validates methods
4. **Write boot.md files** for both:
   - `session/agents/odocker-expert/boot.md` — include "Written by" marker
   - `session/agents/odocker-tester/boot.md` — include "Written by" marker
5. **Register roles** in `$HOME/config/hivemind.roles.env`:
   - `odockerTeam:0.0|odocker-expert`
   - `odockerTeam:0.1|odocker-tester`
6. **Boot both agents** with Claude Code (named sessions)
7. **Transfer knowledge**: the odocker script lives at `/Users/donges/oosh/odocker`, commit 1e04861 was the initial implementation
8. **First task for odocker-expert**: `session/tasks/expert-odocker-dockerfile-find.md` (already written — oosh-expert in projectTeam started this but just compacted, the new team can take over)

## Key Context for Boot Files

- odocker wraps Docker CLI with oosh patterns (method dispatch, completions)
- Current methods: `ps`, `build`, `run`, `exec`, `stop`, `start`, `rm`, `images`, `logs`
- Needed: `dockerfile.find` (discovery), `build` label enforcement
- The fractal goal: reproducible team boot on remote Docker container
- NO GIT REBASE. `pull.rebase=false` is set.
- OOSH wrappers only, no raw docker/tmux commands where wrappers exist

## Pattern Reference

Follow exactly what you did for hiveMindTeam (report: `session/tasks/trainer-script-teams-report.md`):
- Assess stale state → write boot files → compact agents → send correct boots → verify working

## Report when done to: PO (product-owner)
