[Back to Planning Sprint 1](./planning.md)

# Task C1: Non-Interactive Privilege Probe (No Naked Hang)
[task:uuid:d358fd31-0e73-4812-a90c-edd2c33067f5]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up: [Sprint 1 Planning](./planning.md)
- down:
  - [C1.1 Expert — sudo -n probe](./task-c1.1-expert-sudo-n-probe.md)
  - [C1.2 Tester — T-NO-SUDO-HANG](./task-c1.2-tester-no-sudo-hang.md)

## Task Description
A naked P1 self-bootstrap must NEVER block on an interactive sudo password prompt (constructor-contract). `private.test.sudo.priviledges` ran `$SUDO touch` which prompts on a box with no cached creds → unattended-install hang.

## Context
Discovered by the tester exercising the naked path (not assuming). Fix mirrors `init/oosh oosh_can_escalate` (DRY): non-interactive `sudo -n`; no rights = defer to the user band with a warning, never a prompt.

## Intention
- **Why:** objects self-heal / never ask the human to unblock what they can defer.
- **How:** root/marker/`sudo -n` probe; failure → `RESULT=20` (user band) + warning.

---
*Sprint 1 @MacStudio · Epic C: Constructor Safety · Priority 0*
