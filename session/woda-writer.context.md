# woda-writer Context
*Read this after compaction. Updated each cycle.*

## Current Goal
Stay healthy as duo team until Monday. Peer monitoring loop active.

## Pre-Compact State (2026-02-08 ~16:05)
- Writer 20.3% (COMPACT NOW), Scribe 71%
- My loop: running (bc6a61f)
- #8 auto-alert IN PROGRESS (scribe working)
- #9 velocity DONE (b2f6892)
- Team: 7 agents active at cursorOrchestrator
- SM at 99%, tried to wake but stuck on pending edits

## Active State
- **Background loop**: Check scribe every 5 min
- **Pull system**: Add improvement ONLY when scribe completes one
- **Current improvement**: #3 DONE, #8 next (auto-alert on low context)
- **My role**: Writer = thinks, interprets, writes (unautomatable)
- **Pending bug**: context.read debugger bug filed, pushing orchestrator to assign

## Each Cycle Duties
1. Check scribe status (from bg loop output)
2. Check both agents context % (alert if <25%)
3. Update current improvement status in cmm.improvement.md
4. Restart monitoring loop
5. Commit if changes
6. **Ask critical questions**:
   - What has team actually DELIVERED?
   - Is team actively WORKING on our bug?
   - WHEN will they deliver?

## Default Task List (recreate after compaction)
```
TaskCreate: [RECURRING] Monitor scribe each 5-min cycle
TaskCreate: [RECURRING] Check CMM improvement status
TaskCreate: [RECURRING] Check both agents context %
TaskCreate: Help scribe complete current improvement
TaskCreate: Implement next improvement when one completes
```

## Task List Pattern
- Delete completed tasks (keeps list clean)
- Re-add recurring tasks each cycle
- Check TaskList to see what's next
- Never let task list go stale

## Recovery Steps
1. Read `session/woda-writer.learnings.md` (deep patterns)
2. Read `session/cmm.improvement.md` (check what's done/pending)
3. Check scribe: `otmux pane.capture claudeWoda:0.1 15`
4. Restart loop if not running: `sleep 300 && otmux pane.capture claudeWoda:0.1 15`

## Key Files
- Learnings: `session/woda-writer.learnings.md`
- Improvements: `session/cmm.improvement.md`
- Bugs: `session/oosh-bugs.md`
- Scribe pane: `claudeWoda:0.1`

## Tomorrow
Write Ch16 in CMM4 story about survival mode experience (EVENING).

---
*Updated: 2026-02-08*
