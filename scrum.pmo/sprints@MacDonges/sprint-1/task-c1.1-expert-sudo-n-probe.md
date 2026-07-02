[Back to task-c1-no-sudo-hang](./task-c1-no-sudo-hang.md)

# C1.1 Expert — Non-Interactive sudo Probe
[task:uuid:b173cddc-3107-483a-a877-572331a54fc5]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up: [task-c1-no-sudo-hang](./task-c1-no-sudo-hang.md)

## Description
**Role: oosh-expert**

Replace prompting `$SUDO touch` with root/marker/`sudo -n` probe; no rights → defer to user band (RESULT=20) + warning, never a prompt. Mirrors `oosh_can_escalate` (DRY).

**Commit(s):** `8be593d`  (once.sh/dev)

---
*Sprint 1 @MacDonges*
