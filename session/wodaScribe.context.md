# wodaScribe Session Context

## Identity
- **Session**: wodaScribe (pane 1 in claudeWoda tmux session)
- **Role**: O agent (Overview) for main Claude (claudeWodaSession, pane 0)
- **Model**: Claude Opus 4.5

## Pane Layout (5 panes in claudeWoda session)
- **Pane 0** (`claude.main`): Main Claude — writes story chapters
- **Pane 1** (`claude.scribe`): Me (wodaScribe) — rebuild HTML, verify, update context, give feedback
- **Pane 2** (`zsh.commands`): zsh shell — where I send rebuild.sh (76 columns wide)
- **Pane 3** (`zsh.split`): zsh shell — created during Ch14
- **Pane 4** (`oosh.shell`): OOSH bash shell — live OOSH environment

## My Per-Prompt Protocol (8 steps from Ch39)
1. Rebuild: `tmux send-keys -t claudeWoda:0.2 C-u './session/woda/rebuild.sh' Enter`
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

## Current State
- **Ch39 CLOSED**: Seven corrections in one chapter. PDCA loop ran live — writing and doing merged. Commit `8c83eae` (14 files, 4814 insertions). Tron: "goal nearly achieved."
- **Main Claude state**: Writer wrapping up. Above-threshold. Loop gracefully stopping.
- **Monitor**: Running (PID 52752, may change)
- **Overview at**: 59 lines (limit 60). No update needed for Ch39 — core lesson unchanged.
- **CURRENT GOAL**: WODA PDCA until team context-aware. Status: NEARLY ACHIEVED — loop proved, all criteria verified across 2 compactions, gracefully stopped by Tron.
- **Git**: Story files now tracked. First commit `8c83eae`. Protocol updated to 8 steps (commit added as step 6).

## Key Lessons
- NEVER send keys to pane 0 in a loop (caused '2222' spam disaster)
- Enter problem: send-keys Enter doesn't reliably submit in TUI
- ACT when peer is stuck, don't just report to Tron
- `bash -i` gives OOSH access from internal Bash (no pane 4 transport needed)
- Mutual PDCA: writer ↔ scribe feedback every chapter (started Ch32)
- Context health: report data (subscription API) + signals (no compaction warning), NOT "healthy"

## Recovery Steps
1. Read `session/woda/woda-overview.md` FIRST (55 lines, full orientation)
2. Read this file
3. Check if `/tmp/woda_monitor.sh` is running: `ps aux | grep woda_monitor`
4. If not running, start it: `nohup bash /tmp/woda_monitor.sh &>/dev/null &`
5. Check main Claude state: `tmux capture-pane -t claudeWoda:0.0 -p -S -10`
6. Resume protocol — await chapter notification or proactively check pane 0
