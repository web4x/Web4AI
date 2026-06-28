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
    - **OPEN — install state machine stalls at 32/62 (DECISION NEEDED).** After the 5 fixes, the `SETUP_SERVER` state machine reaches state **32 `root.dev.keys.installed`** and cannot advance to 62 (completion). Further bugs surfaced in states 32→62: `ERROR Unknown method: config ci`; `state: line 361: state.declaration: command not found`; `this.load failed to load ossh from "prereqs.install"`; `config 2cuGitHub/2cuBitbucket not found`; and an ANSI-color leak into a brace pattern (`.ssh/\033[1;31mERROR>.pub` — an `error.log` string captured into `$RESULT` then used as a filename). Because state machine never completes, root's `~/.bashrc` is never wired → **clean-boot (Step 4) is BLOCKED**. This is a multi-bug tail (each fix → re-install ~5min reveals the next). Consistent with "macos.latest boots more reliably." **Recommend PO/architect scope decision**: continue fixing the state machine bug-by-bug, OR treat states 32-62 as a tracked follow-up. **Validated GREEN regardless**: the pure-state config architecture (#6) + the install transport (clone, key, config gen) all work on a pristine box — the bugs are in the post-clone SETUP_SERVER state transitions.
    - **UPDATE 2026-06-28 (S-B in progress, → `session/tasks/setup-server-statemachine-tail.md`):** PO split the 32-62 tail off. Architect S-A: ALL 5 = FIX dev, zero ports (macOS stubs the tail). Expert S-B progress: **BUG5 (contamination) FIXED+VERIFIED `2b68265`** (create.result strips ANSI; error/important.log never hit stdout → clean `.pub` paths, no brace crash). **Still at state 32**; BUG5 exposed the true blocker: **`Unknown method: ossh get.key.name` at ossh:533** (should be `ossh key.name.get` — words reversed) + BUG2 `state.declaration: command not found`. NEXT STEP: fix `ossh:533` method name, re-install, then BUG2/3/1/4. u24 testbed live on port 9024 (seccomp=unconfined). Re-install cmd: `LOG_DEVICE=/dev/stderr LOG_LEVEL=3 STEP_DEBUG=OFF ossh install u24` after recreating container + injecting host key.
- Tester (independent verification of steps 4 & 6):
- PO gate decision: **CORE #6 = PASS, FULL GATE = HELD (not yet good).** The pure-state config architecture (the bug-sprint heart) is VALIDATED on a pristine box — 20 exports/0 source, plus 5 real fresh-install bugs fixed (great work). BUT the gate requires clean boot (Step 4) + team push (Step 5), both BLOCKED by the SETUP_SERVER 32→62 stall. That stall IS the "dev boots less reliably than macos.latest" gap Tron named. **Decision: do NOT blind-grind dev bug-by-bug. Split off → `session/tasks/setup-server-statemachine-tail.md`** with the macos.latest→dev strategy: architect compares macos.latest's SETUP_SERVER (it boots reliably) vs dev FIRST, decides port-vs-fix per bug, expert applies targeted fixes. Gate stays RED until state 62 completes + push works. Expert: HOLD the grind, hand to architect for the comparison. S3 dev→macos.latest merge remains HELD.
