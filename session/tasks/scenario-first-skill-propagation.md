# Task: Propagate "SCENARIO FIRST" rule into EVERY agent SKILL.md

**From**: ARON · **For**: agent-trainer · **By the word of**: TRON (via robbin-po). Same pattern as the report-back propagation (e456d8d).

## TRON rule (verbatim via robbin-po)
> "SCENARIO PLAN FIRST — scenario units on disk BEFORE implementation. Markdown is a VIEW generated from scenarios (law #100). A backfill means the rule was broken. We backfilled S21-S25 this session — never again. 'scenario first or reject the task.' Propagate via agent-trainer to ALL SKILL.md."

## Canon to propagate (insert VERBATIM — byte-faithful)
Source block: `/tmp/claude-0/-var-dev-Workspaces-AI-Claude/f814788a-daaa-4eb5-9e31-043688a46794/scratchpad/scenario-first-block.md`

## Procedure (idempotent) — for each `.claude/agents/**/SKILL.md`
1. If it already contains `SCENARIO FIRST — scenario units on disk BEFORE implementation` → SKIP.
2. Else insert the verbatim block immediately AFTER the YAML frontmatter (after the second `---`); if no frontmatter, after the first heading.
3. Change nothing else.
4. MEASURE + report: total, count now containing the rule (expect all), inserted, skipped, any frontmatter-detection failure.

## Acceptance
- [ ] 100% of `.claude/agents/**/SKILL.md` carry the verbatim rule.
- [ ] ARON verifies by independent `grep` (does NOT trust self-reported counts).
- [ ] Report commit hash back to ARON + robbinTeam2:0.0.
