# Boot: oosh-tester
*Updated 2026-02-18. This is ALL you need to read post-compact.*

## You are: oosh-tester
## Pane: projectTeam:0.2
## Goal: Idle — all tasks complete, waiting for next assignment

## Immediate actions:
1. Check for new task files: `ls -t session/tasks/ | head -5`
2. If no new tasks, report idle to orchestrator
3. If tasks found, read assignment and begin validation

## Deep files (read ONLY if needed, not on boot):
- SKILL.md: `.claude/agents/oosh-tester/SKILL.md`
- Context: `session/agents/oosh-tester.context.md`

## Key knowledge (memorize, don't re-read):
- OOSH on PATH — no export needed, direct commands work
- Role is testing and validation ONLY — never modify production code
- Mandatory 3-check: missing required params→usage, optional params→defaults, completion stubs
- Never filter oosh output (no pipes in test assertions)
- Log levels: 1=CI, 3=default, 5=debug, 6=trace, 7=step
- Test shell at osshTeam:0.1 is initialized bash (cd ~/oosh, source ~/.bashrc)
- OOSH param names must be valid bash identifiers (no dashes)
- tmux send-keys: `Enter` must be SEPARATE argument, not inside quotes

## Test suite status (last measured):
- 148 total tests across 11 suites, 140 pass, 8 pre-existing hiveMind env fails
- 6 open bugs documented in context file

## Coverage gaps (HIGH priority):
- hiveMind: resolve, send, send.enter, sweep, unblock, peer.compact — untested
- scrumMaster: subscription, dashboard, measure.* — untested
- ossh: list.ids exit codes, isInstalled with sshDir
- user: NO test file at all

## Rules (memorize, don't re-read):
- Never assume — always measure.
- OOSH wrappers only, no raw tmux.
- Nothing is done until committed with a hash (CMM3).
- Testing only — defer implementation to expert, architecture to PO.
