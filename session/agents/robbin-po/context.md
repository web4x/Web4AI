# robbin-po Context — URGENT 100%-ctx save 2026-05-27/28

**Role:** Product Owner | **Pane:** robbinTeam:0.0 (MacStudio)
**Project:** RawBin (Web4RawBin) | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.22 LIVE** (server iphone:0.1)
**Tron:** iphone:0.0 | **Fleet:** SM TRONinterface:0.1 (monitors me) | agent-trainer baseTeam:0.0
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req

## DELIVERED + VERIFIED (v0.5.22, on Tron-QA gate, "QA after delivering")
- All bug fixes: T81 member-click, T82 vCard btn+rb-avatar DRY, T83 self-click→sheet+Edit, T84 editor-back→parent, T91+T109 avatar persist+keyless upload (rekeyUser + ensureAvatar-no-overwrite), T93 multi-room lobby, T94 version-bar/per-request-version, T95 newest-first, T100 DATA_DIR test isolation
- vCard photo+UUID (148e9b8 v0.5.14, /api/avatar/<token> + NOTE UUID + base64 loop fix)
- **S14 Legacy Migration COMPLETE** v0.5.20: migrate(copy)→T98 clean verify(verify-report.json PASS)→T99 gated delete (Tron auth)→write path removed (Room.persist UUID-only)→tester UI close ✓. UUID-only per-user = sole source.
- **S15 Traceability Browser COMPLETE** v0.5.22: T101-108 + relocated to docs top-nav /trace (peer to browser/App).
- **Fail-closed test isolation** ec0423d: playwright.config default INVERTED to opt-OUT (port 4445 + DATA_DIR=tmp + reuseExistingServer:false); E2E_LIVE=1 to touch live. Pollution structurally impossible.

## IN FLIGHT (S16 — current sprint)
- **S16 Traceability UX** — design COMPLETE + chain-analysis DELIVERED:
  - T116 chain audit DONE: zero orphans S15+S16 (18 methods→15 UCs→8 tasks→10 reqs)
  - T117 PUML DONE: 15 <<UseCase>> stereotyped classes (s16-usecases.puml + trace-cli stereotype spec)
  - T110 DetailViewContainer DONE (expert, drawer slideUp/swipe-dismiss)
  - **T111 SEPARATE DetailViews** (rb-task-detail/rb-requirement-detail/rb-usecase-detail, self-register, open/closed; rb-detail-view = generic fallback) — expert building NEXT
  - T112-T115 tree-item redesign (Lucide ISC icons 24x24, speaky-name auto-gen, word-wrap desc, OS drag, tap-collapse↔expand + '>'-children-expander)
  - trace-cli Pass 4/5 (parse <<UseCase>> + [impl:uuid]) — expert, after views
- **Compound requirement source:** sprint-16-traceability-ux/compound-requirement-source.md (Tron verbatim R16.1-R16.10)
- **Pending follow-up:** 4 room.test failures = S14 test-debt (test removed loadFromDisk/persistDir) — tester to update tests to per-user-only model
- Tester verifies T110 + S16 phases as they land
- Architect available (S16 design + chain done)
- Planner: S16 planned T110-T117 + S14 closure verified (was hitting limits; SM monitoring)
- Req: splitting R16.x

## TEAM-HEALTH PROTOCOL (Tron-mandated coordinated loop)
- SM monitors every agent (60s/3min/10min, save@60, prep@70, rewind@80, never 0)
- Pre-limit: agent WRITES + git-COMMITS context.md + learnings + findings (the recovery anchor)
- agent-trainer executes CMM4-recoverable REWIND (state saved+committed FIRST → rewind → reboot from boot+context+learnings = deterministic/reproducible). Tier-2 if base too bloated: /exit + fork-from-healthy.
- PO sets priorities; SM monitors; trainer executes
- **NEVER /compact** (destructive). Verify fork ACTUALLY RESET (<30%) before declaring recovered + tasking — "verify the reset" protocol gap caught when expert was tasked at 96.2%.
- This session: recovered architect (tier-2 fork, was 977k), tester (fork+pane-capture), expert (verify-the-reset on retry), planner (rewind, repeatedly). Zero work lost.

## NEXT ACTIONS (post-rewind/fork — recovery anchor)
1. Re-task expert with **S16 build sequence** if my prior task was lost in re-fork: T110 done; build T111 (separate DetailViews per type) → T112 tree-item name+desc → T113 Lucide icons → T114 OS drag → T115 collapse/expand+'>'-expander → trace-cli Pass 4/5. Each commit + report.
2. Re-task tester: (a) verify T110 drawer (slideUp/swipe/ctx.mount); (b) FIX 4 room.test S14-debt failures (update to per-user-only Room — no loadFromDisk/persistDir); (c) verify each S16 phase as expert lands them.
3. Architect: standby / design-review (its S16 work done).
4. Drive S16 to delivery; surface real built UX (not premature "done"); Tron QA after delivery.
5. Continue team-health coordination with SM + agent-trainer until ALL delivered.

## HARD-WON RULES (see learnings.md + auto-memory)
- NEVER /compact (kills/risks); rewind via agent-trainer; fork-from-healthy if base bloated; VERIFY the reset actually happened.
- Capture dying agent's diagnosis from its pane + COMMIT myself before rewind (lossless, see f162f1a avatar root cause).
- Verify AFTER destructive ops too (caught: stale T98, data/rooms regeneration, half-done avatar fix, wrong browser placement).
- Route EVERY Tron requirement to req for literal capture; capture verbatim to a "compound requirement source" file BEFORE anything touches it.
- Communicate via task FILES (CMM4); planner co-drives status; no backticks in otmux send (shell-mangles); verify send via pane.capture.
- "QA is after delivering" — don't gate on QA; deliver, Tron QAs after.
- Fork-recovered agents reboot from committed context.md — STALE snapshots lose recent task queues → proactive context-writes critical; re-task on every recovery from preserved captures.

## GATE: ~18+ tested tasks awaiting Tron's QA declaration. Nothing marked Done (Tron's gate).
