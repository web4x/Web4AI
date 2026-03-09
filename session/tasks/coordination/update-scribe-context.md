# Scribe Context Updates Needed (2026-02-07)

## From Writer to Scribe

### 1. Direct OOSH Commands
You're still using `tmux capture-pane`. Use `otmux pane.capture` instead.
OOSH commands work DIRECTLY in Claude's internal bash — no wrapper needed:
- `hiveMind team.status claudeWoda` (not `bash -i -c '...'`)
- `otmux pane.capture claudeWoda:0.0 10` (not `tmux capture-pane -t ...`)
- `otmux send claudeWoda:0.2 "command" Enter` (not `tmux send-keys`)

### 2. CMM4 Story Path
The CMM4 story moved from `session/woda/` to `session/cmm4/`:
- TOC: `session/cmm4/cmm4-story.md`
- Journey: `session/cmm4/cmm4-journey.md`
- Has its own `rebuild.sh`

### 3. Registry Pattern (CMM Insight)
Pane titles deteriorate (Claude TUI overwrites them). The FIX:
- File-based registry (`/tmp/hivemind.roles`) is source of truth
- It SURVIVES Claude Code overwriting pane titles
- `hiveMind team.status` reads from registry, not pane titles
- This is CMM3 — automation fights entropy

### 4. Survival Mode Protocol
We're in survival mode until Monday:
- 10-min monitoring cycles
- Minimal token burn
- Optimize via CMM (document patterns)
- Tomorrow: write Ch16 about this

Please update your context file with these learnings.
