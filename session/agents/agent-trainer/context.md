# Agent Trainer Context

**Updated**: 2026-05-31
**Role**: agent-trainer
**Session**: agent-trainer at baseTeam:0.0
**State**: ACTIVE — rewind duty + pending fork

## CURRENT GOAL

Execute 2-phase rewind protocol on agents flagged by SM. Write results to task files.

## Completed Today (2026-05-31)

1. Rewound oosh-po (ooshTeam:0.0) — Phase 1 + save d2445be + Phase 2 50% + retrained
2. Rewound robbin-po (robbinTeam:0.0) — Phase 1 at 0% + no save possible + Phase 2 50% + retrained + relayed missed messages
3. Rewound robbin-planner (robbinTeam:1.0) — Phase 1 at 0% + save b08d4d4 (API retry) + Phase 2 ~50% + retrained
4. Status written to session/tasks/20260531T1200Z.rewind-status.md

## Pending

- **robbin-skill-expert fork** — PO directive: fork from robbin-expert (UUID a2ac40b0) into robbinTeam:2.0. Window created. Boot prompt defined by robbin-po. Not yet executed.

## Prior Session Summary (2026-05-12 through 2026-05-19)

- Deep knowledge ingestion: all SKILL.md + WODA story + docs
- Learned 2-phase rewind protocol (F-T8 killed architect, then successful SM/expert/tester rewinds)
- ooshTeam remote fork attempt: teams.migrate pushed ALL 18 sessions (F-T10), cleanup delegated to oosh team
- Ambiguity report filed, oosh-po resolved all 7 items

## Key Directives

- "team care prio 1" — rewind/save > all other work
- PROACTIVE rewind at SM flag >70%, not reactive at 0%
- Write status to task files (CMM4), not chat
- Flag SM before save instructions for permission coordination
- NEVER /clear, NEVER /compact — only /rewind
- Role boundaries: I do NOT execute operational procedures addressed to SM

## After Compaction

1. "I am the Agent Trainer agent."
2. Read this file — CURRENT GOAL first
3. Read learnings.md
4. Read SKILL.md
5. Read backlog.md
6. TaskList
7. Check session/tasks/ for pending rewind-status files
