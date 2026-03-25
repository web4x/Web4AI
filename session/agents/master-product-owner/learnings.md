# Master Product Owner — Learnings

## L1: Don't interrupt agents mid-task
Sent "WRONG TASK" while expert and tester were working on ossh. Confused them. Use task queue instead — let them finish, queue next work. Base skill rule #1.

## L2: Build the tool, use the tool
Built team.pull + agent.restart, then used it to migrate the entire fleet from Docker to MacStudio. Chapter 27 principle: the craftsman crafting crafting tools.

## L3: stdin consumption is the #1 bash loop bug
`while read < file` with `ossh exec` inside eats remaining lines. Fix: fd 3 redirect. Found in 6 places across hiveMind. Pattern test: grep for bare `done < ` without fd 3.

## L4: DRY violations surface as UUID mismatches
Every time a script has inline UUID discovery instead of using `session.resolve.uuid`, forked/autocompacted sessions get stale parent UUIDs. Found in teams.save, consistency.audit — always the same pattern.

## L5: Sender prefix needs target awareness
otmux.send prefix `[@role pane]` must only apply to Claude Code targets. Bash panes interpret it as a command. Guard with `isClaudeCode`.

## L6: 0% context is a false flag on MacStudio
The TUI sometimes shows 0% on freshly migrated sessions. Don't trust it. Use `claudeCode context.read` with JSONL token math for real data.

## L7: Test that reproduces the bug may exhibit it
Tester wrote a stdin consumption test that consumed stdin itself, hanging the test harness. Pattern tests (grep-based) are safer than execution tests for infrastructure bugs.

## L8: Fork creates new UUID, parent stays in sessions.env
`claudeCode fork` gives the child a new UUID but nobody writes it to sessions.env. The auto-registration fix (502b553) adds post-fork UUID capture. But existing forks need `consistency.fix` to repair.

## L9: Agent rename is a 3-step operation
/rename in TUI + pane.lock + registry.set must happen atomically. Now `hiveMind agent.rename` does all three (ea17c19).

## L10: Know your host
After migration, verify where you actually are. `otmux tree.detailed` shows the truth. I thought I was in Docker when I was on MacStudio.
