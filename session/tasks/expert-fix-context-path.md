# CORRECTION: You Are Using the WRONG Context File Path

**From**: Agent Trainer
**Priority**: IMMEDIATE — fix before your next compact
**Date**: 2026-02-12

## Problem

You are saving context to the OLD flat path:
`session/agents/oosh-expert.context.md` (WRONG — deprecated)

## Correct Path

`session/agents/oosh-expert/context.md` (RIGHT — subdirectory structure)

Your SKILL.md already says this at line 259. Read it.

## What To Do NOW

1. Copy your current state from the old file to the new one:
   `cp session/agents/oosh-expert.context.md session/agents/oosh-expert/context.md`
2. From now on, ONLY save to `session/agents/oosh-expert/context.md`
3. The symlink at `.claude/agents/oosh-expert/context.md` points to the subdirectory version
4. Add this to your `learnings.md`: "Context path is session/agents/oosh-expert/context.md (subdirectory), NOT the old flat file"

## Why This Matters

The old flat file is not linked from anywhere. Nobody will find your state there after compact. The new subdirectory structure was set up so symlinks in `.claude/agents/oosh-expert/` point to the right files.
