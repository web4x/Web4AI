# State-Correctness Architecture — Architect Analysis

**Author:** oosh-architect (ooshTeam:0.1)
**Date:** 2026-05-12
**Status:** DESIGN — no implementation

## State Stores Inventory

| Store | File | Format | Purpose |
|-------|------|--------|---------|
| **roles.env** | `~/config/hivemind.roles.env` | `pane\|role\|timestamp` | Maps pane targets → agent roles |
| **sessions.env** | `~/config/hivemind.sessions.env` | `pane\|uuid` | Maps pane targets → Claude session UUIDs |
| **teams.env** | `~/config/hivemind.teams.env` | `session\|description` | Registered team sessions |
| **forks.env** | `~/config/hivemind.forks.env` | append-only audit log | UUID discovery history + broken UUID records |
| **snapshots** | `~/config/hivemind.snapshot.*.env` | `session\|addr\|role\|uuid\|title` | Point-in-time team state for restore |
| **queue** | `~/config/hivemind.queue/<pane>.queue` | `epoch\|intent\|text` | Deferred messages per agent |
| **tronMonitor.env** | `~/config/tronMonitor.env` | `session` list | Teams visible in Tron's monitor pane |
| **active.team** | `~/config/hivemind.active.team` | single session name | Default team context for commands |
| **tmux** | tmux server state | pane titles, indices, sessions | Live view infrastructure |
| **JSONL** | `~/.claude/projects/*/<uuid>.jsonl` | per-session conversation | Model data (owned by claudeCode) |

## Mutation Use Cases × State Stores

| Operation | roles.env | sessions.env | teams.env | forks.env | snapshots | queue | tronMonitor | tmux | JSONL |
|-----------|-----------|-------------|-----------|-----------|-----------|-------|-------------|------|-------|
| **agent.spawn** | W (new entry) | — | — | — | — | — | — | W (new pane) | — |
| **agent.bootstrap** | W (new entry) | W (new UUID) | — | — | — | — | — | W (new pane + title) | W (new session) |
| **agent.rename** | W (update role) | — | — | — | — | — | — | W (pane title) | W (/rename) |
| **agent.fork.best** | W (new entry) | W (new UUID) | — | — | — | — | — | W (pane title) | W (fork creates new) |
| **pane.swap** | W (swap 2 entries) | — | — | — | — | — | — | W (swap panes) | — |
| **pane.split** | W (shift indices) | W (shift indices) | — | — | — | W (shift queue files?) | — | W (new pane, indices shift) | — |
| **pane.kill** | D (remove entry) | D (remove entry) | — | — | — | D (remove queue) | — | D (pane gone) | — |
| **team.setup** | W (N entries) | W (N UUIDs) | W (register) | — | — | — | ? (should auto-add) | W (new session + panes) | W (N sessions) |
| **team.remove** | D (all team entries) | D (all team entries) | D (deregister) | — | — | D (all team queues) | D (should auto-remove) | — | — |
| **team.register** | — | — | W (add) | — | — | — | W (should auto-add) | — | — |
| **teams.save** | R | R | R | — | W (new snapshot) | — | — | R | R (UUID lookup) |
| **teams.restore** | W (from snapshot) | W (from snapshot) | W (register) | — | R | — | ? | W (recreate) | R (fork JONSLs) |
| **teams.migrate** | R+W (remote) | R+W (remote) | R+W (remote) | — | R+W | — | — | — | R+W (scp JONSLs) |
| **registry.refresh** | W (reconcile) | W (reconcile) | — | W (audit log) | — | — | — | R (live state) | R (UUID resolve) |
| **consistency.fix** | W (fix entries) | W (fix entries) | — | W (audit log) | — | — | — | R (live state) | R |
| **consistency.audit** | R | R | — | — | — | — | — | R | R |

**Legend:** W=write, R=read, D=delete, —=not touched, ?=should but doesn't

## Invariants That Must Hold After Every Mutation

### I1: Registry-tmux consistency
> Every pane in roles.env MUST exist in tmux. Every Claude-running tmux pane SHOULD have a roles.env entry.

**Currently broken by:** pane.split (indices shift, registry stale), pane.kill (entry remains), tmux server restart (all entries stale)

### I2: Sessions-registry alignment
> Every pane in sessions.env MUST also be in roles.env. UUID in sessions.env MUST match the live Claude process.

**Currently broken by:** fork (new UUID, old sessions.env entry), autocompact (new UUID, old entry), agent restart

### I3: Teams-tmux alignment
> Every team in teams.env SHOULD be a running tmux session OR explicitly marked stopped.

**Currently broken by:** manual `otmux kill` (teams.env not updated), tmux server crash, garbage from failed commands getting written as team names

### I4: tronMonitor-teams sync
> tronMonitor.env entries MUST be a subset of teams.env entries.

**Currently broken by:** manual team.register doesn't auto-add to tronMonitor, team.remove doesn't auto-remove from tronMonitor

### I5: Snapshot completeness
> A snapshot MUST contain correct UUIDs for all live agents at save time.

**Currently fixed by:** teams.save uses session.resolve.uuid (fa722ac). But broken if agents fork/autocompact between save and restore.

### I6: Queue-pane consistency
> Queue files MUST reference valid pane targets. Stale queues for dead panes MUST be drained or cleaned.

**Currently broken by:** no cleanup on pane.kill or team.remove

## Architecture Options

### Option A: Per-operation hooks (current approach, extended)
Each mutation method calls specific fixup code after its primary action.

**Pros:** Local reasoning, each method knows what it changed
**Cons:** DRY violation — every new method must remember to call the right hooks. We already have 15+ mutation points. Missed hooks cause silent degradation.

### Option B: Single reconciliation method (consistency.reconcile)
One method that re-derives the correct state from live truth (tmux + ps + JSONL) and writes all state files atomically.

**Pros:** ONE source of truth logic. Can't forget to call it — just call after any mutation.
**Cons:** Expensive (scans all tmux panes + processes). Can't run during active operations (race).

### Option C: Event-driven (mutation → event → handlers)
Every mutation emits a named event. Handlers subscribe per state store.

```
pane.split → emit "panes.shifted" → 
  handler: registry.shift.indices
  handler: sessions.shift.indices
  handler: queue.rename.files
```

**Pros:** Decoupled, extensible, each state store owns its own handler
**Cons:** Bash has no event system — would need to build one (function dispatch table)

### RECOMMENDED: Option C with B as safety net

1. **Primary:** Event dispatch after every mutation (lightweight — function call table, not a message bus)
2. **Safety net:** `consistency.reconcile` runs on SM sweep cycles (every 60s) to catch anything events missed
3. **Verification:** `consistency.audit` validates invariants I1-I6, returns PASS/FAIL per invariant

The event dispatch is already partially implemented in B5.1 (panes.shifted, panes.swapped, pane.moved). Extend this pattern to ALL mutations.

## Event Catalog (proposed)

| Event | Emitted by | Handlers needed |
|-------|-----------|-----------------|
| `agent.spawned` | agent.spawn, agent.bootstrap | registry.set, sessions.store |
| `agent.killed` | pane.kill, team.remove | registry.remove, sessions.remove, queue.clean |
| `agent.renamed` | agent.rename | registry.update, pane.title |
| `agent.forked` | agent.fork.best, fork.to | registry.set, sessions.store |
| `panes.shifted` | pane.split, pane.kill | registry.shift, sessions.shift, queue.rename |
| `panes.swapped` | pane.swap | registry.swap |
| `pane.moved` | pane.move, pane.join | registry.move |
| `team.created` | team.setup, team.register | teams.add, tronMonitor.add |
| `team.destroyed` | team.remove | teams.remove, tronMonitor.remove, registry.prune, sessions.prune, queue.prune |
| `team.restored` | teams.restore | registry.bulk.set, sessions.bulk.set, teams.add, tronMonitor.add |

## For Expert Review

1. Are there mutation operations I'm missing?
2. Is the event dispatch overhead acceptable in bash? (function call table = ~1ms per event)
3. Should `consistency.reconcile` be a full rebuild or incremental diff?
4. The B5.1 observer pattern (panes.shifted etc.) — is it the right foundation to extend?
5. Where should the event dispatch table live? In hiveMind (Controller) or a new `events` script?
