# OOSH Tester Agent — Session Context

**Updated**: 2026-05-18
**Role**: oosh-tester
**Pane**: ooshTeam:0.3
**Test Shell**: ooshTeam:0.5 (oosh-tester-shell)
**Expert**: ooshTeam:0.2 (oosh-expert), ooshTeam:0.1 (oosh-architect)
**Expert Shell**: ooshTeam:0.4 (oosh-expert-shell)
**Machine**: MacStudio.native
**Branch**: test/macos.latest

## Sprint 0+1 — Delivered Results

| Task | Tests | Result | Commit |
|------|-------|--------|--------|
| B3.2 pane.lock relock | 4/4 | ALL PASS | fb30cc2 |
| B4.3 client lifecycle | 6/6 | ALL PASS | a60e06c |
| B5.2 pane operations | 8/8 | ALL PASS | 4915d00 |
| B6.5 stale client | 6/6 | ALL PASS | 267ac7e |
| B7.2 tree Tab completion | 6/6 | ALL PASS | 688cbe6 |
| B8.3 pane size floor | 7/7 | ALL PASS | d66847a |
| G1.3 context.read 1M | 5/5 | ALL PASS | 8fac44e |
| I1.5 context-aware send | 13/13 | ALL PASS | 449ee34 |
| SC-B.3 event dispatch | 6/6 | ALL PASS | 59a1db5 |
| SC-A.3 invariant fixtures | 7/7 | ALL PASS | e61035f |
| D3.3 tronMonitor switch | manual | PASS | aa7d6ac verified |
| Tron P0 empty-send | 16 | committed | 0b22bff |
| Prefix verification | manual | PASS | 6231b93+af2f76b verified |
| E1.1 lifecycle cycle | 7/8 | PASS | 508509e |
| Bug #4 send leak | 7/7 | ALL PASS | 654b177 |

## Bugs Found This Session
- consistency.audit has interactive y/N prompt that blocks test.suite (reported)
- test.otmux T25 typo: 2c.intsall → c2.install (fixed: b5cef8d)
- test.hiveMind EPERM spam from claudeCode.process.find (fixed: 71f38c7)
- grep -P not available on macOS (test.hiveMind uses it — needs -E)
- Prefix only works on Claude Code target panes (by design — bash shells no prefix)

## Pending
- D2.3 tronMonitor integration tests — not written
- E1.2+E1.3 — test.lifecycle exists, needs rerun
- SC-C.tests handler integration — not written
- SC-D.3 reconcile roundtrip — not written
- SC-E.3 ingress 3-vector reject — not written
- SC-F.4 corrupt snapshot reject — not written

## Recovery Steps
1. Read this file
2. Read `session/agents/oosh-tester/learnings.md`
3. Run `otmux tree.detailed` to verify pane layout
4. Check with PO (ooshTeam:0.0) for priorities

## Key Rules
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep on commands)
- Use oosh-tester-shell (ooshTeam:0.5) for running test commands
- BRE vs ERE: grep -qE uses | not \| for alternation
- Finish current task before handling new prompts
- Tests must be self-contained
- Read specs BEFORE testing — know expected behavior
- Prefix only applies to Claude Code target panes, not bash shells
