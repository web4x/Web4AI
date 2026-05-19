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
| `2f39e85` | `registry.set` pane ID validation + remove phantom `0.0:0.` entry (expert fix, tester verified) |

## Verified (expert commits — tester tested)

| Commit | Fixes | Verdict |
|--------|-------|---------|
| `68157ec` | printf format, column alignment, narrow pane wrapping, timing (5s), fallback parser | 5/5 PASS |
| `2f39e85` | Phantom pane registry entry + pane ID validation in registry.set | PASS |

## Open Issues (not fixed)
- `monitor.approve` sends option without confirmation — by design?
- `auto.commit` hangs in non-TTY (git push background process issue)

## Bugs Found — team.pull / agent.restart / remote offloading (2026-03-26)

| # | Bug | Severity | Status |
|---|-----|----------|--------|
| BUG 3 | JSONL loop stdin consumption — `done < file` with ossh inside eats stdin, 0 of N files downloaded | HIGH | T-PULL-8 confirms, expert notified |
| BUG 4 | `teams.save` on McDonges.native returns zero UUIDs for all agents — `session.resolve.uuid` fails on that host | HIGH | Open |
| BUG 5 | `agent.restart` role completion shows roles from ALL pulled dirs, not filtered by configDir arg | MEDIUM | Open |
| BUG 6 | Agent pane empty after `agent.restart` — `claudeCode opus` sent before bash shell ready in new pane | MEDIUM | Open |
| BUG 7 | `otmux new` attaches by default when run inside SSH — steals remote shell. Should use `-d` | MEDIUM | Open |
| BUG 8 | `claudeCode opus` overwrites pane titles set by `otmux pane.title` — need pane.lock on startup | LOW | Known (pane.lock exists but not used by agent.restart) |
| BUG 9 | Fresh agents start with no role identity — `agent.restart` without UUID starts blank Claude, no bootstrap prompt | MEDIUM | Open |
| BUG 10 | `agent.restart` has no target session param — always uses session from snapshot, can't redirect to a different session (e.g. docuTeam) | HIGH | Open |
| BUG 11 | `agent.restart` overwrites existing panes — sent `claudeCode fork` into remote-tester-shell (SSH pane) because snapshot had `projectTeam:0.4` which mapped to existing pane | CRITICAL | Open |

## Improvements — team.pull / agent.restart (2026-03-26)

| # | Improvement | Priority |
|---|-------------|----------|
| IMP 1 | Tab completion needs 3 presses — usage help shown twice before role list | LOW |
| IMP 2 | Remote `teams.save` output leaks into terminal (dead agent list visible before "Pulling config files") | LOW |
| IMP 3 | `agent.restart` should add sleep before sending `claudeCode` to wait for bash shell ready | MEDIUM |
| IMP 4 | `agent.restart` should call `pane.lock` after setting title to prevent Claude overwrite | MEDIUM |
| IMP 5 | `agent.restart` should send bootstrap prompt (SKILL.md) when starting fresh (no UUID) | MEDIUM |

## Delivered This Session (2026-03-24 → 2026-03-30)

### Tests Written
| File | Tests | Topic |
|------|-------|-------|
| test.hiveMind | 8 | hiveMind panes flat table |
| test.otmux | 6 | pane.lock plan-mode survival |
| test.hiveMind | 7 | list/panes consistency |
| test.hiveMind | 8 | DRY agents.discover extraction |
| test.hiveMind | 1 | HIVEMIND_AGENTS_DIR single source |
| test.hiveMind | 6 | registry invariants + full UUIDs + param naming |
| test.hiveMind | 6 | UUID integrity (code grep + live) |
| test.hiveMind | 3 | UUID cross-source consistency |
| test.hiveMind | 16 | team.pull + agent.restart TDD |
| test.hiveMind | 1 | T-PULL-8 stdin consumption bug |
| test.otmux | 9 | sender prefix on otmux send |
| test.claudeCode | 6 | claudeCode list regression |
| test.claudeCode | 4 | fork project dir resolution |
| test.ossh | 20 | object.verb naming consistency |
| test.ossh | 12 | verb dispatchers (get/set/list) |
| test.os | 13 | os.hostname.info/get/set + private dispatch |

### Bugs Found & Fixed
| Bug | Fix |
|-----|-----|
| hiveMind panes hardcoded role grep | agents.discover extracted (DRY) |
| UUID truncation (8-char) everywhere | full 36-char UUIDs |
| 5 agents had wrong UUIDs (fork/autocompact) | session.resolve.uuid + JSONL filename |
| UUID_RE BRE/ERE regex mismatch | fixed to ERE {8} |
| teams.save used process args not resolve.uuid | DRY — calls session.resolve.uuid |
| JSONL loop stdin consumption (0 of N downloaded) | T-PULL-8 confirms bug |
| sed -i macOS syntax on Linux | temp file pattern |
| os.check couldn't find private methods | private. prefix fallback |
| os bare invocation returned error | shows os.info, returns 0 |
| ossh.get.config undefined (crash) | deprecated wrapper created |
| c2 sub-method collision (get.config) | made private |

### Features Delivered
- sender prefix [@role pane] on otmux.send
- team.pull from remote + agent.restart (single role)
- verb dispatchers: ossh get/set/list with dotted object paths
- os.hostname.info/get/set with private OS-variant dispatch
- os.check supports private.method.darwin/linux

## Current Sprint (2026-03-30)
- [ ] Expert fix: JSONL stdin consumption (fd 3 redirect)
- [ ] Expert fix: claudeCode fork project dir resolution
- [ ] Expert fix: agent.restart target session param + pane safety
- [ ] Run full test suites after expert fixes land
- [ ] T-OTMUX-1..15 tests already written — verify they pass/fail correctly
- [ ] Investigate ghost pane cleanup — should hiveMind have a `team.cleanup` command?
