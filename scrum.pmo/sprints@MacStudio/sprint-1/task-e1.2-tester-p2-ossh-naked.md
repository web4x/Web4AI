[Back to task-e1-install-path-verify](./task-e1-install-path-verify.md)

# E1.2 Tester — P2 ossh install → Naked Container
[task:uuid:68a3840c-8ff7-426e-8efa-8c3b17ccc137]

## Status
- [x] Planned
- [x] In Progress — **BLOCKED**
- [ ] QA Review
- [ ] Done

## Traceability
- up: [task-e1-install-path-verify](./task-e1-install-path-verify.md)

## Description
**Role: oosh-tester**

Provision a fresh linux container via `odocker run.sshd` (proven clean) and run P2 `ossh install` dev→naked → assert same terminal + /home/shared paths. BLOCKED (Tron): donges not in docker group (needs sudo) + container needs authorized_keys injection.

**Commit(s):** — (blocked)

---
*Sprint 1 @MacStudio*
