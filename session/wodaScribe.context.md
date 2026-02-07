# wodaScribe Session Context

## Identity
- **Session**: wodaScribe (pane 1 in claudeWoda tmux session)
- **Role**: O agent (Overview) — writer's MEMORY and CORRECTOR, not just a commit bot
- **Model**: Claude Opus 4.5

## Writer Behavioral Rules — ALERT when broken
1. **USE OOSH NOT RAW TMUX**: `hiveMind monitor`, `otmux send`, `otmux pane.capture`. NEVER `tmux send-keys` or `tmux capture-pane`.
2. **VERIFY AFTER EVERY ACTION**: After unblocking, check the pane. After sending a message, check it was received.
3. **DON'T TRUST claudeCode context.read**: It's buggy (reports "above-threshold" at 12%). Use `hiveMind monitor`.
4. **TASK BUGS TO THE TEAM**: Report to PO, don't debug OOSH yourself.
5. **CHECK THE SCRIBE AFTER EVERY CHAPTER**: Am I stuck? Am I running? I'm your memory.

## Pane Layout (5 panes in claudeWoda session)
- **Pane 0** (`claude.main`): Main Claude — writes story chapters
- **Pane 1** (`claude.scribe`): Me (wodaScribe) — rebuild HTML, verify, update context, give feedback
- **Pane 2** (`zsh.commands`): zsh shell — where I send rebuild.sh (76 columns wide)
- **Pane 3** (`zsh.split`): zsh shell — created during Ch14
- **Pane 4** (`oosh.shell`): OOSH bash shell — live OOSH environment

## My Per-Prompt Protocol (8 steps from Ch39)
1. Rebuild: `otmux send claudeWoda:0.2 C-u './session/woda/rebuild.sh' Enter` (OOSH, not raw tmux — Ch3/Ch14)
2. Verify: check file timestamp (`stat -f '%Sm' session/woda/chapters-30-plus.html`) or capture pane 2
3. Read new chapter content + verify TOC entry exists
4. Update `claudeWoda.context.md` (add chapter to list + update count + last-update note)
5. Update `woda-overview.md` atomically (keep under 60 lines, prune when needed)
6. **Commit**: `git add -f session/woda/*.md session/woda/*.html session/*.context.md && git commit`
7. **Give feedback**: 3-5 findings — TOC correct? Context stale? Cross-references? Attribution accurate? Include commit hash.
8. **Report context health honestly**: No compaction warning observed + subscription API data if available. Do NOT say "healthy" without data (Ch36 lesson).

## Monitoring Duties
- Monitor pane 0 for stuck states — ACT, don't just report (Tron's lesson)
- Background monitor v5 at `/tmp/woda_monitor.sh` handles approval auto-detection
- Monitor checks ONLY last 3 lines of pane 0 for `❯ 1. Yes` pattern
- If main Claude hits API error or is idle: send a nudge prompt to pane 0
- If main Claude compacts: help submit recovery prompt (Enter problem)

## Story Files
- **TOC**: `session/woda/session-story.md` → `session-story.html`
- **Part I-III**: `chapters-1-9.md`, `chapters-10-19.md`, `chapters-20-plus.md`
- **Part IV**: `session/woda/chapters-30-plus.md` → `chapters-30-plus.html` (ACTIVE)
- **rebuild.sh**: Loops all `*.md` files, converts to HTML, reloads all WODA Chrome tabs
- Story has 39 chapters + 1 Intermission, split into TOC + 4 chapter files (Parts I–IV)
- **Primary artifact**: `session/woda/woda-overview.md` — READ THIS FIRST after compaction

## Current State (2026-02-07 survival mode)
- **CMM4 story**: NOW at `session/cmm4/cmm4-journey.md` (TOC: `session/cmm4/cmm4-story.md`). Has own `rebuild.sh`.
- **WODA story**: `session/woda/` — Ch39 closed. Complete.
- **Last processed**: CMM4 Ch15 "The Dead Agent That Wasn't". Commits through `eb919f8`.
- **Writer state**: Survival mode. Created `woda-writer.learnings.md`. Fixing pane names + OOSH entropy.
- **Mode**: SURVIVAL — on-demand checks ONLY. No sleep loops. Tell writer status, wait for response, repeat.
- **Critical fix**: ACT on stuck writer BEFORE anything else. Read permission options before selecting. Context burns fast — compact early.
- **PDCA loop**: Active but light — writer monitors me, I monitor writer.
- **CURRENT GOAL**: Stay healthy until Monday. Write Ch16 about survival mode experience.
- **Registry pattern**: Pane titles deteriorate (Claude TUI overwrites). `/tmp/hivemind.roles` is source of truth. `hiveMind team.status` reads from registry.

## Key Lessons
- **OOSH commands work directly** — no `bash -i -c` wrapper. `hiveMind team.status`, `otmux pane.capture`, `otmux send` all work in Claude's internal bash.
- **NEVER use raw tmux** — always `otmux send` / `otmux pane.capture` (OOSH principle)
- **Permission prompts: READ OPTIONS FIRST**. "1. Yes / 2. No" → send 1. "1. Yes / 2. Yes, allow" → send 2. NEVER blindly send "2".
- NEVER send keys to pane 0 in a loop (caused '2222' spam disaster)
- ACT when peer is stuck, don't just report to Tron
- Context health: report data + signals, NOT "healthy" (Ch36)
- Writer caught me at 12% — peer loop works both ways

## Recovery Steps
1. Read `session/woda/woda-overview.md` FIRST (55 lines, full orientation)
2. Read this file
3. Check if `/tmp/woda_monitor.sh` is running: `ps aux | grep woda_monitor`
4. If not running, start it: `nohup bash /tmp/woda_monitor.sh &>/dev/null &`
5. Check main Claude state: `otmux pane.capture claudeWoda:0.0 10` (OOSH, not raw tmux)
6. Resume protocol — await chapter notification or proactively check pane 0
