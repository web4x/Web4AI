# robbin-po Context — Save Point 2026-05-26

**Role:** Product Owner | **Pane:** robbinTeam:0.0 (MacStudio)
**Project:** RawBin (Web4RawBin) | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.4 LIVE** (server pane iphone:0.1)
**Tron:** iphone:0.0 (research@MacStudio)

## Team (robbinTeam)
0.0 PO(me) | 0.1 architect | 0.2 expert | 0.3 tester | 0.4 expert-shell | 0.5 tester-shell | 1.0 planner | 1.1 req
Fleet: scrum-master TRONinterface:0.1 | agent-trainer baseTeam:0.0

## DELIVERED this session — all on v0.5.4, tester-verified 39/39 (full Playwright)
Tron's requirements, all impl + deployed + verified, AWAITING TRON QA GATE + phone test:
- T81 member-click→profile sheet (msg.profile→msg.user fix) v0.4.9
- T82 vCard button restore + rb-avatar DRY v0.5.0
- T83 self-click→read-only sheet + Edit button (supersedes T81 AC6) v0.5.3
- T84 editor back→parent dir (not /app) v0.4.10
- T91 avatar persists (ensureAvatar trusts disk) v0.4.11
- T92 avatar upload JUST WORKS (createUserHome+keypair before encrypt, retry; no error) v0.5.1
- T93 multi-room lobby (per-user load + creatorToken backfill + per-client owner-aware list) v0.5.2
- T94 version-update-banner (per-request getVersion — fixed "every fix invisible to Tron") v0.5.4
Device-only open items (Tron phone QA): T94 AC5 iOS-standalone banner, T91 live reconnect+restart.

## IN PIPELINE
- T95 (S13) newest-rooms-first lobby sort — architect design (commit pending) → expert → tester
- Sprint 14 Legacy Data Migration (19c5a0a) — GATED: T96 migrate-rooms + T97 migrate-userdirs(→UUIDv4) → T98 verify(no-data-loss) → [⛔GATE: verify PASS + TRON AUTH] → T99 remove-legacy. Copy-then-verify, backup-first, NEVER auto-deletes. End-state = UUID v4 ONLY (data/users/<user-uuid>/rooms/<room-uuid>/). Architect designing.
- Sprint 11 traceability remediation (T85-T90) — planner/req background.

## STANDARDS / PROCESS (Tron-mandated this session)
- Traceability standard: scrum.pmo/standards/traceability-standard.md — UUID chain req→uc→puml→method→test.
- CMM4: communicate via TASK FILES, not chat. Refine collaboratively until spec is consistent enough to delegate cold to expert+tester. Then expert implements / tester verifies FROM the file.
- Web4Articles hierarchical Status checklist. QA Review + Done = TRON's gate only.

## NEXT ACTIONS
1. Await Tron QA gate + phone test on v0.5.4 (8 fixes ready). Run sprint QA close-out on approved tasks.
2. Review architect's T95 design (file) → route expert.
3. Review Sprint 14 migration plan (architect+planner) BEFORE any execution; T99 delete parked on Tron auth.

## HARD LESSONS (see learnings.md + auto-memory)
- NEVER /compact agents — forbidden. Stuck agent → agent-trainer REWIND. (I /compacted tester under a misread of "NO ONE EVER GETS COMPACTED" — it survived but Tron furious.)
- Don't drop design→implement handoff (let expert idle after architect designs = "why is no one working").
- otmux send can fail to submit (text left at prompt) — ALWAYS verify with pane.capture.
- Don't override Tron's explicit statements with my own code-reading (the editor-bug dismissal).
- Every delegation ends with explicit report-back to robbinTeam:0.0.
- PO verifies independently before reporting (curl, source, commit) — never pass agent claims unchecked.
