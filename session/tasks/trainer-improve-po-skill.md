# Task: Improve Product Owner SKILL.md

**From**: PO (self-improvement via trainer)
**For**: agent-trainer
**Priority**: HIGH

## Context

The PO's SKILL.md focuses entirely on OOSH script governance (first principles, usability contracts). It's MISSING team governance — the PO's responsibility for team quality, CMM progression, agent lifecycle, and SKILL.md quality.

Tron directive: "you are the po responsible for the team and its quality and cmm progression. you together with me have to care we built a cmm4 team as described in the woda story."

## Before editing

1. Read `session/woda/woda-overview.md` — understand the team's full history
2. Run `git log --oneline -10 .claude/agents/product-owner/SKILL.md` — see how the file evolved
3. Read `session/agents/product-owner/context.md` — see PO's current state and failures
4. Read the current `.claude/agents/product-owner/SKILL.md` — understand what's there

## What to ADD (do not remove existing content)

### 1. Team Quality Ownership section

The PO owns team quality, not just script quality. Add:
- PO is responsible for CMM progression of the whole team
- PO works WITH Tron to build a CMM4 team
- PO owns SKILL.md quality — ensures agent definitions lead to correct behavior
- PO uses the trainer as a tool for SKILL.md improvements
- Read `session/woda/woda-overview.md` on boot — team history is context for governance

### 2. Agent Lifecycle Management section

From PO failures this session (F29):
- /clear ONLY at 0% context. At any % above 0, try /compact first.
- When managing compacts: measure context %, send /compact, verify it processed, send boot prompt, verify reboot
- Never /clear a teammate above 0% — it destroys all context, learnings, patterns
- After /clear (if unavoidable): send FULL retraining — SKILL.md + context.md + learnings.md, not a bare boot prompt

### 3. Manual Mode section

When SM/orchestrator are stopped, PO manages expert + tester directly:
- PO assigns work via task files in session/tasks/
- PO approves permissions on worker panes
- PO monitors agent context % and manages compacts
- Communication: PO → expert/tester directly (not through orchestrator)

### 4. Fix the Communication section

Current line 212 says "PO talks only to Tron and Orchestrator." This is wrong in manual mode. Update to reflect both modes:
- Full team mode: PO → Orchestrator → workers
- Manual mode: PO → expert/tester directly (when SM/orchestrator stopped per Tron order)

### 5. Fix Role Boundaries

Line 201: "DO NOT: Monitor agent panes" — wrong when in manual mode. The PO DOES monitor panes when SM is stopped. Update to say: "In full team mode, monitoring is SM's job. In manual mode, PO monitors."

## What NOT to change

- First Principles section — this is correct and well-written
- Usability Contract — correct
- Script Ownership Model — correct
- Base skills / OOSH-only / mandatory rules — these are template sections, don't touch

## Deliverable

Targeted edits to `.claude/agents/product-owner/SKILL.md`. Commit with a message explaining what was added and why.
