[Back to Sprint 2 Planning](./planning.md)

# Task S2-D: node provisioning + hardening
[task:uuid:eb1933da-aef9-4f03-bc5e-dcc4b7fefc26]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [ ] creating test cases
  - [~] implementing (hardening baked; autoconfig + runtime open)
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- down
  - [odocker-runsshd-autoconfig.md](../../../session/tasks/odocker-runsshd-autoconfig.md) — D.1 (NP-1) auto ssh-config
  - [np4-provision-agent-runtime.task.md](../../../session/tasks/np4-provision-agent-runtime.task.md) — D.2 (NP-4) tmux+claude on node
  - [SECURITY-u20-malware-incident.md](../../../session/tasks/SECURITY-u20-malware-incident.md) — D.0 hardening origin (RESOLVED)
  - once.sh@dev: [odocker](https://github.com/Cerulean-Circle-GmbH/once.sh/blob/dev/odocker) `41ca4e4` (loopback+key-only)

## Description
**Role: architect → expert → tester**
A fresh Linux node → reachable → dev-oosh installed → team-ready, in the fewest reliable + SECURE commands. Each step leaves a complete, hardened state.

## Open items
- [x] **D.0 hardening** — odocker `run.sshd` binds 127.0.0.1 + key-only, Dockerfiles hardened (once.sh `41ca4e4`). Born-hardened default. DONE (from security incident).
- [ ] **D.1 (NP-1)** — fold `ossh config.create` into `odocker run.sshd` (one-command reachable container); inherit the loopback+key-only hardening.
- [ ] **D.2 (NP-4)** — provision tmux + claude-cli on the node (via install or team.push pre-flight) so `team.push` places live agents (was 0). Unblocks u24 gate Step 5.
- Note: NP-2 (u24 clean-boot) GREEN + NP-3 (SETUP_SERVER→99) DONE; S3 dev→macos merge PARKED pending Tron a/b.

## Definition of Done
- one `odocker run.sshd` + one `ossh install` → clean-booting, hardened, team-ready node
- `team.push` places live agents (tmux+claude present); verified by push + discoverability
- T-RUNSSHD-AUTOCONFIG, T-PROVISION-RUNTIME green

*Sprint 2 — Controller Reliability · task-s2-d*
