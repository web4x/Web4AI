# hiveMind dead-validator calls — ranked breakage list (oosh-expert, 2026-10-28)

**Status**: ANALYSIS ONLY — no hiveMind code changed. Queued as oosh-expert's NEXT task after the claudeCode fix.
**Sequencing (oosh-po)**: ONE hiveMind pass — validators and stale-role Rule 2 as SEPARATE commits, re-read the tree between them. Never in parallel with Rule 2.
**Fix pattern (PO-approved)**: local `private.hiveMind.is*` validators, regexes unchanged — Tron's otmux precedent in `b745e766`. Do NOT revive the kernel `this.is*`.

## Two independent root causes

| Validator | State on deployed `test/mcdonges.latest` | Broken since |
|---|---|---|
| `isPaneTarget`, `isSessionName`, `isRoleName`, `isUuid`, `isPipeSafe` | commented out in `this:80-108` | `b745e766` "fixed this.is.... bloating" (2026-10-22) |
| `isSshHost` | **never defined on this lineage** — its definition `317e0d7f` (2026-05-25) is only on `test/macos.latest` / `dev-teampush-astray`; hiveMind's calls arrived without it | pre-existing, undated — independent of `b745e766` |

Mechanism: `if ! this.isX "$v"` → `command not found` (rc 127) → negated → the method logs "invalid …" and returns 1 for EVERY input.

## Ranked by fleet impact

Ranking = automatic/silent paths first (they corrupt state with nobody calling them), then references (CLI invocations in session/ + .claude/ + oosh scripts, plus internal call sites).

### Tier 0 — fires automatically on every tmux event, error SILENCED (strongest root-cause candidate)
| Method | Dead validators | Trigger |
|---|---|---|
| `hiveMind.protected.pane.moved` | PaneTarget, PipeSafe | `otmux` on every pane move (`2>/dev/null`) |
| `hiveMind.protected.panes.swapped` | PaneTarget, PipeSafe, SessionName | `otmux:2946` on every swap (`2>/dev/null`) |
| `hiveMind.protected.session.renamed` | SessionName, PipeSafe | `otmux:209` on every rename (`2>/dev/null`) |

**PROVEN** (deployed, safe — rejection cannot mutate): `hiveMind protected.pane.moved ooshTeam:0.3 ooshTeam:0.3` → `this.isPaneTarget: command not found` → `invalid pane target(s) … rejected`, rc=1.
Consequence: the `pane.moved` / `panes.swapped` events never emit → `private.hiveMind.handler.*.{registry,role_env}` never run → **registry + role_env have not followed any move/swap/rename since 2026-10-22**. This is a strong root-cause candidate for the stale-registry send-by-name misrouting AND the queued stale-role-label task (not yet proven causal — verify after the fix: move a pane, check registry follows).

### Tier 1 — migration / restore / cross-host hot path
| Refs | Method | Dead validators | Note |
|---:|---|---|---|
| 26 | `hiveMind.team.push` | SshHost | isSshHost never defined here |
| 21 | `hiveMind.teams.restore` | SessionName | + calls `snapshot.row.valid` |
| 19 | `hiveMind.team.pull` | SshHost | |
| 15 | `hiveMind.teams.migrate` | SshHost | |
| 10 | `hiveMind.agent.restart.remote` | RoleName, SshHost, PaneTarget | |
| 7 | `hiveMind.team.migrate` | SessionName, PipeSafe | + calls `snapshot.row.valid` |
| (2 internal) | `private.hiveMind.snapshot.row.valid` | SessionName, RoleName, Uuid, PipeSafe | rejects every row with a non-empty session/role/uuid → restore/migrate silently DROP rows |

### Tier 2 — interactive team/agent management
| Refs | Method | Dead validators |
|---:|---|---|
| 8 | `hiveMind.team.switch` | SessionName, PipeSafe |
| 8 | `hiveMind.agent.rename` | RoleName, PipeSafe |
| 5 | `hiveMind.team.remove` | SessionName, PipeSafe |
| 4 | `hiveMind.team.setup` | SessionName, PipeSafe |
| 4 | `hiveMind.task.delegate` | SshHost, PaneTarget |
| 4 | `hiveMind.registry.remove` | PaneTarget, PipeSafe |
| 4 | `hiveMind.delegate` | RoleName |
| 4 | `hiveMind.agent.state.set` | RoleName |
| 3 | `hiveMind.team.setup.full` | SessionName, PipeSafe |
| 3 | `hiveMind.roles.list.uuids` | RoleName |
| 2 | `hiveMind.team.state.set` | SessionName |
| 1 | `hiveMind.team.host.set` | SessionName |
| 1 | `hiveMind.agent.spawn` | RoleName, PipeSafe |
| 1 | `hiveMind.agent.rewind` | PaneTarget |
| 0 | `hiveMind.protected.team.import` | SessionName, PipeSafe |

### Silent misroute (not an error — a wrong branch)
`hiveMind:3603` `elif this.isSessionName "$arg" 2>/dev/null; then` — used as a DISCRIMINATOR, so it is always false and the session-name branch is never taken. Verify which code path that silently takes instead.

## Architect triage — calls NOT covered by e48ba430, ranked by LIVE reachability (oosh-architect, 2026-10-28)
Method: my own read-only static scan (`/tmp/claude-0/-var-dev-Workspaces-AI-Claude/94fe28f8-8ca4-4689-95e1-69f5b2237260/scratchpad/deadcalls.sh`: every `script.method` / `private.*` / `this.*` call that no OOSH script defines). Then I checked every candidate line by hand: strings, comments, embedded Python `os.*`, and arguments to another script (`ossh config.create`, `claudeCode context.read`) are excluded. A = on a path the fleet hits now · B = reachable but rare · C = no live caller.

| # | script:line | Dead call | Caller path | Class | Fix shape |
|---|---|---|---|---|---|
| 1 | **hiveMind:9295** | `private.hiveMind.agent.queue.drain` (only the PUBLIC `hiveMind.agent.queue.drain` :8877 exists) | `private.hiveMind.agent.unblock.pane`, `idle)` branch: the auto-drain-on-idle that runs on every unblock/sweep. `2>/dev/null` hides the failure | **A** | Repoint to the defined public `hiveMind.agent.queue.drain` (one line). Don't add a private alias. **Queued messages never auto-drain today**, which breaks the §8 no-strand invariant (T-DELIVERY-EXACTLY-ONCE case 2) |
| 2 | **hiveMind:2426** | `otmux.rewind.drive` (defined nowhere; also an in-process call to another script's function, which the never-source-scripts rule forbids) | `hiveMind.agent.rewind` after it sets DURING_REWIND | **B** | Fails safe: rc 127, then the always-clear removes the hold. Rewinds are driven by hand per agent-rewind.md. Make `agent.rewind` **refuse loudly** ("drive not implemented — drive manually per agent-rewind.md") until a real `otmux rewind.drive` exists. Don't delete it; its auth and poke-guard logic is good |
| 3 | osemvec:337 | `this.isRoleName` (dead kernel validator, b745e766) | `osemvec.new` (CLI + `test.osemvec`) | B | Local `private.osemvec.isRoleName`, regex verbatim. Same pattern as e48ba430, no kernel revival. `test.osemvec` valid-role cases are RED today because of this |
| 4 | osemvec:418 | `this.isPaneTarget` | `osemvec.guard` (CLI + test) | B | Local `private.osemvec.isPaneTarget` (as #3) |
| 5 | tronMonitor:594 | `this.isSessionName` | `tronMonitor.fit` (Tron's dashboard, CLI) — rejects EVERY team today | B | Local `private.tronMonitor.isSessionName` (as #3) |
| 6 | config:182 | `config.list.completion` (only `config.list.completion.name` :191 exists) | `config.edit.completion` → Tab on `config edit` | B | Repoint to `config.list.completion.name` |
| 7 | state:361 | `state.declaration` | `private.check.all.states.added` (:320), reached by dynamic dispatch `private.check.$stageTo` (state:262) during state-machine transitions, i.e. `oo` install/provisioning | B | Same symptom as the known SETUP_SERVER `state.declaration` install bug: re-home from the lineage that defines it, or retire the check. Expert to confirm which (my read of :355-365 was blocked) |
| 8-13 | otmux:3201/3386/3401/3428/3433/3438 | `otmux.buffers` `.set` `.show` `.bind` `.unbind` `.keys` | Forwarders `otmux.buffer.list` / `config.set` / `config.show` / `key.bind` / `key.unbind` / `key.list` → their pre-rename targets were deleted (object.verb rename). **No callers** in oosh, `.claude`, or base-skills; `restore/otmux` is a copy | **C** | Re-home each body to the tmux-native command (one line each: list-buffers / set-option / show-options / bind-key / unbind-key / list-keys) rather than delete. These are the canonical object.verb names, and `otmux usage` advertises them, so deleting them would leave advertised-but-missing verbs (same defect class as `pane.zoom`) |

Not dead (excluded after reading): state:262 (guarded by `this.functionExists`), config:145/501/580 (defined with the `function` keyword), oo:1258 (`private.stage` is defined), all other oo hits (state-machine step names, strings, `ossh`/`once` arguments), otmux:1110/3593 (strings), hiveMind `context.*` / `line.*` / `os.*` / `fix.path` / `path.strip` (strings, Python, or calls to another script).

**Count discrepancy vs the tester's gate:** I find config 1 (gate: 2), state 1 (gate: 3), oo 0 (gate: 1). Either the gate counts dynamic and string matches that I excluded, or it caught calls my regex misses. **Tester: please commit the raw 70-line gate output** so we can reconcile line by line; I won't guess the missing ones.

**Next batch, in order:** #1 now (A, one line, and it unblocks the §8 RED), then #3-#5 together (same validator pattern as e48ba430, three scripts), then #6/#7, then #2 (refuse-loud), then #8-#13 (C, re-home). The expert stays on hiveMind steps 1-5. #1 and #2 are hiveMind, so slot them after step 5 or as a separate hiveMind commit there. Everything else is outside hiveMind and can go to any owner.

## Reproducible instruments (scratchpad)
- `/tmp/claude-0/-var-dev-Workspaces-AI-Claude/a43c1b23-7de6-4c75-8952-3e98b6ca43b6/scratchpad/hm-deadmap.sh` — every dead call → enclosing method + validators.
- `/tmp/claude-0/-var-dev-Workspaces-AI-Claude/a43c1b23-7de6-4c75-8952-3e98b6ca43b6/scratchpad/hm-rank.sh` — the reference ranking above.

## Caveats
- "Refs" is an invocation-reference proxy, not a runtime trace.
- Tier 0 → stale-registry causality is a hypothesis; the fix's verification must include a real move/swap and a registry read-back.

## Report-back (owners edit here)
- Expert (claudeCode, done first): branch `oosh-expert/claudeCode-validators` @ `d8fe4375` — awaiting tester RED `T-CLAUDECODE-VALIDATORS`.
- Expert (hiveMind):
- Tester:
