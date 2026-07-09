[Back to Planning Sprint 2](./planning.md)

# Task B3: De-Hardcode Platform Paths (~8 Scripts)
[task:uuid:c9a08beb-b795-4e4e-97c9-2266b7c92eca]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [Sprint 2 Planning](./planning.md)
- depends: B1, B2 (vars must exist before scripts reference them)

## Description
Replace literal `/Users/Shared` and `/home/shared` in: `oo` (218, 967), `hiveMind` (2285, 3142), `claudeCode`, `odocker` (14), `backup`, `init/deinstall.oosh`, `templates/user/oo-shim`, `restore/hiveMind` — with `$OOSH_SHARED_BASE`/`$OOSH_COMPONENTS_DIR`. Expert impls, tester gate: `grep -rn '/Users/Shared\|/home/shared' <scripts>` = 0 hits (excluding comments/docs).

---
*Sprint 2 @MacStudio · Epic B: OS-Independence · Priority 2*
