# oosh-po Context

**Updated**: 2026-06-28
**Role**: oosh-po (forked from fallback-oosh-po)
**Pane**: ooshTeam:0.0 on **WODA.prod** (v60211.1blu.de) — re-derived 2026-06-28 (was wrongly @MacStudio: fork inherited parent's stale @host; real host = OOSH_SSH_CONFIG_HOST=WODA.prod)
**Session**: oosh-po@WODA.prod [29a1e1d1-2284-4484-a95e-6b89154c7a9c]

## 🔴 REWIND-NOW SEED — 2026-07-24 (Tron ORDERED rewind; THIS block is the boot seed — read it first, then MEASURE DISK)
Identity: oosh-po@WODA.prod, ooshTeam:0.0/%17, uuid 889a24a9 (G1 LIVE → `otmux current` reliable, $TMUX_PANE-immune). BOOT-FIRST: MEASURE DISK (git HEAD /root/oosh, `ls scrum.pmo/sprints*`, read task files) not the stale thread [[ghost-context-after-deep-rewind]].
**DELIVERED since 07-20 (all live on /root/oosh `mcdonges.latest`, gated+pushed):** unit-D `context.gather.quiet` **`08504af`** (send-free ctx refresh, no more /context to near-cliff agents). sweep RATE_LIMIT **API-error-at-idle** fix **`b66b678`** (3 independent gate rounds — real fix = run ratelimit.probe on the `auto mode on` idle path past the 9094 short-circuit + position-aware resumed-guard; `sweep-rate-limit-detect.task.md`). opy one-command **bare-box install COMPLETE** (`eb42502` + prior, end-to-end green).
**OPEN / NEXT:**
- **NEW (Tron 07-24):** team.sweep does NOT recognize a **context-limit-reached** state ("Context limit reached · /compact or /clear to continue") — DISTINCT from the API-rate-limit fix. Add that signature to `sweep.detect` (same pattern: match the string, classify a blocked/needs-attention state, no-false-positive). robbin-req (robbinTeam2:0.4) was the case; its live render also shows a /context readout ~66% used.
- **S-9 send-ghost fix** — STILL awaiting Tron deploy GO (`scratchpad/S-9-otmux.diff`, gated 3 rounds). The one thing I hold for explicit GO.
- unit-D driver (sweep.loop/watchdog) not started yet. otmux `fit` small-session error — couldn't repro from 133 client; need Tron's exact error/box.
**GIT-KEYS (07-21): resolved = TRANSIENT server-side API/IP throttle** (keys/config fine, access restored). On recurrence: WAIT, don't churn keys.
**DEPLOY DISCIPLINE:** `git apply` to /root/oosh (NEVER `cp -a` — symlink chain writes through to /home/shared [[cp-a-hardlink-writes-through-to-live]]); gate the FIX at the level the defect lives + independent + symlink-safe (git show/worktree) [[gate-the-fix-not-just-the-target]]. Account had an intermittent API throttle all 07-24 (hit robbin-req + my subagents; recover on retry).

## 🔴 REWIND-READY CHECKPOINT — 2026-07-20 (overnight; heeding Tron's ≤85% proactive-rewind guardrail)
**Identity:** oosh-po@WODA.prod, ooshTeam:0.0 / pane %17, live uuid **889a24a9** (RE-DERIVE — prove by capturing which pane renders my own TUI; $TMUX_PANE lies [[self-id]]). BOOT-FIRST: `otmux pane.history` + `ls scrum.pmo/sprints*` + read task files (world moved). SM=ooshTeam:0.1 (42-pair, recovered from its own 13h wall via trainer Option-2). Deploy discipline: `git apply` NEVER cp -a (hardlink write-through); gate must SANITY-CHECK VALUES (0k for a live agent = impossible false-low); fail-loud = record NOTHING never 0; no `| tail`/`head`/`2>/dev/null` (denied).

**LIVE /root/oosh HEAD = `a27e3b2` on mcdonges.latest. Delivered today (all live, gated + pushed):**
- **opy series** (Tron "pull it" + expert live-hotfixes): G1 self-ID `93de8ac` + opy env `aa2c4f5` + build-essential `7282bd7` + zlib `1535d58`. G1 mis-tag root ELIMINATED (otmux current PID-walk, $TMUX_PANE-immune).
- **Context-tracking feature** (Tron order): record/get/gather/gather.all + team.sweep shows recorded reading+age, replaces the lying live ctx% (`4ff09df`). Iterated to `17d5a2d`: JSONL-total ÷ honest-denom-from-readout, drift-proof live.jsonl resolver, **non-zero-required + MANDATORY 0-guard at context.record** (after I caused + reverted a 0k false-low regression `10fde7f`→`b1f2bf7` — lesson [[false-low-worse-than-absent-sanity-check-values]]). WORKING: all robbin agents read real non-zero, cross-checked.
- **Sweep RATE_LIMIT P1** (detect+display, Tron order): `d972bd2` — throttled-then-idle shows RATE_LIMIT (BOLD_YELLOW) not IDLE; no-false-positive (resolved throttle→IDLE) tested.
- **Sweep unit D** (ctx auto-refresh, Tron/SM): `a27e3b2` — auto-gathers stale(>300s)/near-cliff(≥60%) idle agents in pane.sweep.loop, bounded backoff, inherited 0-guard. Live gate (dry→apply→verify) INTERRUPTED by API-unavailable — safe deployed (read-only + inherited fail-safe); RETRY the gate + SM co-verify on a real ≥60% pane.

**STANDING / IN-FLIGHT (resume here):**
- **S-9 send-ghost fix** — gated GREEN 3 rounds (`scratchpad/S-9-otmux.diff`), **AWAITING TRON's explicit deploy GO** (I chose to hold this proactive core-comms change; it also makes gather/re-nudge sends reliable). Verb map: send.tui=bare Enter, send.raw=Esc+Enter.
- **RATE_LIMIT P2 (auto-renudge)** — built+19/19 (`scratchpad/rl/sweep-renudge.patch` on d972bd2), HELD for P1 co-verify.
- **Fast-follows:** RATE_LIMIT P1 co-verify on real throttle (SM) · unit D live-gate retry (dry/apply/no-0k) + SM co-verify · context.gather could `skipped: shell` non-Claude panes · opy real end-to-end build gate (tester).
- **opy install:** converging via expert's clean opy-only ffs; tester's real apt+CPython build = remaining gate.
- Task files (the channel): s9-otmux-send-ghosting · hivemind-context-tracking · sweep-rate-limit-detect (RATE_LIMIT + unit D) — all current.
- **Subagents used today** (resume via SendMessage if needed): builds/gates via hiveMind-expert/tester + otmux-expert/tester subagents (the live ooshTeam expert/tester were heavy, and S-9 ghosting made live dispatch unreliable → I drove via subagents).

## ✅ DEPLOYED 2026-07-17 (post-rewind, Tron said "pull it")
G1+opy fast-forwarded onto LIVE /root/oosh (mcdonges.latest df95a02→93de8ac, clean FF, 2 commits).
- **93de8ac G1 self-ID** — VERIFIED live: `otmux current`/`pane.get.target` return ooshTeam:0.0 (my true pane) even with TMUX_PANE=%999; poisoned-$TMUX_PANE mis-tag root ELIMINATED. Session no-CURRENT constraint LIFTED.
- **19d8d52 opy ensure-pyenv self-care** — live (gated green T-OPY-ENSURE-PYENV).
NEXT: (a) gate context.read 1M-detection on tester report; (b) team-loop G2-G6 gap-sprints (G2 folds task-21 mis-tag); (c) re-derive the real G1 test-proof commit (anchor's 594f297 was wrong).

## 🔴 REWIND-NOW ANCHOR — 2026-07-17, 85% (Tron ORDERED my rewind; THIS block is the seed)
BOOT: `otmux pane.history CURRENT` + `ls scrum.pmo/sprints*` first. Identity: oosh-po@WODA.prod, ooshTeam:0.0 — RE-DERIVE live uuid (last known 889a24a9). GitHub prefix = github.com/web4x/Web4AI/blob/main/.
**READY-TO-DEPLOY on Tron's go (both land mcdonges.latest = the live line agents run; clean opy-style ff; NOT dev-ports so NOT blocked on robbin's dev-merge):**
- **G1 self-ID root fix** — PO-GATED GREEN (T-NO-TMUXPANE-EXT 7/7; impl `93de8ac` VERIFIED = tip of origin/test/mcdonges.latest; proof-hash `594f297` was WRONG/does-not-resolve 2026-07-17 — re-derive real test commit before re-citing). Fixes the session-long mis-TAGGING/mis-routing — self-ID was empty/stale on the live line (pane.self called-but-undefined + $TMUX_PANE); now ONE `private.otmux.pane.resolve` (PID-walk), env-immune, pane.self defined. `session/tasks/team-loop-mvc-design.md`.
- **opy** (install-latest `df95a02` + ensure-pyenv self-care `19d8d52`, gates 9d3c2ef/857eb86) — opy AUTO-installs pyenv (OOSH self-care) + installs latest. `session/tasks/opy-install-latest.task.md`.
**IN FLIGHT (expert):** context.read 1M-detection defect (`context-read-1M-detection-defect.task.md`, bfac811c) — REAL cause of the false-80% (÷200k not ÷1M for a live-/model-switched 1M agent).
**AT TRON ACCEPTANCE (origin/dev):** config.save A+B · task-18 cyan · 7 [S] cases · Gap B/D.
**HELD (robbin's dev-merge, 3-way editor):** topology switch + ALL dev-ports. Reopen when dev whole. Tron: NO port to dev until merged.
**NEXT after rewind:** (1) get Tron's **G1+opy deploy go — G1 is now SAFETY-URGENT** (a mis-tag nearly misdirected a REWIND to robbin-architect; task-21 CRITICAL; G1 fixes the self-ID root) → ff-deploy to mcdonges.latest (heads-up first). (2) gate context.read on tester report. (3) team-loop **G2-G6** gap-sprints (G2=one hiveMind.identity, FOLDS task-21 mis-tag; G4=team.rewind.all; G5=live ctx% field; G3=agent.approve; G6=task/gate field). SM uses JSONL-growth not the frozen Nk hint for ctx.

## 🎯 PROACTIVE-SAVE ANCHOR — 2026-07-17 (~80%; trainer DOWN so no rewind yet — zero-loss when it returns)
**BOOT FIRST**: `otmux pane.history CURRENT` + `ls scrum.pmo/sprints*` (per session/base-skills/agent-rewind.md) — the world moves while out. **Identity**: oosh-po@WODA.prod (base role = product-owner SKILL), ooshTeam:0.0 / pane %17, LIVE session 889a24a9 — RE-DERIVE from tree.detailed, never trust this copy.

**CURRENT PLAN**: `scrum.pmo/sprints@WODA.prod/sprint-1/planning.md` — "Reliable Send & Capture" (my sprint; the send-verified/BUG10 productization). Nearly the whole sprint is PO-gated GREEN on origin/dev, awaiting Tron acceptance.

**CURRENTLY DRIVING (dual-link the TASK each response to Tron; GitHub prefix = github.com/web4x/Web4AI/blob/main/):**
- **opy ensure-pyenv self-care** — GATED GREEN (T-OPY-ENSURE-PYENV 14/14, proof 857eb86), READY to ff-deploy to /root/oosh ON TRON'S GO. `session/tasks/opy-install-latest.task.md`. Kills Tron's "install pyenv manually" — opy now auto-installs pyenv (OOSH self-care).
- **team-loop MVC design** — Controller-reviewed + ACCEPTED (e68ed436); impl gap-by-gap, G1-first → oosh-expert. `session/tasks/team-loop-mvc-design.md`.

**OPEN — AWAITING TRON:** (1) opy ff-deploy GO. (2) G1-branch decision (G1=corrected `otmux current`, no $TMUX_PANE; lives on BROKEN dev vs LIVE mcdonges.latest — land mcdonges-line like opy, or wait dev-merge?). (3) ACCEPTANCE BATCH (all PO-gated on origin/dev): config.save A+B · task-18 cyan · 7 [S] cases · Gap B/D · opy install-latest · opy ensure-pyenv.

**HELD (tracked, NOT driven) — robbin's dev-merge (3-way editor):** topology switch (`live-box-stray-branch-topology.task.md`, P0 GREEN, P1-P4=Tron window) + ALL ports to dev. Tron: NO port/switch to dev until robbin merges the broken dev. Reopen when dev whole.

**RECENT COMMITS (workspace main):** e68ed436 team-loop review · 282c01a9 opy ensure-pyenv gate · 4fecc507 opy land-live · 61fe530f no-port-until-dev-merged. Code (once.sh): opy self-care `19d8d52` on origin/test/mcdonges.latest; `df95a02` opy install-latest LIVE on /root/oosh.

**★ OPERATING RULES (also learnings.md):** every Tron response leads with the current sharp TASK dual link · every dispatch closes "report-back before idle" + clear-first (Escape+C-u via otmux send.raw) before send (staged-text blocks agent.send) · PO does NOT run tests/grep/edit — delegate + gate on CAPTURED report · verify a cited commit HASH resolves before propagating · OOSH self-care = auto-install recoverable deps (never fail-loud-manual; fail-loud only unrecoverable) · NO `| tail`/`| head` (denied in settings 2026-07-17) · SM "idle" → gate report + DISPATCH NEXT (not remind) · measure-source-not-copy.

## 🎯 CURRENT — 2026-07-03 (pre-rewind save; near-cliff at 9%)
**BOOT FIRST**: `otmux pane.history <self>` + `ls scrum.pmo/sprints*` (per session/base-skills/agent-rewind.md). **Identity**: oosh-po@WODA.prod, ooshTeam:0.0, **LIVE session uuid 889a24a9** (re-derived post-rewind 2026-07-03 from tree.detailed; pre-rewind was 29a1e1d1 — measure-source-not-copy).
**CURRENT PLAN (explicit path — do NOT default to bare sprints/sprint-2, that's STALE)**: `scrum.pmo/sprints@WODA.prod/sprint-1/planning.md` — "Reliable Send & Capture" (flat tasks 01-17). Dual link: [GitHub](https://github.com/web4x/Web4AI/blob/main/scrum.pmo/sprints@WODA.prod/sprint-1/planning.md) | [scrum.pmo/sprints@WODA.prod/sprint-1/planning.md](scrum.pmo/sprints@WODA.prod/sprint-1/planning.md)
**CURRENTLY DRIVING**: the send-completion current-param CYAN gate — **SHARP task = task-18** (dual link the TASK, not the plan): [GitHub](https://github.com/web4x/Web4AI/blob/main/scrum.pmo/sprints@WODA.prod/sprint-1/task-18-send-completion-current-param.md) | [scrum.pmo/sprints@WODA.prod/sprint-1/task-18-send-completion-current-param.md](scrum.pmo/sprints@WODA.prod/sprint-1/task-18-send-completion-current-param.md). Task 01 DONE (Tron-accepted). Pane-target completion PROVEN+captured (tester). **Current-param CYAN = runtime-UNCONFIRMED** (completion.parameter.txt 0 bytes, METHOD_PARAMETER empty in completion.discover) → fresh expert(0.3) dispatched to give the tester the exact invocation (RED-2 `25081bd`) OR FIX it → tester captures → PO gate → Tron. **Task 02 = NOISE, DROPPED (not the gate).**
**OPEN**: current-param cyan (expert→tester); cases 03-17 planned; expert-impl (C.2/C.3 etc.) is sprint-2-era, NOT the current send sprint.
**DURABLE STATE**: expert work pushed (once.sh dev bce0cc3 + session cd49b6a). My recent: T2Q metric (ARON purified into shared PO SKILL, 0278c59), rewind skills (agent-rewind.md), dual-link canon (Web4Articles PDCA), astray-fix.
**PRINCIPLES banked (reading-list/learnings)**: T2Q=minimize tokens/task-to-QA=reduce noise · scalability>primitive (QA=repeatable captured proof, not eyeball) · dual-link=`[GitHub](url) | [relative/path]` same artifact, **SHARP = the specific TASK driven, never the sprint plan** · send-canon (`send.tui` in modals) · PO doesn't run tests (tester) / doesn't poll (SM) · measure-source-not-copy.

## ⏸️ PARKED — 2026-06-29 (Tron parked node-provisioning for a more urgent priority)
**Tron: "well done until here" — parked the u24/S3 work mid-flight for a higher priority. Resume from this block.**

**EXACT PARK STATE (node-provisioning sprint):**
- **NP-3 SETUP_SERVER: DONE** — fresh dev install → state 99, clean boot GREEN (tester-confirmed independently). The dev-reliability gap Tron named is CLOSED. ~11 fixes.
- **BUG6 pkill regression: FIXED `44c9043`** (enforcer tagged __paneLockEnforcer; T-UNLOCK-KILLS-1/2/3 green on full otmux suite). **S3 GATE 1 = CLEARED.**
- **u24 gate: Step 4 (clean boot) GREEN ✓ (tester-confirmed); Step 5 (team.push) BLOCKED** — u24 has no tmux + no claude-cli → 0 agents placed. Filed **NP-4** (`np4-provision-agent-runtime.task.md`): provision tmux (`oo cmd`) + claude (`claudeCode install`) via team.push pre-flight or ossh install.
- **⛔ DECISION PENDING FROM TRON (unanswered when parked): S3 release a/b** — (a) RELEASE S3 now: clean-boot+pkill green = merge content validated, carry ~11 fixes+MVC to macos.latest, NP-4 follows; (b) HOLD S3 until NP-4 makes Step 5 green (full gate as originally specified). **PO recommended (a).** Resume = get Tron's a/b, then act.
- **READY TO ASSIGN on resume:** NP-4 → oosh-expert (idle, pkill done). Independent of S3 a/b — advances full gate either way. Provisional placement: team.push pre-flights target, provisions tmux+claude, fail-loud; architect confirms install-vs-push when RC-unstuck.

**TEAM (WODA.prod ooshTeam) at park:** expert idle (ready for NP-4 or S3 merge) · tester Step-4-done/Step-5-blocked · architect RC-STUCK (Tron's claude.ai/code domain to unstick) · SM ooshTeam:0.1 monitoring.

**S3 merge** = `ed4c9fd` plan (clean auto-merge dev→macos.latest, carries ~11 fixes + MVC; preserves 4 macos-only commits). Release when Tron says (a), or after NP-4 if (b).

**OPEN BACKLOG (queued behind gate, all committed task files):** dispatch-submission-verified (BUG10 fix — HIGHEST-ROI, the SM-queue tax), NP-1 odocker run.sshd autoconfig, legacy-suite-remediation (82 pre-existing reds), oo-new-task scaffolder, panelock-skip-human-shells, rewind-readiness-preflight, sessions.prune, test.suite regression.check.

**★ BUG10 WORKAROUND (proven): dispatch SHORT one-line pointers only** (`Escape→C-u→"<verb> — spec in <file>"→Enter`); long msgs stall unsubmitted. SM is the submission net.

---

## ★★★ PRE-CLIFF CHECKPOINT — 2026-06-28 (SM cliff warning; gate nearly DONE)
Identity: oosh-po@WODA.prod, ooshTeam:0.0, fork 29a1e1d1. SM=ooshTeam:0.1 (42 pair). Two repos: oosh code /root/oosh (branch dev), workspace /var/dev/Workspaces/AI/Claude (main).

**WHERE WE ARE — gate one tester-pass from GOOD:**
- **NP-3 SETUP_SERVER: DONE** → state 99/finished on pristine u24 (driver fix 278d5a7 + root .bashrc as SETUP_SERVER state bee01a1 + ~11 fixes). Fresh dev install now boots clean (env -i bash = working OOSH). The dev-reliability gap Tron named is CLOSED.
- **S1: fully triaged** — 82/83 = pre-existing shared debt (dev actually IMPROVED hiveMind: 23 vs macos 40); legacy-remediation = separate sprint (NOT waved, F-PREEXISTING). 1 real regression = BUG6 pkill.
- **BUG6 pkill regression: FIXED 44c9043** — enforcer tagged `__paneLckEnforcer`, pkill only that, no self-SIGTERM. Confirmed GREEN on full test.suite run otmux (T-UNLOCK-KILLS-1/2/3 ✓). **S3 GATE 1 CLEARED.**
- **u24 gate (NP-2): expert-GREEN, tester S-C pending** = Step 4 (formal clean-boot checks, tester running u24-step4.sh) + Step 5 (hiveMind team.push u24 → agents discoverable). = **S3 GATE 2.**
- **S3 merge dev→macos.latest (ed4c9fd plan): release when BOTH gates green** = pkill ✅ + u24 GOOD. Clean auto-merge, carries ~11 fixes + dev's MVC improvements to macos.

**NEXT AFTER REWIND:** (1) check tester S-C result in u24-freshinstall-testgate.md — if Step 4+5 green → mark u24 TEST GATE GOOD. (2) Both gates green → release S3 (expert does the ed4c9fd merge). (3) Then: legacy-suite-remediation sprint + dispatch-submission-verified (BUG10 fix, highest-ROI) + NP-1 odocker autoconfig + the queued improvement tasks.

**★ BUG10 WORKAROUND (proven, learning 24e39d8): dispatch SHORT one-line pointers only** — long/wrapping messages stall unsubmitted (`❯ …`). Recipe: `Escape → C-u → short pointer "<verb> — spec in <file>" → Enter`. This is also ARON's pointer-discipline. SM is the submission safety-net.

## ★★ CHECKPOINT — 2026-06-28 LATE (clean-boot bug sprint + u24 gate, before idle)
Identity: oosh-po, ooshTeam:0.0, fork 29a1e1d1, **on WODA.prod (v60211)** — I was forked here this session (raw tmux confirmed pane=0.0; $TMUX_PANE was stale %8 → that bug started the whole sprint). Branch dev (oosh code /root/oosh) + main (workspace /var/dev/Workspaces/AI/Claude). SM = scrum-master ooshTeam:0.1, my 42 pair, actively monitoring + catching my unsent dispatches (BUG 10).

**CLEAN-BOOT BUG SPRINT — DELIVERED (all on dev, session/tasks/clean-boot-bugs-woda-prod.md):**
- BUG1 HOME discovery in this (4bdd948); BUG2 user.env pure 0-source (37e16f7+9937799); BUG3 config.save inert (af3a3f7); BUG4 self-care+no-source docs (9e4915c); BUG5 hiveMind.status fd3 all-teams (d40a005+1366742); BUG6 pane.unlock pkill orphans (3fd419b); BUG7 ELIMINATE $TMUX_PANE→pane.self PID-walk, 0 residual+guard (6480f78,350e3e7,d74e354,a20d0d7,a5f709d); BUG8/FEAT8 CURRENT pane target via resolve.target→pane.self (615918c); BUG9 idempotent prefix no [@x][@x] (4c52e24); A config.save allow-list 113→19 exports (9937799); B color boot — line init exports setup.color.env, claudeCode list 41 ANSI (c82fa31); C-ext bare display-message self-ID killed (9ff5343); A/doctrine reconciled first-principles Rule A (6540254).
- PO-VERIFIED live: user.env 19exp/0src, claudeCode list 41 ANSI, CURRENT 5/5, $TMUX_PANE 0 residual, hiveMind bare=6 teams.
- BUG10 LOGGED (not fixed): agent.send/send.verified FALSE-POSITIVE — text delivered but Enter not registering on WODA.prod panes; SM caught 2 unsent dispatches. INTERIM DISCIPLINE: after every dispatch verify pane shows 'esc to interrupt' (submitted), else send.raw Enter. Fix spec: send.verified must confirm submission not text-presence.

**IN FLIGHT (WIP=1 each, results into task files):**
- **u24 GATE** (session/tasks/u24-freshinstall-testgate.md): CORE #6 PASS — fresh dev ossh install on pristine ubuntu:24.04 → pure-state config 20exp/0src; expert fixed 5 fresh-install bugs (rsync→scp 4397ac2/8a3c02d, mode ssh→root, ssh-keygen -N'' 99fb694, seccomp=unconfined). FULL GATE HELD — SETUP_SERVER stalls 32→62 (root .bashrc never wired → clean boot + push blocked). odocker u24 running (port 9024), ossh config u24 ok, testbed PRESERVED.
- **SETUP_SERVER tail** (session/tasks/setup-server-statemachine-tail.md): the dev-reliability gap. Strategy=macos.latest→dev (Tron: macos.latest boots more reliably). **architect WIP=1 on S-A** (compare macos.latest vs dev SETUP_SERVER 32-62, port-vs-fix ordered list); **expert HOLDING for S-A** then S-B applies fixes (incl result-vs-error ANSI→$RESULT→filename contamination at source). Known tail bugs: config ci unknown, state.declaration missing, prereqs.install fails, ANSI leak into filename.
- **S1** (sprint-cleanboot-closeout.md): tester running full dev suite (otmux/hiveMind/config/c2 + prefix-idempotent/current-target/no-tmuxpane) — verification gate.
- **S2** doctrine: DONE (architect 6540254).
- **S3** dev→macos.latest merge: PLAN READY (expert ed4c9fd — clean auto-merge, preserves 4 macos.latest-only commits 04b54a5/9971ad7/3249104/2cca6f8), **HELD until u24 gate green**.

**NEXT after rewind/idle:** (1) await architect S-A port/fix list → release expert S-B. (2) SM flags S1-green → I'm already past needing it for S3 (S3 gated on u24 not S1). (3) u24 gate green (state 62 + push works) → release S3 merge → mark gate GOOD. (4) Drive each via task-file report-backs; verify before advancing; verify-submission on every dispatch (BUG10).

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

---
## ⚠ OPEN MESS (2026-08-18) — conflicting hiveMind refactor; Tron deferred the decision
**The collision**: /root/oosh (branch mcdonges.latest) carries a BIG uncommitted refactor by hiveMind-expert (hiveMind −2270 net, + claudeCode/odocker/ossh/otmux) that DELETES `private.hiveMind.live.tupleset` + `identity.resolve` + `protected.live.tupleset` — the c.0 canonical single-reader. My APPROVED §7 (`session/tasks/team-sweep-live-recognition.design.md`, `pane.live` single-source) was designed to PROJECT live.tupleset → **direct conflict**.
**Root cause (mine to own)**: I assigned oosh-expert to build the pane.live sweep refactor WITHOUT checking that hiveMind-expert (the SCRIPT OWNER) was already mid-refactor in the SAME sweep/context area (its recent landed commits: RATE_LIMIT-at-idle, `context.gather.quiet`, auto-refresh stale-ctx, false-low guards). = duplicate + conflicting effort. See [[check-script-owner-before-assigning-refactor]].
**Tool damage**: hiveMind is BROKEN mid-refactor — `team.sweep` errors (EPERM 8628), `from.jsonl.reading` fails (this.load), agent.sends returned no-output. Shared coordination degraded.
**What I did NOT do**: touch/clobber the WIP. oosh-expert HELD (caught it); §7 on hold.
**What I DID (Tron directive)**: built `scrumMaster.pulse` (commit 0fffc75) = honest real-time team status, DECOUPLED from the broken hiveMind — the SM's trustworthy view while the mess stands. Verified live vs /context + cross-agent.
**DEFERRED DECISION (Tron: "decide about your mess later")**: which refactor wins (hiveMind-expert restructure vs §7 single-source) + who lands/stashes the WIP. My recommendation: unify under hiveMind-expert (owner); reconcile the §7 design + 8 RED tests against its landed structure; oosh-expert stands down from the parallel build.

---
## ✅ CORRECTION (2026-08-18, later) — the "OPEN MESS" above was a PHANTOM (option-1 revert-blast, recovered)
The "⚠ OPEN MESS" (conflicting hiveMind refactor deleting live.tupleset) was **MISDIAGNOSED by me**. Trainer's widened all-trees re-check (556b6848) found the truth: the **option-1 auto-fire during oosh-expert's rewind REVERTED 5 /root/oosh scripts to ANCIENT versions** (−3359L; hiveMind −3357 = back to before live.tupleset existed; the reverted otmux was missing pane.self = host-wide breakage). It was **NOT** a competing refactor / duplicate effort — a revert accident.
**RECOVERED**: trainer git-stashed the reverted tree (reversible, `stash@{0}`) + restored /root/oosh to HEAD `0fffc75`. **VERIFIED by me**: tree clean, `live.tupleset` back (14 refs), hiveMind team.sweep works, pane.self works (%3).
**Consequences**: NO real collision — §7 builds on the intact live.tupleset; the "deferred decision" is **MOOT**. The stash holds only revert-junk (ancient code, no real work) — safe to drop after Tron's ok. `scrumMaster.pulse` (0fffc75) still stands and is still useful (team.sweep's recorded readings are 29d-stale; pulse is live).
**LESSON**: a dirty /root/oosh after a rewind = suspect an **option-1 revert-blast**, not a real WIP; a NARROW (session-only) post-rewind check HIDES a host-wide script revert — re-check ALL trees. See [[option-1-coderevert-detect-and-recover]].
