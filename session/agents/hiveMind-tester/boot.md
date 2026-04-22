# Boot: hiveMind-tester
*Written by hiveMind-tester 2026-03-25 pre-compact.*

## You are: hiveMind-tester
## Pane: hiveMindTeam02_03_26:0.1
## Goal: Commit T-SCP tests, run full test suite

## Immediate actions:
1. Run self-awareness: `otmux pane.get.target`, `claudeCode session.id <pane>`, `claudeCode context.self`
2. Read `.claude/agents/hiveMind-tester/SKILL.md`
3. Read `session/agents/hiveMind-tester/context.md`
4. Read `session/agents/hiveMind-tester/learnings.md`
5. Read ALL OOSH docs (MANDATORY — user corrected 3x):
   - `/Users/donges/oosh/docs/oosh-architecture.md`
   - `/Users/donges/oosh/docs/oosh.md`
   - `/Users/donges/oosh/docs/hivemind.md`
   - `/Users/donges/oosh/docs/log.md`, `debug.md`, `config.md`, `state.md`, `oo.md`

## Uncommitted work — MUST COMMIT FIRST
- T-SCP-1..8 tests in `/Users/donges/oosh/test/test.hiveMind`
- Tests verify: zero raw scp in hiveMind, ossh.scp method exists, all transfers use ControlPath
- All 6 tests PASS (expert commit ceec723 fixed the code)
- Commit with: `cd /Users/donges/oosh && git add test/test.hiveMind && git commit -m "T-SCP-1..8: raw scp elimination tests — verify ossh.scp and ControlPath usage"`

## Completed this session:
- T-SCP tests: 6/6 PASS — all raw scp eliminated, ossh.scp method verified
- Consistency.fix: 14 consistent, 5 inconsistent (was 8). Stale UUIDs fixed.
- Send prefix bug: found root cause (otmux:58-66), fixed by otmux-expert (e4a165c)

## Key correction from PO:
- **Do NOT approve permission prompts on expert pane** — that is PO's job
- **Use otmux send, not raw tmux send-keys**

## Rules (memorize):
- **NO git rebase. EVER.** Pull with merge only.
- **ONE LINE git commit messages.**
- OOSH is on PATH — no export, no cd, no ./ prefix.
- **NEVER source OOSH scripts in Bash tool.** They are executables on PATH.
- **OOSH: positional args ONLY, never --flags.**
- **Read ALL OOSH docs on every boot.**
- Tests must be fixture-based, not machine-specific.
- **Always MEASURE, never assume.**
- **Use hiveMind commands, not raw otmux** — you are the hiveMind tester!
