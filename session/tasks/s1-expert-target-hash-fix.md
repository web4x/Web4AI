# Expert Task S-1: target-hash placement fix (PREREQ for all of team.push)

**From**: oosh-po@WODA.prod
**Priority**: HIGH — START IMMEDIATELY, this unblocks everything
**Sprint**: sprint-team-migration

## Problem

`teams.migrate` / `agent.restart.remote` place JSONLs at the SOURCE's absolute path on the target. On a target with different `$HOME` or workspace path, the file lands outside `$HOME/.claude/projects/<targetHash>/` → `claudeCode list` blind, fork can't find it.

## What to implement

1. **`private.claudeCode.projectHash <path>`** — compute the project-hash dir name from a workspace path. The hash is the path with `/` replaced by `-` and leading `/` dropped: `/var/dev/Workspaces/AI/Claude` → `-var-dev-Workspaces-AI-Claude`. Check how Claude Code actually computes this (look in `~/.claude/projects/` for the pattern).

2. **Fix `teams.migrate` JSONL transfer** (hiveMind line ~1850): instead of `scp "$remotePath" "${host}:${remotePath}"` (source path on target), compute the TARGET hash from the target workspace path and place into `$HOME/.claude/projects/<targetHash>/<uuid>.jsonl`.

3. **Fix `agent.restart.remote` JSONL transfer** (hiveMind line ~3300): same fix.

4. **Verify**: after scp, run `ossh exec <host> "claudeCode list"` and assert the transferred session appears.

## Read first
- `scrum.pmo/sprints/sprint-team-migration/planning.md` — S-1 story
- Current hiveMind code: `grep -n "scp.*jsonl\|remotePath.*jsonl" hiveMind`

## When done
Commit on dev, push, fill report-back below, ping oosh-po. Then read `session/tasks/s-architect-team-push-design.md` for the full choreography design (when architect delivers) and proceed to S-2..S-8.

## Report-back (edit here)
- Expert (S-1 impl + commit):
