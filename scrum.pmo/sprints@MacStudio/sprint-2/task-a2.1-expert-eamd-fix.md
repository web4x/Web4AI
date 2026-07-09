[Back to task-a2-eamd-install-order](./task-a2-eamd-install-order.md)

# A2.1 Expert — Reorder EAMD Symlink + Kill Literal 'dev'
[task:uuid:17a7be26-0394-4a99-ad98-892a66251348]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [task-a2-eamd-install-order](./task-a2-eamd-install-order.md)

## Description
**Role: oosh-expert**
In `oo` lines 945/1001: create `~/oosh` symlink BEFORE `config save`; set `OOSH_DIR="$HOME/oosh"` (not resolved); replace literal `'dev'` with mode-derived value.

---
*Sprint 2 @MacStudio*
