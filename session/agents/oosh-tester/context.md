# OOSH Tester Agent — Session Context

**Updated**: 2026-04-30
**Role**: oosh-tester
**Pane**: ooshTeam:0.2
**Test Shell**: ooshTeam:0.4 (oosh-tester-shell)
**Expert**: ooshTeam:0.1 (oosh-expert)
**Expert Shell**: ooshTeam:0.3 (oosh-expert-shell)
**Machine**: MacStudio.native
**Branch**: test/macos.latest (tester shell), prod (my Claude session)

## Sprint 0 — All Completed Tests

| Task | Tests | Result | Commit |
|------|-------|--------|--------|
| G1.3 context.read 1M | 5/5 | ALL PASS | 8fac44e |
| B1.3 otmux boundary | 4/4 | ALL PASS (raw tmux fixed) | 7e8dd2d |
| B2.3 layout persistence | 2 TDD fail, 3 skip | Expected — not implemented | 7e8dd2d |
| B3.2 pane.lock relock | 4/4 | ALL PASS | fb30cc2 |
| A1.3 claudeCode boundary | 6/7 | 1 fail: 2 raw tmux | 57d8a00 |
| A2.3 portability | 4/4 | ALL PASS | cb31d3f |
| C1.4 cold-start cycle | 8/8 | ALL PASS | d092295 |
| C2.3 DRY patterns | 3/4 | 1 fail: 14 JSONL refs | 57d8a00 |
| C3.3 sweep fixtures | 10 written | BLOCKED by slow filter | c0e59d0 |
| B5.2 pane operations | 8 written | Running | 4915d00 |
| Bug #4 send leak | 7 written | Running | 654b177 |
| E1.1 lifecycle cycle | 7/8 | PASS (critical path green) | 508509e |
| T-DISCOVER | 10/10 | ALL PASS | 6f37454 |
| T-REFRESH | 9/9 | ALL PASS | 6f37454 |
| T-RESOLVE-MT | 5/5 | ALL PASS | 85b3353 |

## Pending
- B4.3 client lifecycle (attach -r, window-size largest)
- B5.2 results (background task running)
- Bug #4 results (background task running)
- D2.3 integration tests

## Key Rules
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- Use oosh-tester-shell (ooshTeam:0.4) for running commands
- BRE vs ERE: grep -qE uses | not \| for alternation
- Finish current task before handling new prompts
- Tests must be self-contained
- Every task = one commit with ref to task file
