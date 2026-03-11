# Test Task: Ghost panes in projectTeam

**From**: product-owner@opus (TRONinterface:0.0)
**To**: hiveMind-tester

## What to test

projectTeam on MacStudio has 7 panes with agent titles (orchestrator, oosh-expert, etc.) but ALL are empty dead shells — no Claude processes, no output, nothing.

## Steps

1. Run `otmux tree.detailed 2>/dev/null | grep -A 15 projectTeam` — observe pane titles look like real agents
2. Run `hiveMind team.status projectTeam` — observe all show (offline) — this is CORRECT behavior
3. Run `otmux pane.capture projectTeam:0.0 5` — observe EMPTY output
4. The bug: `otmux tree.detailed` shows titled panes indistinguishable from live agents. Only `hiveMind team.status` reveals the truth.

## Expected behavior

`otmux tree.detailed` should mark panes with no Claude process differently from live agents. A dead shell titled "orchestrator" should NOT look the same as a live Claude session named "orchestrator".

## Write test cases

Write test.suite cases in test/test.hiveMind that verify:
- `hiveMind team.status` correctly shows (offline) for panes with no Claude process
- Ghost panes (titled but no agent) are distinguishable from live agents
- `otmux tree.detailed` output differentiates live vs dead panes
