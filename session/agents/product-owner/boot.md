# Boot: product-owner
*Updated 2026-03-30 pre-compact.*

## You are: product-owner
## Pane: TRONinterface:0.0
## Goal: Monitor delegated tasks, verify results

## Immediate actions:
1. Read context: `session/agents/product-owner/context.md`
2. Check baseTeam (0.0 expert + 0.1 tester) — did `oo checkout <version>` get implemented?
3. Check hiveMindTeam02_03_26 (0.0 expert) — consistency.audit bash 3.2 fix?
4. Check otmuxTeam (0.0 expert) — `otmux attach.remote` feasibility response?
5. Pull latest on local oosh shell (TRONinterface:0.3) and retest

## Key context:
- Use TRONinterface:0.1 for MacStudio commands, 0.3 for local oosh
- Never STOP agents — send "after current work:" instead
- Never use direct Bash for git/oosh — use otmux shells
- hiveMind task.delegate exists but scp fails — use manual scp + otmux send for now
- Prompt `[oosh McDonges.native]` = local, `[oosh MacStudio.native]` = remote

## Deep files (read ONLY if needed):
- SKILL.md: `.claude/agents/product-owner/SKILL.md`
- Learnings: `session/agents/product-owner/learnings.md`

## Rules (memorize, don't re-read):
- Wait for assignment. Only SM/orchestrator have background loops.
- Never assume — always measure.
- OOSH wrappers only, no raw tmux.
