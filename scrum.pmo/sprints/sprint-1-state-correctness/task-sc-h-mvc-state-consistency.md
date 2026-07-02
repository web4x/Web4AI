[Back to Planning](./planning.md)

# Task SC-H: MVC State Consistency — Every Lifecycle Command Updates All 3 Layers
[task:uuid:h1a2b3c4-e5f6-7890-cdef-mvc0state001]

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up: [Sprint 1 Planning](./planning.md)
- down:
  - [SC-H.1: Expert — Audit all lifecycle commands for MVC state gaps](./task-sc-h.1-expert-lifecycle-mvc-audit.md)
  - [SC-H.2: Expert — Fix commands that skip layers](./task-sc-h.2-expert-fix-missing-updates.md)
  - [SC-H.3: Tester — MVC consistency invariant tests](./task-sc-h.3-tester-mvc-consistency-tests.md)

## Task Description

Every hiveMind lifecycle command that changes state must update ALL three MVC persistence layers atomically:

| Layer | File | What it tracks |
|-------|------|----------------|
| **Model** (claudeCode) | `sessions.env` | pane → Claude session UUID |
| **View** (otmux) | pane titles, tmux sessions | which panes exist, their names |
| **Controller** (hiveMind) | `roles.env`, `teams.env`, `forks.env` | registry, team membership, fork audit |

### Lifecycle commands to audit:
- `team.setup` — creates session + panes + agents
- `team.register` / `team.remove` — manages teams.env
- `agent.bootstrap` / `agent.spawn` — creates pane + starts Claude
- `agent.rename` — changes role identity
- `agent.restart` / `team.restart` — restarts from pulled config
- `teams.save` / `teams.restore` — snapshot and restore
- `teams.migrate` — cross-machine transfer
- `team.pull` — pull config from remote
- `consistency.fix` / `consistency.reconcile` — repair tools
- `registry.refresh` — update registry from live state

### For EACH command, verify:
1. Does it update `roles.env`? (Controller)
2. Does it update `sessions.env`? (Model)
3. Does it update `teams.env`? (Controller)
4. Does it set pane titles? (View)
5. Does it fire events (SC-B)? (Controller → observers)
6. On failure/partial execution, does it leave state consistent or half-broken?

### Known gaps (from PO observations):
- robbinTeam registered in teams.env but completion didn't find it (stale c2 cache? or teams.complete not called?)
- `team.setup` creates panes and registry but unclear if it always writes teams.env
- After `teams.restore`, many stale teams from old snapshots pollute teams.env (21 entries, many dead)
- `tronMonitor.add` was never auto-triggered by `team.register` (D2 from Sprint 0)

## Intention
CMM4 requires that every state change is measured and consistent. If a command updates the View (creates a pane) but skips the Controller (doesn't register), the system is in an inconsistent state that `consistency.audit` catches AFTER the fact. The goal: make inconsistency IMPOSSIBLE by ensuring every lifecycle command updates all layers, so `consistency.audit` always returns clean.
