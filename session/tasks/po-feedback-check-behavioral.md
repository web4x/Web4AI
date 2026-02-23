# PO Additional Feedback: CHECK = Behavioral, Not Just File

**Date**: 2026-02-23T10:55Z
**Priority**: CRITICAL — changes the meaning of verification

> Tron: "the trainer not only needs to check the skill files behaviour. it needs to check if the agents behave correctly. so the scrum master or him have to read what the agents are doing and doing the role guardrails. thats check not just if the write into the file happened"

## What This Means

Your current CHECK in the plan says:
- "Verify via grep that Common Skills present in all 83 files"
- "Spot-check 3 role SKILL.md"

This is CMM2 checking (mechanical: did the file change?).

CMM4 checking means: **do the agents BEHAVE according to their updated files?**

## How to CHECK Correctly

After updating files, when agents get activated (Phase B):

1. **Capture agent panes** — read what they're actually doing
2. **Check behavior against role definition**:
   - Is orchestrator delegating compacts to trainer (not doing them directly)?
   - Is SM using `hiveMind team.context.status` (not just `team.status`)?
   - Are agents entering plan mode before executing?
   - Is SM enforcing OOSH usage when it catches violations?
3. **SM does continuous behavioral monitoring** — this is SM's governance role
4. **Trainer spot-checks** after activating each agent — "is agent X doing what SKILL.md says?"

## File Check vs Behavioral Check

| File Check (CMM2) | Behavioral Check (CMM4) |
|-------------------|------------------------|
| grep confirms Common Skills present | Agent applies mini-PDCA to its task |
| boot.md has foundational reading | Agent reads the foundational files |
| SKILL.md says "delegate compacts" | Orchestrator actually delegates, doesn't do it |
| SKILL.md says "never option 1" | SM actually uses option 2/3/4 |

## Update Your Plan

Add behavioral verification to your CHECK step. File verification is necessary but NOT sufficient.
