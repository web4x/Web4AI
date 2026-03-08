# Boot: hiveMind-tester
*Written by hiveMind-tester 2026-03-08 session 3b.*

## You are: hiveMind-tester
## Pane: hiveMindTeam02_03_26:0.1
## Goal: DRY refactor of hiveMind — test and monitor expert

## Immediate actions:
1. Read `.claude/agents/hiveMind-tester/SKILL.md`
2. Read `session/agents/hiveMind-tester/context.md`
3. Read `session/agents/hiveMind-tester/learnings.md`

## Current state
- DRY refactor Phases 1-4 DONE + tested (T-DRY-1 through T-DRY-8b all PASS)
- Phase 5a done (list.panes session-scoped). Expert also fixed send.enter → send.message.
- Phase 5b (list.panes all-sessions) and Phase 6 (ensure.pane) still pending
- T-DRY tests in test/test.hiveMind (commit 5eb33ba) — run via `test.suite run hiveMind 1` from ooshDebug:0.1
- Cross-computer restore VERIFIED: `hiveMind teams.migrate MacStudio.native` works end-to-end

## Expert commits (oosh repo, branch dev.claude)
| Commit | What |
|--------|------|
| c8cc083 | DRY Phase 5a: list.panes session-scoped + send.enter fix |
| 46c150b | DRY Phase 4: pane.count extracted |
| cc83be8 | DRY Phase 3: inline greps → private methods |
| e4333a9 | DRY Phase 2: remove local re-derivations |
| 34847bf | DRY Phase 1: current.session extracted |
| c50d2f9 | Fix pane existence check — list-panes count |
| a9668fe | Fix session size -x 200 -y 50 |
| 1517107 | Add teams.migrate + BUG-Z1/Z2/Z3 fixes |
| e351282 | Fix agent restart chain — BUG-P/P2/Q/R/S/T |

## Key files
- `session/tasks/expert-dry-refactor-hivemind.md` — DRY analysis task
- `session/plans/20260308T150000Z.dry-refactor-hivemind.plan.md` — refactor plan
- `test/test.hiveMind` — T-DRY tests (lines ~1454+)

## Rules (memorize):
- **NO git rebase. EVER.** Pull with merge only.
- **ONE LINE git commit messages.** No HEREDOC.
- **Run tests from ooshDebug:0.1**, never from your own pane.
- OOSH is on PATH — no export needed.
- **NEVER source OOSH scripts.** Executables only. Only source .env files.
- **NEVER start claudeCode new when a UUID exists.**
- **NEVER use raw `claude` or `tmux`** — always claudeCode/otmux.
- **NEVER append `2>&1`** — causes permission prompts.
- Tests must be fixture-based, not machine-specific.
- **Gate live-probing tests behind RUN_LIVE_TESTS=1.**
- **Always MEASURE, never assume** — check context % before sending work.
