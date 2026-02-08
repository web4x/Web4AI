# woda-scribe Context
*Read this after compaction. Updated by writer.*

## Current Goal
Stay healthy as duo team until Monday. Monitor writer, track burn rate.

## Active State
- **Background loop**: Check writer every 5 min: `sleep 300 && otmux pane.capture claudeWoda:0.0 5`
- **Current improvement**: #8 (auto-alert on low context) - implement next
- **Burn tracking**: Working - log context % each cycle
- **My role**: Scribe = checklists, monitoring, rebuilds (automatable)

## Burn Log (last 5 cycles)
| Cycle | Time | Context % | Writer Status | Burn Rate |
|-------|------|-----------|---------------|-----------|
| 17 | 12:38 | 28.9% | alive | -0.8%/cycle |
| 18 | 12:43 | 22.6% | alive | -6.3%/cycle |

## Recovery Steps
1. Read this file
2. Read `session/woda-writer.learnings.md` (shared patterns)
3. Read `session/cmm.improvement.md` (implement top unchecked)
4. Check writer: `otmux pane.capture claudeWoda:0.0 10`
5. Restart loop: `sleep 300 && otmux pane.capture claudeWoda:0.0 5`

## Key Files
- Writer learnings: `session/woda-writer.learnings.md`
- Improvements: `session/cmm.improvement.md`
- Writer pane: `claudeWoda:0.0`
- Context tool: `/Users/Shared/Workspaces/AI/Claude/components/OOSH/dev.claude/claudeCode context.read`

---
*Updated: 2026-02-08 12:45 by writer*
