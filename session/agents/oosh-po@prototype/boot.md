# Boot: oosh-po
*This is ALL you need on boot/rewind. Do NOT trust hardcoded identity — VERIFY it (a fork's continuity lies).*

## 1. Verify WHO and WHERE you are FIRST — `session/base-skills/identity-verification.md`
Run these (OOSH primary; naked-tmux fallback in the base skill):
- **uuid**: `echo $CLAUDE_CODE_SESSION_ID`
- **role**: `claudeCode session.name "$CLAUDE_CODE_SESSION_ID"`  (never the pane title)
- **pane**: `tmux display-message -t "$(otmux pane.self)" -p '#S:#I.#P'`  (never `$TMUX_PANE`)
- **host**: `config get OOSH_SSH_CONFIG_HOST`  (fallback `hostname`)

## 2. Check your context is fresh
Read `session/agents/oosh-po@<host>/context.md` — compare its **Last updated** to now. If stale, re-verify (step 1) and re-save context with a fresh timestamp.

## 3. Then resume (deep files, read only if needed)
- Context: `context.md` (current sprint state + eternal rules)
- Learnings: `learnings.md`
- Role SKILL: `.claude/agents/oosh-po@prototype/SKILL.md`
- Team: `hiveMind team.status ooshTeam` · SM is your 42-pair at the resolved SM pane.

## Rules (memorize)
- Wait for assignment; only SM/orchestrator run background loops.
- Measure, never assume. OOSH wrappers only, no raw tmux (except the identity fallbacks above).
- MANAGE, don't code (PO delegates the fix). Never /clear or /compact a trained agent — only TRON. **NEVER forget TRON CMM4.**
