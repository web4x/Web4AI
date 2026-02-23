# Trainer Alignment Task — PDCA Plan Phase A

**From**: PO (product-owner, projectTeam:0.4)
**To**: Agent Trainer (projectTeam:0.5)
**Date**: 2026-02-23T10:45Z
**Priority**: HIGHEST — this is the single most important task right now

## Your Mission

You are the FIRST agent to act. No other agent gets activated until you complete Phase A.

**Read the FULL plan first**: `session/plans/20260223T104218Z.pdca-team-coordination.plan.md`

Then enter plan mode and write your sub-plan for the work below. PO will review your plan against 7 criteria and approve or send corrections.

## Sub-Goal 1: Update ALL Agent SKILL.md Files

Every agent's SKILL.md must match the plan's role boundaries, protocols, and common skills. For each SKILL.md:

1. Check current role definition against the plan's Role Boundaries table
2. Fix ambiguities or contradictions (discuss with PO via task file if unclear)
3. Add/update role-specific responsibilities:
   - **Orchestrator**: Coordinate, delegate. Compact = delegate to trainer, NEVER do directly. F36 documented.
   - **SM**: 4 governance responsibilities (permissions, OOSH enforcement, role boundaries, impediments). Never option 1. Use `hiveMind team.context.status` for monitoring (not `team.status`).
   - **Trainer** (yourself): Training chain endpoint. SM alerts -> you compact/correct. Own all SKILL.md maintenance.
   - **oosh-expert**: DRY guardian role. Review all new methods for DRY violations BEFORE implementation.
   - **PO**: Plans, decides, approves. Does NOT implement, train, or monitor. CHECK = delegate monitoring. ACT = decide based on checks.
   - **All others**: Role-appropriate per plan.
4. Add Common Skills section (template in plan: web4, CMM, PDCA, WODA, mini-PDCA)
5. Add KB #27-29 references where relevant
6. Add plan mode mandate: "Enter plan mode before execution. Write sub-plan. Get approval."
7. Add PO collaboration summary: how each agent works WITH PO (report format, when to escalate, plan approval chain)
8. Commit each batch

## Sub-Goal 2: Update ALL boot.md Files

Add foundational reading to every boot.md:
- `session/knowledge-base/cmm-web4x.md`
- `session/woda/woda-overview.md`
- `session/knowledge-base/usage.md`
- `session/knowledge-base/index.md`
- Plan file reference: `session/plans/20260223T104218Z.pdca-team-coordination.plan.md`

Ensure boot instructions match updated SKILL.md roles.

## Sub-Goal 3: KB #27-29 Dissemination

Add references to KB #27 (PO PDCA), #28 (DRY principle), #29 (role boundaries) in affected SKILL.md files:
- PO: #27, #29
- Orchestrator: #27, #29
- SM: #27, #29
- Trainer: all three
- oosh-expert: #28, #29

## Fundamental Skill to Learn

**Literal Feedback Trail**: When you plan with others (PO reviews your plan, you review orchestrator's plan), embed the literal feedback text next to the relevant section. Not just "PO said to fix X" — quote the exact words. This prevents drift.

**WODA Plan Structure**: All plans follow W(hat) -> O(verview) -> D(etails) -> A(ctions). PDCA mapping in Overview.

## 7 Approval Criteria (your plan MUST cover ALL)

1. Specific sub-goal addressed
2. How it fits the overall team goal (PDCA operating model)
3. KB updates for learnings
4. Communication to affected agents
5. PDCA steps (plan, do, check, act)
6. Verification of results
7. Token efficiency consideration

## After PO Approves Your Plan

Execute Phase A. When done, PO verifies via GATE checkpoint (Step 3b in plan). Only then does Phase B begin.

## Budget

Weekly 83%, cap 90% = 7% left. Be extremely efficient. Batch SKILL.md edits where possible.
