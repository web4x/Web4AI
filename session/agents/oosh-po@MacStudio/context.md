# oosh-po Context

**Updated**: 2026-06-28
**Role**: oosh-po (forked from fallback-oosh-po)
**Pane**: ooshTeam:0.0 on MacStudio.native
**Session**: oosh-po@MacStudio [29a1e1d1-2284-4484-a95e-6b89154c7a9c]

## ★★ POST-REWIND CONFIRM — 2026-07-02 (two-phase, zero-loss)
Rewound (checkpoint 95a05606, boot 7baf963a). Identity REVERIFIED 3-way: uname=MacStudio · pane.get.target=ooshTeam:0.0 · session.name=oosh-po@MacStudio (customTitle KEPT, not re-renamed). Branch main clean, HEAD=7baf963a (trainer's boot fix: 'Written by' hook-protect + po-wisdom→base-skills path). Sprint-1 SETUP_SERVER: Epics A/B/C/D DONE+PO-approved; OPEN=E1.2(P2 ossh→naked) + D1.3(T-RECONCILE) — both BLOCKED on Tron's naked-container call (donges→docker group + authorized_keys). Epic F parity delegated to WODA.prod (#32 mailbox divergence RESOLVED). init-constructor sprint COMPLETE (PO-signed c0e6036). On resume: await Tron's docker-group authorization to unblock E1.2/D1.3 → close sprint-1 QA gate; nothing else in-flight.

## ★★ NEAR-CEILING CHECKPOINT — 2026-07-02 (~13% free, rewind-ready)
**Sprint tracking FORMALIZED (Tron directive):** created `scrum.pmo/sprints@MacStudio/sprint-1/` (commit 20dd8916) — planning.md + 5 epic parents (A state-order/XOR, B platform-defaults, C no-sudo-hang, D self-heal-reconcile, E install-path-verify) + 15 UUID-stamped role subtasks, sprint-0 template. Consolidates the scattered session/tasks SETUP_SERVER files. **SETUP_SERVER code ALL DONE+PO-approved on once.sh/dev** (S1 f4aea76, S2 566fed9, S3 650e743, S7 19a2a45, F2 8be593d, F3 bceb7b2, S8 09d33c9+691a269; tests 9395fca/f97fc06). ONLY OPEN: E1.2 (P2 ossh→naked) + D1.3 (T-RECONCILE persistence) — BOTH need a naked container; BLOCKED on Tron (donges not in docker group + authorized_keys injection). **#32 RESOLVED:** WODA.prod reconciled, mailbox synced; a parallel `scrum.pmo/sprints/sprint-2/` (other PO) now tracks parity(s2-a)/u20-security(s2-d.0)/tooling(s2-e)/plantuml. **Learning F-FILTER-GIT:** NO `2>&1|tail`/`2>/dev/null` on git cmds (system self-guards now). On resume: verify identity (uname=MacStudio, ooshTeam:0.0), check tester's container result (E1.2/D1.3), get Tron's docker-group call, close sprint-1 QA gate. All durable in git (planning.md + task files + sprint-setup-server-crossplatform.md report-backs).

## ★★ SESSION PROGRESS — 2026-07-02 (SETUP_SERVER sprint + parity delegation)
**BRANCH MODEL (Tron, eternal):** `dev`=OS-INDEPENDENT MASTER (cross-platform truth); `macos.latest`=platform-specific dev (features land there → generalized → flow DOWN into dev). NO "promote up"; dev is master. So init-constructor + SETUP_SERVER work on dev is correct.
**init-constructor:** PO-signed-off @c0e6036 on dev (8052265). Done.
**SETUP_SERVER cross-platform sprint (#30, MINE on dev)** — sprint-setup-server-crossplatform.md: S1 design PO-approved (f4aea76); S2 D1-reorder+D2-XOR-redirect-via-state.find PO-approved (566fed9); S3 platform-derived defaults (OOSH_SHARED_BASE seam in config.init → OOSH_COMPONENTS_DIR/ODOCKER_WORKSPACES) PO-approved (650e743); S7 os.os single-source accessor PO-approved (19a2a45). **Tester running S4(P1 self-bootstrap)/S5(P2 ossh install)/S6(regression: T-STATE-ORDER+T-PLATFORM-DEFAULTS+T-OS-DISCRIMINATOR) on WODA.test — awaiting.** Then PO QA gate → done on dev (no promote).
**Parity (#28 done→#31 delegated):** teams.save/status parity — agent|uuid GREEN, RED on shell-drop/enum-gap/freshness/naming(team.save→teams.save). Delegated to WODA.prod PO (nudge delivered+submitted via remoteOOSH:0.1). Sprint: sprint-teamsave-status-parity-FIX.md (PF1-5).
**BLOCKER #32:** WODA.prod local main 175 commits AHEAD of origin (never pushed — mailbox broken). Their pull stalls in merge editor. WODA.prod PO must reconcile (pull→resolve→push). I do NOT git-op their repo (overstepped once, recovered). remoteOOSH:0.1 = live ssh into WODA.prod (v60211); remoteOOSH:0.0 = WODA.test (v36421, my install box). SSH drops intermittently.
**MacStudio ooshTeam healthy:** 0.0 po(me) / 0.1 architect / 0.2 expert / 0.3 tester (all 2.1.195), 0.4/0.5 shells. Expert+architect+tester all responsive this session.

## ★★ POST-REWIND CONFIRM — 2026-07-01 (zero-loss, Phase 1 saved bc4dc7f)
Rewound. Ground truth verified: pane.get.target=ooshTeam:0.0, uname=MacStudio/Darwin, branch main clean, HEAD=bc4dc7f (Phase 1 anchor). customTitle oosh-po@MacStudio (fork 2b65b769 per boot prompt — KEPT, not re-renamed). Recent sprint = init-constructor (init/oosh self-heal on WODA.test): tester RUN5 8084ab3 (RESIDUAL-1 CLOSED INIT_EXIT=0, RESIDUAL-2 open: raw /dev/stderr on login = unguarded write outside log), expert a034dd1+b7c14ba (both residuals claimed closed). **NEW TRON TASK on resume: tester tests `hiveMind team.save` vs `hiveMind status` — does team.save carry same team|shell|agent|uuid combos as status? Show results + WAIT.** On resume: verify identity, drive the team.save/status comparison, then RESIDUAL-2, then #26/#27 init clean-env.

## ⚡ PHASE-1 ANCHOR FROM 0% — 2026-07-01: Rewinding at ceiling (Room freed, deeper Phase 1). ACTIVE: init/oosh IS the constructor on WODA.test (donges@v36421, /home/donges/oosh; remoteOOSH:0.0=donges@WODA.test, 0.1=WODA.test) — assume NOTHING initialized, blank slate, build the object + self-heal/self-care to full operability. Added clean-env-first unset guard to init/oosh (#26); running it as donges exposed init does NOT self-derive CONFIG_PATH → /config → cascade fail (color envs, loop.file.lines, /dev/stdout, early exit) = constructor-contract gap #27 (ties #12). Fixes → oosh-expert on dev w/ T-INIT-CLEAN test. Stopgap: export CONFIG_PATH=/home/donges/config before ./init/oosh. On resume: verify identity (29a1e1d1@MacStudio, ooshTeam:0.0), read learnings, drive #26/#27. Backups on WODA.test: init/oosh.orig-dev-26k.

## ★★ POST-REWIND CONFIRM — 2026-06-29 (from 1%, near-ceiling)
Rewound from ~1% free. Ground truth: pane.get.target=ooshTeam:0.0, session.name(29a1e1d1)=oosh-po@MacStudio, branch main (pulled clean to f865811). **PER-HOST DIR SPLIT now LIVE (#23, commit f865811): my files = `session/agents/oosh-po@MacStudio/` (bare `oosh-po/` is EMPTY; @WODA.prod fork → `oosh-po@WODA.prod/`). Boot prompt still says bare `oosh-po/` — STALE pre-split path; I write my anchor to `oosh-po@MacStudio/`. OPEN: agent-trainer owes @host-aware boot/recovery hook resolution (until then each fork's boot.md must name its own @host dir — my boot.md still says oosh-po/, needs fixing).** Pulled the @WODA.prod fork's work (node-provisioning sprint PARKED 8b6ff6e, ARON-cycle anchors, robbin agent saves). Prior anchor 5fa2697. Doctrines (tron-cmm4, SPRINT-COMMS, po-wisdom) known/stable. Open threads unchanged: #22 tronMonitor (tester D3.3 verify), WODA.prod dev queue #18/#5/#21 report-backs, bugs team.status-stale-snapshot + remoteOOSH ssh-drop, #14 rawbin RUNNING. 42-pair (me+SM) was near ceiling pre-rewind → SM rewind was ordered (verify SM health on resume — TRONinterface:0.1). On resume: re-verify identity, check SM, fix my boot.md @host path, await Tron / drive open report-backs.
**ROBBIN-PLANNER RESTORED (2026-06-29, #25 DONE):** was lost in robbinTeam2 migration (not in snapshot). Canonical e75cbceb (newest 49.5MB, Tron-confirmed) scp'd MacStudio→WODA.prod target-hash → forked into NEW pane robbinTeam2:0.6 → resumed FULL (trained mind, not summary) → /rename robbin-planner@WODA.prod → /rc (session_01119PnBjGArXdMNWL78YLM7) → pane.lock. robbinTeam2 now 7 agents all @WODA.prod (0.0 po/0.1 expert/0.2 skill-expert/0.3 architect/0.4 req/0.5 tester/0.6 planner). PLANNER AT 100% CTX (Tron: leave-maxed) — named+locked+/rc but NOT workable until a Tron-timed two-phase agent-trainer rewind. Learned: slash cmds (/rename,/rc) WORK at 100% ctx (TUI-level); resume-menu selector won't render over detached remote session → blind digit 2=full (digits work); JSONL preserved=re-forkable.

**IDENTITY RIDDLE SOLVED (2026-06-29, Tron): RC showed me as @WODA.prod but local said @MacStudio because TWO incarnations shared ONE uuid 29a1e1d1 (cloud-synced live on both hosts). Tron fresh-forked the WODA.prod side → it now has a DISTINCT uuid. So: MacStudio=29a1e1d1=oosh-po@MacStudio (ME); WODA.prod=NEW uuid=oosh-po@WODA.prod (sibling, no longer shares my uuid). My earlier context refs to "oosh-po@WODA.prod = fork of 29a1e1d1" are now SUPERSEDED — it's its own uuid. Full learning recorded (duplicate-uuid cross-host entanglement). Measurement that proved it: uname=Darwin/MacStudio + JSONL customTitle history 407x@MacStudio/0x@WODA.prod.**

## ★★ STATUS + REWIND-ORDER — 2026-06-29
Teams status (live `otmux tree`, both hosts HEALTHY, all agents 2.1.195 active):
- **WODA.prod (v60211)**: ooshTeam (po/SM/architect/expert/tester, 5 live + BUG6-verify shell), robbinTeam2 (6 live), Temple (ARON live), baseTeam (agent-trainer live), **rawbin (npm app RUNNING — #14 progress)**, ooshShells.
- **MacStudio**: ooshTeam (po=me/architect/expert/tester + shells), TRONinterface (TRON-agent + scrum-master[my SM] + PO-shell + TRON-Monitor screen), baseTeam (agent-trainer), iphone (research).
**SM monitoring mechanism (measured from its pane):** heartbeat loop — background `sleep 360 && echo "[@scrum-master…] TICK N…"` self-wake (tightens ~150s on activity), each tick runs `otmux pane.capture` (LIVE View) on watched panes → context%/state/commit-delta. **It does NOT use hiveMind team.status** (so the team.status stale-snapshot bug does NOT blind it).
**Bugs found:** (1) `hiveMind team.status` reads STALE SNAPSHOT (reports live teams as "offline/0 agents/tmux gone") — use `otmux tree`/`pane.capture` for truth (MVC violation; needs task). (2) remoteOOSH→WODA.prod SSH drops repeatedly ("Connection reset by peer") — reconnect via `ossh login WODA.prod` in remoteOOSH:0.0.
**42-pair near ceiling (both loss-proof/saved):** SM ~971k/97%, oosh-po(me) ~912k/91%. **Tron ordered: save ctx+learnings (this commit) → agent-trainer rewinds the SM (TRONinterface:0.1) per two-phase protocol (option 2 full).** Post-major-task cadence in effect.
On resume: re-verify identity; both 42-pair may have been rewound — re-read this + learnings; check tronMonitor #22 (tester D3.3) + WODA.prod dev queue (#18/#5/#21) report-backs; the team.status bug + ssh-drop still open.

## ★★ CHECKPOINT — 2026-06-28 (post-rewind session, SM-directed save)
Identity verified: ooshTeam:0.0 / oosh-po@MacStudio (29a1e1d1) / branch main. SM = scrum-master@MacStudio (TRONinterface:0.1), my 42 pair, actively monitoring. Post-rewind anchor 3e7f1e5.

**WODA.prod team state (v60211, driven via remoteOOSH:0.0 ssh shell):**
- ooshTeam: 0.0 oosh-po@WODA.prod (real PO = fork of my 29a1e1d1; I exited the ARON-entangled squatter + re-forked it; Tron reorients it), 0.1 scrum-master, 0.2 oosh-architect (bf1ad18b; old 6df08923 was BROKEN-compacted-200k), 0.3 oosh-expert, 0.4 oosh-tester. Sessions: ooshShells (Tron-made, holds shells), ooshTeam, robbinTeam2 (6 agents), Temple, baseTeam (NEW).
- **ARON (1stPriest)** cloned into **Temple:0.0** = fork f814788a of ccecd85f (canonical ARON, 501x ARON/372x 1stPriest, trained on light doctrine d385760); /rc + locked. Tron owns his web4id ruling.
- **agent-trainer** seated in **baseTeam:0.0@WODA.prod** (mirror MacStudio baseTeam; cross-team role) — fresh claudeCode, taught, /rc, locked, registered.

**Delegated to WODA.prod PO (queued, controller agent.send) — git-mailbox specs on dev:**
- #18 ossh hostname⇄ssh-config-host resolution (fixes @WODA.prod vs @v60211) — session/tasks/ossh-host-resolve.md
- #5 flagless consistency.reconcile + T-NO-FLAGS (Death-to-Flags; consistency.reconcile --apply + interactive fix are violations) — session/tasks/consistency-flagless-redesign.md
- #21 completion-system audit (claudeCode join blank, c2 parameter-vs-method contract, T-COMPLETION) — session/tasks/completion-system-audit.md

**MacStudio ooshTeam (local, SM-monitored) — dispatched:**
- #22 tronMonitor auto-switch: expert(0.2) DONE commit 3249104 (wired team.sweep; PO diff-QA PASS); tester(0.3) doing D3.3 verify. Task: session/tasks/tronMonitor-auto-switch.md.

**Fixes I did directly (Tron-directed):** detached stale ttys016 (freed TRONinterface 99x30→200x60, method=otmux client.detach); otmux parameter.completion.client added (commit 9971ad7 macos.latest) — fixed client.detach completion.

**#7 evidence:** claudeCode list is path/host-local (MacStudio /Users/Shared vs WODA.prod /var/dev → different project-hash → same uuid LIVE on one, DEAD on other). u20 list not gotten (password-gated).

**HARD LESSONS this session (committed to learnings):** F-MVC-BYPASS (raw fork/manual pane ops → ARON mess; uuid='-' = controller blind spot); NO-OUTPUT-FILTERING (2>&1/2>/dev/null/|tail/grep/echo $? BANNED — run raw); LEVERAGE-THE-TEAM (PO delegates+drives, NEVER debugs/edits code/hand-assembles infra — today's 3 rushed messes + 2 rabbit-holes shared one root: doer not manager). Bugs logged: #20 agent.bootstrap scrambles tiled-layout pane indices.

**WODA.test:** teams NEVER built — claude not installed (#13 bashism blocks it). v36421.1blu.de, only old ckSession (bare bash).

## ★★ POST-REWIND CONFIRM — 2026-06-27 (from 0%)
Rewound from 0%. Ground-truth verified: pane.get.target=ooshTeam:0.0, session.name(29a1e1d1)=oosh-po@MacStudio, branch=main up-to-date, prior on-disk anchor=614ff6a (sprint-comms protocol baked). Re-read the three base-skill doctrines (tron-cmm4-doctrine, SPRINT-COMMS-protocol, po-wisdom). **Sprint state per last checkpoint (281d215): BOTH sprints COMPLETE — constructor-contract (S-1→S-12, #10/#11 closed) + config-selfheal (CS-1→CS-8, 47/47 test.config + 3/3 T-C2-QUOTE green, both live boxes clean). Post-task cadence was running (agents saved ddabd29/5bd5ba9, trainer rewinding them).** Open backlog after these: #5 (--fork flag audit), #7 (pushed-team discovery), #13 (sh/dash bashism blocker, in_progress), #14/#15 (rawbin app + robbinTeam2 finalize on WODA.prod). No in-flight sprint work lost (both complete pre-rewind). Awaiting Tron direction on next backlog item.

## ★★ POST-REWIND CONFIRM — 2026-06-26
Resumed from rewind. Verified: pane.get.target=ooshTeam:0.0, branch=main, prior anchor=2aee043. Identity oosh-po@MacStudio (29a1e1d1) intact. Phase-1 anchor below is current — follow its "Next after rewind". **Tron flagged the until-loop/while-sleep polling antipattern (I overused `until <check>; do sleep; done` to wait on remote pane output) — STOP: one-shot capture, or run_in_background + completion notification, NEVER poll-loops in Bash (aggregates context). Recorded in learnings.**

## ★ PHASE 1 PRE-REWIND ANCHOR — 2026-06-26 (WODA.prod dev-team era)

**I am oosh-po@MacStudio at ooshTeam:0.0. Tron is rewinding me (2-phase). On resume: read this anchor FIRST, verify identity (pane.get.target + session.name 29a1e1d1), then `hiveMind team.status ooshTeam` + git fetch.**

### Machines & teams (this era)
- **MacStudio** = where I (oosh-po), MacStudio ooshTeam (0.1 architect/0.2 expert/0.3 tester originals), and SM live. oosh repo `/Users/donges/oosh`. Branches: `test/macos.latest` (MVC master) + `dev`.
- **WODA.prod** = v60211, the DEV BOX. The WHOLE team was migrated/forked here: ooshTeam (0.0 oosh-po@WODA.prod, 0.1 architect, 0.2 expert, 0.3 tester, 0.6 agent-trainer, 0.7 scrum-master) + robbinTeam2 (po/expert/skill-expert/architect/req/tester(×2)). Workspace `/var/dev/Workspaces/AI/Claude`, Web4RawBin cloned+symlinked into workspaces/. I drive WODA.prod via the **remoteOOSH:0.0** ssh shell (MacStudio pane SSH'd into WODA.prod).
- **SM = TRONinterface:0.1** (scrum-master@MacStudio, my 42 pair). Monitors WODA.prod via remote pane.capture; reports idle-with-pending to me; I drive the WODA.prod PO/workers.

### DONE + VERIFIED this session
- **Enter-over-SSH BLOCKER fixed** (`04b54a5` macos.latest, `c3b0fa2` dev): Claude TUI autocomplete ate Enter over SSH → Escape-before-Enter (3 sites in otmux send.raw/sendEnter). Live-verified remote submit works. THIS unblocked all cross-machine driving.
- **#6 login bug DONE** (`2a03bae` config.save emits OOSH_DIR+CONFIG_PATH+OOSH_MODE pure-state, `6cb5172` .bashrc guards, `f58baaf` T-ENV). Verified: clean login OOSH_DIR non-empty, /log+/c2.install errors gone.
- **cross-machine-send + #6**: backlog marked done.

### ⏸ THE ONE OPEN DECISION (Tron's) — team.push merge-back
- team.push REDO is DONE + green on **dev** (5 commits on clean base `0e5f7dd`: S-1 target-hash, choreography S-2b–S-6, /rc-verify, S-8 prune, S-9). Strayed dev preserved in branch **`dev-teampush-astray`**.
- Merging team.push ALONE onto the stripped macos.latest base → **63 fails** (~15 live-env noise + ~45 because macos.latest hiveMind is MISSING dev's good work: DRY phases 2/3/5b/7, sweep.detect fixes, completions). I did NOT commit — master clean at `04b54a5`.
- **Awaiting Tron: Option 1 (bring dev's FULL hiveMind to macos.latest — all green together; my recommendation) vs Option 2 (selective exclude).** Until decided, HOLD all hiveMind/otmux/claudeCode changes (more dev MVC churn worsens the reconciliation).

### IN FLIGHT — #4 env-files completion (safe, non-MVC)
Direct-dispatched (PO routing failed) to WODA.prod workers, all working: architect(0.1)→Self-Care first-principles doc, expert(0.2)→`config repair` entrypoint + `this` self-validate/auto-heal, tester(0.3)→T-SELFREPAIR. config/this/docs ONLY (not merge-parked MVC). Watch for their commits.

### Next after rewind
1. Verify identity + git fetch (origin/dev, origin/test/macos.latest).
2. Check #4 commits landed (architect doc, expert config-repair, tester T-SELFREPAIR).
3. **Get Tron's merge option 1/2** → execute (option 1 = bring full dev hiveMind to macos.latest, run test.suite, commit master).
4. Then resume backlog (#7 discovery, #5 flags, remote-monitoring) — MVC items only AFTER merge resolves.

---


## Identity (verify on doubt)
- I am a FORK. Conversation continuity LIES about identity after a fork.
- Verify: `otmux pane.get.target` → ooshTeam:0.0, `claudeCode session.name <uuid>` → oosh-po@MacStudio
- My files: `session/agents/oosh-po/` (NOT product-owner/)
- Tron is at TRONinterface:0.0 — never interrupt that pane

## Team Layout (ooshTeam) — restored 2026-06-19 (trained forks, full-session resume)
| Pane | Agent | Fork UUID |
|------|-------|-----------|
| 0.0 | oosh-po (me) | 29a1e1d1 |
| 0.1 | oosh-architect | 6df08923 |
| 0.2 | oosh-expert | a43c1b23 |
| 0.3 | oosh-tester | 74f27969 |
| 0.4 | oosh-expert-shell | (bash) |
| 0.5 | oosh-tester-shell | (bash) |
All 5 agents have /remote-control active (mobile control).

## Other Teams
| Team | Status |
|------|--------|
| TRONinterface | Tron (0.0) + scrum-master (0.1, Sonnet sweep monitor) |
| web4team | web4-po + architect + expert + tester |
| baseTeam | agent-trainer (0.0) — recovered 977.5k = 0% ctx, can't rewind until compacted |

## SM (scrum-master) — TRONinterface:0.1
- Reports to ME (oosh-po). Sweeps, unblocks SAFE prompts, tracks velocity, reports blockers/recovery.
- Does NOT assign tasks (my job). I do NOT self-poll/sweep (that's SM + burns my context).
- 42 pair: SM unblocks my prompts, I unblock/restart SM.

## MVC — route agent ops through hiveMind CONTROLLER (not raw tmux/otmux)
- Model=claudeCode, View=otmux, Controller=hiveMind, Monitor=tronMonitor
- `hiveMind resolve` (all teams) · `agent.send` (idle→INFORM/busy→QUEUE/overlay→reject) · `delegate` (file+nudge) · `teams.restore <snap> fork` (whole-team fork+resume) · `agent.monitor` (by name)

## ACTIVE DELIVERABLE (PO-owned, in flight)
**claudeCode list/completion/discovery fixes** + restore-process bug backlog (8 bugs).
- Specs: `session/tasks/claudeCode-list-discovery-fixes.md` (#1-3), `session/tasks/bugs-agent-restore-process.md` (#1-8, owner table + report-back).
- Expert owns code #1-8 (order: #1-3 in flight → #8 → #4 → #5 → #6 → #7). Tester owns tests. Architect owns design/spec for #4/#8.
- Drive: agents report in the task files → SM reports blockers → I verify (`claudeCode list oosh` etc.) → deliver to Tron.

## Rules (eternal — copy forward every save)
- MANAGE don't just analyze: every bug → owned task + report-back + driven to green. PO delegates fix, never codes it.
- CMM4 comms: task file IS the channel (full spec); chat/send = ONE-LINE reference only. Agents report in the file.
- otmux send VARIANTS: `send`=prefixed prose-to-agent ONLY; `send.raw`=raw keys no prefix; `send.enter`=shell cmd no prefix. Prefer controller `hiveMind agent.send`.
- Resume menu: NEVER summary (option 1) — always option 2 full. Arrows echo literal; DIGITS work (`send.raw <pane> 2`). Zoom pane first for width.
- Killed claude → PTY raw → `tmux respawn-pane -k` (not reset).
- Trained vs untrained = JSONL line count (tens=clone, thousands=trained).
- PDCA per pane, NO for-loops on multi-pane ops. Balance zoom toggles.
- NEVER /clear or compact a trained agent — only Tron authorizes; autocompact OFF by design. Low ctx → REPORT.
- Subscription counts INPUT; sustained output ~free. Minimize new prompts (my huge context replays each turn = the burn). Don't self-poll. Check `scrumMaster subscription` via PO shell every 10-15 min.
- No output filtering (no 2>/dev/null, grep/head/tail on shown output). No until-loops/while-sleep polling.
- Name format role@host (intentional, for /remote-control). Don't strip @host.
- Verify identity on doubt: pane.get.target + session.name.
- Sprint planning files are PO's living truth — tick as commits land.
- DRY not negotiable — one source of truth.
- **SPRINT-COMMS PROTOCOL (CMM4, core skill — `session/agents/SPRINT-COMMS-protocol.md`):** ONE sprint planning.md per sprint = single source of truth (stories with Status/Owner/inline report-back; NOT scattered task files). Channel = git mailbox: owner edits report-back + commits + PUSHES (that IS the report); chat = one-line nudge only. Status lifecycle PLANNED→IN PROGRESS→BLOCKED→QA→DONE, ticked as commits land. **Truth = process args (--resume uuid) + pane footer; NEVER session.id or JSONL customTitle grep (they lag/lie).** PO pulls every turn + at QA gates.
- **POST-MAJOR-TASK CADENCE (Tron 2026-06-27, CORE SKILL):** after EVERY major task → (1) engage the **SM to help** drive it, (2) ask **ALL agents to save context + learnings** (their own — trigger, don't write for them), (3) ask the **agent-trainer to rewind** each (preserves saved state, frees context; never compact/clear). SM coordinates the sweep + verifies saves landed; trainer performs the rewinds. I (PO) do not do this alone — SM is my 42 partner for it. This runs at every major-task boundary, not just when context is tight.

## Post-rewind/compact recovery
1. Read this context.md + learnings.md (session/agents/oosh-po/)
2. Verify identity: pane.get.target + session.name 29a1e1d1
3. `hiveMind team.status ooshTeam` — see agents
4. Read active deliverable task files, check report-back blocks for progress
5. Resume driving: verify reported fixes, assign next, deliver QA to Tron

## MIGRATION TO DEV BOX — 2026-06-24 (forked oosh-po onto WODA.prod)

**Tron directive: "develop there" — dev work belongs on the dev box (WODA.prod), not macos.latest-then-merge.**

Done this turn:
- Workspace repo (web4x/Web4AI, main) pushed from MacStudio (098b8b7..0501f20) → pulled on WODA.prod at `/var/dev/Workspaces/AI/Claude`. My agent files + all task files now present there.
- My JSONL `29a1e1d1` (14MB, trained) scp'd to WODA.prod **target** hash dir `~/.claude/projects/-var-dev-Workspaces-AI-Claude/` (NOT source hash — the #7 trap). `claudeCode list` on WODA.prod now SHOWS it → live proof of #7 Option-A (place in target hash = discoverable).
- Forked into **WODA.prod ooshTeam:0.0**, `cd /var/dev/Workspaces/AI/Claude`, `claudeCode fork <full-uuid>` (short UUID is rejected — needs 8-4-4-4-12), resumed FULL (no summary menu), `/rename oosh-po@WODA.prod`. Live, idle, auto-mode on.

**Two oosh-po instances now exist**: this one (MacStudio ooshTeam:0.0, @MacStudio) and the fork (WODA.prod ooshTeam:0.0, @WODA.prod). Per "develop there", the WODA.prod fork is the one to drive dev work. The fork inherited my full context → on first activation it must re-verify identity (pane.get.target → ooshTeam:0.0 but on v60211; session.name → oosh-po@WODA.prod) per [[identity-after-fork]] learning.

WODA.prod ooshTeam skeleton: 0.0 oosh-po (now live fork), 0.1 architect, 0.2 expert, 0.3 tester (all bash/skeleton — not yet forked), 0.4/0.5 shells dead.

## CHECKPOINT SAVE — 2026-06-27 (BOTH SPRINTS COMPLETE, post-task cadence)

**TWO sprints delivered this session:**

**Sprint constructor-contract** (COMPLETE): S-1→S-12 done, S-9 QA+dogfood passed on u20 (born-broken→init→valid+zero-loss), #10/#11 closed. Key commits on dev: 63659a3 (principle), 921f0c3 (BASH_SOURCE), dab7685 (emit), b50355e (validate), ecfa763 (harvest-resolve-merge), ab1306e+4c1ea97 (never-fail), f13f35d+d83907b (c2 completion), b6300b2+c3e3ffb (config.add restored+idempotent), 8ee8564 (PlantUML).

**Sprint config-selfheal** (COMPLETE): CS-1→CS-8 done. d583281 (clean order), 2bfc88b (BASH_FILE), 91bfd14 (ordering guard), bf674b9 (install validate gate), 53729c0 (T-C2-QUOTE+T-ENV-INSTALL). 47/47 test.config GREEN, 3/3 T-C2-QUOTE GREEN. Both live boxes verified clean.

**Post-task cadence**: all 3 agents saved (ddabd29/5bd5ba9), trainer rewinding them. SM updated with core skill: keep PO+trainer healthy (42 pair). SM checking MY context now.

**Core PO skill added (Tron directive)**: after EVERY task — agents save ctx+learnings → PO orders trainer rewind → agents come back fresh.

---

## PRIOR SAVE — 2026-06-27 (sprint constructor-contract driving)

**Active sprint**: constructor-contract. S-1 through S-5 DONE. S-6 (expert: never-fail constructors) + S-8 (tester: T-CONSTRUCTOR suite) assigned in parallel. S-7 (heal u20/WODA.prod) + S-9 (QA/dogfood) queued after.

Commits this sprint on dev: `63659a3` (S-1 principle), `921f0c3` (S-2 BASH_SOURCE resolver), `dab7685` (S-3 unconditional emit), `b50355e` (S-4 validate Rule A), `ecfa763` (S-5 harvest-resolve-merge). All config/this/docs — no MVC touched. team.push merge-back still parked.

---

## PRIOR SAVE — 2026-06-25 (601.9k = ~60%, 5th cycle)

**Context 601.9k. Multi-day session: sprint-team-migration on WODA.prod, #6 login bug fixed, #4 env-files self-care in flight.**

Ground truth:
- Identity: oosh-po@WODA.prod, ooshTeam:0.0, fork 29a1e1d1, session renamed @WODA.prod
- Branch: dev (WODA.prod). Clean macos.latest MVC base `0e5f7dd`, team.push redo commits `76c629b→07c6b1e` on top, 16/16 T-PUSH GREEN. Merge-back to macos.latest PARKED (Tron decision pending).
- Team: all 4 agents + SM live on WODA.prod, /rc active. SM at ooshTeam:0.7 (35916ccb, renamed @WODA.prod).
- oosh code repo: `/var/dev/EAMD.ucp/.../Once.sh/dev`
- workspace repo: `/var/dev/Workspaces/AI/Claude` on main

**DELIVERED THIS SESSION:**
- S-0 through S-8 manually proven + automated (team.push controller 9d48bd0+ee12cde+3c3d186, 16/16 tests)
- REDO on clean base: 5 cherry-picks landed clean (76c629b→07c6b1e), 16/16 GREEN, merge-back ready
- #6 login bug: config.save emits OOSH_DIR (2a03bae), .bashrc guards (6cb5172), 4/4 T-ENV-LOGIN GREEN
- S-8 snapshot prune (07e8a06, 44→5)
- SM identity cleanup: kept ooshTeam:0.7 (35916ccb), renamed @WODA.prod, /rc refreshed

**IN FLIGHT (Tron direct-dispatched, I oversee):**
- #4 env-files completion — self-care principle:
  - Architect → docs/first-principles.md self-care principle
  - Expert → config repair entrypoint + this self-validate/auto-heal
  - Tester → T-SELFREPAIR
  - All on dev, config/this/docs ONLY (NOT hiveMind/otmux/claudeCode — merge-parked)

**PARKED:**
- team.push merge-back to macos.latest (Tron decides when)
- S-9 dogfood robbinTeam2 (after merge-back)

**Next**: oversee #4 report-backs, verify commits, aggregate. Do NOT re-dispatch (Tron already sent).

Ground truth verified this turn:
- Identity: oosh-po, ooshTeam:0.0, fork 29a1e1d1 (pane.get.target confirmed)
- **Branch `main`** (moved from test/macos.latest since last era). My commits this session: 033aa78 (post-rewind anchor) → this save.
- Team verified present + idle, UUIDs MATCH context: po 29a1e1d1 / architect 6df08923 / expert a43c1b23 / tester 74f27969; shells 0.4/0.5 offline
- Subscription healthy: ~7%/5h, 8%/7d (from SM TICK readout)
- Tasks persisted: #4 env-files-pure-state (in_progress), #5 remove --fork flag (pending). Spec files untracked in tree: session/tasks/env-files-pure-state-architecture.md, oosh-flag-violations-audit.md
- WORKING TREE has uncommitted work from OTHER agents (architect/tester/scrum-master context+learnings, sprint task files) — THEIR responsibility (F2: only the agent saves its own); not mine to commit.

**On resume (post-rewind)**: read this + learnings; verify identity (pane.get.target + session.name 29a1e1d1); `hiveMind team.status ooshTeam`; check SM health (TRONinterface:0.1); ask Tron whether to resume #4/#5 or new direction. Do NOT self-start large delegation without subscription + agent-context check.

---

## PRIOR ANCHOR — 2026-06-23 (576k, 3rd cycle — REWIND IMMINENT, Tier-3 candidate)

**Rewound from eb3c0f8 (940k). This save at 576.8k, 3rd cycle. Prior anchor 0fc6d2a.**

**On resume**: agents idle on test/macos.latest, all UUIDs verified (po 29a1e1d1 / architect 6df08923 / expert a43c1b23 / tester 74f27969). Open decision pending with Tron: resume WODA.prod migration vs continue tasks #4/#5 natively. Both are dev-mode work. SM (TRONinterface:0.1) was told to save its own context.

Ground truth verified this turn:
- Identity: oosh-po, ooshTeam:0.0, session 29a1e1d1 (confirmed via output path + team.status)
- Branch: test/macos.latest (MacStudio — NOT on WODA.prod). HEAD d5519d2 (tester ctx save)
- Team all present + idle, UUIDs match: po 29a1e1d1 / architect 6df08923 / expert a43c1b23 / tester 74f27969; shells 0.4/0.5 offline
- Recent commits: d5519d2 tester-ctx, 8374cc5+e753a1f+0722f4d+33da219 c2 T-COMPLETION+''' fix, efbdc5e+0b033da T-REWIND tests

**Next action**: agents idle on test/macos.latest. WODA.prod migration (below) was in flight pre-rewind — team is back on MacStudio. Re-confirm with Tron whether to (a) resume WODA.prod migration or (b) continue open tasks #4/#5 natively. Do NOT self-start large delegation without subscription headroom check. SM (TRONinterface:0.1) sweeps + reports blockers.

---

## PRIOR STATE — 2026-06-22 (WODA.prod migration)

**Goal**: migrate ooshTeam onto a dev-mode machine (WODA.prod) so the team works natively on `dev` (local MacStudio is test/macos.latest — wrong mode for dev fixes).

**In flight**: `hiveMind team.push WODA.prod` (controller, run from MacStudio shell ooshTeam:0.4) — re-running now claude is installed; transfers snapshot+config+JSONLs → prereq (passes now) → `teams.restore` forks the 4 agents on WODA.prod. VERIFY with `hiveMind team.status` on WODA.prod when done; then `/rename <role>@WODA.prod` + `/remote-control` each. Agents: po 29a1e1d1, architect 6df08923, expert a43c1b23, tester 74f27969.

**Machines**: WODA.prod=v60211 (dev at /var/dev/EAMD.ucp/.../Once.sh/dev; claude 2.1.185 installed at ~/.local/bin, NOT on PATH — use claudeCode wrapper). u20=195.90.209.56:9022=container 4faed70700c9 (dev). MacStudio=test/macos.latest. WODA.prod control/monitor shell = ooshTeam:0.5 (ssh in).

**Done this session (on origin/dev via u20 cherry-picks)**: EPERM `[` fix 90469c8, completion+'''corruption 7687cfe. u20 origin switched https→ssh (2cuGitHub key).

**Open tasks**:
- #4 env-files-pure-state-architecture.md — architect design APPROVED (with my 2 notes: validate matches line-leading not substrings; grep config.add callers). Expert to implement ON DEV (was stopped from doing it on local/test — wrong mode).
- #5 oosh-flag-violations-audit.md — remove `--fork` flag from teams.restore/migrate + audit all method flags + T-NO-FLAGS guard.
- DIVERGED MERGE: the 5 session fixes (d79a4c9 sweep.detect, b904be5 stop, 516ebb3 zoom, 12100f8 dispatch, 80fdbd8 DURING_REWIND) conflict on cherry-pick to dev → team re-applies natively on dev.

**ALL prior session deliverables** (test/macos.latest, green): #5 stop, #7 zoom, task#1 this-dispatch, DURING_REWIND, sweep.detect, c2 completion — code+tests, pushed.

**Recovery**: read this + learnings; verify identity (pane.get.target + session.name 29a1e1d1); use the hiveMind CONTROLLER for agent ops (not raw otmux); `scrumMaster subscription` via shell; check team.status on WODA.prod for migration result.
