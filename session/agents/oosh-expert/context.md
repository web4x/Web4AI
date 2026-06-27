# OOSH Expert Agent Context

**Session**: oosh-expert@WODA.prod (opus 1M)
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: ooshTeam:0.2
**Machine**: WODA.prod (dev branch, /root/oosh)
**PO**: oosh-po @ ooshTeam:0.0
**SM**: scrum-master @ TRONinterface:0.1
**Updated**: 2026-06-27 — sprint-constructor-contract S-1..S-10 ALL DONE+VERIFIED. Holding for rewind.

## Completed this sprint (constructor-contract + team-migration)

| Commit | Story | What |
|--------|-------|------|
| 76c629b | S-1 team-migration | projectHash + 3 JSONL transfer site fixes |
| 814f7ec | team-migration | team.push controller (preflight, resolveCanonical, push.agent 8 sub-steps, reconcile.apply) |
| 037e240 | team-migration | /remote-control capture+verify+retry+URL extraction |
| 6ba9b86 | S-8 team-migration | snapshots.list + snapshots.prune |
| 07c6b1e | S-9 team-migration | projectHash bugfix (sed /._) + captureForkedUUID |
| 2a03bae | #6 login fix | config.save emits OOSH_DIR+CONFIG_PATH+OOSH_MODE into user.env |
| 6cb5172 | #6 login fix | bashrcTemplate: source user.env before interactive guard + OOSH_DIR guards |
| e36f6b5 | #10 born-broken | config.repair writes to resolved absolute path |
| 921f0c3 | S-2 constructor | private.this.resolve.fundamentals — BASH_SOURCE-based, no $HOME/oosh guess |
| dab7685 | S-3 constructor | config.save unconditional emit — resolve then emit, no [ -n ] guards |
| b50355e | S-4 constructor | config.validate accepts source *.env (Rule A), rejects other logic |
| ecfa763 | S-5 constructor | harvest-resolve-merge in config.save — no-loss reinit, repair=alias |
| ab1306e | S-6 constructor | private.this.selfheal — constructors always self-heal, never RC=1 |
| 4c1ea97 | S-6 fixes | 7 T-CONSTRUCTOR fixes: harvest file+live, guard log.device |
| cc4da85 | S-10 otmux | otmux.attach self-healing + __test_ completion filter |
| f13f35d | S-10 c2 | c2 completion crash fix — guard empty pipeline + bash -n before source |

## Key methods implemented
- `private.this.resolve.fundamentals` — BASH_SOURCE chain walker, symlink-safe
- `private.this.selfheal` — auto-repair logic pollution in user.env
- `config.repair` — alias for config.save (repair IS init)
- `config.validate` — accepts export/declare/source*.env, rejects logic
- `hiveMind.team.push` — full per-agent verify-or-fail migration controller
- `private.hiveMind.push.preflight/resolveCanonical/agent/captureForkedUUID`
- `hiveMind.consistency.reconcile.apply` — flagless object.verb wrapper
- `hiveMind.snapshots.list/prune`
- `private.claudeCode.projectHash` — encode path to hash (replaces /._ with -)

## Awaiting
- PO rewind directive

## Notes
- WODA.prod has no /dev/tty — use `LOG_DEVICE=/dev/stdout` prefix
- dev was reset to macos.latest MVC at 0e5f7dd, team.push cherry-picked clean
- u20 is the born-broken repro box (symlinked ~/config)
