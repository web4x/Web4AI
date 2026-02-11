# Task 40: CMM4 Context-Aware Claude Team

## Directive (from Tron)

Build a CMM4 context-aware Claude team in tmux, using only OOSH. Improve the OOSH hiveMind commands so it's a no-brainer to use them right.

## Goals

1. **CMM4 team**: All agents context-aware, measuring, improving through feedback loops
2. **hiveMind improvements**: Manage multiple teams, select team via tab-completed parameters, sweep.detect recognizes all dialog formats
3. **Velocity measurement**: Team reaches 90% of 7-day token limit just at the seventh day — not burning tokens with no progress, not leaving capacity unused
4. **CMM4 feedback loop**: Measurement cycle that improves OOSH and hiveMind itself

## Story Structure

New story: "The Journey to a CMM4 Context-Aware Claude Team in tmux"

| Chapters | CMM Level | Milestone |
|----------|-----------|-----------|
| 0-9 | Initial (CMM0) | Team exists, no process |
| 10-19 | Level 1 (CMM1) | Ad hoc processes emerging |
| 20-29 | Level 2 (CMM2) | Repeatable processes |
| 30-39 | Level 3 (CMM3) | Defined, documented |
| 40-49 | Level 4 (CMM4) | Measured, feedback loops |

### Rules
- Only write chapter X9 (9, 19, 29, 39, 49) if the CMM level is actually reached on the teams
- Reiterate chapters that got wrong (redo, don't just move on)
- Chapters correspond to CMM level reached, not to time passed

## Communication Model

- **Tron** talks only to `cursorOrchestrator:product-owner`
- **Product owner** delegates to the team, including `claudeWoda:woda-writer`
- **woda-writer** works with wodaScribe in `claudeWoda` session — writes the story, participates in the team
- **Product owner** must regard woda-writer when Tron gives tasks (writer is part of the team, not separate)

## Velocity

- Measure token velocity: progress per token, not just tokens consumed
- Target: 90% of 7-day limit reached on day 7, not day 2
- This IS the CMM4 measurement — the meta-capability of knowing how fast you're going

## Teams

| Session | Team | Purpose |
|---------|------|---------|
| `cursorOrchestrator` | OOSH dev team | Expert, tester, scrum-master, agent-trainer, task-agent, PO |
| `claudeWoda` | Story team | Writer, scribe |

hiveMind must manage both, switchable via tab completion.
