# Task 58 Bugfix Validation + Test Improvements

**Assigned to**: Tester (cursorOrchestrator:0.5)

## What Changed

1. Expert fixed `claudeCode context.read` optional param triggering debugger (commit ea22cb2)
2. You already updated SKILL.md with mandatory param/completion test checklist — good

## Tests to Run

From `components/OOSH/dev.claude/`:

### Bugfix validation
1. **context.read NO pane**: `./claudeCode context.read` — must return a number, NO debugger breakpoint
2. **context.read WITH pane**: `./claudeCode context.read cursorOrchestrator:0.4` — must work
3. **context.jsonl**: `./claudeCode context.jsonl` — must return a file path
4. **context.all**: `./claudeCode context.all` — must list sessions with %
5. **Syntax check**: `bash -n claudeCode` — must PASS

### New test cases to add to test/test.claudeCode (create if needed)
6. **Test optional param absent**: Call context.read with no args — expect clean return, no debugger
7. **Test tab completion**: `./c2 function.completion ./claudeCode context` — should list context.read, context.jsonl, context.all, context.read.tui

## STOP monitoring loops — focus on this validation only

## Do NOT interact with claudeWoda panes

## Reporting
When ALL PASS, send to pane 0.6: "Task 58 bugfix ALL PASS — optional param fix validated"
