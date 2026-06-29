# hiveMind reconcile-after-fork — adopt orphan (raw-forked) agents into the controller

**From**: oosh-po@WODA.prod (SM flag: robbin-planner robbinTeam2:0.6 invisible to roster — F-MVC-BYPASS)
**Owners**: oosh-architect (adopt contract) → oosh-expert/hiveMind-expert (impl) → oosh-tester (verify)
**Priority**: HIGH — invisible critical-path agents can't be monitored/unblocked via controller
**Status**: PLAN (BACKLOG — node-provisioning parked)
**Date**: 2026-06-29
**Sprint**: — (hiveMind MVC; tooling)
**Related**: F-MVC-BYPASS learning (oosh-po@WODA.prod/learnings.md), hiveMind consistency.fix/audit, registry-rebuild-from-tty learning

## Problem / Why
Agents true-forked via raw `claude --name` (outside `hiveMind agent.bootstrap`) are NOT in the roster: `team.sweep` misses them, and `agent.monitor`/`agent.unblock` can't target them → forces raw-tmux (the exact bypass that earlier spawned the ARON identity mess). Smoking-gun: `hiveMind process.list` shows the pane with SESSION UUID = `-` (empty). Live case: robbin-planner @ robbinTeam2:0.6.

## Design / Approach
`hiveMind reconcile-after-fork <pane>` (a.k.a. `agent.adopt <pane> [role]`): ADOPT an orphan pane into the controller —
1. Resolve the pane's live claude PID → its session uuid via tty-match (`ps -eo pid,tty,args` ↔ `tmux pane_tty`) — the registry-rebuild technique.
2. Derive role from pane title (or arg) + @host from OOSH_SSH_CONFIG_HOST.
3. Write roles.env (role→pane) + sessions.env (role→uuid) + teams.env (team membership); lock the pane title.
4. Run `consistency.fix`, assert `consistency.audit`=0.
Also: a `team.sweep`/`process.list` WARNING when a pane has a live claude with empty uuid (flag orphans proactively). DRY: reuse existing tty-match + registry.set + consistency.fix; ONE adopt path.
**Doctrine**: `agent.bootstrap` is the ONLY sanctioned fork path; raw `claude --name` is F-MVC-BYPASS. reconcile-after-fork is the recovery when it happens anyway.

## Acceptance Criteria
- [ ] `hiveMind reconcile-after-fork <pane>` registers an orphan fork (role+uuid+pane), consistency.audit→0
- [ ] adopted agent is then targetable by agent.monitor/agent.unblock/team.sweep
- [ ] process.list/team.sweep WARN on live-claude-with-empty-uuid panes (orphan detection)
- [ ] T-RECONCILE-FORK: raw-fork a pane → invisible → reconcile → visible + audit 0
- [ ] DRY: reuses tty-match + registry.set + consistency.fix (no new registry writer)

## PDCA
- Plan: this spec. Do: expert adds reconcile-after-fork + orphan warning. Check: T-RECONCILE-FORK + reconcile the live robbinTeam2:0.6. Act: make agent.bootstrap the enforced path.

## Report-back (owners edit here; one line each, with commit hash)
- Architect (adopt contract):
- Expert (reconcile-after-fork + orphan-warn impl):
- Tester (T-RECONCILE-FORK + live robbinTeam2:0.6 reconcile):
