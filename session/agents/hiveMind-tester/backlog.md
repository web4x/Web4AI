# hiveMind tester Backlog

## Priority: HIGH
- [x] Test `hiveMind send.enter` — PASS (conditional on active.team file)
- [x] Test `hiveMind agent.bootstrap` — PASS (validation only, destructive skip)
- [x] Test `hiveMind unblock` — PASS (single + all)
- [x] Test `hiveMind monitor.approve` — PASS (after send→send.enter fix)

## Priority: MEDIUM
- [x] Test `hiveMind spawn` — PASS (validation; agentRoom backend not running)
- [x] Test `hiveMind teach` — PASS (validation + completion)
- [x] Test `hiveMind roles` — PASS (functional; stale hardcoded list noted)
- [x] Test `hiveMind agent.verify` — PASS (all cases)
- [x] Test `hiveMind join` — PASS (found active session)
- [x] Test `hiveMind monitor.cycle` — PASS (all 11 panes + burn log)

## Priority: LOW
- [x] Test `hiveMind team.setup.full` — PASS (validation: refuses existing session)
- [x] Test `hiveMind team.setup.oosh` — PASS (validation: refuses existing session)
- [x] Test `hiveMind sweep`, `sweep.cycle` — PASS (after validation fix)
- [ ] Test `hiveMind sweep.loop` — SKIP (continuous loop, would block)
- [x] Test `hiveMind watchdog.status`, `watchdog.stop` — PASS
- [ ] Test `hiveMind watchdog` — SKIP (destructive, creates pane)
- [x] Test `hiveMind auto.commit` — PASS (after git add -A → -u security fix)
- [x] Test `hiveMind cycle.full` — PASS (functional)
- [x] Test `hiveMind dashboard` — PASS (writes dashboard.md)
- [ ] Test `hiveMind kill` — SKIP (destructive)

## Bugs Found & Fixed (all sessions combined)

| Commit | Fix |
|--------|-----|
| `d750b0a` | `./claudeCode` → `claudeCode` (3 occurrences) |
| `390be11` | `role.list` agents dir resolution + `team.sweep` validation |
| `e82fee1` | `./otmux` → `otmux` (28 occurrences) |
| `fdeffb2` | `active.team` fallback to roles registry |
| `315c173` | `claudeCode` missing space in monitor.cycle, cycle.full, dashboard |
| `a7e0ee7` | `sweep` validation, `auto.commit` security (git add -A → -u), `watchdog` path |
| `4aaea28` | `roles` hardcoded 12 → dynamic SKILL.md lookup (81 roles + filter) |

## Open Issues (not fixed)
- `monitor.approve` sends option without confirmation — by design?
- `auto.commit` hangs in non-TTY (git push background process issue)
