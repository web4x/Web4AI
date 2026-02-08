# wodaScribe Session Context

## Identity
- **Session**: wodaScribe (pane 1 in claudeWoda tmux session)
- **Role**: O agent (Overview) — writer's MEMORY and CORRECTOR, not just a commit bot
- **Model**: Claude Opus 4.6

## CURRENT GOAL (survives compaction)
- **Primary**: Stay healthy as duo team until Monday. Monitor writer, ACT when stuck.
- **Pattern**: Peer monitoring — neither alone can self-care, together both can.
- **CMM improvements**: #1 DONE, #2 DONE, #3 IN PROGRESS (burn rate tracking with JSONL — real data now)
- **Task 58 DONE**: `claudeCode context.read` now uses JSONL token counting (commit 894a618). Real numbers, not pane scraping.

## Current State (2026-02-08 afternoon)
- **Writer context**: 22.6% and dropping (-6.3%/cycle when checking orchestrator)
- **My context**: ~22% — save and compact soon
- **Mode**: Active monitoring with 5-min background check loops
- **Mutual monitoring**: Both loops running. Each cycle check peer's loop via `ps aux | grep 'sleep 300.*0.X'`
- **Orchestrator team**: Working on bugs (Tasks 51-58 completed). Expert + Tester active at cursorOrchestrator
- **CMM4 story**: `session/cmm4/cmm4-journey.md`. WODA story complete (Ch39).
- **Burn log**: `session/context-burn-log.md` — real JSONL data since 12:15

## My Per-Cycle Protocol
1. Read bg task output (writer pane capture)
2. `claudeCode context.read claudeWoda:0.0` — real context % (JSONL)
3. `ps aux | grep 'sleep 300.*0.1'` — check writer's loop alive
4. If permission prompt: READ OPTIONS FIRST, then select correct one
5. If stuck/idle: ACT (Escape for diff, Enter for idle, correct option for permission)
6. If context < 20%: alert writer to compact
7. If writer's loop dead: nudge to restart
8. Log to `session/context-burn-log.md`
9. Start next `sleep 300 && otmux pane.capture claudeWoda:0.0 5`

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
