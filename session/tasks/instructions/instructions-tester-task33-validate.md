# Tester: Validate Task 33 — hiveMind sweep/unblock/sweep.loop

**Task file**: `session/tasks/Task.33.202602041515.md`
**Expert commit**: 593acfe
**Status**: Steps 1-4 DONE by Expert. You validate steps 5-8.

## Your Steps

### Step 5: Validate sweep output format
```bash
./hiveMind sweep
```
- Verify output is a table with columns: pane | role | status | action-needed
- All registered agents should appear
- Status should reflect actual pane state

### Step 6: Validate unblock detects and resolves blockers
```bash
# Test single agent unblock
./hiveMind unblock oosh-expert

# Test all agents unblock
./hiveMind unblock all
```
- Should detect: permission prompts, queued messages, autocomplete stuck, rate limits
- Should report what action was taken (or "none needed")

### Step 7: Validate sweep.loop runs continuously
```bash
./hiveMind sweep.loop 10
```
- Should run sweep + unblock every 10 seconds
- Verify it loops continuously (let it run 2-3 cycles)
- Ctrl+C should stop cleanly

### Step 8: Validate Tab completion
```bash
./c2 function.completion ./hiveMind sweep
./c2 function.completion ./hiveMind unblock
./c2 function.completion ./hiveMind sweep.loop
```
- `unblock` should complete with agent names + `all`
- `sweep.loop` should suggest interval values

## Also Validate: Task 32 — otmux pane.lock
```bash
# Lock a pane
./otmux pane.lock cursorOrchestrator:0.5 "test-lock"

# Verify title set
tmux display -t cursorOrchestrator:0.5 -p '#{pane_title}'

# Unlock
./otmux pane.unlock cursorOrchestrator:0.5

# Check completion
./c2 function.completion ./otmux pane.lock
```

## Report
When done, commit test results and report: `Task 32+33 validation done`
