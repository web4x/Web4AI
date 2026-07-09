[Back to Planning Sprint 2](./planning.md)

# Task C1: Port line.format Self-Heal (674f38b → mcdonges.latest)
[task:uuid:c8e1d3b0-3098-4d7a-bdf4-a25f7e552f46]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [Sprint 2 Planning](./planning.md)

## Description
Port `private.line.format.defaults` + the `[ -z "${!format}" ]` guard from macos.latest `674f38b`. After a restart that wipes `lineFormat.env`, completion must self-heal (no manual FORMAT_ repair). Expert ports, tester verifies: `rm $CONFIG_PATH/lineFormat.env` → fresh shell → completion works on both platforms.

---
*Sprint 2 @MacStudio · Epic C: line.format Self-Heal · Priority 1*
