# Scrum Master Context — 2026-06-14 (POST-TIER3 TEAM REWIND; fresh save fixing stale anchor)

## Identity
- **Role:** scrum-master at TRONinterface:0.1, Opus 4.8 (1M context) — MUST stay Opus 1M (Sonnet=200k would break this ~900k pane).
- **Reports to:** TRON (TRONinterface:0.0 — but that AGENT is at CONTEXT LIMIT; route coordination via robbin-po, TRON-human reads via Remote Control).
- **Coordinates:** agent-trainer (baseTeam:0.0), robbin-po (robbinTeam2:0.0), oosh-po (ooshTeam:0.0).

## Heartbeat (TRON directive — unchanged)
- Single VISIBLE background `sleep N && echo "<next-tick prompt>"` (run_in_background=true). ALWAYS exactly 1 shell. Relaunch ONE each tick. Echo carries the full next-tick directive.
- Cadence: emergency/churn 150s; steady 200-300s; quiet/eased 300-360s. Conserve tool-runs.

## Monitoring targets (all window 0)
- **robbinTeam2** (Web4RawBin, /Users/Shared/Workspaces/2cuGitHub/Web4RawBin): 0.0 robbin-po, 0.1 planner, 0.2 expert, 0.3 skill-expert, 0.4 architect, 0.5 req, 0.6 tester, 0.7 MacStudio shell (ignore). ALL panes RC-active.
- **ooshTeam:** 0.0 oosh-po, 0.1 architect, 0.2 expert, 0.3 tester, 0.4/0.5 shells.
- **baseTeam:0.0** agent-trainer.

## ★ CURRENT STATE 2026-06-14 (POST-TIER3 — READ THIS FIRST; older sections below are history)
- **Team-wide Tier-3 rewind DONE + verified:** SM (me, 85%), robbin-po (75%, Rule-6 GREEN), architect/expert/tester/planner all rewound + operating, fresh/low context. PO anchor ecd2259. My PRIOR anchor 3520f03 was STALE (self-save uncommitted at rewind) → THIS is the fresh save.
- **TRON DIRECTIVES (both DONE headless):** (1) drawer-consolidation SHIPPED — evolved v0.6.10→room-aligned→pin-bottom→clean-build, now **v0.6.22** live (973/974). (2) test-user purge EXECUTED — 170 deleted, 61 remaining (backup data/migration/pre-testuser-purge-20260614T103044Z.tar.gz). 209 profiles.json = gitignored runtime E2E re-accumulation (NOT a leak). **OPEN = TRON-SIDE: trace-drawer DEVICE-CHECK (all headless gates GREEN, on-device can't be done headless) + R19.99 screenshot.**
- **COUNT (SECONDARY, committed): 20/204 champagne + 20 functionalDone.** Honest collapse 178→20 via STRICT NAMED-METHOD RULING (I made it: a champagne Impl REQUIRES a real named method; inline/closure/CSS/template markers DON'T count) + fake-suffix(-a1b2) audit + 62-false-credit reconciliation. Strict ruling SURVIVED the rewind + is enforced (64be19345 un-wire 5 inline / keep 2 genuine). Canonical tool = `npx tsx scripts/po-chain-follow-up.ts --all` (det-3x, full-scan, never sample).
- **★ HARD-WON DISCIPLINES (this whole saga):** (1) **context.read LIES** — false 100/80/60/4.7% repeatedly (near-limits AND post-rewind ±22%); PANE STATUS-BAR ('Context low (N% remaining)'/'clear to save Nk') + agent self-report = GROUND TRUTH. (2) **WATCH ALL 6 PANES EQUALLY every tick** — a RECOVERED agent burns back (expert 23%→99% while I watched only 3 'climbers'); capture 5-6 lines to SEE the bar. (3) **ACT AT 80% USED** (not the 1%-remaining warning) → save+agent-trainer DEEP rewind (75% depth; shallow 65% leaves ~60%). (4) **resume-queue** (PO captures pending work) = zero-loss even on no-save rewind. (5) **COMPLETION gated on canonical tool + named-method + exclusion-scan (orphanByDesign+supersededBy = excluded count) + shared-impl=0 + no-fake-suffix-uuid**; report ONLY cross-verified sealed#. (6) **PRE-REWIND GIT-LOG HARD GATE** (boot 7d2ad8f) — check newest commit BEFORE any /rewind so the anchor isn't stale (the lesson that caused THIS fresh save). (7) release = patch bump + sw.js + git TAG (verify each S20 release; v0.6.0-22 tagged). (8) survival@80%-WEEKLY(7d) + per-agent budgets (dormant ~13%).

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
