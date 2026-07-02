[Back to task-b1-platform-defaults](./task-b1-platform-defaults.md)

# B1.3 Expert — os.os Single-Source Discriminator
[task:uuid:e3709174-66b8-4601-a957-9e1d889282e4]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up: [task-b1-platform-defaults](./task-b1-platform-defaults.md)

## Description
**Role: oosh-expert**

Add side-effect-free `os.os` (owns the `$OSTYPE→OOSH_OS` mapping via os.check.env); `config.init` consumes `$(os os)`, dropping its duplicate case. One source of platform truth.

**Commit(s):** `19a2a45`  (once.sh/dev)

---
*Sprint 1 @MacDonges*
