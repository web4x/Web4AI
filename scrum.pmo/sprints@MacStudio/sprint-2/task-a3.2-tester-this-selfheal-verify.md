[Back to task-a3-this-init-selfheal](./task-a3-this-init-selfheal.md)

# A3.2 Tester — Corrupt OOSH_DIR Then Verify Self-Heal
[task:uuid:5f1d7551-3203-4a23-b8a4-264d2979a910]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [task-a3-this-init-selfheal](./task-a3-this-init-selfheal.md)

## Description
**Role: oosh-tester**
Set `OOSH_DIR=/bogus/path` in env → open fresh shell → `echo $OOSH_DIR` must = `$HOME/oosh` (self-healed). Both platforms.

---
*Sprint 2 @MacStudio*
