# oosh-architect Context

**Updated**: 2026-04-30 12:20
**Role**: oosh-architect
**Pane**: ooshTeam:0.1 (forked from oosh-po aca3405a)
**Session**: oosh-architect

## What I Delivered

### 4 PlantUML Diagrams
Location: `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/diagrams/`

1. **mvc-pane-lifecycle.puml** — Sequence diagram: broken vs correct MVC flow for pane operations. Shows 3 things that break on swap (registry, titles, HIVEMIND_ROLE env).
2. **claudeCode-usecases.puml** — Model layer: 68 methods, session/context/process groups, 14 View leaks flagged.
3. **otmux-usecases.puml** — View layer: pane/send/layout groups, 7 B5 bugs highlighted.
4. **hiveMind-usecases.puml** — Controller layer: 196 otmux + 34 claudeCode cross-layer calls, protected observer pattern.

All use cases fully qualified with script prefix (claudeCode.session.current, otmux.pane.swap, hiveMind.resolve).

### Bugs Found During Fork
- otmux split.h shifts ALL pane indices — registry stale
- hiveMind resolve returns wrong pane after split (live discovery race)
- pane.swap doesn't update registry, titles, or HIVEMIND_ROLE env
- claudeCode session.id method missing (command not found)

### Key Architecture Findings
- otmux calls hiveMind in only 2 places (session.renamed + tree display)
- Zero notifications for pane mutations (split/swap/move/join/kill)
- Observer pattern exists: protected.session.renamed — needs 3 new protected methods
- Model (claudeCode) unaffected by pane changes — sessions bind to TTYs not indices

## Sprint 0 Task B5.3 — DONE
Diagram delivered, Tron review feedback applied (fully qualified names).

## RULES (eternal)
- Fully qualified OOSH naming: object.verb everywhere
- Read actual scripts, don't assume method names
- Queue incoming messages with TaskCreate, finish current task first
