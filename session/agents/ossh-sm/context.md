# ScrumMaster Context — osshTeam

**Agent**: scrum-master (osshTeam:0.3)
**Date**: 2026-02-17T14:10Z
**Session**: osshTeam
**Status**: Active — monitoring sweep loop

## Current State

### Team
| Pane | Role | Status |
|------|------|--------|
| osshTeam:0.0 | ossh-expert | Phase 2 done, triggered /compact (92% quota) |
| osshTeam:0.1 | test-shell | bash + OOSH sourced, healthy |
| osshTeam:0.2 | ossh-tester | Phase 3 validation in progress |
| osshTeam:0.3 | SM (me) | Active |

### Task Progress
- **Phase 1**: Investigation complete — root cause found (`CURRENT_SSH_DIR` in `user.env` pointing to experiment dir)
- **Phase 2**: All 3 fixes applied and verified:
  1. `user.env:12` — removed stale `CURRENT_SSH_DIR`
  2. `ossh:772` — `echo "$RESULT"` → `info.log "$RESULT"` (stops stdout leak)
  3. `ossh:549` — added `| grep -v '^\*'` to filter `Host *` wildcard from completion
  - `test.suite run ossh` → 8/8 PASS
  - `ossh parameter.completion.sshConfigHost` returns 70+ real hosts
- **Phase 3**: Tester doing live `ossh login [Tab]` validation in test shell — IN PROGRESS

### Active Background Task
- `bf6b318` — sleep 60 wakeup (60s sweep interval, slowed down per user request)

## Rules in Force

1. **Never suppress stderr** — no `2>&1`, no `2>/dev/null`. Errors are information.
2. **Query KB before solving** — `ls session/knowledge-base/`, search, read relevant articles
3. **No harmful git** — reject `rebase`, `push --force`, `reset --hard`, `checkout .`
4. **OOSH-only tmux** — use `otmux`, never raw `tmux` commands
5. **60s sweep interval** — slowed down per user request

## After Compact

- Resume with `claude --resume scrum-master` to fix pane naming
- Stop background task `bf6b318` first or let it fire (will need new wakeup after compact)
- Tester (0.2) should be finishing Phase 3 — check result
- Expert (0.0) may be in compact or recovering — check and assist if needed
- Re-read boot task: `session/tasks/20260217T1315Z.ossh-sm-boot.md`

## Key Files

- Boot task: `session/tasks/20260217T1315Z.ossh-sm-boot.md`
- Full task: `session/tasks/20260217T1300Z.ossh-team.md`
- Training: `session/tasks/20260217T1310Z.oosh-training.md`
- KB rule: `session/tasks/20260217T1345Z.query-kb-first.md`
- Stderr rule: `session/tasks/20260217T1340Z.no-stderr-redirect.md`
- Tester report: `session/ossh-test-report.md`
- Expert investigation: `session/ossh-investigation.md`
