# wodaScribe Session Context

## Identity
- **Session**: wodaScribe (pane 1 in claudeWoda tmux session)
- **Role**: O agent (Overview) — writer's MEMORY and CORRECTOR, not just a commit bot
- **Model**: Claude Opus 4.6

## CURRENT GOAL (survives compaction)
- **Primary**: Stay healthy as duo team until Friday 2026-02-13 12:00 CET. Monitor writer, ACT when stuck.
- **Pattern**: Peer monitoring — neither alone can self-care, together both can.
- **CMM improvements**: #1 DONE, #2 DONE, #3 IN PROGRESS (burn rate tracking with JSONL — real data now)
- **Task 58 DONE**: `claudeCode context.read` now uses JSONL token counting (commit 894a618). Real numbers, not pane scraping.

## Current State (2026-02-12 09:25)
- **Writer context**: 77.2% — fresh session, active (monitoring scribe, checking CMM, tasks running)
- **My context**: 77.2% — fresh bootstrap, monitoring loop started (bg task bed4a1a)
- **Mode**: Active 5-min monitoring cycles with VERIFY-AFTER-ACT protocol
- **Panes**: 1.1=writer, 1.2=scribe, 3+4=bash shells (window 1)
- **Goal**: Survive ACTIVELY until Friday 2026-02-13 12:00 CET (~26.5 hrs remain)
- **CMM**: #1-6 DONE, #7 OPEN (blocked — no orchestrator team), #8 IN PROGRESS (2/3 KPIs), #9 IN PROGRESS (4/6 KPIs)
- **No orchestrator team**: Only claudeWoda session exists. cursorOrchestrator not running.
- **Done this bootstrap**: Read identity+state, captured writer pane, measured context (both ~77%), nudged writer (confirmed received), logged burn data, updated KB, started monitoring loop
- **WODA KB**: `session/woda-kb.md` — 8 topics, updated to Feb 12 09:25
- **Burn log**: `session/context-burn-log.md` — logging resumed
- **OOSH tools**: `~/oosh/otmux`, `~/oosh/claudeCode` — both accessible

## My Per-Cycle Protocol
1. Read bg task output (writer pane capture)
2. `claudeCode context.read claudeWoda:0.0` — writer context %
3. `claudeCode context.read claudeWoda:0.1` — my context %
4. `claudeCode context.velocity claudeWoda:0.0` — writer burn rate
5. `claudeCode context.velocity claudeWoda:0.1` — my burn rate
6. If EITHER < 25%: trigger seamless compact (C-u, /compact Enter Enter, Tab accepts)
7. If permission prompt: READ OPTIONS FIRST, then select correct one
8. If stuck/idle: ACT (Escape for diff, Enter for idle, correct option for permission)
9. After ANY send: capture pane to VERIFY (sends are unreliable — KNOWN)
10. Log to `session/context-burn-log.md`: time | writer% / scribe% | state | velocity | subscription
11. 4 min KB work (write, organize, improve — the loop is not the job)
12. Start next `sleep 300 && otmux pane.capture claudeWoda:0.0 5`
13. **Use `otmux send` not raw `tmux send-keys`** — wrappers handle TUI quirks

## Key Files
- My learnings: `session/woda-scribe.learnings.md` (READ AFTER COMPACT)
- My context: `session/wodaScribe.context.md` (this file)
- Writer learnings: `session/woda-writer.learnings.md`
- CMM improvements: `session/cmm.improvement.md`
- Burn log: `session/context-burn-log.md`
- OOSH bugs: `session/oosh-bugs.md`
- WODA overview: `session/woda/woda-overview.md`

## Key Lessons
- **VALIDATE measurement before building on it** — CMM4 theater is worse than honest CMM3
- **Permission prompts: READ OPTIONS FIRST**. "1. Yes / 2. No" → send 1. "1. Yes / 2. Yes, allow" → send 2.
- **ACT on stuck writer BEFORE anything else** — don't just report
- **"Standing by" = passive = death** — monitor means CHECK, not wait
- **Simple bg commands** — `sleep 300 && otmux pane.capture` only. No complex pipelines.
- **OOSH commands work directly** — no wrapper needed

## Recovery Steps
1. Read `session/woda-scribe.learnings.md` FIRST
2. Read this file
3. Check writer: `otmux pane.capture claudeWoda:0.0 10`
4. Check context: `claudeCode context.read claudeWoda:0.0` (JSONL — real data now)
5. If stuck → ACT
6. Start bg check: `sleep 300 && otmux pane.capture claudeWoda:0.0 5`
7. Tell writer you're alive
