[Back to task-a1-oo-mode-invariant](./task-a1-oo-mode-invariant.md)

# A1.2 Expert — Fix oo.mode() OOSH_DIR Assignment
[task:uuid:458418e2-7336-4aa7-afc5-58b530e2a199]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [task-a1-oo-mode-invariant](./task-a1-oo-mode-invariant.md)

## Description
**Role: oosh-expert**
Change `oo.mode()` (~line 309): `export OOSH_DIR="$HOME/oosh"` instead of `"$target_dir"`. Verify `config save` after `oo mode <branch>` persists `$HOME/oosh`.

---
*Sprint 2 @MacStudio*
