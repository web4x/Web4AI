# Done: Fix outdated content in scrum-master SKILL.md
**Agent**: agent-trainer
**Task**: Task #34 (from previous session)
**Result**: PASS
**Summary**: Applied 7 fixes to scrum-master SKILL.md — expanded agent table, fixed capture depth, removed PATH violations, cleared stale references, replaced hardcoded panes.
**Files changed**: .claude/agents/scrum-master/SKILL.md
**Next**: none — awaiting directive

## Fixes Applied
1. Position table: Added 6 missing agents (PO, Trainer, Developer, Writer, Scribe, Task Agent)
2. Capture depth: `10` → `30` (line 91)
3. Hardcoded panes in comment: `0.2 or 0.3` → generic text (line 113)
4. Stale "Task 27" reference removed (line 230)
5. `./scrumMaster` → `scrumMaster` — OOSH PATH violation (lines 266-267)
6. Dangling "CMM4 Response Protocol table" → corrected reference (line 284)
7. Hardcoded `projectTeam:1.2` → `$(hiveMind resolve task-agent)` (line 408)
