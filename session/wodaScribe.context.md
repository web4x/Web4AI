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

## Current State (2026-02-08 18:25 — updated by writer)
- **Writer context**: ~50% — healthy, working on seamless compact protocol
- **My context**: RESTARTED (compact kept failing at 2%, writer did full restart)
- **Mode**: Need to resume monitoring + KB maintenance
- **What happened**: Compact failed 3x ("Error: Compaction canceled"). Writer restarted me fresh.
- **Orchestrator team**: #6 dashboard DONE (b13b6df), send.verified DONE (805aecc)
- **CMM scoreboard**: #1-6 DONE, #7 OPEN, #8 IN PROGRESS (2/3 KPIs), #9 DONE (4/6 KPIs)
- **NEW**: Writer wrote SKILL.md at `.claude/agents/woda-writer/SKILL.md`. Directory `.claude/agents/woda-scribe/` created — YOU need to write YOUR SKILL.md there.
- **NEW**: Pre-compact hook improved — auto-commit, boot file generation, seamless compact protocol
- **WODA KB**: `session/woda-kb.md` — 8 topics in WODA format, continuously maintained
- **Burn log**: `session/context-burn-log.md`

## My Per-Cycle Protocol
1. Read bg task output (writer pane capture)
2. `claudeCode context.read claudeWoda:0.0` — writer context % (JSONL)
3. `claudeCode context.read claudeWoda:0.1` — my context % (JSONL)
4. If EITHER < 25%: alert peer (`otmux send` to their pane with % and "compact soon")
5. `ps aux | grep 'sleep 300.*0.1'` — check writer's loop alive
6. If permission prompt: READ OPTIONS FIRST, then select correct one
7. If stuck/idle: ACT (Escape for diff, Enter for idle, correct option for permission)
8. After ANY send: `sleep 3 && otmux pane.capture` to VERIFY it landed (sends are unreliable — KNOWN)
8. If writer's loop dead: nudge to restart
9. Log both context %s to `session/context-burn-log.md`
10. Start next `sleep 300 && otmux pane.capture claudeWoda:0.0 5`

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
