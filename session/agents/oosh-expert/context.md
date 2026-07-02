# OOSH Expert Agent Context

**Session**: oosh-expert@WODA.prod (opus 4.8 1M)
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: ooshTeam:0.3 (verified via `otmux pane.get.target`; shell ooshShells:0.0)
**Machine**: WODA.prod (dev branch, /root/oosh)
**PO**: oosh-po @ ooshTeam:0.0 | Peer tester: ooshTeam:0.4 | Architect: ooshTeam:0.2
**Updated**: 2026-07-02 — see "SESSION 2026-06-28→07-02" block below. (Older WODA.prod-instance state preserved beneath it.)

## SESSION 2026-06-28 → 2026-07-02 (MacStudio oosh-expert @ ooshTeam:0.2; dev via worktree; tester/PO drive WODA.test)
All work on `dev` in a git worktree (test/macos.latest undisturbed); tester verifies live on WODA.test; report-back = git mailbox (per SPRINT-COMMS). Delivered + QA-signed:
- **init/oosh self-heal constructor (GATE GREEN, tester RUN6 c0e6036)**: 12 edits — clean-env guard + run-as-user, LOG_DEVICE #1, rm -f #2, mv-glob #3, apt-defer #5 (`oosh_can_escalate`), .bashrc login hook #4, oo.update git self-heal #6, `set +e` tail + relocate hook, benign-deferral exit 0, and the FINAL fd2-dup `private.log.emit` (kills the su- /dev/stderr leak — see learnings).
- **SETUP_SERVER sprint (sprint-setup-server-crossplatform.md, on dev)**: S2 `566fed9` (D1 reorder + D2 XOR redirect via state.find + C.1 OOSH_MODE seam), S3 `650e743` (OOSH_SHARED_BASE platform seam → OOSH_COMPONENTS_DIR/ODOCKER_WORKSPACES, macOS literals dropped), S7 `19a2a45` (`os.os` accessor single-sources discriminator), F2 `8be593d` (non-interactive sudo probe — naked bootstrap never hangs), S8 `09d33c9`+`691a269` (reconcile self-heal: DRY `private.setup.server.declare` + schema stamp + two-tier detect; F2-safe rm instead of `state machine.delete`-which-runs-`oo cmd vim`). **S8 rebuild-persistence still needs tester T-RECONCILE on an ISOLATED box** (my scratch harness confounded by co-resident real install).
- **Death-to-Flags #5 `90f6768` + #33 `553b19a`** (SIGNED OFF): --fork already flagless (c6033dd); stale --apply doc fixed; otmux `--force`→`force` sentinel. True zero flags / 9 scripts; fence `test/test.no.flags` at budget 0.
- **Also (macos.latest earlier this session)**: env-files-pure-state `d45031a`, hiveMind MVC parity merge `f74c20a`, otmux send-Enter over-SSH fix `04b54a5` (Escape-before-Enter dismisses autocomplete), tronMonitor team.sweep auto-switch `3249104`.
- **Death-to-Flags #33 SIGNED OFF** `553b19a` (otmux `--force`→`force` sentinel; true zero flags / fence budget 0).
- **#13 claudeCode/dash CLOSED as already-solved** (`8168a562`): D13.1 measured the real blocker = OOSH dotted `object.verb` fn names un-parseable by dash (framework-wide, line 34), NOT install bashisms; D13.2 `ef34ed0` POSIX-cleaned claudeCode.install/uninstall bodies anyway (harmless hygiene, fence-green); D13.A grounding measured `init/oosh` (the REAL fresh-host sh entry, `#!/usr/bin/env sh`) is dash-safe in BOTH forms → premise didn't reproduce. My measurement corrected a PO named-trigger assumption twice this thread (42-loop). See learnings.
**NOW**: idle — sprint-1 tail (E1.2/D1.3) Tron-blocked on naked container; #13 closed; awaiting PO assignment.

---
## (prior WODA.prod-instance state — kept for that instance)
**Instance**: oosh-expert@WODA.prod, ooshTeam:0.3, /root/oosh — 2026-06-28: u24 fresh-install GATE / SETUP_SERVER tail (S-B). S3 macos.latest merge HELD (S1 not green: tester found 83 legacy fails). Clean-boot sprint (BUG1-9,A,B,C-ext,FEAT8) all on dev + QA-passed.

## ACTIVE: u24 fresh-install gate → SETUP_SERVER 32→62 tail (S-B)
Task files: `session/tasks/u24-freshinstall-testgate.md` + `session/tasks/setup-server-statemachine-tail.md`.
**Goal**: fresh dev ossh install on pristine ubuntu:24.04 (u24 container) must reach state 62 + wire root .bashrc → clean boot.
**u24 testbed**: container `u24`, port 9024, `--security-opt seccomp=unconfined` (glibc clone3 vs Docker 20.10.7), root key injected. Recreate+install:
```
docker rm -f u24; docker run -d --name u24 --security-opt seccomp=unconfined -p 9024:22 naked_ubuntu_24_04
docker exec u24 bash -c "mkdir -p /root/.ssh && echo '$(cat /root/.ssh/id_rsa.pub)' > /root/.ssh/authorized_keys && chmod 600 /root/.ssh/authorized_keys"
LOG_DEVICE=/dev/stderr LOG_LEVEL=3 STEP_DEBUG=OFF ossh install u24
ssh u24 'grep -E "^state=|stateValue" ~/config/current.state.machine.env'   # check state
```
**5 install-transport bugs FIXED (gate)**: rsync push+pull remote-probe→scp (4397ac2,8a3c02d), mode ssh→root (4397ac2), ssh-keygen -N'' hang (99fb694), odocker run.sshd sshHostPort (9a87d34); +container seccomp.
**SETUP_SERVER S-B (architect: ALL 5 = FIX dev, zero ports — macOS stubs the tail)**:
**✅✅ S-B COMPLETE 2026-06-28 — CLEAN BOOT GREEN on pristine u24. Handed to tester (S-C) for Step 4+5.** Fresh dev install → state 99 finished, root .bashrc wired, `env -i bash` = working OOSH shell (OOSH_MODE=dev, oo on PATH, config valid, 0 errors). ~11 fixes: BUG5 2b68265, method-name d546947, BUG2 044dc75, BUG1+3 edbbabc, BUG6 376020e, 33-62 batch ffb38c9, driver-loop 278d5a7 (the structural key: continue.local looped `state next` to terminal vs single call), root-bashrc bee01a1 (state 33 installs bashrcTemplate in-chain) + 5 gate install-transport. Detail: setup-server-statemachine-tail.md.

**BUG6 pkill REGRESSION fixed `44c9043` (S3 gate 1 CLEARED).** My earlier BUG6 `3fd419b` (pane.unlock pkill orphan-sweep) used `pkill -f "pane.lock.*<target>"` which matched the FOREGROUND `otmux pane.lock <target>` process itself → auto-unlock-first self-SIGTERM → rc=143, title never set (tester caught it, T-UNLOCK-KILLS-1 RED 3e4ab3e). FIX: tag the enforcer loop `setsid bash -c '…' __paneLockEnforcer <target> <title> <pidFile>`; new `private.otmux.pane.lock.killEnforcers` pkills ONLY that signature (dots escaped), called by both lock(pre-spawn) + unlock(orphan-sweep) — never the foreground caller. Verified green on full `test.suite run otmux`: T-UNLOCK-KILLS-1/2/3 all PASS.

**S3 dev→macos.latest merge BLOCKED on TWO gates** (per PO S3-GATE DECISION in s1-suite-failures.md): (1) BUG6 pkill fix → ✅ CLEARED 44c9043; (2) u24 fresh-install gate GOOD → expert-GREEN, tester S-C verification pending. When BOTH green: merge dev→macos.latest (plan in sprint-cleanboot-closeout.md, clean auto-merge confirmed). The 82 other legacy suite fails = PRE-EXISTING shared debt (separate sprint, NOT S3 blockers).

---
## (archived) earlier S-B progress
**7 BUGS FIXED (all architect-5 + 2 siblings); machine chains 0→32 cleanly; STOPS at state-33 setup (new batch).**
- ✅ BUG5 contamination `2b68265` — create.result(this:319) strips ANSI; err.log+important.log coerce stdout/empty LOG_DEVICE→/dev/stderr.
- ✅ method-name `d546947` — `ossh get.key.name`→`ossh key.name.get` at ossh:533 + ossh:1513 (renamed in dev, call sites missed).
- ✅ BUG2 `044dc75` — defined `state.declaration()` (lightweight current-state render; state.machine.declaration cats whole file + installs vim, wrong for per-transition).
- ✅ BUG1+BUG3 `edbbabc` — removed vestigial `config ci`(this:927); defined `ossh.prereqs.install()` (rsync+tree via oo cmd, non-fatal).
- ✅ BUG6 `376020e` — ossh.key.pull(1483) pulled `.ssh/<name>.pub` but ossh keys live at `public_keys/<name>.public_key`; try managed path first.
- ⏳ STATE STILL 32 (machine chains 0→32, state-33 `root.installation.done` SETUP fails). Checks are STUBS (oo:981-986 return 0) → advance gated by SETUP action. `state.next`(state) is single-step; chain driven by each passing check calling next; `ossh.install.continue.local` kicks it via `state next`(ossh:502).
- **NEXT (state-33 setup, fresh-box-assumption class)**: `wget 404 Not Found` (dead asset URL); `cat /root/.ssh/config: No such file` (fresh box); `cp config.initial/stateMachines/: No such file`. Reported to PO/architect for scope — same class as gate's 5 install bugs.
- Re-install cmd unchanged (see above). u24 still live port 9024.

---
## PRIOR: clean-boot sprint + S3 plan

## Sprint: clean-boot bugs + parity (2026-06-28, dev) — all QA-passed

| Item | Commit | What |
|------|--------|------|
| BUG1 | 4bdd948 | this.init resolves HOME before any HOME-path (env -i/cron/container) |
| BUG2 | 37e16f7 | config.save harvest drops source lines (pure-state) + regen user.env |
| BUG3 | af3a3f7 | config.save inert — no LOG_DEVICE mutation, no this.load, info.log |
| BUG5 | d40a005 | hiveMind.status fd3 — team.status no longer eats session list via stdin |
| BUG6 | 3fd419b | pane.unlock pkills ALL enforcers — no orphan accumulation |
| BUG7 | 6480f78,350e3e7,d74e354,a20d0d7,a5f709d | ELIMINATE $TMUX_PANE — public `otmux pane.self` (PID-walk) is the ONE self-ID primitive; purged otmux/hiveMind/claudeCode/restore; T-NO-TMUXPANE guard |
| BUG7 C-ext | 9ff5343 | kill bare `display-message -p` self-ID (focused-pane bug); `private.otmux.self.session`; guard extended |
| BUG9 | 4c52e24 | otmux.send prefix idempotent — skip if text starts with `[@` (no `[@x][@x]`); T-PREFIX-IDEMPOTENT |
| A | 9937799 | config.save ALLOW-LIST: strict OOSH-only live-env harvest + deny-set; user.env 113→19 exports, 0 leakage |
| B | c82fa31 | `line init` self-contained EXPORTED setup.color.env — colors survive into subprocesses (claudeCode list); pure-state |
| FEAT8+D | 615918c,76bb8ef | `CURRENT` pane target via one resolver→pane.self; shared `private.complete.paneTargets`; T-CURRENT-TARGET (explicit env-gated skip) |
| extra | 1366742,9557be1,f076064 | sweep.detect 'auto mode on'=idle + team.sweep fd3; team.models.list; default model opus-4-8[1m] DRY const |

**Key primitives this session**: `otmux pane.self [%|target]` (PID-walk self-ID, never stale) + `private.otmux.self.session` + `CURRENT` target. **Doctrine**: env files = pure exports, `this` owns source chain (architect reconciled 6540254). **S3 gate**: merge dev→macos.latest is clean (merge-tree: 0 conflicts); HOLD until tester S1 GREEN.

---
## PRIOR (archived) — constructor-contract + config-selfheal sprints (2026-06-27)

## Sprint: constructor-contract (S-1..S-11, all verified)

| Commit | Story | What |
|--------|-------|------|
| 76c629b | S-1 team-migration | projectHash + 3 JSONL transfer site fixes |
| 814f7ec | team-migration | team.push controller (preflight, resolveCanonical, push.agent 8 sub-steps) |
| 037e240 | team-migration | /remote-control capture+verify+retry+URL extraction |
| 6ba9b86 | S-8 team-migration | snapshots.list + snapshots.prune |
| 07c6b1e | S-9 team-migration | projectHash bugfix (sed /._) + captureForkedUUID |
| 2a03bae | #6 login fix | config.save emits OOSH_DIR+CONFIG_PATH+OOSH_MODE |
| 6cb5172 | #6 login fix | bashrcTemplate: source user.env before interactive guard |
| e36f6b5 | #10 born-broken | config.repair writes to resolved absolute path |
| 921f0c3 | S-2 constructor | private.this.resolve.fundamentals — BASH_SOURCE chain walker |
| dab7685 | S-3 constructor | config.save unconditional emit — no [ -n ] guards |
| b50355e | S-4 constructor | config.validate accepts source *.env (Rule A) |
| ecfa763 | S-5 constructor | harvest-resolve-merge in config.save — no-loss reinit |
| ab1306e | S-6 constructor | private.this.selfheal — constructors always self-heal |
| 4c1ea97 | S-6 fixes | 7 T-CONSTRUCTOR fixes: harvest file+live, guard log.device |
| cc4da85 | S-10 otmux | otmux.attach self-healing + __test_ completion filter |
| f13f35d | S-10 c2 | c2 completion crash fix — guard empty pipeline + bash -n |
| d83907b | S-10 c2 | c2 completion ';' fix — extract param from signature, fix RC |
| b6300b2 | S-11 config.add | restore source line write (Rule A), dynamic harvest |
| c3e3ffb | GAP-1 | config.add idempotent grep guard |

## Sprint: config-selfheal (CS-1..CS-5)

| Commit | Story | What |
|--------|-------|------|
| d583281 | CS-1 | config.clean: awk dedup preserving line order (replaces sort -u) |
| 2bfc88b | CS-2 | BASH_FILE unconditional emit via which bash fallback |
| 91bfd14 | CS-3 | guard config.save oosh/log sub-saves on OOSH_DIR non-empty |
| bf674b9 | CS-4 | config.validate gate in ossh.install finish+continue |
| fc5b6b3 | CS-5 | fix constructor test fixtures — re-resolve CONFIG after config.save |

## Key architecture
- Constructor contract: this.init/config.save ALWAYS yields valid object
- 3-phase harvest-resolve-merge: FILE+live harvest → BASH_SOURCE resolve → merge+validate
- resolve.fundamentals: BASH_SOURCE chain walker, symlink-safe, no $HOME/oosh guess
- team.push: per-agent verify-or-fail with 8 sub-steps
- c2 completion: empty pipeline guard, bash -n source guard, signature param extraction

## Notes
- WODA.prod has no /dev/tty — use LOG_DEVICE=/dev/stdout
- u20 = born-broken repro box (symlinked ~/config)

---
## ⚡ CURRENT WODA.prod SESSION (ooshTeam:0.3) — 2026-07-02, saved pre-cliff (appended)
DONE (all dev, pushed): security rebuild (u20+u24 KEY-ONLY loopback-bound; incident RESOLVED); parity PF1-4 (shared reader `private.hiveMind.live.tupleset`; teams.save+team.list consume it; `hiveMind role.uuid` live-preferred; PF5 3/3 cc641b7); plantUML task-s2-f.1 (odocker run.ephemeral+image.ensure 1cb40ee; plantuml 0638344; docs/plantuml.md a51c9ed; T-PLANTUML 5/5); OTR-2 route auto-heal (3452eae).
**OTR-1 (task-s2-b.1) DONE**: 96ccff2 otmux core (send.stage/submit/poke/verify; send.smart→honest rc{0,2,3,1}; REGION-verify not text-presence — kills BUG10 false-pos), a9fbea5 hiveMind (agent.queue.drain gates dequeue rc0 = no-silent-drop; delegate=pointer-only thru core), 0cc1b9e timing (settle 1.3s — verifying too early false-STAGE-reads submitted pane → harmful Escape-poke; live-caught). Tester T-DISPATCH-SUBMIT next. Supersedes BUG10.
**⏭ NEXT — NOT STARTED: OTR-3** = scrum.pmo/sprints/sprint-2/task-s2-c.2-reconcile-after-fork.md (PO design): I2b (batch live-uuid vs cached via `private.hiveMind.live.tupleset`) + fork-event uuid-adopt + tty-match orphan adopt + team.audit + route auto-heal. Tester T-RECONCILE-FORK. READ SPEC FIRST. Reuse: live.tupleset (parity reader), otmux send.verify (region), hiveMind role.uuid (live uuid).
