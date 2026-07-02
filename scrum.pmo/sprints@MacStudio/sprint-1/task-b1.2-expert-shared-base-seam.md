[Back to task-b1-platform-defaults](./task-b1-platform-defaults.md)

# B1.2 Expert — OOSH_SHARED_BASE Seam
[task:uuid:c24a9633-4ef8-4748-bff5-58a52325e77b]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up: [task-b1-platform-defaults](./task-b1-platform-defaults.md)

## Description
**Role: oosh-expert**

`config.init` derives `OOSH_SHARED_BASE`→`OOSH_COMPONENTS_DIR`/`ODOCKER_WORKSPACES` (pure-state exports); `oo.mode.base.get` + `odocker` drop the macOS literals (oo:218, odocker:14); `${VAR:-}` preserves override.

**Commit(s):** `650e743`  (once.sh/dev)

---
*Sprint 1 @MacDonges*
