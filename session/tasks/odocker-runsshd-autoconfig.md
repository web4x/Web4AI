> ⬆ **[Sprint 2 · Epic D](../../scrum.pmo/sprints/sprint-2/task-s2-d-node-provisioning-hardening.md)** — this spec is traced from that epic.

# Plan: make `ossh config.create` a fundamental part of `odocker run.sshd`

**From**: oosh-po (Tron directive 2026-06-28)
**Owners**: oosh-architect (design integration point + idempotency + failure contract) → oosh-expert (implement in odocker, REUSE ossh config.create) → oosh-tester (verify one-command reachability)
**Priority**: HIGH
**Status**: PLAN (awaiting Tron confirm → assign)

## Why
The u24 gate exposed it: starting a reachable container today is TWO manual steps —
1. `odocker run.sshd naked_ubuntu_24_04 u24 9024` (container + sshd + host-pubkey→authorized_keys; `9a87d34` added the `<sshHostPort>` arg)
2. `ossh config.create u24 root@localhost:9024` (the ssh-config alias)

A container that's UP but has no ssh-config alias is a **half-initialized state** — you can't `ssh u24` / `ossh login u24` / `hiveMind team.push u24` until step 2 is done by hand. Self-care principle: `run.sshd` should leave a COMPLETE, reachable container in ONE command.

## Design (DRY + self-care)

**Integration point**: at the END of `odocker.run.sshd`, after the container is up + sshd verified reachable + host pubkey injected, **call the canonical `ossh config.create`** — do NOT reinvent ssh-config writing inside odocker (DRY: one writer of ~/.ssh/config = ossh).

```
odocker run.sshd <image> <name> <sshHostPort>:
  ... start container, map <sshHostPort>->22, inject host pubkey ...
  verify sshd reachable (ssh -p <sshHostPort> root@localhost true)
  ossh config.create <name> root@localhost:<sshHostPort>     # NEW — the round-trip closer
  verify: ssh <name> true   (alias works)
  report: "container <name> up + reachable via: ssh <name>"
```

**Requirements:**
1. **DRY** — reuse `ossh config.create` verbatim; odocker never writes ssh-config directly.
2. **Idempotent** — re-running `run.sshd <name>` replaces the alias (not duplicate Host blocks). `ossh config.create` must be idempotent (or odocker removes the old entry first via the canonical ossh method).
3. **Derivation** — host/port come from what run.sshd already knows: `localhost:<sshHostPort>` for local docker; if the docker host is remote, use the docker host's address (param/derive, don't hardcode localhost). User = `root` (naked images use root login).
4. **Name = alias** — container name IS the ssh-config alias by default (`u24` container → `ssh u24`).
5. **Self-care failure contract** — if `config.create` or the reachability check FAILS, run.sshd reports a LOUD, single-line error naming the gap ("container up but ssh alias not created — run `ossh config.create <name> root@localhost:<port>`"), never leaves a silent half-state. (Constructor-contract: prefer detect-and-heal — retry once — then report.)
6. **No flags** (OOSH Death-to-Flags) — positional `<sshHostPort>` already; keep the integration flag-free.

## Acceptance
- [ ] `odocker run.sshd <image> <name> <port>` → `ssh <name>` works IMMEDIATELY, no manual config step
- [ ] Re-running is idempotent (one Host block, updated)
- [ ] config-write goes through `ossh config.create` only (DRY — grep shows no direct ssh-config write in odocker)
- [ ] Failure of the config/reachability step → loud actionable error, no silent half-state
- [ ] u24-style flow collapses 2 steps → 1; re-validate the u24 gate path with the integrated command
- [ ] Test T-RUNSSHD-AUTOCONFIG: run.sshd a throwaway container → assert `ssh <name>` + idempotent re-run + failure-path message

## Notes
- Composes with the u24 gate (`u24-freshinstall-testgate.md`): once integrated, the gate's step 1+2 become one, and a fresh box is one `odocker run.sshd` + one `ossh install` away from a working node.
- `odocker run.sshd` `<sshHostPort>` (9a87d34) is the hook to build on.

## Report-back (edit here)
- Architect (integration design + idempotency/failure contract):
- Expert (impl in odocker via ossh config.create + commit):
- Tester (T-RUNSSHD-AUTOCONFIG + 1-command reachability):
