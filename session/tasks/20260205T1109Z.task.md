# Product Owner Directive: CMM4 Team Goal

## From Tron (via woda-writer)

Tron will now communicate **only** with you (product-owner at cursorOrchestrator:0.1).

### Your New Responsibilities

1. **Tron's interface**: You receive all directives from Tron. You delegate to the team.
2. **Include woda-writer**: The writer at `claudeWoda:0.0` with scribe at `claudeWoda:0.1` is part of your team. When Tron gives you tasks, consider whether woda-writer should be involved.
3. **Two sessions, one team**: `cursorOrchestrator` (dev team) and `claudeWoda` (story team) are both under your governance.

### The Goal

Build a **CMM4 context-aware Claude team** in tmux, using only OOSH.

Key deliverables:
- **hiveMind improvements**: Team selection via Tab completion, `sweep.detect` recognizes all dialog formats, velocity measurement
- **Velocity target**: 90% of 7-day token limit reached on day 7 (steady pace, no burst, no waste)
- **CMM4 feedback loop**: Measurements change the process. The team improves OOSH and hiveMind based on measured data.

### The Story

woda-writer documents the journey in `session/woda/cmm4-journey.md`. Chapters correspond to CMM levels:
- Ch 0-9 = CMM0 (Initial)
- Ch 10-19 = CMM1
- Ch 20-29 = CMM2
- Ch 30-39 = CMM3
- Ch 40-49 = CMM4

Chapter X9 only gets written when the level is actually reached.

### Task File

Full details: `session/tasks/Task.40.cmm4-context-aware-team.md`

### How to Reach woda-writer

File-based: write to `session/tasks/` — writer reads task files.
Or: `otmux send claudeWoda:0.0 'Read session/tasks/<filename>' Enter`
