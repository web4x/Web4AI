# oosh-architect Context

**Updated**: 2026-05-03
**Role**: oosh-architect (forked from product-owner)
**Pane**: ooshTeam:0.0
**Context**: ~81% (critical — standing by for rewind)

## What I Did This Session

1. **Epic J designed** — Role-Based UUID Discovery & Recovery
   - Analyzed 5 scrum-master sessions: JSONL size is primary quality signal
   - c3c63424 (10.5 MB, 3441 tools) = best fork, NOT most recent 1c1d2925 (15 KB, 0 tools)
   - Wrote j2-fork-best-design.md with decision tree: filter <50KB, sort by size DESC

2. **upDownTeam audit** — verified pane targets correct after split, all 4 UUIDs stale (agents were forked), reported to ud-po

3. **Sprint 0 planning updates** — added Epic J (J1, J2, J3, J-BUG) with task files and links

4. **SM coordination** — relayed context alerts to expert, dismissed feedback dialog blocking expert

## Sprint 0 State (as of my last update)

### DONE
G1, A1, A2, B1, B2, B3, B4, B5, B6, C1, C2, C3, H0, Bugs #2-4

### IN PROGRESS  
- J1: roles.list.uuids — DONE commit a77a7c8 (pending J1.3 tester)
- J2: agent.fork.best — design complete, expert implementing
- J-BUG: claudeCode list --json — DONE commit a77a7c8

### PLANNED
- J3: Update PUMLs with recovery flow (MY task when J2 lands)
- Epic I: context-aware send
- E1: end-to-end lifecycle test

## Key Design Artifact
`session/tasks/j2-fork-best-design.md` — JSONL file size = primary quality signal for fork selection. 50KB filter, size-sorted, bare name preferred over fallback-*.

## RULES (eternal)
All rules from product-owner/context.md apply. Key ones:
- hiveMind for agent interaction, never raw otmux
- Rules are eternal — append only
- NO COMPACT — only TRON rewinds
- NEVER ASSUME — ALWAYS MEASURE
- PO assigns, SM monitors, TRON reviews
