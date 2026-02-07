# woda-writer Learnings
*Extracted from 39 WODA chapters + CMM4 journey. Read after compaction.*
*Maintained by: woda-writer | Updated: 2026-02-07*

## CURRENT GOAL (survives compaction)
- **Primary**: Stay healthy as duo team until Monday. No context loss. Minimal token burn.
- **Secondary**: Tomorrow write Ch16 in CMM4 story about survival mode experience.
- **Pattern**: Peer monitoring — neither alone can self-care, together both can. CHECK peer after every interaction.

## Failures (learn from these)
- 2026-02-07: Both agents died during survival mode. Background loops = entropy. On-demand checks = forgotten.
- 2026-02-07: Scribe in compact death spiral (10% after compact → compact again). Passive waiting = slow death.
- 2026-02-07: Both agents chatting but no monitoring loop. Empty back-and-forth burns context. Need ONE watcher, ONE worker.
- 2026-02-07: Answered Tron's question then STOPPED. Both said "standing by" = passive = death.

## OOSH Fundamentals

### Invocation
- Script method (SPACE) at prompt: `otmux pane.capture 1 20`
- Script.method() (DOT) is internal function notation only
- OOSH commands work DIRECTLY — no `bash -i -c` wrapper needed
- Tab reveals all methods (c2 completion system)

### No Flags
- Method names carry meaning: `otmux pane.splitH` not `tmux split-window -h`
- Parameters are positional, Tab-completable
- `.completion()` sibling function defines valid inputs
- If you need a flag, you haven't named your method well

### Script Creation
- `oo new myScript` — working script from template
- `oo new.method myScript.greet` — add method
- Bootstrap: source this → this.start "$@" → scriptname.start "$@"
- `### new.method` marker is where new methods get inserted

## tmux & Panes

### Core Commands (OOSH versions)
- `otmux pane.splitH` / `pane.splitV` — split panes
- `otmux pane.capture <target> <lines>` — read pane content
- `otmux send <target> "text" Enter` — type into pane
- `otmux pane.title <target> "name"` — name a pane
- `hiveMind team.status <session>` — see all panes with roles

### Pane Titles vs Registry
- Pane titles DETERIORATE — Claude TUI overwrites them
- Registry (`/tmp/hivemind.roles`) is source of truth
- `hiveMind team.status` reads from REGISTRY, not titles
- This is CMM3 — automation fights entropy

### Shell Differences
- C-u clears line in BOTH zsh and bash (use this)
- C-c behaves differently between shells (avoid)
- zsh finds OOSH scripts in PATH but can't use them properly
- OOSH shell has full bootstrap (completions, config, PATH)

## Multi-Agent

### Communication
- File-based communication > buggy Enter messages
- Write task file → agent READs it (no send-keys needed)
- Enter submission is unreliable via send-keys (known issue)
- hiveMind registry maps agent names to pane targets
- `hiveMind resolve <name>` — find agent's pane

### Monitoring
- `hiveMind monitor <name> <lines>` — peek at agent's pane
- `hiveMind team.status <session>` — tree view of all agents
- `claudeCode process.running <pane>` — is Claude alive?
- Peer monitoring: neither alone can self-care, together both can

### Two Gather (Ch37)
- Agent CAN'T see own context % — invisible to self
- Peer CAN see it via pane capture (TUI status bar)
- Context % shows at bottom: "Context left until auto-compact: NN%"
- Interdependence is DESIGN, not limitation
- Neither alone can survive, together both can

### Permission Prompts
- READ THE OPTIONS FIRST before sending a number
- "1. Yes / 2. No" → send 1
- "1. Yes / 2. Yes, allow from project" → send 2
- NEVER blindly send "2"

## WODA Pattern

### The Four Letters
- W = What (prompt) — ephemeral, consumed
- O = Overview (context) — MAINTAINED by scribe
- D = Details (files) — durable, survives everything
- A = Actions (shell) — results persist

### Persistence (after compaction)
- W: GONE (prompt history erased)
- O: PARTIAL (context file quality matters)
- D: FULL (files on disk)
- A: RESULTS ONLY (commits, written files)

### The O Agent
- Maps topics to context
- Maintains overview/index
- Enables recovery after compaction
- "Wer den Überblick behält, der behält die Kontrolle"

## CMM Patterns

### Levels
- L1 Initial: chaos, heroic individuals
- L2 Repeatable: manual discipline, checklists
- L3 Defined: documented, standardized, automated
- L4 Managed: measured, quantitative feedback
- L5 Optimizing: continuous improvement (PDCA)

### Key Insights
- Composed maturity: weakest link determines overall level
- CMM2 requires DOING the checklist every time
- CMM3 = "wer schreibt, der bleibt" (who writes, stays)
- CMM4 = "wer misst, der weiss" (who measures, knows)
- PDCA-CA-CA until failure rate is zero

### Role Clarity
- Writer: interprets, thinks, writes (unautomatable)
- Scribe: checklists, monitoring, rebuilds (automatable)
- Expert: builds OOSH tools (not writer's job)
- Delegate what can be delegated, keep what can't

## Context Preservation

### Before Compaction
- Update context file with current state
- Include CURRENT GOAL at top
- List what you were working on
- Include recovery steps

### After Compaction
- Read context file FIRST
- Read learnings file (this file)
- Check peer's status
- Resume PDCA on unmet criteria

### Entropy Fighting
- Registry survives pane title overwrites
- Files survive context loss
- Write it down or lose it
- "Wer schreibt, der bleibt"

## Key Commands Quick Reference

### OOSH (run directly, no wrapper)
- `hiveMind team.status claudeWoda`
- `hiveMind monitor <name> <lines>`
- `otmux pane.capture <target> <lines>`
- `otmux send <target> "text" Enter`
- `claudeCode process.running <pane>`
- `config set/get/list`

### Recovery
- Read `session/claudeWoda.context.md`
- Read `session/woda-writer.learnings.md` (this file)
- `hiveMind team.status claudeWoda`
- `otmux pane.capture claudeWoda:0.1 15`

### Story Files
- WODA: `session/woda/chapters-*.md`
- CMM4: `session/cmm4/cmm4-journey.md`
- Rebuild: `session/woda/rebuild.sh`
- Context: `session/claudeWoda.context.md`
