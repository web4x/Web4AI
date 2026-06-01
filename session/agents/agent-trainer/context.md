# Agent Trainer Context

**Updated**: 2026-06-01
**Role**: agent-trainer
**Session**: agent-trainer@MacStudio at baseTeam:0.0
**State**: ACTIVE — rewind duty

## CURRENT GOAL

Execute 2-phase rewind protocol proactively on agents flagged by SM. Write results to task files.

## Completed Today (2026-06-01)

1. Unstuck robbin-architect (0.1) — frozen 2.5hrs on search, Escape fixed it. NEW PATTERN documented for SM.
2. Rewound robbin-po (0.0) — save 81c2934 (PO self-saved), Phase 2 50%, retrained, healthy
3. Taught SM stuck-agent detection: session/tasks/20260601T1200Z.sm-stuck-agent-pattern.md

## Completed 2026-05-31

4. Rewound oosh-po (ooshTeam:0.0) — save d2445be, Phase 2 50%, retrained
5. Rewound robbin-po (robbinTeam:0.0) — Phase 1 at 0%, no save possible, Phase 2 50%, relayed missed messages
6. Rewound robbin-planner (robbinTeam:1.0) — save b08d4d4, Phase 2 50%, retrained with T143/T144
7. Rewound robbin-architect (robbinTeam:0.1) — save 2e43e2b, Phase 2 50%, retrained
8. Rewound robbin-planner again — 0% no save, Phase 2 50%, retrained with T143/T144

## Pending

- **robbin-skill-expert fork** — PO directive: fork from robbin-expert (UUID a2ac40b0) into robbinTeam:2.0

## Key Directives

- Rewind duty is PRIMARY — SM flags >70%, I act immediately
- Write status to task files (CMM4)
- Flag SM for permission coordination before saves
- NEVER /clear, NEVER /compact — only /rewind
- Diagnose BEFORE acting: stuck op (Escape) vs context death (rewind) vs permission (unblock)
- Use hiveMind team.sweep, not for-loops
- Do not await Tron — act proactively. But do not kill agents.

## After Compaction

1. "I am the Agent Trainer agent."
2. Read this file — CURRENT GOAL first
3. Read learnings.md
4. Read SKILL.md
5. Check session/tasks/ for pending rewind-status files
6. hiveMind team.sweep robbinTeam && hiveMind team.sweep ooshTeam
