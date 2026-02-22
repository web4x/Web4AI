# Task: Review PO Failures F26-F34 — Train All Agents

**Priority**: HIGH — these are fresh mistakes from tonight
**Assigned to**: agent-trainer
**From**: product-owner

## What Happened

PO made 9 new failures tonight (F26-F34). Each one has a pattern that affects ALL agents, not just PO. Read the full details in `session/agents/product-owner/learnings.md` (search for F26 through F34).

## The Failures and What to Teach

### F27: Interrupted working agent ("park the tester")
**Teach**: "Slow down" = no new large tasks. Current work FINISHES. Never interrupt mid-task — context loss is permanent. KB #25.

### F28: Compound `&&` commands
**Teach**: Run commands separately. `sleep N && command` and `cmd1 && cmd2` trigger unique permission prompts. OOSH wrappers have `<?interval>` params. Anti-pattern #4.

### F31: Forgot to monitor orchestrator (0.0)
**Teach**: SM must sweep ALL panes. `hiveMind team.status` first, not selective captures. One forgotten pane = one dead agent = team blind.

### F32: Self-care violation — reached 9% without saving at 35%
**Teach**: Self-care IS team care. Save at 35%. If you're monitoring others and ignoring your own burn, you'll die and take the team with you. Priority #1.

### F33: Recovery order violated
**Teach**: SM first → orchestrator → workers. No exceptions. Without SM sweeping, nobody has a safety net. KB #26.

### F34: Deleted rules from context.md (THE BIG ONE)
**Teach**: Rules are ETERNAL. Never delete them from any agent file. When saving context — APPEND new rules, copy ALL old rules forward. Emergency saves are no excuse. This is now in team-goals.md and base-skills/task-queue.md.

### INC-004: Unsubmitted self-prompts
**Teach**: Every hiveMind send must be verified. Text at `❯` + no "esc to interrupt" = not submitted. Send Enter. SM must check this every sweep.

## Your Standing Job: Maintain the HOW

Every failure, learning, and recovery must flow into KB action checklists. This is your CORE function — not a one-time task.

**The flow**: Failure → agent learnings.md → trainer reviews → KB action checklist updated → checklist becomes OOSH script when deterministic

**KB action checklists to maintain** (create if missing):
- `recovery-order.md` — how to recover the team (update from F31, F33)
- `compact-boot-lifecycle.md` — how to compact/boot agents (update from F32, F34)
- `subscription-accuracy.md` — how to monitor subscription (already good, KB #24)
- `recurring-incidents.md` — INC-004 detection procedure (update from tonight)
- `permission-prompts.md` — how to avoid/resolve (update from F28)

**CMM progression**: Action checklist = CMM2. When no dynamic intelligence is needed, graduate to OOSH script = CMM3. Example: `scrumMaster cycle` automated the sweep checklist.

**On every failure/learning/recovery**:
1. Which KB checklist does this affect?
2. Update that checklist with the new step/fix
3. Commit the update (regression safety)
4. If the checklist is now fully deterministic → flag for OOSH script conversion

## The Fractal Connection

Every sub-task in the fractal was born from a failure:
- #46 hiveMind Enter fix ← F13 (agents stopped without wakeup)
- #44 Compact lifecycle ← F11 (sent raw /compact without letting agents save)
- #47 Context awareness ← F5/F9 (not monitoring context proactively)
- #48 Pre-compact hook ← F20 (unknown boot = lobotomized agent)
- #49 Subscription accuracy ← F12/F25 (stale measurement, binary thresholds)

Failures → learnings → KB → tools → fractal. That's PDCA. That's CMM4. That's web4x.
