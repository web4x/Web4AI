# TEST GATE: fresh dev-oosh install on Ubuntu 24 + ooshTeam push (Tron directive)

**From**: oosh-po (Tron directive 2026-06-28)
**Owner**: oosh-expert (infra: odocker + ossh install + team.push) → oosh-tester (independent verify) → PO/Tron mark gate
**Priority**: HIGHEST — this is THE acceptance gate for the whole clean-boot bug sprint
**Status**: OPEN

## Why
macos.latest is currently more stable / boots more reliably. The clean-boot bug sprint (BUG 1-9, A, B, C-ext, FEAT8, ossh-install pure-state #6) all landed on **dev**. This gate proves dev's install is now equally reliable: a FRESH dev-oosh install on a clean Ubuntu 24 box must boot clean, and the ooshTeam must push onto it and work. Only then is dev validated.

## Steps (PDCA per step — verify each before next)

1. **odocker: start u24** — launch an SSH-based Ubuntu 24 (latest) container named `u24` via `odocker`. Must have sshd running + reachable.
2. **ossh config: u24** — create the ossh config entry for `u24` (canonical `ossh config.create` — machine-relative-safe, no hardcoded /root or /Users paths).
3. **Fresh dev-oosh install** — run the NEW dev `ossh install` onto u24. This is the live test of the install-path pure-state fix (#6) + HOME discovery (BUG 1).
4. **Verify clean boot on u24** (the bug-sprint acceptance checks, on a box that NEVER had old pollution):
   - `env -i sh` → `bash`: ZERO errors (no `/.local/bin/env`, HOME resolved by `this`)
   - `config list`: pure exports only, ~19 vars, **0 source lines**, `config validate` passes
   - `OOSH_MODE` set, `OOSH_DIR` on correct tree, `oo mode` shows header
   - `claudeCode list`: COLOR renders (ANSI present)
   - `otmux pane.self` / `pane.get.target`: correct (no $TMUX_PANE)
   - `otmux pane.title CURRENT "x"`: works
5. **Push ooshTeam to u24** — `hiveMind team.push u24` (or teams.migrate). Transfers snapshot + config + JSONLs + forks agents.
6. **Verify pushed team works on u24**:
   - `hiveMind team.status u24` shows the agents
   - `claudeCode list` on u24 SHOWS the pushed sessions (tests #7 placement — JSONLs in target's ~/.claude/projects)
   - agents are reachable via `hiveMind resolve` / `agent.send` from u24
7. **Mark the gate** — if ALL green: PO+Tron mark TEST GATE GOOD. Any red → file + fix, gate stays red.

## Acceptance
- [ ] u24 container running (odocker), ssh-reachable
- [ ] fresh dev `ossh install` succeeds, produces pure-state config (no manual cleanup)
- [ ] clean-boot checks all green on u24 (step 4)
- [ ] ooshTeam pushed, agents live on u24
- [ ] pushed agents discoverable via claudeCode list + hiveMind (step 6)
- [ ] TEST GATE marked GOOD

## Report-back (edit here; report to oosh-po)
- Expert (odocker u24 + ossh install + team.push + per-step results):
  - **Step 1 — odocker u24: GREEN.** Built `naked_ubuntu_24_04` from `DockerWorkspaces/nakedUbuntu/24.04/Dockerfile` (fixed 2 build blockers: apt `docker-clean` Post-Invoke hook fails on noble under Docker 20.10.7 → remove hook before apt-get; added root-login enable to mirror 20.04.sshd). Enhanced `odocker run.sshd` with optional `<sshHostPort>` (SSH-only mapping, no 8080/8443 collision with running u20) — dev `9a87d34`. Ran `odocker run.sshd naked_ubuntu_24_04 u24 9024`; injected host pubkey → root authorized_keys. **Verified**: `ssh -p 9024 root@localhost` → `Ubuntu 24.04.4 LTS`, sshd reachable. Container UP, port 9024->22.
  - **Step 2 — ossh config.create u24: GREEN.** `ossh config.create u24 root@localhost:9024` → rendered User root/Port 9024/HostName localhost/IdentityFile ~/.ssh/id_rsa; `ossh config.save.last` appended to `~/.ssh/config`. Verified `ssh u24` connects via alias.
  - **Step 3 — fresh dev ossh install: install-path had FIVE real bugs, all fixed; CORE result GREEN.** Running the NEW dev installer onto a pristine ubuntu:24.04 surfaced (and I fixed) a chain of fresh-box install bugs:
    1. `private.ossh.rsync` checked LOCAL rsync only → rsync needs it on BOTH ends; fresh box has none. Added remote probe → scp fallback. (`4397ac2`)
    2. `ossh install` caller used stale `./oosh mode ssh …` but the new dev `init/oosh` only accepts `mode root`. Fixed to `mode root <host> _ <branch>`. (`4397ac2`)
    3. container: glibc 2.39 (noble) `clone3` blocked by Docker 20.10.7 default seccomp → `getaddrinfo() thread failed to start` on git clone. Run u24 with `--security-opt seccomp=unconfined`.
    4. `user init` ran `ssh-keygen` WITHOUT `-N ""` → passphrase prompt hung forever on closed ssh stdin (froze the whole install at state 32). Added `-N "" -q`. (`99fb694`)
    5. `private.ossh.rsync.pull` had the same local-only check → fails pulling to a fresh box. Added remote-source probe → scp fallback. (`8a3c02d`)
    - **CORE GATE RESULT (the #6 acceptance): GREEN** — fresh dev install on a pristine box produces **PURE-STATE config: 20 exports, 0 source lines**; `~/oosh` cloned (dev, 69 files); `oo status` runs. HOME-discovery (BUG 1) implicitly OK (install ran as root with HOME=/root resolved).
    - **OPEN**: direct-root install does not yet auto-wire root's `~/.bashrc` with the OOSH bootstrap (installer wires `$SUDO_USER`'s bashrc only when SUDO_USER≠root; direct-root path skips it). Clean-boot (Step 4 `env -i bash`) needs this. Investigating final install completion + bashrc wiring.
- Tester (independent verification of steps 4 & 6):
- PO gate decision:
