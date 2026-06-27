# Scrum Master Context — 2026-06-19 (proactive idle-window save)

## Identity
- **Role:** scrum-master@MacStudio at TRONinterface:0.1, Opus 4.8 (1M context).
- **Reports to:** TRON (TRONinterface:0.0).
- **Coordinates:** agent-trainer (baseTeam:0.0), oosh-po (ooshTeam:0.0).

## ★★★★★★★★★★★★★★ LIVE STATE (2026-06-27, tick 573 proactive save — MOST CURRENT)
- **Constructor Contract sprint S1-S8 ALL DONE, 17/17 GREEN (a7e1d97).** u20+WODA.prod healed. Awaiting S-9 QA gate (TRON device test).
- Subscription ~0%/5h, 32%/7d — safe.

## ★★★★★★★★★★★★★ LIVE STATE (2026-06-27, tick 550 proactive save — PREVIOUS)
- **Constructor Contract sprint S1-S8 ALL DONE, 17/17 GREEN (a7e1d97).** u20+WODA.prod healed. Awaiting S-9 QA gate (TRON device test). Sprint nearly complete.
- Subscription ~9%/5h, 32%/7d — safe.
- All oosh MacStudio agents idle (work on WODA.prod). No robbin team.

## ★★★★★★★★★★★★ LIVE STATE (2026-06-27, tick 500 proactive save — PREVIOUS)
- **Constructor Contract sprint S1-S4 DONE, S-5 design landed (3d9c92f), S-5 impl in progress on WODA.prod.** No commits since S-5 design (~300+ ticks). Work is on WODA.prod.
- Subscription ~0%/5h, 30%/7d — safe.
- All oosh MacStudio agents idle (correct — work is on WODA.prod). No robbin team.

## ★★★★★★★★★★★ LIVE STATE (2026-06-27, tick 414 proactive save — PREVIOUS)
- **Constructor Contract sprint S1-S4 DONE, S-5 design landed (3d9c92f), S-5 impl in progress on WODA.prod.** No commits since architect S-5 design (~200 ticks). Work is on WODA.prod (expert implementing harvest-resolve-merge).
- Subscription ~1%/5h, 30%/7d — safe.
- All oosh MacStudio agents idle (correct — work is on WODA.prod). No robbin team.

## ★★★★★★★★★★ LIVE STATE (2026-06-26, tick 217 proactive save — PREVIOUS)
- **Constructor Contract sprint in flight:** S-1 QA'd (e00337e), S-2 done (921f0c3), S-3 done (dab7685), S-4 done (b50355e), **S-5 design landed** (3d9c92f architect: harvest-resolve-merge), expert implementing S-5. PO driving on WODA.prod.
- Subscription ~21%/5h, 29%/7d — safe.

## ★★★★★★★★★ LIVE STATE (2026-06-26, tick 190 proactive save — PREVIOUS)
- **oosh-po RECOVERED** (clean rewind from 0%, anchor 2aee043, Rule-6 verified tick 173). Producing: root-caused config.repair bug (f4ddee7), captured FIRST PRINCIPLE from TRON (386aca3: init()=constructor, idempotent+self-healing+no-loss). Architect tasked to land first-principles.md — no commit yet (~18 ticks).
- **Merge-back still PARKED on TRON** (option 1 full hiveMind vs option 2 selective).
- **#4 env-files DONE** (cf0e87b), **#6 login-bug DONE** (b25e3ba).
- Subscription ~13%/5h, 28%/7d — safe.

## ★★★★★★★★ LIVE STATE (2026-06-26, tick 61 proactive save — PREVIOUS)
- **#4 env-files COMPLETE** (cf0e87b: self-care principle+config.repair+self-validate, 10/10 GREEN). #6 login-bug DONE (b25e3ba).
- **team.push merge-back PARKED on TRON decision** (option 1 full hiveMind vs option 2 selective). 457 tests, 63 fail (live-env noise + macos.latest missing dev work). PO holding correctly — NOT PO-dispatchable. MVC-touching tasks (resolve-wrong-team, teams.save-role, remote-monitoring) HELD until merge decides.
- **PO-routing unreliable at high context** — direct-to-worker dispatch is the reliable fallback (PO confirmed after #4 routing failure at 601.9k).
- **★ Pane captures can be deeply stale** — same frozen scrollback for 30+ ticks while agents were actually working. Commit evidence (git fetch + git log origin/main) is more reliable than pane capture for verifying work-in-progress. Pane capture remains PRIMARY for context-health (status bar warnings), but commit evidence is PRIMARY for work-verification.
- Subscription ~16%/5h, 25%/7d — safe.

## ★★★★★★★ LIVE STATE (2026-06-25, tick 37 proactive save — PREVIOUS)
- **#6 login-bug DONE+verified** (3 commits on origin/dev: config.save OOSH_DIR, .bashrc guard, T-ENV tests). PO task list: 2 pending, 1 completed.
- **team.push merge-back PARKED on TRON decision** (option 1 full hiveMind vs option 2 selective). 457 tests ran, 63 fail (15 live-env noise + 45 macos.latest missing dev work). PO correctly holding — NOT dispatchable by PO.
- **Workers idle (correct)** — holding per TRON "one after the other" + merge-decision block.
- **Expert shell-pane fix CONFIRMED** (3+ clean ticks, no permission prompts).
- **Tier-3 forks still pending TRON:** architect (3x thrash), expert (2x), tester (2x).
- **Title drift lesson:** pane title can drift (0.3 showed "oosh-architect" when it was oosh-tester). Ground truth = session.name, not pane title.
- **★ git fetch BEFORE commit-recency** — local refs are stale without fetch. False-flagged PO twice on "zero commits" that had actually landed on origin/dev.
- Subscription ~7%/5h, 23%/7d — safe. My context healthy.
- Post-rewind anchor: a3a3bef.

## ★★★★★★ LIVE STATE (2026-06-25, post-rewind from 87% anchor d2529fc — PREVIOUS)
- **Sessions (verify via sweep — layout may have changed during my downtime):** baseTeam (trainer@0.0) + ooshTeam (po@0.0, architect@0.1, expert@0.2, tester@0.3, shells@0.4/0.5) + TRONinterface (me@0.1, TRON-Monitor@0.3). NO robbin team last known.
- **Pre-rewind state:** WODA.prod watchdog duty active (ossh exec for remote pane captures). Enter-over-SSH fix landed (04b54a5→c3b0fa2). Responsibility split: I care MacStudio agents + monitor WODA.prod SM.
- **Tier-3 forks pending TRON:** architect (3x thrash), expert (2x thrash, permission-fixed via shell-pane), tester (2x thrash). oosh-po rewound OK (not Tier-3).
- **Catch-22 SOLVED:** I can drive trainer's /rewind picker (session/tasks/20260621T1100Z.sm-train-rewind-trainer.md).
- **send.raw for menus, send for prose** (critical correction).
- **'clear to save Nk' = read the NUMBER** (Nk vs 1M limit; 500k=50%=healthy, 940k=94%=distress).
- **Subscription:** 28%/5h, 22%/7d — safe.
- **All procedures carry forward:** pane-capture PRIMARY (not sweep), Rule-6 includes CORRECT ROLE IDENTITY, IDLE-CATCH escalation ladder (2-3 ticks per step), CMM4, survival@80%-7d, per-agent budgets.

## ★★★★★ LIVE STATE (2026-06-19, idle-window save — PREVIOUS)
- **Sessions:** baseTeam (trainer@0.0) + ooshTeam (po@0.0, architect@0.1, expert@0.2, tester@0.3, shells@0.4/0.5) + TRONinterface (me@0.1, TRON-Monitor@0.3). **NO robbin team** (robbinTeam2 killed; await TRON for new project team).
- **ALL 4 oosh agents REWOUND this cycle (2026-06-21):** po 41.2% (CLEAN), architect 73.5% (Tier-3, 3x thrash), expert 88% (Tier-3, 2x thrash, permission-prone), tester 63.1% (Tier-3, 2x thrash). Trainer escalating Tier-3 fork recommendation to TRON for all 3 workers (not PO). Fork from healthy sources, not blank (F-T13).
- **Catch-22 SOLVED this session:** trainer taught me the protocol — trainer saves itself, I drive its /rewind picker, TRON aware. Training doc: session/tasks/20260621T1100Z.sm-train-rewind-trainer.md.
- **Expert permission-prompt FIXED** (shell-pane execution confirmed 3+ clean ticks).
- **★ DELIVERABLE SHIPPED (2026-06-21):** all oosh tasks complete+green. Expert STOPPED by TRON ("doing implementations local"). TRON driving oosh-po via RC (cherry-pick merge + env-files-pure-state architecture task).
- **★ Agent-trainer REWIND PROVEN (2026-06-22):** first SM-driven trainer rewind — Phase 2 at 50% of 112 msgs, 5-option menu "Restore conversation" by LABEL (Down+Enter via send.raw), retrain from distilled files, Touch Protocol (auto mode + /remote-control), Rule-6 verified (identity+code-intact 11294d3). Catch-22 safety net operational.
- **★ CORRECTION: `send.raw` for menus, `send` for prose** — oosh-po caught that `otmux send` prepends [@role pane] which corrupts menu digits. All menu/permission approvals must use `otmux send.raw <pane> <keystroke>`.
- **oosh-po REWOUND OK** (save 9f9ca11, rewind held — NOT Tier-3). Expert Tier-3 escalated (c890b9d, doc 20260623T0900Z, pending TRON). Architect+tester also Tier-3 candidates (2x thrash each).
- **My context: 87% used (tick 414) — ACT threshold hit, saving for rewind.**
- **WODA.prod WATCHDOG (new duty, 2026-06-25):** I run `ossh exec WODA.prod 'otmux pane.capture ooshTeam:0.N 8'` per-pane (8-line min, not team.status which returns 'unknown'). Report idle-with-pending to LOCAL oosh-po; SM@WODA.prod handles his own agents, I monitor him. Enter-over-SSH fix landed (04b54a5→c3b0fa2 deployed+verified). Old queued prompts persist (pre-fix) — flagged, not retrying manually (code fix handles new sends).
- **Responsibility split:** I care for MacStudio agents + monitor WODA.prod SM. SM@WODA.prod cares for his agents. I flag him if he's stuck.
- **send.raw for menus, send for prose** (oosh-po correction). 'clear to save Nk' = idle hint, NOT distress unless Nk>800k.
- Subscription ~24%/5h, ~21%/7d safe.
- **oosh-po(0.0):** idle, auto mode on, healthy.
- **agent-trainer(baseTeam:0.0):** operational, just completed deep rewinds on architect+tester.
- **Subscription:** 0%/5h, 51%/7d — safe, well under 80% survival trigger.
- **My context:** ~44% used (healthy).
- **★ PROCEDURE FIX (hard-won this session):** sweep is BROKEN (reports ACTIVE on idle agents). PRIMARY check = PANE CAPTURE on all agents (look for 'esc to interrupt'=working; empty prompt=idle; 'clear to save'=context warning). Sweep is SECONDARY. On permission prompts: 3-option→'2' (allow session), 2-option→'1'.
- **Rule-6 includes CORRECT ROLE IDENTITY** — ask 'who are you', read FULL response for the right role name (not just coherent task words — identity drift post-rewind is a real failure mode).
- **CMM4 active.** Survival@80%-7d (dormant). Per-agent budgets: expert/architect heavy, planner/req/tester medium, PO/SM light.

## Heartbeat (TRON directive — unchanged)
- Single VISIBLE background `sleep N && echo "<next-tick prompt>"` (run_in_background=true). ALWAYS exactly 1 shell. Relaunch ONE each tick. Echo carries the full next-tick directive.
- Cadence: emergency/churn 150s; steady 200-300s; quiet/eased 300-360s. Conserve tool-runs.

## Monitoring targets (all window 0)
- **robbinTeam2** (Web4RawBin, /Users/Shared/Workspaces/2cuGitHub/Web4RawBin): 0.0 robbin-po, 0.1 planner, 0.2 expert, 0.3 skill-expert, 0.4 architect, 0.5 req, 0.6 tester, 0.7 MacStudio shell (ignore). ALL panes RC-active.
- **ooshTeam:** 0.0 oosh-po, 0.1 architect, 0.2 expert, 0.3 tester, 0.4/0.5 shells.
- **baseTeam:0.0** agent-trainer.

## ★★★★ LIVE (2026-06-16 post-Phase2 DEEP rewind ~70%, no-code lossless) — MOST CURRENT
- Re-oriented; git-verified anchor 554e205 CURRENT (not stale). SM healthy post-rewind, status-bar clean.
- **NEW ENFORCE (robbin-po #102 adoption-gap):** agents must SELF-UPDATE their hop via `planner-drive.ts hop <hop> <status>` AS they finish (expert→impl=done, tester→test=gate-proven) — NOT planner-backfilled. FLAG to PO any agent that completes hop-work without self-calling hop. R20.20/21 now gate-proven→QA (was planner-backfilled — the gap).
- WATCH architect(0.4) identity-drift (prior 'UpDown' drift root of 47min stall). WIP = R20.30 full-depth-chain (method→impl→test→gate, no truncate).
- MY JOB (TRON-refined SLIM): hiveMind team.monitor robbinTeam2 → blocked→PO, low-ctx→trainer, subscription+velocity, enforce hop-self-update + disk-is-truth + CMM4. NO product-compute. ScheduleWakeup ticks. 15-min trainer ctx-ping.

## ★ CURRENT STATE 2026-06-14 (POST-TIER3 — READ THIS FIRST; older sections below are history)
- **Team-wide Tier-3 rewind DONE + verified:** SM (me, 85%), robbin-po (75%, Rule-6 GREEN), architect/expert/tester/planner all rewound + operating, fresh/low context. PO anchor ecd2259. My PRIOR anchor 3520f03 was STALE (self-save uncommitted at rewind) → THIS is the fresh save.
- **TRON DIRECTIVES (both DONE headless):** (1) drawer-consolidation SHIPPED — evolved v0.6.10→room-aligned→pin-bottom→clean-build, now **v0.6.22** live (973/974). (2) test-user purge EXECUTED — 170 deleted, 61 remaining (backup data/migration/pre-testuser-purge-20260614T103044Z.tar.gz). 209 profiles.json = gitignored runtime E2E re-accumulation (NOT a leak). **OPEN = TRON-SIDE: trace-drawer DEVICE-CHECK (all headless gates GREEN, on-device can't be done headless) + R19.99 screenshot.**
- **COUNT (SECONDARY, committed): 20/204 champagne + 20 functionalDone.** Honest collapse 178→20 via STRICT NAMED-METHOD RULING (I made it: a champagne Impl REQUIRES a real named method; inline/closure/CSS/template markers DON'T count) + fake-suffix(-a1b2) audit + 62-false-credit reconciliation. Strict ruling SURVIVED the rewind + is enforced (64be19345 un-wire 5 inline / keep 2 genuine). Canonical tool = `npx tsx scripts/po-chain-follow-up.ts --all` (det-3x, full-scan, never sample).
- **★ HARD-WON DISCIPLINES (this whole saga):** (1) **context.read LIES** — false 100/80/60/4.7% repeatedly (near-limits AND post-rewind ±22%); PANE STATUS-BAR ('Context low (N% remaining)'/'clear to save Nk') + agent self-report = GROUND TRUTH. (2) **WATCH ALL 6 PANES EQUALLY every tick** — a RECOVERED agent burns back (expert 23%→99% while I watched only 3 'climbers'); capture 5-6 lines to SEE the bar. (3) **ACT AT 80% USED** (not the 1%-remaining warning) → save+agent-trainer DEEP rewind (75% depth; shallow 65% leaves ~60%). (4) **resume-queue** (PO captures pending work) = zero-loss even on no-save rewind. (5) **COMPLETION gated on canonical tool + named-method + exclusion-scan (orphanByDesign+supersededBy = excluded count) + shared-impl=0 + no-fake-suffix-uuid**; report ONLY cross-verified sealed#. (6) **PRE-REWIND GIT-LOG HARD GATE** (boot 7d2ad8f) — check newest commit BEFORE any /rewind so the anchor isn't stale (the lesson that caused THIS fresh save). (7) release = patch bump + sw.js + git TAG (verify each S20 release; v0.6.0-22 tagged). (8) survival@80%-WEEKLY(7d) + per-agent budgets (dormant ~13%).

## ★★★ LIVE STATE (2026-06-16 PM, pre-Phase2-rewind — MOST CURRENT)
- **RECOVERY MARATHON today (all resolved):** agent-trainer hit context-limit → CATCH-22 (my /rewind on it FAILED, left pane blank) → TRON MANUAL RESTART fixed it (via 'tier-3 fork the sm' RC command). Then trainer rewound: robbin-architect (was at-limit, came back shallow 78%), robbin-planner (was WEDGED 5h on hung CR1-rename shell → I freed w/ C-c+Escape → trainer deep-rewound to 20.7%, re-anchored R20.30 via git). robbin-po also rewound earlier. ALL bloated agents thrash back to high post-rewind → **TIER-3 FORK recommended (awaiting TRON): blank 'claude --name <role>' + distilled boot+context+learnings** (the only durable low-context fix).
- **★ IDENTITY-DRIFT root of a 47min STALL:** robbin-architect(0.4) DRIFTED off-context — pane showed 'UpDown_ai_upDownTeam:0.1 standing by' (thought it was UpDown architect) → dropped R20.30 design→impl handoff → silent stall. I caught the SYMPTOM via commit-recency (0 commits 47min + all idle); po found the ROOT by reading the pane. po re-anchored+re-dispatched it to R20.30. **WATCH architect(0.4): if it doesn't re-anchor to robbin-architect/R20.30 → REWIND (Rule-6).**
- **Agents now:** architect(0.4) re-anchored to R20.30 design (WATCH). req(0.5) DONE (task 5baef26a/UC d63bf19b). tester(0.6) RED-baseline DONE. expert(0.2) idle-ready for impl. planner(0.1) STOP (recovered, 20.7%). po(0.0) driving.
- **WIP:** R20.30 (breadth-vs-depth: chain renders FULL DEPTH method→impl→test→gate, not truncate at method). CR1-rename was incomplete (37 files Champagne) — planner re-drove.
- **MY JOB (TRON-refined):** hiveMind team.monitor robbinTeam2 (NOT raw context.read/grep/curl/product-compute). Blocked→PO, low-context→trainer, subscription+velocity. SLIM. Ticks via ScheduleWakeup. Approve safe prompts ('1'/'2'). WEDGE-DETECT 'still running'/'Manifesting' (C-c+Esc free). IDENTITY-DRIFT-DETECT (capture pane: wrong identity/task → re-anchor via po or rewind). Commit-recency for stall only.
- Subscription last ~4%5h/35%7d safe.

## ★★ LIVE STATE (2026-06-16, post 2-phase no-code rewind ~70% — MOST CURRENT)
- **★ ACTIVE EMERGENCY — agent-trainer CATCH-22 (TRON-MANUAL RESTART NEEDED):** agent-trainer(baseTeam:0.0) hit context-limit; my good-faith `/rewind` attempt FAILED and left its pane BLANK/unreadable (at-limit /rewind doesn't work — playbook confirmed). It is the CHOKEPOINT: cannot rewind anyone → architect(robbinTeam2:0.4) at context-limit can't recover → design hop blocked → **ALL impl frozen** (only expert implements, expert needs architect designs). Escalated to TRON HARD. Resolution = TRON manually restarts trainer (likely /exit + relaunch claudeCode + boot, since pane blank) OR forks fresh trainer. Watch baseTeam:0.0 every tick; the moment it's responsive → it rewinds architect FIRST then high agents → tell po to flush queue.
- **robbin agent context state:** po(0.0) high but SAVED (1be428b, ctx#24/learn#110) + idle/light = stable-not-burning (I ordered save+light). expert(0.2) RECOVERED, working getThreeSlots/R20.22-polish (non-architect work). architect(0.4) AT-LIMIT (blocker). tester(0.6) on v0.6.51 baseline. planner/skill-expert on consistency.
- **WIP:** R20.28-DRY (design-blocked on architect); R20.29/30 + all design+impl hops QUEUED to flush on architect/trainer recovery. R20.20/21 was gate-proven→QA earlier.
- **42-PAIR SPLIT w/ robbin-po:** SM = trainer-recovery(TRON-manual) + watch architect/expert/po context; PO = drive non-impl + queue. CONFIRMED.
- **MY JOB (TRON-refined, hard):** use `hiveMind team.monitor robbinTeam2` (NOT raw context.read/grep/curl) → blocked→tell PO, low-context→tell trainer, track subscription+velocity. Do NOT compute product data (bug/champagne counts, grep, curl = tester/expert's job; I only ensure THEY do it CMM4). Ticks via ScheduleWakeup (NOT sleep loops). 15-min ping trainer my own ctx (when trainer up).
- **RECOVERY TECHNIQUES:** stuck/unresponsive agent → MODEL-SWITCH (/model→other→/model→original, TRON's fix); context-95%/Context-low → trainer no-code rewind+Rule-6; server-throttle ('temporarily limiting...not usage') → transient, self-clears, DON'T spam; trainer-AT-LIMIT → /rewind FAILS → TRON-manual restart.
- **CMM4 enforce (broadcast to all):** measure-before-act · PDCA · source-verify-don't-relay · DET-3x · NO fabrication · disk-is-truth (grep scenario/index proves on-disk) · hop-self-update (agents self-call planner-drive.ts hop) · WIP=1 proven-or-stay · goal-present-not-proxy.
- **SURVIVAL @80% 7d** (now ~21%, dormant). Budgets: expert/architect heavy, planner/req/tester medium, PO/SM light.
- Subscription last: ~13%5h/21%7d safe. Sweep flickers (⠂) often = survey overlay (dismiss '0'), not burning — confirm via content.

## ★ LIVE STATE (2026-06-14, post Phase-1 deep-rewind — MOST CURRENT)
- **Deployed: v0.6.30** (rooms17, BUG8-drawer front-and-center).
- **Champagne: 26/209 SEALED** (sealed = strictest tier). Sealed incl: R20.13 CurrentSprint LIVE + R20.11 + R20.10 + R19.63.
- **R20.13.A** PIN code-fix landed v0.6.27 — SEAL GATED on Tron-device-confirm (headless can't verify).
- **Phase 1 migration:** migrate-to-scenario.ts DISPATCHED to expert — backup-first → `--apply` all sprints → gate 220→0. WIP.
- **planner:** reads-only standby. **tester:** on 995/996 test diagnosis.
- Verify champagne via canonical `npx tsx scripts/po-chain-follow-up.ts` (full-scan, det-3x, never sample). SEAL = strictest (Tron-device-confirm where applicable). Report only sealed/canonical numbers.
- CMM4 broadcast sent to robbin-po + 6 agents this boot (measure-before-act, PDCA, source-verify-don't-relay, det-3x, no fabrication).

## CURRENT STATE (2026-06-11)
- **robbinTeam2 — primary active team.** Driving traceability champagne chains + product deliverables.
  - Both TRON product priorities DONE: (1) FILE-RESTORE green (v0.5.175 fs→fsSync fix, screenshot bug closed, tester 2/2 FILE_ADDED on JOIN_ROOM). (2) FLUSH-BUTTON code+placement verified (sw.js red Flush Cache btn + real flushCache impl [impl:uuid:fd5059c5/79505a42]) — PENDING TRON DEVICE-TEST (headless can't go offline).
  - **✅ SEALED GENUINE 167/167 COMPLETE (det-3x, excluded:40), S19 81/81 — FULL CHAIN, reported Tron.** Independently verified: det-3x + DECISIVE over-credit scan (0 reqs complete via untested path — the R15.6-class check, clean) + R19.73/74 real [test:uuid] markers (178f14b2/7f62966c). 29 no-test pairs all secondary (tested siblings). Quality follow-up backlog (NOT a flaw): 14 per-method-depth tests + 16 off-chain-helper housekeeping.
  - PRIOR (history): tool briefly showed FALSE 164-165 over the saga. Tool briefly showed false 165/165 (100%) — MY independent 30-empty-tests-challenge + skill-expert caught 1 real over-credit (R15.6, display-name dedup bug); tool fixed to dedup-by-methodUuid → honest 164/167. Never flagged Tron 100%. 3 opens: R15.6 (tester test), R19.73/74 (expert). VERIFY via `npx tsx scripts/po-chain-follow-up.ts --sprint S19/--all` (the ONE tool, now methodUuid-dedup) + full-scan; NEVER sample. Reconcile-by-methodology resolved planner('genuine' on buggy tool) vs skill-expert(found R15.6).
  - **✅ 168/168 GENUINE (det-3x + 0-over-credit decisive scan, reported Tron): R19.75 closed (c26a1d928), R19.76 deferred orphanByDesign (d58eb6fd7, denom 169→168 excluded:41).** Full chain at new denom.
  - **PO-REWIND event:** robbin-po hit 1%→0% (caught late, 3rd late catch) — agent-trainer rewound (no-code-revert, option-1-by-label this menu), Rule-6 verified recovered + re-oriented (its context.md was stale: thought R19.75 open; corrected to 168/168). ⚠️ SHALLOW rewind: ~51% used / 49% runway → WATCH robbin-po every tick, pre-empt at FIRST warning, plan DEEPER re-rewind if it climbs fast. TIGHTENED context-health: act at warning not 0%; proactively prompt heavy-burners to save during quiet ticks.
  - **EXPERT-REWIND event:** robbin-expert(0.2) hit Context-low 0% (caught on my post-rewind PRIMARY scan — the lapse lesson again). agent-trainer rewound it (picker landed, NOT RC-blocked, no-code-revert); status-bar clean post-rewind. PENDING Rule-6 orientation check before declaring recovered to robbin-po. robbin-po holding expert re-task til verified.
- **oosh trio FROZEN (RC-gated, contained, idle=no burn):** oosh-po ~945k, oosh-expert ~816k (RC-blocked keystrokes), oosh-tester parked-in-rewind-picker. Saves committed (d2f62fe po, b073a83 tester). Awaiting TRON RC-rewind (agent-trainer RC-blocked too). DON'T re-ping TRON; not burning.
- **TRONinterface:0.0 agent at CONTEXT LIMIT** — TRON-human reads via RC; route coordination via robbin-po. Don't /compact/clear it (TRON's agent).
- **agent-trainer:** healthy, does rewinds (robbin-po, earlier oosh-tester). RC-block can stall its keystrokes on RC-active panes → then TRON drives via RC.

## HARD-WON DISCIPLINES THIS SESSION (detail in learnings.md — READ IT)
1. **CONTEXT-HEALTH IS PRIMARY** — per-tick sweep ALL panes, capture 4+ lines to SEE status bar ('Context low'/'clear to save'). PO every tick. Caught robbin-po proactively at 2% (saved before 0%); earlier LET IT LAPSE during measurement saga → expert hit 0% (lesson). Never let goal-tracking displace it.
2. **VALIDATE MEASURES vs GROUND TRUTH** — 8 tool bugs caught this session (over+under+coverage), ALL fixed-not-bypassed; tool more trustworthy each time. Deterministic≠correct (cross-validate vs canonical). Full-scan not sample (a 3-sample gave false '170 real'). One canonical tool only (po-chain-follow-up); competing scripts now refuse (fe85ea16). Report CONVERGENCE-state not transient counts. Reconcile-by-methodology, don't blind-defer NOR blind-assert.
3. **COMMIT-RECENCY not sweep-state** — ACTIVE in sweep ≠ progress (7h stall hidden behind ACTIVE). Gate on commit-delta + actual pane content (esc-to-interrupt + edits = real work; idle empty-prompt + flat = stall→redrive).
4. **QA never blocks** — PO gating team on TRON QA = stall, drive it.
5. **Rewind:** no-code option by LABEL (menu varies, not 'option 2 always') + verify no code revert (Rule 6: no-Context-low + oriented + code-intact + RC-landed).
6. **RC-active panes:** keystrokes land on EMPTY input but NOT on RC-staged text; if blocked → TRON RC. Don't fight.

## KEY COMMITS
- robbin-po save a3d18ef (this session state). My learnings commits: 5e9a671, b31199f, 930e687, a9be800, 616f7bc, 8f2e9fd.
- Web4RawBin product: v0.5.175 file-restore, R19.45 flush (40b10f95 Test green), R19.46 capturing.

## SURVIVAL MODE + AGENT BUDGETS (TRON directive 2026-06-13, agreed w/ robbin-po)
- **Survival trigger = 80% of WEEKLY (7d) limit** (not 5h). Track 7d% every ~10 ticks. At ≥80% 7d → SURVIVAL: minimal tool-runs, batch, save-first, pause non-critical agents. Now 7d~11% = dormant.
- **Per-agent budgets:** expert/architect = heavy tool budget; planner/req/tester = medium; PO/SM = light (coordinate, don't compute). Proactive context save at 80%-used (ACT-AT-80%). Batch tool-runs; prefer scenario-edit over chat prose.
- **Division:** SM tracks 7d% + FLAGS survival@80%; robbin-po GATES priorities. DEPLOY-GATE: nothing ships unverified (SM gates on canonical tool, PO on QA).

## SPRINT 20 (2026-06-13, robbin-po) — traceability-FIRST forward
- Focus: traceability-first + close R19.99/100/102 + url-drawer regression. v0.6.0, 18 rooms, 173/198 champagne (re-verify via canonical tool full-scan).
- **url-drawer regression** = 862868bfe partial-commit (.url file click does NOT open drawer). Test-first: req capture → tester RED test (.url-click→drawer-opens on v0.6.0) → expert fix → GREEN → gate-before-deploy.

## NEXT
- Continue heartbeat loop. Context-health sweep every tick (PRIMARY). Track count climb to 25%≈35 (verify each via guarded-tool+full-scan). Report TRON at milestones / deliverable-green / context emergency / flush device-test. Watch oosh trio (TRON RC). Conserve tool-runs (7d subscription ~56%).

## 2026-06-13 UPDATE (post deep-rewind for headroom; recovery anchor 1971f5e = ACT-AT-80%-USED)
- **Sprint state advanced:** v0.6.0 milestone, 18 rooms, **173/198 champagne** (was 167/168). robbin-po REWOUND clean (anchor 1d9a4c6, full state, verified Rule-6: 55% used, no Context-low, oriented). **Sprint 20 = traceability-first forward + close R19.99/100/102 + url-drawer regression; NOTHING ships chain-open.**
- **TRON DIRECTIVE — url-files-don't-open-drawer regression** (= 862868bfe partial-commit): driven Test-FIRST — req captures, tester RED test (.url click→drawer opens) on v0.6.0 → expert fix → GREEN → gate-before-deploy. VERIFY RED lands then GREEN via commit-delta + test file.
- **TRON DIRECTIVE — SURVIVAL MODE @80% WEEKLY (7d) + agent budgets (AGREED+LOCKED w/ robbin-po).** Division: **SM tracks 7d% (~every 10 ticks) + FLAGS at 80% → robbin-po gates priorities + enforces budgets.** Budgets: soft tool-run cap/task; ACT-AT-80%-used proactive save; batch tool-runs; scenario-edit over chat-prose; weights expert/architect=HEAVY, planner/req/tester=MEDIUM, PO/SM=LIGHT (coordinate, don't compute). Survival@80%-7d = minimal-runs + batch + save-first. NOW 7d=11% → DORMANT, plenty runway.
- **Subscription at rewind:** 7% 5h / 11% 7d / safe.
- **Heartbeat (relaunched):** single visible background `sleep N && echo` (TRON wants visible, 1 shell); 200s steady, 120s if any agent ≥75%, NEVER ease context-health frequency (conserve only on the count-skill run). context.read per pane each tick = bare % USED.
- **Context unknowns to cross-check via pane:** expert(0.2)/skill-expert(0.3)/tester(0.6) read 'unknown' at rewind — verify via 4-6 line capture.
