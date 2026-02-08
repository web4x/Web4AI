# woda-writer Context
*Read this after compaction. Updated each cycle.*

## Current Goal
Stay healthy as duo team until Monday. Peer monitoring loop active.

## Active State
- **Background loop**: Check scribe every 5 min
- **Pull system**: Add improvement ONLY when scribe completes one
- **Current improvement**: #3 DONE, #8 next (auto-alert on low context)
- **My role**: Writer = thinks, interprets, writes (unautomatable)
- **Pending bug**: context.read debugger bug filed, pushing orchestrator to assign

## Each Cycle Duties
1. Check scribe status (from bg loop output)
2. Update #3 status in cmm.improvement.md
3. Restart monitoring loop
4. Commit if changes
5. **Ask critical questions**:
   - What has team actually DELIVERED? (not "checking" - concrete results)
   - Is team actively WORKING on our bug?
   - WHEN will they deliver?
   - Did scribe TEST results or just report status?

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
