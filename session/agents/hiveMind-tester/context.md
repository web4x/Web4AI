# hiveMind tester Agent Context
**Session**: hiveMindTeam02_03_26
**Role**: hiveMind-tester
**Pane**: hiveMindTeam02_03_26:0.1
**Updated**: 2026-03-08 session 3

## Active Work
- **Goal**: Cross-computer team restore — VERIFIED WORKING
- **Status**: `hiveMind teams.migrate MacStudio.native` tested end-to-end: save→transfer→pull→prereqs→restore→verify. All 7 sessions, 13 agents restored.

## Expert Commits (oosh repo, branch dev.claude)
| Commit | What |
|--------|------|
| c50d2f9 | Fix pane existence check — list-panes count instead of display-message |
| a9668fe | Fix session size — -x 200 -y 50 for splits |
| a004ccb | Fix pane creation — split until target address exists |
| c6f3d67 | Fix -d flag for detached session creation |
| 1517107 | Add teams.migrate + BUG-Z1/Z2/Z3 fixes |
| e351282 | Fix agent restart chain — BUG-P/P2/Q/R/S/T all fixed |
| cb76d46 | Colors: exported color vars in setup.color.env |
| 05d95c9 | Colors: added to consistency.audit + consistency.fix |
| aabd8b8 | Fix consistency.fix sed delimiter — | to # |

## Cross-Computer Restore — VERIFIED (2026-03-08)
- `hiveMind teams.migrate MacStudio.native` — ONE COMMAND, works end-to-end
- Steps: snapshot → ossh push.dir config → git pull oosh → prereqs check → teams.restore
- Teardown + re-restore cycle: `tmux kill-server` → `teams.restore` — clean success
- Root cause of "can't find pane" bug: tmux display-message fuzzy-matches pane targets (0.3→0.0)
- Fix: use `list-panes | wc -l` to count panes instead of display-message check (c50d2f9)
- /opt/homebrew/bin PATH issue: teams.migrate handles via `export PATH=/opt/homebrew/bin:$PATH`

## Consistency Audit (current)
```
8 consistent, 4 inconsistent:
- projectTeam:0.4   ✗ dup UUID (oosh-tester shares a2c6b6c4 with oosh-expert)
- odockerTeam:0.1   ✗ title≠reg ("CommittoExpertPane" — needs /rename)
- baseTeam:0.2      ✗ title≠reg ("ClaudeCode" — needs /rename)
- baseTeam:0.3      ✗ title≠reg,dup UUID
```

## RECOVERY AFTER COMPACT
1. Read `.claude/agents/hiveMind-tester/SKILL.md`
2. Read `session/agents/hiveMind-tester/context.md` (this file)
3. Read `session/agents/hiveMind-tester/learnings.md`

## Rules (memorize):
- **NO git rebase. EVER.** Pull with merge only.
- **ONE LINE git commit messages.**
- **Run tests from ooshDebug:0.1**, never from your own pane.
- OOSH is on PATH — no export needed.
- **NEVER source OOSH scripts.** Executables only. Only source .env configs.
- **NEVER start claudeCode new when a UUID exists.**
- **NEVER use raw `claude` or `tmux`** — always claudeCode/otmux.
- **NEVER append `2>&1`** — causes permission prompts.
- Tests must be fixture-based, not machine-specific.
- **Gate live-probing tests behind RUN_LIVE_TESTS=1.**
- **Check expert's context** before sending work.
