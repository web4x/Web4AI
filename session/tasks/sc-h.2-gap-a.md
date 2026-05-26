# SC-H.2 Gap A — defer-probe pattern for session.store

**Sprint**: 1 (state correctness)
**Wave**: SC-H lifecycle gap closure
**Predecessors**: Gap C (`f707fa9` agent.restart+team.restart emit agent.spawned), Gap B (`e843391` team.remove bash-3.2 fallback prune)
**Reference detector**: I10 in `consistency.audit` (commit `53f2bd9`) — post-fact missing-S2-entry detector. This task is the prevention side.

## Problem

`hiveMind.agent.session.probe` waits a fixed `sleep 3` after sending `/status`. All call sites that call `probe → store` do `sleep 8` before the probe to let Claude launch. If Claude isn't ready (slow startup, plan-mode prompts, autocompact mid-launch), probe returns empty → `private.hiveMind.session.store` never runs → S2 (sessions.env) has no pane→UUID entry → I10 audit flags it later.

Root cause of the robbinTeam disaster: 3/6 Claude panes registered in S1 but missing from S2 because the initial probe window expired before the TUI was ready.

## Fix

Add a backgrounded retry: `private.hiveMind.session.store.deferred <pane> <role>`.
Forked subshell that retries probe at 5s/15s/30s post-call. Idempotent — skips if S2 already populated, pidfile guards re-entry from concurrent calls.

Wired into the agent.spawned event handler — when UUID arg is empty, schedule deferred probe. Bash-3.2 fallback at each direct call site (events are no-op on bash 3.2 per task #29).

## Affected sites

- `team.setup` (line ~5102) — non-emitting; direct call
- `team.setup.full` (line ~6041) — non-emitting; direct call
- `agent.bootstrap` (line ~5536) — emits agent.spawned; bash-3.2 fallback only
- `agent.restart` (line ~3769) — emits agent.spawned; bash-3.2 fallback only
- `team.restart` (line ~3857) — emits agent.spawned; bash-3.2 fallback only
- `team.setup.oosh` — DEPRECATED, skip

## Design

```bash
private.hiveMind.session.store.deferred <pane> <role>
  pidfile: /tmp/hivemind.deferred.<sanitized-pane>.pid
  skip if pidfile holds live PID
  fork (disowned):
    write pidfile, trap EXIT to remove
    for delay in 5 15 30:
      sleep (delay - prev)
      if session.lookup pane → already stored, exit 0
      sid = agent.session.probe pane
      if sid: session.store pane sid; log success; exit 0
    log give-up after 30s; exit 1
```

Event handler:
```bash
private.hiveMind.handler.agent.spawned.sessions:
  if uuid: session.store               # existing fast path
  elif role: session.store.deferred    # NEW — bash 5 events path
```

Bash 3.2 fallback at sync sites:
```bash
[ -z "$HIVEMIND_EVENTS_AVAILABLE" ] && [ -z "$uuid" ] && \
  private.hiveMind.session.store.deferred "$pane" "$role"
```

## Idempotency

- pidfile guards concurrent defer-probes for the same pane
- each retry checks `session.lookup` first; exits if S2 already populated
- safe to call from multiple paths (event handler + bash-3.2 fallback both fire — pidfile wins)

## Acceptance

- `bash -n hiveMind` clean
- `private.hiveMind.session.store.deferred` defined
- `private.hiveMind.handler.agent.spawned.sessions` calls deferred when uuid empty
- 5 sync sites updated (team.setup, team.setup.full, agent.bootstrap, agent.restart, team.restart)
- Tester verifies: kill a Claude before sync probe completes → defer-probe captures UUID within 30s, S2 populated, I10 audit clean

## Commit

`hiveMind: defer-probe pattern for sessions.env coverage (ref: sc-h.2-gap-a.md)`

## Status (closure 2026-05-25)

- **Implementation**: oosh commit `1b2d59b` — 98 +/3 -, single commit, pushed to test/macos.latest
- **Tests**: oosh commit `7a5e2bc` — 8 tests (GAP-A-1..8), code-grep + isolated-source for GAP-A-7
- **Verification**: `test.suite run hiveMind 1 GAP-A` → 8/8 assertions passed
- **Acceptance**: bash -n clean; helper + handler + 5 sync sites all wired (team.setup direct, team.setup.full direct, agent.bootstrap bash-3.2 fallback, agent.restart bash-3.2 fallback, team.restart bash-3.2 fallback); team.setup.oosh skipped (deprecated)
- **Handoff**: none — task closed. Open issue logged in expert context: agent.bootstrap dev-flow could schedule defer-probe via event handler only on bash 5 (it already does); bash-3.2 fallback paths verified idempotent via pidfile.
