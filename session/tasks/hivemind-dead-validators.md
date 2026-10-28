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
