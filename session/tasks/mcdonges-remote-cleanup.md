# McDonges Remote Cleanup

**Priority**: HIGH
**Status**: PLAN (no execution without Tron auth)

## Situation
`teams.migrate McDonges` cloned all 18 local sessions to remote instead of just ooshTeam.

## Findings (from otmux tree on remote)
1. 18 sessions created — only ooshTeam was intended
2. ooshTeam has 55 panes (0.0-0.54) — stale pane explosion from restore
3. Live Claude instances running (oosh-po, scrum-master, upDown-po, fallback agents) — consuming subscription
4. `__restore_init` session not cleaned up after restore
5. Dead agent entries (master-product-owner@opus1m)

## Bugs to Fix in Code
- [ ] BUG-M1: teams.restore creates excessive panes — ensure.pane splits without limit
- [ ] BUG-M2: __restore_init session not killed after successful restore
- [ ] BUG-M3: teams.migrate has no session filter — FIXED by team.migrate (dc0cc00) but restore still has the pane issue
- [ ] BUG-M4: Live Claude instances auto-fork on restore without throttle — burns subscription

## Cleanup Plan (requires Tron auth)
1. Kill all live Claude instances on McDonges (stop token burn)
2. Kill 17 extra sessions — keep only ooshTeam
3. Kill 54 stale panes in ooshTeam — keep 6 (matching local layout)
4. Kill __restore_init
5. Verify ooshTeam layout matches local: po/architect/expert/tester/2 shells

## Prevention (code tasks for Sprint 1)
- teams.restore: cap pane creation to snapshot count, not split-until-index
- teams.restore: cleanup __restore_init on success
- team.migrate: use new single-team method (dc0cc00)
- Add --dry-run to teams.restore showing what WOULD be created
