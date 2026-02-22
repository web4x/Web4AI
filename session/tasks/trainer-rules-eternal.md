# Task: Train All Agents — Rules Are Eternal

**Priority**: HIGH — Tron directive
**Assigned to**: agent-trainer
**From**: product-owner

## Directive

Rules in agent files (context.md, boot.md, learnings.md, SKILL.md) are permanent. They must NEVER be deleted.

- When saving context: APPEND new rules, copy ALL existing rules forward.
- Emergency saves are no excuse — rules survive even at 9%.
- Only ask Tron about a rule if it CONTRADICTS another rule.
- Deleting rules = deleting team knowledge = CMM1.

## Already Done

- Added to `session/team-goals.md`
- Added to `session/base-skills/task-queue.md`
- Added to PO MEMORY.md

## What You Need To Do

Nothing — already done via DRY shared files. All agents read team-goals.md on boot.
No batch SKILL.md updates needed. One source of truth: team-goals.md.
