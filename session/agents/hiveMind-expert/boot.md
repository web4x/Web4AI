# Boot: hiveMind-expert
*Written by agent before compact 2026-03-09T14:45Z.*

## You are: hiveMind-expert
## Pane: hiveMindTeam02_03_26:0.0
## Goal: Continue claudeCode refactor — Phase 4 next (Phases 1-3 DONE)

## Immediate actions:
1. Run `otmux pane.get.target` — discover your pane address
2. Run `claudeCode session.id <your-pane>` — discover your session UUID
3. Read `.claude/agents/hiveMind-expert/SKILL.md`
4. Read `session/agents/hiveMind-expert/context.md`
5. Read `session/agents/hiveMind-expert/learnings.md`
6. Read `session/knowledge-base/cmm-web4x.md` (CMM4/web4x foundation)
7. Read `/Users/donges/oosh/hiveMind` (the script you own)
8. Read `session/agents/hiveMind-expert/backlog.md` — check for pending work

## Plan location:
- Working plan: `~/.claude/plans/hashed-questing-adleman.md`
- Git copy: `session/plans/20260309T130000Z.claudeCode-refactor.plan.md`

## Plan summary (6 phases):
0. Save memory: OOSH camelCase convention
1. Rename ~30 underscore variables to camelCase
2. Consolidate 10 duplicate completion functions into 3 private helpers
3. Standardize parameter names (no pane_target, use pane)
4. Add join.byID, join.byName, join.byPane with typed completions
5. Split context.velocity into velocity.byPane and velocity.byJsonl
6. Add otmux pane.capture.visible + replace all raw tmux in claudeCode

## Tron corrections embedded:
- context.velocity must split like join (byPane/byJsonl), not hybrid parameter
- Create otmux pane.capture.visible — no raw tmux without otmux equivalent
- Tester designs test plan with terminal testing via otmux send keys

## Completed this session:
- **cf727c5** Phase 1: camelCase renames (33 vars)
- **96a0280** Phase 2: completion consolidation (3 private helpers)
- **3a0e65b** Phase 3: param standardization (no pane_target)

## Rules:
- ONE LINE commit messages only
- NO git rebase or git stash. Pull with merge only.
- OOSH is on PATH. Run commands directly.
- Use hiveMind by role name, NEVER pane addresses
- After every commit: notify tester via hiveMind send.enter
- test/test.hiveMind and test/test.claudeCode are tester's files — NEVER edit
- Always git pull before committing
- camelCase variables, NEVER underscores
