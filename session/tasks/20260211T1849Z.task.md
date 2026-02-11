# Task: Add OOSH PATH Setup Section to All SKILL.md Files

**From**: Product Owner
**To**: Agent Trainer
**Date**: 2026-02-11
**Priority**: HIGH — agents use compound cd+./commands causing permission bloat

---

## Context

Every agent has been using `cd /Users/donges/oosh && ./otmux send ...` — compound Bash commands that trigger permission prompts every time. The fix: OOSH is on PATH. Simple atomic commands like `otmux send ...` work directly.

The PO already:
1. Removed all 178 `./otmux` and `./hiveMind` prefixes from all 11 SKILL.md files
2. Added the PATH Setup section to `scrum-master/SKILL.md` as a template
3. Updated CLAUDE.md with the PATH setup instructions
4. Updated settings.json with matching permission patterns

## Your Task

Add this section to ALL remaining SKILL.md files (all except scrum-master which is done). Place it **immediately before** the existing `## OOSH-Only Rule (MANDATORY)` section:

```markdown
## OOSH PATH Setup (MANDATORY — run FIRST in every session)

\`\`\`bash
export PATH="/Users/donges/oosh:/Users/donges/oosh/otmux:/Users/donges/oosh/hiveMind:/Users/donges/oosh/ng:$PATH"
\`\`\`

This makes all OOSH commands available directly. **No `cd`, no `./` prefix, no compound commands.**

Shell state does NOT persist between Bash calls. Prepend the export to your first command each session, or use `bash -i -c 'command'` (interactive bash loads OOSH from .bashrc).
```

Also update the OOSH-Only Rule table in each file to add the row:
```
| `cd /Users/donges/oosh && ./otmux ...` | `otmux ...` (OOSH is on PATH) |
```

### Files to Update
- `.claude/agents/agent-teacher/SKILL.md` (orchestrator)
- `.claude/agents/agent-trainer/SKILL.md` (your own)
- `.claude/agents/developer/SKILL.md`
- `.claude/agents/oosh-expert/SKILL.md`
- `.claude/agents/oosh-tester/SKILL.md`
- `.claude/agents/product-owner/SKILL.md`
- `.claude/agents/task-agent/SKILL.md`
- `.claude/agents/woda-writer/SKILL.md`
- `.claude/agents/woda-scribe/SKILL.md`
- `.claude/agents/script-product-owner/SKILL.md`

(NOT scrum-master — already done by PO)

## Also: Commit Your Pending Governance Edits

You have pending edits from the 7 PO governance findings (accept them with shift+tab, then commit). Those changes + these PATH additions should go in one commit.

## Also: Accept and Commit Your Earlier Docs Work

The PO noticed you created docs in the workspace root. Those have been replaced with a symlink to the real OOSH docs at `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/dev.claude/docs/`. The docs already existed there. Your reading list additions to the SKILL.md files were correct and have been committed by the PO.

---

**PO Note**: This is the OOSH philosophy in practice — "death to flags." The `cd` and `./` were flags — plumbing that shouldn't be visible. Now the commands are clean: `otmux send`, `hiveMind team.status`. The PATH setup is the one-time plumbing that makes it work.
