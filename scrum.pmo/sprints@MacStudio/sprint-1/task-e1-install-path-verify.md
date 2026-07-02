[Back to Planning Sprint 1](./planning.md)

# Task E1: Verify Both Install Paths Reach the Correct Terminal
[task:uuid:1ccbc3af-76c7-4851-9ed5-89227ecc675e]

## Status
- [x] Planned
- [x] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [Sprint 1 Planning](./planning.md)
- down:
  - [E1.1 Tester — P1 self-bootstrap](./task-e1.1-tester-p1-selfbootstrap.md)
  - [E1.2 Tester — P2 ossh install → naked container](./task-e1.2-tester-p2-ossh-naked.md)

## Task Description
Prove both install paths drive SETUP_SERVER to the same correct, mode-aware, platform-correct terminal: **P1** (`init/oosh` self-bootstrap on a naked box) and **P2** (`ossh install` dev-mode from a working box → naked system). The Epic E naked container also hosts the D1.3 reconcile-persistence check.

## Context
P1 is verified (dev XOR crossing, platform paths, idempotent — A1.4). P2 needs a genuinely naked target; WODA.test is already installed.

## Intention
- **Why:** completeness — the whole point is a naked system reaching a valid object via either entry.
- **How:** provision a fresh linux container via `odocker` (dogfoods D3 linux paths), run P2, assert terminal + paths; fold T-RECONCILE onto the same isolated box.
- **Blocker (Tron):** `donges` not in `docker` group (needs sudo) + container needs `authorized_keys` injection.

---
*Sprint 1 @MacDonges · Epic E: Install-Path Verification · Priority 1*
