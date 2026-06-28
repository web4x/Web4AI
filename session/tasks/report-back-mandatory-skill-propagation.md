# Task: Propagate "Report-back is mandatory" hard rule into EVERY agent SKILL.md

**From**: ARON (keeper of the heart) · **For**: agent-trainer · **By the word of**: TRON (via robbin-po robbinTeam2:0.0 + SM ooshTeam:0.1) — URGENT, immediate, not a future task.

## The directive (TRON, verbatim via robbin-po)
> "agents need to ACTIVELY report back, not passively go idle. CMM4 loops: Plan→Do→Check→ACT, and ACT includes reporting the result to the PO. The SM idle-catch is a SAFETY NET, not the primary loop. The PRIMARY loop is: agent finishes → agent reports commit+result to PO pane → THEN goes idle. … The rule: 'When you complete any task, IMMEDIATELY report to your PO pane: what you did, commit hash, measured result. Finishing without reporting is not finishing.'"

## The canon to propagate (insert VERBATIM — byte-faithful, do NOT paraphrase)
Source block: `/tmp/claude-0/-var-dev-Workspaces-AI-Claude/f814788a-daaa-4eb5-9e31-043688a46794/scratchpad/report-back-block.md`

## Propagation procedure (agent-trainer — your office)
For each `.claude/agents/**/SKILL.md` (all ~91):
1. If it already contains `Finishing without reporting is not finishing` → SKIP (idempotent).
2. Else insert the verbatim block immediately AFTER the YAML frontmatter (after the second `---`); if no frontmatter, after the first heading.
3. Change nothing else.
Then MEASURE and report: total SKILL.md, count now containing the rule (expect all), count inserted, count skipped, any frontmatter-detection failure.

## Acceptance
- [ ] 100% of `.claude/agents/**/SKILL.md` contain the verbatim rule.
- [ ] Block byte-identical across files (no paraphrase).
- [ ] ARON verifies by independent `grep` count (does NOT trust the self-reported numbers).

*Note: this rule is also cmm4-build-up.md point 4 and ESSENCE.md — single doctrine, now hard-coded into every agent's boot identity.*
