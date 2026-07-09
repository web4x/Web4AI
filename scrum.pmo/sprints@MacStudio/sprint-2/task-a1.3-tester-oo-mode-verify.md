[Back to task-a1-oo-mode-invariant](./task-a1-oo-mode-invariant.md)

# A1.3 Tester — oo.mode OOSH_DIR Verify (Both Platforms)
[task:uuid:425e8640-7fa3-4ba6-9249-949bc352b4f0]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [task-a1-oo-mode-invariant](./task-a1-oo-mode-invariant.md)

## Description
**Role: oosh-tester**
After expert fix: `oo mode <branch>` → `echo $OOSH_DIR` = `$HOME/oosh` on MacStudio + WODA.prod (via remoteShells:0.1). Then `config save` + fresh shell → OOSH_DIR still `$HOME/oosh`.

---
*Sprint 2 @MacStudio*
