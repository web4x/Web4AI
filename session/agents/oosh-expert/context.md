# OOSH Expert Agent Context

**Session**: oosh-expert@WODA.prod (opus 1M)
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: ooshTeam:0.2
**Machine**: WODA.prod (dev branch, /root/oosh)
**PO**: oosh-po @ ooshTeam:0.0
**Updated**: 2026-06-27 — BOTH SPRINTS COMPLETE. constructor-contract S-1..S-11 + config-selfheal CS-1..CS-5. Holding for rewind.

## Sprint: constructor-contract (S-1..S-11, all verified)

| Commit | Story | What |
|--------|-------|------|
| 76c629b | S-1 team-migration | projectHash + 3 JSONL transfer site fixes |
| 814f7ec | team-migration | team.push controller (preflight, resolveCanonical, push.agent 8 sub-steps) |
| 037e240 | team-migration | /remote-control capture+verify+retry+URL extraction |
| 6ba9b86 | S-8 team-migration | snapshots.list + snapshots.prune |
| 07c6b1e | S-9 team-migration | projectHash bugfix (sed /._) + captureForkedUUID |
| 2a03bae | #6 login fix | config.save emits OOSH_DIR+CONFIG_PATH+OOSH_MODE |
| 6cb5172 | #6 login fix | bashrcTemplate: source user.env before interactive guard |
| e36f6b5 | #10 born-broken | config.repair writes to resolved absolute path |
| 921f0c3 | S-2 constructor | private.this.resolve.fundamentals — BASH_SOURCE chain walker |
| dab7685 | S-3 constructor | config.save unconditional emit — no [ -n ] guards |
| b50355e | S-4 constructor | config.validate accepts source *.env (Rule A) |
| ecfa763 | S-5 constructor | harvest-resolve-merge in config.save — no-loss reinit |
| ab1306e | S-6 constructor | private.this.selfheal — constructors always self-heal |
| 4c1ea97 | S-6 fixes | 7 T-CONSTRUCTOR fixes: harvest file+live, guard log.device |
| cc4da85 | S-10 otmux | otmux.attach self-healing + __test_ completion filter |
| f13f35d | S-10 c2 | c2 completion crash fix — guard empty pipeline + bash -n |
| d83907b | S-10 c2 | c2 completion ';' fix — extract param from signature, fix RC |
| b6300b2 | S-11 config.add | restore source line write (Rule A), dynamic harvest |
| c3e3ffb | GAP-1 | config.add idempotent grep guard |

## Sprint: config-selfheal (CS-1..CS-5)

| Commit | Story | What |
|--------|-------|------|
| d583281 | CS-1 | config.clean: awk dedup preserving line order (replaces sort -u) |
| 2bfc88b | CS-2 | BASH_FILE unconditional emit via which bash fallback |
| 91bfd14 | CS-3 | guard config.save oosh/log sub-saves on OOSH_DIR non-empty |
| bf674b9 | CS-4 | config.validate gate in ossh.install finish+continue |
| fc5b6b3 | CS-5 | fix constructor test fixtures — re-resolve CONFIG after config.save |

## Key architecture
- Constructor contract: this.init/config.save ALWAYS yields valid object
- 3-phase harvest-resolve-merge: FILE+live harvest → BASH_SOURCE resolve → merge+validate
- resolve.fundamentals: BASH_SOURCE chain walker, symlink-safe, no $HOME/oosh guess
- team.push: per-agent verify-or-fail with 8 sub-steps
- c2 completion: empty pipeline guard, bash -n source guard, signature param extraction

## Notes
- WODA.prod has no /dev/tty — use LOG_DEVICE=/dev/stdout
- u20 = born-broken repro box (symlinked ~/config)
