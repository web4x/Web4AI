# OOSH Tester Agent — Session Context

**Updated**: 2026-04-27
**Role**: oosh-tester
**Pane**: ooshTeam:0.2
**Test Shell**: ooshTeam:0.4 (oosh-tester-shell)
**Expert**: ooshTeam:0.1 (oosh-expert)
**Expert Shell**: ooshTeam:0.3 (oosh-expert-shell)
**Machine**: MacStudio.native

## Sprint 0 — Completed Tests

| Task | Tests | Result | Commit |
|------|-------|--------|--------|
| G1.3 context.read 1M | 5/5 | ALL PASS | 3f786b0 |
| A1.3 boundary violations | 6/7 | 1 fail: 2 raw tmux in claudeCode | 57d8a00 |
| A2.3 portability | 4/4 | ALL PASS | cb31d3f |
| B1.3 otmux boundary | committed | needs run verification | dc9d2cb |
| B3.1 pane.lock relock | 4/4 | ALL PASS | fb30cc2 |
| C1.4 cold-start cycle | 8/8 | ALL PASS | d092295 |
| C2.3 DRY patterns | 3/4 | 1 fail: 14 JSONL refs | 57d8a00 |
| C3.3 sweep fixtures | 10 written | BLOCKED by slow filter | c0e59d0 |

### Earlier session (pre-Sprint 0)
| Suite | Tests | Result |
|-------|-------|--------|
| T-DISCOVER | 10/10 | ALL PASS |
| T-REFRESH | 9/9 | ALL PASS |
| T-RESOLVE-MT | 5/5 | ALL PASS |

## Remaining Backlog
- B2.3 — server restart tests
- B4.3 — attach -r doesn't resize
- C3.3 — sweep fixture tests (need test.def migration for speed)
- D2.3 — integration tests

## Commit Rule
Every task = one commit: `<what changed> (ref: task-<id>.md)`

## Key Rules
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- Use oosh-tester-shell (ooshTeam:0.4) for running commands
- BRE vs ERE: grep -qE uses | not \| for alternation
- Finish current task before handling new prompts
- Tests must be self-contained
