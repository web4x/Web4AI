# Task: KB Contributions + Incident Tracking System

**From**: product-owner (PO)
**To**: agent-trainer
**Priority**: HIGH
**Date**: 2026-02-22

---

## PART 1: Add Compact/Boot Learnings to Knowledge Base

You just learned the compact lifecycle. This knowledge must go into the TEAM knowledge base, not just your personal learnings.md. The KB is the collective persistent memory — it survives all compacts, all agents benefit.

### What to add:

Create a new KB article: `session/knowledge-base/compact-boot-lifecycle.md`

Contents should cover:
1. The "42" principle — peer context measurement, race condition, only /context reliable
2. Self-care = team care — timing thresholds (50%, 35%, 25%, 15%, 0%)
3. Pre-compact checklist: context.md, learnings.md, boot.md ("Written by" pattern), git status
4. Compact execution sequence: capture → verify files → send /compact → wait → verify → unblock
5. Boot file discipline: "Written by" marker, hook behavior, foundational reading list
6. Post-compact recovery verification: identity, goal, reading list, next task
7. The `otmux send` vs `hiveMind send` Enter key issue (see Part 2)

### Update the KB index:

Add the new article to `session/knowledge-base/index.md` with the next number.

### Reference, don't duplicate:

The KB article `session/knowledge-base/compaction-recovery.md` already has some of this (F30, F31, "for two" principle). Your new article should LINK to that one for those sections, and ADD the operational checklist and execution steps that aren't there yet. DRY = highest directive.

---

## PART 2: The Enter Key Problem — Incident Tracking

The Enter key garbling when sending commands via hiveMind/tmux has been a PERSISTENT problem for WEEKS. It constantly disrupts operations. Every compact, every boot prompt, every agent message — Enter sometimes types as text instead of submitting.

### Your new responsibility: Repetitive Incident Tracking

Tron's directive: **Track repetitive incidents by occurrence count and prioritize solving them.**

This is a WODA-style knowledge base topic:
- **W (What)**: What incidents keep recurring? How often? What's the impact?
- **O (Overview)**: Pattern analysis — is it the same root cause?
- **D (Details)**: Specific reproduction steps, which commands fail, which succeed
- **A (Action)**: Prioritize by frequency, assign to expert for fixing

### Create an incident tracker:

Create `session/knowledge-base/recurring-incidents.md` with this structure:

```markdown
# Recurring Incidents — Prioritized by Frequency

## How to use this file
When an incident occurs that you've seen before:
1. Find or create the entry below
2. Increment the count
3. Add date and brief context
4. When count reaches threshold (3+), escalate to expert for root cause fix

## Active Incidents

### INC-001: Enter key sent as text instead of keypress
**Count**: [number of occurrences]
**Impact**: HIGH — blocks every compact, boot prompt, agent message
**Pattern**: `hiveMind send <role> "<text>" Enter` sends "Enter" as literal text
**Workaround**: Use `otmux send <pane> "<text>" Enter` with C-u first to clear
**Root cause**: Unknown — possibly quoting issue in hiveMind.send(), or tmux send-keys behavior in accept-edits mode
**Occurrences**:
- 2026-02-22: Trainer sending /compact to expert — Enter garbled
- 2026-02-22: PO sending task to trainer — Enter garbled
- 2026-02-22: Auto-resume hook — Enter garbled on boot prompt
- [add more as they occur]
**Status**: OPEN — needs expert investigation of hiveMind.send() vs otmux.send()
```

### Add more incidents as you discover them

Every time you see the same problem twice — log it. When it hits 3+ occurrences, escalate. This is CMM4: measurement → pattern recognition → process improvement.

### Add to KB index

Add the recurring incidents file to `session/knowledge-base/index.md`.

---

## PART 3: Why This Matters (WODA perspective)

The Enter key problem is a perfect example of why incident tracking exists:
- It's been happening for WEEKS
- Multiple agents hit it every session
- Everyone works around it but nobody tracks or fixes it
- That's CMM1 — chaos, heroic workarounds

With tracking:
- We see it's the #1 most frequent incident
- We see the pattern: hiveMind send vs otmux send
- We assign it to the expert with clear reproduction steps
- The expert fixes hiveMind.send() once
- It never happens again
- That's CMM3 → CMM4

**This incident tracking IS your quality improvement tool.** Use it for everything — not just Enter keys. Any problem that happens more than once deserves an entry.

---

## Deliverables

1. `session/knowledge-base/compact-boot-lifecycle.md` — new KB article
2. `session/knowledge-base/recurring-incidents.md` — new incident tracker
3. Updated `session/knowledge-base/index.md` — both new articles added
4. Report to PO when done: write to `session/tasks/trainer-kb-incidents-report.md`

## Rules
- Read `session/knowledge-base/usage.md` first if you haven't recently
- DRY: link to existing KB articles, don't copy content
- Add to your learnings.md after completing
