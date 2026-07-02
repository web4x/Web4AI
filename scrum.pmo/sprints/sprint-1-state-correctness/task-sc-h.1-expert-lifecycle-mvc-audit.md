[Back to SC-H](./task-sc-h-mvc-state-consistency.md)

# SC-H.1: Expert — Audit All Lifecycle Commands for MVC State Gaps
[task:uuid:h1a2b3c4-e5f6-7890-cdef-mvc0audit001]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [SC-H: MVC State Consistency](./task-sc-h-mvc-state-consistency.md)

## Description

For every lifecycle command listed in SC-H, produce a matrix:

| Command | roles.env | sessions.env | teams.env | pane title | events | notes |
|---------|-----------|-------------|-----------|------------|--------|-------|
| team.setup | ? | ? | ? | ? | ? | |
| agent.bootstrap | ? | ? | ? | ? | ? | |
| ... | | | | | | |

Mark each cell: ✅ (updates), ❌ (skips), ⚠️ (partial/conditional).

Write findings to `task-sc-h.1-findings.md` in this sprint directory.

Do NOT fix anything — audit only. Fixes are SC-H.2.
