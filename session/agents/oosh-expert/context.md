# OOSH Expert Agent Context

**Session**: oosh-expert@WODA.prod (opus 1M)
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: ooshTeam:0.2
**Machine**: WODA.prod (dev branch, /root/oosh)
**PO**: oosh-po @ ooshTeam:0.0
**Updated**: 2026-06-27 — sprint-constructor-contract ALL DONE+VERIFIED (S-1..S-10). Holding.

## Completed this sprint (18 commits, all verified)

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
| 921f0c3 | S-2 constructor | private.this.resolve.fundamentals — BASH_SOURCE chain walker |
| dab7685 | S-3 constructor | config.save unconditional emit — no [ -n ] guards |
| b50355e | S-4 constructor | config.validate accepts source *.env (Rule A) |
| ecfa763 | S-5 constructor | harvest-resolve-merge in config.save — no-loss reinit |
| ab1306e | S-6 constructor | private.this.selfheal — constructors always self-heal |
| 4c1ea97 | S-6 fixes | 7 T-CONSTRUCTOR fixes: harvest file+live, guard log.device |
| cc4da85 | S-10 otmux | otmux.attach self-healing + __test_ completion filter |
| f13f35d | S-10 c2 | c2 completion crash fix — guard empty pipeline + bash -n before source |
| d83907b | S-10 c2 | c2 completion ';' fix — extract param from signature, fix RC=0 |
| 0c26839 | born-broken fix | config.repair ground truth resolution (superseded by S-2/S-5) |

## Key architecture delivered
- **Constructor contract**: this.init/config.save ALWAYS yields valid object — self-heals, never RC=1
- **3-phase harvest-resolve-merge**: FILE harvest + live env → BASH_SOURCE resolve → fundamentals-first merge + validate
- **resolve.fundamentals**: BASH_SOURCE chain walker finds oosh dir by this+config file presence, symlink-safe
- **team.push**: per-agent verify-or-fail migration with 8 sub-steps per agent
- **c2 completion**: empty pipeline guard, bash -n source guard, signature-based param extraction

## Notes
- WODA.prod has no /dev/tty — use LOG_DEVICE=/dev/stdout
- u20 is the born-broken repro box (symlinked ~/config)
- dev was reset to macos.latest MVC at 0e5f7dd, team.push cherry-picked clean
