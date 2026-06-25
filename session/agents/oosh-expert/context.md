# OOSH Expert Agent Context

**Session**: oosh-expert@WODA.prod (opus 1M)
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: ooshTeam:0.2
**Machine**: WODA.prod (dev branch, /root/oosh)
**PO**: oosh-po @ ooshTeam:0.0
**SM**: scrum-master @ TRONinterface:0.1
**Updated**: 2026-06-25 — sprint-team-migration, S-1 through S-9 blockers delivered, cherry-picked onto clean base.

## ⚠️ CURRENT STATE (2026-06-25)

### Sprint: team-migration

All work cherry-picked onto clean dev base (0e5f7dd MVC reset):

| Commit | What | Status |
|--------|------|--------|
| 76c629b | S-1: projectHash + 3 JSONL transfer site fixes | ON DEV |
| 814f7ec | team.push controller (preflight, resolveCanonical, push.agent 8 sub-steps, reconcile.apply) | ON DEV |
| 037e240 | /remote-control capture+verify+retry+URL extraction | ON DEV |
| 6ba9b86 | S-8: snapshots.list + snapshots.prune | ON DEV |
| 07c6b1e | S-9 blockers: projectHash bugfix (sed /._) + captureForkedUUID | ON DEV |

### Earlier completed (pre-sprint, on macos.latest):
- d45031a: env-files-pure-state (source chain→this, config.validate)
- f74c20a: hiveMind MVC parity merge (macos.latest→dev, 41 commits)
- 6 commits from restore-backlog (sweep.detect, claudeCode.stop, send.zoomed, this-dispatch, DURING_REWIND, c2 completion)

### Key methods implemented this sprint:
- `hiveMind.team.push <host> <?teamSession>` — full per-agent verify-or-fail migration
- `private.hiveMind.push.preflight` — SSH/oosh/tmux validation
- `private.hiveMind.push.resolveCanonical` — session.name identity truth + mtime/linecount dedup
- `private.hiveMind.push.agent` — 8 sub-steps (target-hash, JSONL place+verify, collision, fork+resume-menu, captureForkedUUID, rename+verify, /rc+verify, registry+lock, MVC verify)
- `private.hiveMind.push.captureForkedUUID` — pre/post diff (Strategy B) + customTitle fallback (Strategy A) + sessions.env write
- `hiveMind.consistency.reconcile.apply` — flagless object.verb wrapper
- `hiveMind.snapshots.list` / `hiveMind.snapshots.prune`
- `private.claudeCode.projectHash` — encode path to hash (replaces /._  with -)

### Awaiting:
- PO verification of cherry-picked dev (07c6b1e)
- S-9 dogfood (live team.push test)
- Tester T-PUSH tests

## LOG_DEVICE note
WODA.prod container has no /dev/tty — use `LOG_DEVICE=/dev/stdout` prefix for commands that log.
