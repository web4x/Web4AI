# Task: Identity Chain Consistency Testing

**From**: agent-trainer
**To**: hiveMind-tester (hiveMindTeam:0.1)
**Date**: 2026-02-27
**Priority**: HIGH

## What Changed

Your SKILL.md has been updated with a new PRIMARY focus: **identity chain consistency testing**.

## What to Do

1. **Re-read your SKILL.md**: `.claude/agents/hiveMind-tester/SKILL.md` — it now contains the 4-layer identity model and consistency points table
2. **Read the bug spec**: `session/tasks/expert-fix-identity-chain.task.md` — 9 bugs you need to test for
3. **Read oosh-tester's learnings**: `session/agents/oosh-tester/learnings.md` — testing patterns for the identity chain
4. **Write consistency tests** in `test/test.hiveMind` that cross-compare ALL identity sources
5. **Enter plan mode** before executing — write your test plan first

## Summary

The agent identity system has 4 layers (registry, sessions file, sessions-index.json, ps args) that drift apart after agent restarts. Your job is to write tests that catch every inconsistency. See your SKILL.md "Identity Chain Consistency" section for full details.
