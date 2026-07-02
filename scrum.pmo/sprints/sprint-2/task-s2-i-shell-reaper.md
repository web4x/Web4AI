[Back to Sprint 2 Planning](./planning.md)

# Task S2-I: shell.reap — reap accumulated background shells (fd-leak / persist-thru-rewind)
[task:uuid:8c149a17-6516-4036-a949-581965ff7109]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- related: [task-s2-h dashboard](./task-s2-h-team-sweep-fleet-dashboard.md) (SURFACES the shell-count) · [task-s2-c OTR-2 route/fd](./task-s2-c-registry-route-identity.md) (fd-exhaustion family)

## Description
**From Tron/SM (2026-07-02):** background shells ACCUMULATE per agent (e.g. expert=4) and **persist THROUGH rewind** = an fd-leak (ties to OTR-2 fd-exhaustion — accumulated shells consume file descriptors; suspected route-corruption aggravator alongside the u20 malware). task-s2-h shows the COUNT; this task REAPS them.
**Role**: architect (design: what's safe to reap) → expert (impl) → tester (T-SHELL-REAP).

## Requirements
-  (object.verb, no-flag) — identify STALE/orphaned background bash subtrees per pane (the SAME tty→pane_pid subtree task-s2-h counts) and terminate the stale ones.
- **Self-care safety**: NEVER kill a shell doing active work (a running command / live child); reap only idle/orphaned/detached shells. Reap opportunistically on rewind + idle-sweep.
- Persist-thru-rewind is the key leak: a rewind forks fresh ctx but leaves the old bg shells → reap them at/after rewind.
- DRY: reuse the batch-ps subtree logic task-s2-h uses for the count.

## Definition of Done
-  terminates stale bg shells, leaves active ones untouched
- post-rewind shell count returns to baseline (leak closed)
- T-SHELL-REAP: seed stale bg shells → reap → count drops, an active shell survives

## Report-back
- Architect (safe-reap design):
- Expert (impl):
- Tester (T-SHELL-REAP):
