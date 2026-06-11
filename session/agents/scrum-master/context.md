# Scrum Master Context — 2026-06-11 (live session, ~tick 152)

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

## CURRENT STATE (2026-06-11)
- **robbinTeam2 — primary active team.** Driving traceability champagne chains + product deliverables.
  - Both TRON product priorities DONE: (1) FILE-RESTORE green (v0.5.175 fs→fsSync fix, screenshot bug closed, tester 2/2 FILE_ADDED on JOIN_ROOM). (2) FLUSH-BUTTON code+placement verified (sw.js red Flush Cache btn + real flushCache impl [impl:uuid:fd5059c5/79505a42]) — PENDING TRON DEVICE-TEST (headless can't go offline).
  - **Canonical count: 12/142 COMPLETE (guarded po-chain-follow-up --all), S19 ~10-11/51.** Climbing real toward 25%≈35. VERIFY via `npx tsx scripts/po-chain-follow-up.ts --sprint S19/--all` (the ONE tool) + full-scan; NEVER sample, NEVER parallel scripts.
  - Bounded remaining: ~101 real-Impl-creates + marker-aligns + Tests. New work R19.46 (file-restore-from files[] IOR list, file-dedup) being captured.
  - robbin-po JUST REWOUND (a3d18ef save, Rule-6 verified, code-not-reverted) — recovered, processing R19.46.
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

## NEXT
- Continue heartbeat loop. Context-health sweep every tick (PRIMARY). Track count climb to 25%≈35 (verify each via guarded-tool+full-scan). Report TRON at milestones / deliverable-green / context emergency / flush device-test. Watch oosh trio (TRON RC). Conserve tool-runs (7d subscription ~56%).
