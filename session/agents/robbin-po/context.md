# robbin-po Context — Save Point 2026-05-27 (high-context checkpoint)

**Role:** Product Owner | **Pane:** robbinTeam:0.0 (MacStudio)
**Project:** RawBin (Web4RawBin) | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.22 LIVE** (pane iphone:0.1)
**Tron:** iphone:0.0 | **Fleet:** scrum-master TRONinterface:0.1 | agent-trainer baseTeam:0.0
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req

## DELIVERED this session (all verified, on the Tron-QA gate)
- Bugs (Tron live): T81 member-click→sheet (v0.4.9) · T84 editor-back→parent (v0.4.10) · T94 version-bar/per-request-version (v0.4.10/0.5.4) · T82 vCard button+rb-avatar DRY (v0.5.0) · T91+T109 avatar persist + keyless upload + rekeyUser re-encrypt + ensureAvatar-no-overwrite (v0.4.11→0.5.10, both parts tester 6/6) · T93 multi-room lobby (v0.5.2) · T95 newest-first (v0.5.5) · vCard photo+UUID (v0.5.14) · T100 DATA_DIR test isolation (v0.5.6)
- **S14 Legacy Migration COMPLETE** (v0.5.20): migrate(copy)→T98 clean verify(verify-report.json PASS)→T99 gated delete (Tron auth 2026-05-26)→removed legacy data/rooms read+write+dead code. UUID-only per-user = sole source. 3 real rooms intact. Backups retained.
- **S15 Traceability Browser COMPLETE** (v0.5.22): T101 TraceModel + T102 consistency engine + T103 Object.verb seam (routes/ViewBus/MVC) + T104 diagrams + T105-108 views + browser. RELOCATED to docs top-nav (/trace, peer to browser/App) — was wrongly in /edit sidebar.

## IN FLIGHT
- **S16 Traceability UX** (NOT delivered — early design): Tron compound requirement in sprint-16-traceability-ux/compound-requirement-source.md (verbatim). Req splitting R16.1-10; architect designing (DetailViewContainer drawer + Task/RequirementDetailView; tree-item redesign: square-SVG icon/free-lib, speaky name+generate, word-wrap description, OS drag, tap-icon collapse/expand, '>' children expander; chain review method→requirement + UseCase as class instances in PUML). **Architect + planner BOTH rewinding (hit context limits) — S16 resumes on their recovery.** Tasks T110+.
- **S14 closure proof**: expert verifying a new-room-create does NOT recreate data/rooms.
- **S11 traceability remediation** (T87-90, req) — fixes the drift T102 detects (14 broken/110 issues).
- **Fail-closed test isolation** (#25): pollution recurred 3x; fix = invert E2E isolation to opt-OUT (tester). 

## TRON-QA GATE: ~18 tested awaiting Tron's QA declaration. NOTHING marked Done (Tron's gate). "QA is after delivering" — don't gate work on QA; deliver, Tron QAs after.

## NEXT ACTIONS (post-rewind)
1. When architect + planner rewound: re-confirm their TODOs — architect resumes S16 design (+ icon-lib pick); planner plans S16 (T110+) + verifies S14 closure.
2. Drive S16 to BUILT UX (design→review→expert build→tester). Report only real built deliverables, not "done" prematurely.
3. Await expert's S14 new-room proof.

## STANDING RULES (hard-won this session — see learnings.md + auto-memory)
- NEVER /compact or /clear any agent (kills/risks them). Stuck/over-full agent → REWIND via agent-trainer (baseTeam:0.0), state saved+committed FIRST. Capture an agent's diagnosis from its pane + commit it myself if it can't (did this for the avatar root cause f162f1a).
- VERIFY independently before reporting "done" AND after destructive ops — caught: half-done avatar fix, stale T98 verify, legacy data/rooms regeneration, wrong browser placement. Never relay an agent's "done" unchecked.
- Route EVERY Tron requirement to req for literal capture immediately; split compound directives into ALL their requirements. Capture verbatim to a source file before anything touches it.
- Destructive ops GATED: copy→verify-on-CURRENT-data→explicit Tron auth→delete→verify-after. Never delete on a stale verify.
- Communicate via task FILES (CMM4); planner co-drives status consistency. No backticks in otmux send (shell-mangles). Verify otmux send landed (pane.capture).
- No idle agents: re-task on every completion. Don't drop design→implement handoffs.
