# Task: Organize Agent Files + Standardize Checklist Format

## CORRECTION: Files go in session/agents/, NOT .claude/agents/

`.claude/agents/<role>/` keeps ONLY `SKILL.md` — the permanent role definition.
`session/agents/<role>/` gets ALL working files — context, learnings, backlog.

## PO Directive

Agent files are scattered across `session/`, `session/agents/` (flat), and loose in `session/`. Fix this.

## Rule 1: Two locations, linked together

**Real files** live in `session/agents/<role>/`:

```
session/agents/<role>/
  context.md      # current state, recovery info
  learnings.md    # patterns, failures, KPIs — identity after compact
  backlog.md      # open work items, improvements, issues (checkbox lists)
```

**Symlinks** in `.claude/agents/<role>/` point to the session files:

```
.claude/agents/<role>/
  SKILL.md          # real file — permanent role definition
  context.md -> ../../../session/agents/<role>/context.md
  learnings.md -> ../../../session/agents/<role>/learnings.md
  backlog.md -> ../../../session/agents/<role>/backlog.md
```

This way the reading list can reference files "next to" SKILL.md, and the actual data lives in session/.

No more loose files like `session/woda-scribe.learnings.md` or `session/agents/scrum-master.context.md` (flat). Every agent gets its own subdirectory.

## Rule 2: Hierarchical checkbox lists

All backlog.md and learnings.md files use checkbox format:

```markdown
## Open

- [ ] Implement context velocity tracking
  - [ ] Add method to claudeCode
  - [ ] Test with two agents
- [ ] Fix otmux send.verified for long messages

## Done (archive regularly)

- [x] PATH setup in all SKILL.md files
- [x] Knowledge base restructure (WODA layers)
```

**Checked items** (`- [x]`) get moved to context.md if relevant, then removed from backlog. Keep backlogs clean — only open work.

## Rule 3: Update SKILL.md reading lists

Symlinks make all files local to SKILL.md. Reading lists use simple relative paths:

```markdown
### On Bootstrap / After Recovery
1. This file (SKILL.md)
2. `context.md` (symlink — same directory)
3. `learnings.md` (symlink — same directory)
4. `backlog.md` (symlink — same directory)
```

## Rule 4: Update context preservation sections

Every SKILL.md that says "save to session/agents/<role>.context.md" or "save to session/<name>.context.md" must be updated to `session/agents/<role>/context.md` (subdirectory, not flat file).

## Files to Move

| From | To |
|------|-----|
| `session/agents/product-owner.context.md` | `session/agents/product-owner/context.md` |
| `session/agents/scrum-master.context.md` | `session/agents/scrum-master/context.md` |
| `session/agents/orchestrator.context.md` | `session/agents/orchestrator/context.md` |
| `session/agents/agent-trainer.context.md` | `session/agents/agent-trainer/context.md` |
| `session/agents/oosh-expert.context.md` | `session/agents/oosh-expert/context.md` |
| `session/agents/oosh-tester.context.md` | `session/agents/oosh-tester/context.md` |
| `session/agents/woda-scribe.context.md` | `session/agents/woda-scribe/context.md` |
| `session/woda-scribe.learnings.md` | `session/agents/woda-scribe/learnings.md` |
| `session/woda-writer.learnings.md` | `session/agents/woda-writer/learnings.md` |
| `session/woda-writer.context.md` | `session/agents/woda-writer/context.md` |
| `session/woda-scribe.context.md` | `session/agents/woda-scribe/context.md` (merge) |
| `session/wodaScribe.context.md` | `session/agents/woda-scribe/context.md` (merge) |
| `session/cmm.improvement.md` | `session/agents/woda-scribe/backlog.md` (scribe implements improvements) |
| `session/scribe-improvements.md` | `session/agents/woda-scribe/backlog.md` (merge) |
| `session/scribe-issues.md` | `session/agents/woda-scribe/backlog.md` (merge) |
| `session/oosh-bugs.md` | `session/agents/oosh-expert/backlog.md` (expert owns bug fixes) |

## Create directories + empty templates for agents without files yet

```
session/agents/agent-trainer/
session/agents/developer/
session/agents/task-agent/
session/agents/product-owner/
session/agents/scrum-master/
session/agents/oosh-expert/
session/agents/oosh-tester/
session/agents/woda-writer/
session/agents/woda-scribe/
session/agents/orchestrator/
```

Each gets context.md, learnings.md, backlog.md (empty template if no content to move).

## Validation

After all moves, ask each active agent to verify:
1. Can it read its files from `session/agents/<role>/`?
2. Does the SKILL.md reading list point to the right paths?
3. Does the context preservation section point to the right path?

Validate with the agents — don't just move silently.
