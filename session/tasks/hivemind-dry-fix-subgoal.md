# hiveMind Expert Sub-Goal: DRY Send Consolidation

**From**: Orchestrator (PO-approved PDCA plan)
**Priority**: HIGH
**Full plan**: Read `/Users/donges/.claude/plans/streamed-gathering-hippo.md` first
**DRY spec**: Read `session/tasks/dry-send-consolidation.md` for full analysis

## Your Sub-Goal

Implement DRY send consolidation — **Option C**:

### Changes Required

1. **`hiveMind.send()`** → change to call `otmux send.enter` instead of `otmux send`
   - This is the critical fix: agents use `hiveMind send` and it must append Enter automatically
   - Currently calls `otmux.send()` which does NOT use the INC-001 fix

2. **Remove `hiveMind.send.enter()`** — now redundant since `hiveMind.send()` does the same thing

3. **Remove `otmux.send.keys()`** — redundant alias for `otmux.send()`

4. **Keep**:
   - `otmux.send()` — raw low-level (no Enter)
   - `otmux.send.enter()` — low-level + Enter
   - `hiveMind.send.message()` — safe send for complex cases

### Result
- `hiveMind send <role> "msg"` → resolves role to pane → sends text + Enter automatically
- No more need for separate `hiveMind send.enter` or manual Enter argument
- INC-004 truly resolved because `hiveMind send` now uses the fixed code path

## Your Mini-PDCA

1. **Plan**: Enter plan mode. Read the hiveMind and otmux scripts. Map the current call chain. Plan code changes. Address all 7 approval criteria.
2. **Do**: Implement Option C changes
3. **Check**: Test `hiveMind send <role> "test"` — verify Enter is appended. Test `otmux send` raw — verify it still works without Enter.
4. **Act**: Report completion to orchestrator. Write `session/tasks/hivemind-expert-results.md`.

## Key Files
- hiveMind script: `/Users/donges/oosh/hiveMind` (look for `hiveMind.send()` function)
- otmux script: `/Users/donges/oosh/otmux` (look for `otmux.send()`, `otmux.send.enter()`)
- INC-001 fix: `private.otmux.sendEnter()` in otmux

## Budget
Weekly at 82%, cap 92%. Be efficient. Plan first, implement once.

## Communication
Report completion: write `session/tasks/hivemind-expert-results.md`, then tell orchestrator.
