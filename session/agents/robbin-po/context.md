# robbin-po Context — save 2026-06-11 (robbinTeam2 fork)

**Role:** PO | **Pane:** robbinTeam2:0.0 (forked from robbinTeam to escape write-classifier outage; same repo/machine, diff otmux session)
**Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.176 LIVE**
**Tron:** iphone:0.0 | SM TRONinterface:0.1 (event-driven) | agent-trainer baseTeam:0.0

## robbinTeam2 roster
0.0 po(me) | 0.1 planner | 0.2 expert | 0.3 skill-expert | 0.4 architect | 0.5 req | 0.6 tester | 0.7 empty

## ★ PRINCIPLE #1 — ALL IS DILIGENCE. NOTHING URGENT. (read learnings #1 first)

## CURRENT STATE (honest, dual-verified)
- **Chain count: 12/137 COMPLETE** (S19 11/51), guarded-canonical, deterministic 3x, full-scan-clean (86/86 Impls real, 0 stubs). Climbed 4→11→12 on REAL work.
- **Both Tron product priorities GREEN + on phone:** (1) FILE-RESTORE fixed (fs→fsSync, v0.5.175, files reappear on JOIN_ROOM) (2) FLUSH-PWA-CACHE button (R19.45, sw.js red button + flushCache, chain now FULLY COMPLETE).
- Milestone 25%=34/137 (need +22). Open: expert ~94 real-Impl-creates, tester ~78 Tests, architect ~0.

## THE MEASUREMENT-INTEGRITY SYSTEM (session's core achievement)
- **ONE canonical measure:** `npx tsx scripts/po-chain-follow-up.ts --all` (or --sprint S19). NO parallel scans. trace-audit.ts hard-REFUSES (exit 1) on --completion (skill-expert prevention).
- **team-velocity** skill sources po-chain-follow-up (never recomputes); validated cwd-independent.
- **8 tool bugs caught vs ground truth, ALL FIXED-NOT-BYPASSED** (tool stays canonical gate): arg-handling, indexing, exclusion(boolean-stringify), unit-existence-guard(dropped over-count 10→4), denominator-canonicalization, UC.method-walker(under-count), marker-uuid-mismatch, .js-scan-coverage(sw.js). Tool erred OVER + UNDER + COVERAGE — all corrected. More trustworthy each time.
- **3 stub-creation rounds caught by tester's FULL SCAN** (130, 322, 145 sourceless stubs deleted). 86 real Impls remain.
- Object.verb skill pattern (Chain/Velocity typed classes + how-to-write-skills.md).

## HARD-WON RULES (learnings.md — read #1 first, then these)
- #1 ALL DILIGENCE NOTHING URGENT. #53/#65 NEVER /compact — agent-trainer REWIND. #85 never blind-Enter (stale buffer). #86 never idle team on QA/deferred-Q. #88 SAMPLED-real≠validated, FULL-SCAN the population. #89b reconcile conflicting measures (don't blind-defer); don't run parallel scans — fix the canonical tool. Surface-don't-swallow errors (silent catch{} hid 3 bugs: chat undeclared-room, file-restore stderr-not-TUI, fs/fsSync). Verify before trusting ANY claim (premature "complete" caught repeatedly). DON'T BYPASS the tool when data looks right — FIX the tool.
- Dual context-health watch (PO+SM, SM per-tick primary). Expert hit 0% → clean agent-trainer rewind (verified reset <30% before re-dispatch).

## NEXT ACTIONS
1. Drive expert's ~94 real-Impl-creates (full-scan-verify each #88) + tester's ~78 Tests → climb 12→34 (25%).
2. Verify EVERY climb via guarded-tool deterministic 3x + full-scan; SM independently re-verifies; report convergence.
3. Flag SM/Tron on: 25% milestone, deliverable green, count climb, worker idle, context warning.
4. New Tron requirements → req for literal capture; build full-champagne-from-start (no retrofit).
