[Back to Planning Sprint 1](./planning.md)

# Task B1: Platform-Derived Install Locations
[task:uuid:a2255ec5-ad26-4cac-9c7a-266e851bd162]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up: [Sprint 1 Planning](./planning.md)
- down:
  - [B1.1 Architect — platform-derivation design](./task-b1.1-architect-platform-design.md)
  - [B1.2 Expert — OOSH_SHARED_BASE seam](./task-b1.2-expert-shared-base-seam.md)
  - [B1.3 Expert — os.os single source](./task-b1.3-expert-os-accessor.md)
  - [B1.4 Tester — platform + os tests](./task-b1.4-tester-platform-tests.md)

## Task Description
OOSH is cross-platform but install defaults were hardcoded to macOS paths (`/Users/Shared…`, and linux `/home/shared`, `/var/dev`). Derive install locations from platform defaults via `os` detection — especially OOSH component modes (`oo.mode.base.get`) and odocker workspaces (`ODOCKER_WORKSPACES`). One derivation seam, consumed by both install paths.

## Context
Measured hardcodes: `oo:218` component base, `odocker:14` workspaces. `os.check.env` owns the `$OSTYPE→OOSH_OS` mapping; there was no side-effect-free accessor, so config.init duplicated the case (resolved in B1.3).

## Intention
- **Why:** cross-platform correctness + DRY (single source of platform truth).
- **How:** `os.os` accessor → `config.init` derives `OOSH_SHARED_BASE`→`OOSH_COMPONENTS_DIR`/`ODOCKER_WORKSPACES` as pure-state exports; consumers drop literals; `${VAR:-}` preserves operator override.

---
*Sprint 1 @MacDonges · Epic B: Cross-Platform Defaults · Priority 1*
