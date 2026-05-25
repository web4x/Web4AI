# SC-E.2 P2/P3 — apply triple defense to remaining ingress points

**Sprint**: 1 (state correctness) · **Epic**: SC-E ingress triple-defense
**Predecessors**: SC-E.1 audit (`42b84c5`); SC-E.2 P1 already shipped (`1b759c5`/`c1ecf3f`/`a7f5cb0`/`085f621`)
**Reference**: docs `task-sc-e.1-findings.md` priority list (P2 = 7 sites, P3 = 10 sites)

## Triple-defense pattern (P3 from SC-E.1)

Every public method accepting a caller-supplied identifier must apply at the boundary:
1. **(a) Format regex** — via kernel predicate (`this.isSessionName` / `this.isPaneTarget` / `this.isRoleName` / `this.isUuid` / `this.isSshHost`)
2. **(b) Pipe/newline safe** — via `this.isPipeSafe` when identifier goes into `|`-delimited env files
3. **(c) Existence** — via `otmux has` / file grep / registry lookup as appropriate

Reject with `error.log` + `return 1` on any layer failing. Pattern is mechanical.

## New kernel predicate (one addition)

`this.isSshHost <s>` — `[A-Za-z0-9._-]+` and length ≤64. SSH config aliases use kebab/dots/dots; sshHost is a command-injection vector if it reaches `ssh "$host"` unguarded.

## Sites covered (17 — split into 3 commits by file)

### Commit A — hiveMind P2/P3 (10 sites)
- `team.setup`, `team.setup.oosh` (deprecated, skip), `team.setup.full` — session regex
- `team.switch`, `team.activate` — session regex
- `delegate <agentName>` — role regex (path-traversal: name→task file)
- `roles.list.uuids` — role regex (filesystem traversal)
- `teams.migrate <sshHost>` — sshHost regex
- `team.pull <sshHost>` — sshHost regex
- `task.delegate <sshHost> <pane> <taskFile>` — sshHost + pane regex
- `agent.restart.remote <agentName> <sshHost>` — sshHost regex

### Commit B — otmux + tronMonitor (4 sites)
- `otmux.session.rename` — both args session regex + pipe-safe
- `otmux.kill <target>` — session regex (destructive)
- `tronMonitor.add <teamSession>` — allowlist regex (on top of existing __test_ blocklist)
- `tronMonitor.remove <teamSession>` — session regex + pipe-safe

### Commit C — claudeCode (5 sites)
- `claudeCode.join.byID` / `fork.byID` — UUID regex
- `claudeCode.join.byPane` / `fork.byPane` — pane regex
- `claudeCode.fork.to <pane> <?role>` — pane + role regex

## Skipped

- `team.setup.oosh` — DEPRECATED, not maintained
- `otmux.send.*` family — already has `target.isPane` (SC-E.1 partial coverage)
- `protected.*` observers — DONE in P1 (commit `a7f5cb0`)

## Acceptance

- `bash -n` clean for hiveMind, otmux, tronMonitor, claudeCode
- `this.isSshHost` defined
- Each site rejects (a) malformed input, (b) pipe-in-name, (c) ghost identifier (when applicable) with `error.log` + non-zero rc
- Existing test suite continues to pass

## Commits

- `hiveMind: SC-E.2 P2/P3 ingress defense — team/delegate/sshHost (ref: sc-e.2-p2-p3-ingress-defense.md)`
- `otmux+tronMonitor: SC-E.2 P2 ingress defense — session.rename/kill/tronMon (ref: sc-e.2-p2-p3-ingress-defense.md)`
- `claudeCode: SC-E.2 P3 ingress defense — UUID/pane methods (ref: sc-e.2-p2-p3-ingress-defense.md)`
