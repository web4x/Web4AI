# Sprint: Node Provisioning — one-command reachable + installable Linux nodes

**Epic**: A fresh Linux node goes from nothing → reachable → dev-oosh installed → team-ready with the fewest, most reliable commands. Every provisioning step leaves a COMPLETE state (self-care); no half-initialized boxes. dev reaches macos.latest boot reliability on a real server.
**Owner**: oosh-po@WODA.prod
**Status**: IN PROGRESS — NP-1 planned (Tron directive); NP-2/NP-3 in flight from u24 gate
**Created**: 2026-06-28
**Source**: u24 fresh-install gate (`u24-freshinstall-testgate.md`) — provisioning was 2+ manual steps; SETUP_SERVER tail blocks completion. Tron directive: fold `ossh config.create` into `odocker run.sshd`.

## Stories

### NP-1: `odocker run.sshd` auto-creates the ossh config alias (Tron directive) — PLANNED
Folding `ossh config.create` into `odocker run.sshd` so ONE command leaves a container reachable via `ssh <name>`. A container up without an ssh-config alias is a half-initialized state. Spec: `session/tasks/odocker-runsshd-autoconfig.md`.
- [ ] `odocker run.sshd <image> <name> <port>` → `ssh <name>` works immediately (no manual config step)
- [ ] DRY: config write goes through `ossh config.create` ONLY (no direct ssh-config write in odocker)
- [ ] Idempotent: re-run replaces the alias (one Host block, no duplicates)
- [ ] Self-care: config/reachability failure → loud actionable one-line error, never silent half-state (detect-and-heal: retry once → report)
- [ ] No flags (Death-to-Flags); reuse existing positional `<sshHostPort>` (`9a87d34`)
- [ ] T-RUNSSHD-AUTOCONFIG: run.sshd throwaway container → `ssh <name>` + idempotent re-run + failure-path message
- Owner: oosh-architect (design integration/idempotency/failure contract) → oosh-expert (impl) → oosh-tester (verify)

### NP-2: fresh dev `ossh install` produces a working node on pristine Ubuntu 24 — IN PROGRESS
The u24 gate. CORE #6 GREEN (pure-state config 20/0 on pristine ubuntu:24.04; 5 fresh-install bugs fixed: rsync→scp 4397ac2/8a3c02d, mode ssh→root, ssh-keygen -N'' 99fb694, seccomp=unconfined). Spec: `session/tasks/u24-freshinstall-testgate.md`.
- [x] odocker u24 running (port 9024), ssh-reachable (`9a87d34`)
- [x] ossh config.create u24 (→ becomes NP-1 automatic)
- [x] fresh dev install → pure-state config, no manual cleanup (CORE #6 PASS)
- [ ] clean boot green on u24 (env -i bash, config pure, color, pane.self, CURRENT) — BLOCKED by NP-3
- [ ] ooshTeam pushed to u24, agents live + discoverable (claudeCode list + hiveMind)
- [ ] TEST GATE marked GOOD
- Owner: oosh-expert → oosh-tester → PO/Tron gate

### NP-3: SETUP_SERVER install state machine completes 32→62 on a real server — IN PROGRESS
The dev reliability gap. macOS STUBS the server tail (no port reference) → dev is first real exerciser; all 5 = FIX dev. Spec: `session/tasks/setup-server-statemachine-tail.md` (architect S-A done `ced7c4e`).
- [ ] BUG5 result-vs-error contamination (error.log → $RESULT → filename) fixed at source [FOUNDATIONAL]
- [ ] BUG3 `ossh prereqs.install` defined/wired
- [ ] BUG2 `state.declaration` defined/replaced
- [ ] BUG1 `config ci` removed-unless-real
- [ ] BUG4 `2cuGitHub` alias created before clone (sequencing)
- [ ] SETUP_SERVER reaches state 62 on fresh u24 install → root `.bashrc` wired → unblocks NP-2 clean boot
- Owner: oosh-architect (S-A done) → oosh-expert (S-B) → oosh-tester

## Dependency order
NP-3 (state machine completes) → unblocks NP-2 (clean boot + push) → NP-2 gate GOOD.
NP-1 (auto-config) is independent — collapses NP-2 step 1+2 into one; do it via architect design while expert is on NP-3 S-B.

## Definition of done (sprint)
A single `odocker run.sshd <image> <name> <port>` + single `ossh install <name>` yields a clean-booting, pure-config, team-ready node on pristine Ubuntu 24 — verified by pushing ooshTeam and seeing agents live + discoverable.
