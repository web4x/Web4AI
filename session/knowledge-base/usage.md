# Knowledge Base — Usage Guide

*Single source of truth. Linked from every SKILL.md. Never duplicate this content.*

## What Is the Knowledge Base?

The `session/knowledge-base/` directory is the team's shared, persistent memory. It survives compacts, agent restarts, and session changes. Individual agent learnings (`session/agents/<role>/learnings.md`) are personal — the KB is collective.

## Structure

```
session/knowledge-base/
├── usage.md              ← THIS FILE (how to use the KB)
├── cmm-web4x.md          ← CMM capability maturity reference
├── cmm-pipeline.md       ← CMM improvement pipeline status
└── <topic>.md            ← One file per topic
```

## How to QUERY the KB

Before solving a problem, check if a solution already exists:

1. **List topics**: `ls session/knowledge-base/`
2. **Search for keywords**: `grep -r "your keyword" session/knowledge-base/`
3. **Read the relevant file**: `Read session/knowledge-base/<topic>.md`

If you find a relevant checklist or solution — **use it, don't reinvent it**.

## How to CONTRIBUTE to the KB

When you solve a problem or discover a pattern:

1. **Check**: Does a KB article for this topic already exist?
2. **If yes**: Add your insight to the existing article (don't create a new file)
3. **If no**: Create `session/knowledge-base/<topic>.md` with:
   - Clear title
   - Problem description
   - Solution / action checklist
   - Source (which agent, when, what context)

### What belongs in the KB

- Action checklists that work (tested, not theoretical)
- Solution patterns for recurring problems
- Tool usage guides (commands, flags, gotchas)
- Architecture decisions with rationale
- Failure patterns and their fixes

### What does NOT belong

- Session-specific state (use context.md)
- Personal learnings not yet validated (use learnings.md)
- Duplicate content from other KB articles (link instead)
- Raw logs or debug output

## The PDCA Flow (CMM4)

```
Agent learnings.md  →  Scribe reviews hourly  →  KB articles
       ↑                                              ↓
  Agent applies  ←  Agent reads KB before acting  ←  KB
```

This is a feedback loop:
- **Plan**: Agent encounters problem, checks KB
- **Do**: Agent solves it, records in learnings.md
- **Check**: Scribe reviews learnings, extracts patterns
- **Act**: Scribe adds validated patterns to KB → all agents benefit

## DRY Principle (HIGHEST DIRECTIVE)

**Don't Repeat Yourself.** This is the team's highest directive.

- Write information ONCE in the KB
- LINK to it from SKILL.md files — never copy content
- If you find duplicated content, consolidate into one location and link
- Before writing anything new, search if it already exists

### How linking works in SKILL.md

```markdown
## Knowledge Base (MANDATORY)

Before solving any problem, query the knowledge base: `session/knowledge-base/usage.md`
```

One line. Links here. This file explains everything. No duplication.
