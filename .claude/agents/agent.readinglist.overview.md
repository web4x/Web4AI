# Agent Reading List Overview

**Maintained by**: Product Owner (governance) + Agent Trainer (updates)
**Date**: 2026-02-11
**Status**: CRITICAL — many referenced documents do NOT exist

---

## File Existence Legend

- **EXISTS** — file found on disk
- **MISSING** — referenced in SKILL.md but file does NOT exist
- **N/A** — created per-session, may or may not exist

---

## ALL AGENTS — Universal Reading List

Every agent must read these on bootstrap/recovery:

```
ALL AGENTS
├── Own SKILL.md ................................................ EXISTS (all 11 files)
├── CLAUDE.md (workspace root) .................................. EXISTS
├── .claude/agents/agent-overview.md ............................ EXISTS
├── Own context file: session/agents/<role>.context.md
│   ├── orchestrator.context.md ................................. EXISTS
│   ├── scrum-master.context.md ................................. EXISTS
│   ├── oosh-expert.context.md .................................. MISSING
│   ├── oosh-tester.context.md .................................. MISSING
│   ├── task-agent.context.md ................................... MISSING
│   ├── product-owner.context.md ................................ MISSING
│   ├── developer.context.md .................................... MISSING
│   └── agent-trainer.context.md ................................ MISSING
├── docs/context-schema.md (if context file needs repair) ....... MISSING !!
└── (Mandatory rules embedded in each SKILL.md — no external file)
```

---

## Per-Agent Reading Lists

### Orchestrator (agent-teacher/SKILL.md)

```
Orchestrator
├── REQUIRED ON BOOTSTRAP
│   ├── .claude/agents/agent-teacher/SKILL.md ................... EXISTS
│   ├── session/agents/orchestrator.context.md .................. EXISTS
│   ├── .claude/agents/agent-overview.md ........................ EXISTS
│   ├── docs/context-schema.md .................................. MISSING !!
│   └── docs/oosh-architecture.md ............................... MISSING !!
├── REQUIRED FOR ROLE WORK
│   ├── .claude/agents/*/SKILL.md (all — for role enforcement) .. EXISTS (11 files)
│   ├── session/tasks/Task.40.5.cmm4-feedback-loop.md ........... MISSING !!
│   └── .claude/agents/script-product-owner/SKILL.md ............ EXISTS
└── REFERENCE
    └── CLAUDE.md ................................................ EXISTS
```

### ScrumMaster (scrum-master/SKILL.md)

```
ScrumMaster
├── REQUIRED ON BOOTSTRAP
│   ├── .claude/agents/scrum-master/SKILL.md .................... EXISTS
│   ├── session/agents/scrum-master.context.md .................. EXISTS
│   └── docs/context-schema.md .................................. MISSING !!
├── REQUIRED FOR ROLE WORK
│   ├── session/tasks/Task.40.5.cmm4-feedback-loop.md ........... MISSING !!
│   └── (no other external docs referenced)
└── REFERENCE
    └── .claude/agents/agent-overview.md ........................ EXISTS
```

### OOSH Expert (oosh-expert/SKILL.md)

```
OOSH Expert
├── REQUIRED ON BOOTSTRAP
│   ├── .claude/agents/oosh-expert/SKILL.md ..................... EXISTS
│   ├── session/agents/oosh-expert.context.md ................... MISSING !!
│   ├── docs/context-schema.md .................................. MISSING !!
│   └── docs/oosh-architecture.md ............................... MISSING !!
├── REQUIRED FOR ROLE WORK
│   ├── docs/completion-system.md ............................... MISSING !!
│   ├── docs/test-suite.md ...................................... MISSING !!
│   └── docs/log-levels-and-testing.md .......................... MISSING !!
└── REFERENCE
    └── /tmp/measure_pane.sh (metric prototype) ................. N/A (temp file)
```

### OOSH Tester (oosh-tester/SKILL.md)

```
OOSH Tester
├── REQUIRED ON BOOTSTRAP
│   ├── .claude/agents/oosh-tester/SKILL.md ..................... EXISTS
│   ├── session/agents/oosh-tester.context.md ................... MISSING !!
│   ├── docs/context-schema.md .................................. MISSING !!
│   └── docs/test-suite.md ...................................... MISSING !!
├── REQUIRED FOR ROLE WORK
│   ├── docs/log-levels-and-testing.md .......................... MISSING !!
│   ├── docs/completion-system.md ............................... MISSING !!
│   ├── docs/log.md ............................................. MISSING !!
│   └── test/ directory (existing test examples) ................ EXISTS (in OOSH dir)
└── REFERENCE
    └── .claude/agents/agent-overview.md ........................ EXISTS
```

### Task Agent (task-agent/SKILL.md)

```
Task Agent
├── REQUIRED ON BOOTSTRAP
│   ├── .claude/agents/task-agent/SKILL.md ...................... EXISTS
│   ├── session/agents/task-agent.context.md .................... MISSING !!
│   └── docs/context-schema.md .................................. MISSING !!
├── REQUIRED FOR ROLE WORK
│   └── session/tasks/ (existing task files) .................... EXISTS (directory)
└── REFERENCE
    └── (no other external docs referenced)
```

### Product Owner (product-owner/SKILL.md)

```
Product Owner
├── REQUIRED ON BOOTSTRAP
│   ├── .claude/agents/product-owner/SKILL.md ................... EXISTS
│   ├── session/agents/product-owner.context.md ................. MISSING !!
│   └── docs/context-schema.md .................................. MISSING !!
├── REQUIRED FOR ROLE WORK
│   ├── docs/first-principles.md ................................ MISSING !!
│   ├── docs/oosh-architecture.md ............................... MISSING !!
│   └── docs/completion-system.md ............................... MISSING !!
└── REFERENCE
    └── CLAUDE.md ................................................ EXISTS
```

### Agent Trainer (agent-trainer/SKILL.md)

```
Agent Trainer
├── REQUIRED ON BOOTSTRAP
│   ├── .claude/agents/agent-trainer/SKILL.md ................... EXISTS
│   ├── session/agents/agent-trainer.context.md ................. MISSING !!
│   ├── docs/context-schema.md .................................. MISSING !!
│   └── .claude/agents/*/SKILL.md (all — for auditing) ......... EXISTS (11 files)
├── REQUIRED FOR ROLE WORK
│   └── .claude/agents/agent-overview.md ........................ EXISTS
└── REFERENCE
    └── (no other external docs referenced)
```

### Developer (developer/SKILL.md)

```
Developer
├── REQUIRED ON BOOTSTRAP
│   ├── .claude/agents/developer/SKILL.md ....................... EXISTS
│   ├── session/agents/developer.context.md ..................... MISSING !!
│   └── docs/context-schema.md .................................. MISSING !!
├── REQUIRED FOR ROLE WORK
│   ├── docs/oosh-architecture.md ............................... MISSING !!
│   ├── docs/completion-system.md ............................... MISSING !!
│   ├── docs/log.md ............................................. MISSING !!
│   └── docs/log-levels-and-testing.md .......................... MISSING !!
└── REFERENCE
    └── CLAUDE.md ................................................ EXISTS
```

### WODA Writer (woda-writer/SKILL.md)

```
WODA Writer
├── REQUIRED ON BOOTSTRAP
│   ├── .claude/agents/woda-writer/SKILL.md ..................... EXISTS
│   ├── session/woda-writer.learnings.md ........................ EXISTS
│   └── session/woda-writer.context.md .......................... EXISTS
├── REQUIRED FOR ROLE WORK
│   ├── session/cmm.improvement.md .............................. EXISTS
│   ├── session/oosh-bugs.md .................................... N/A
│   ├── session/cmm4/cmm4-journey.md ............................ N/A
│   └── session/cmm4/cmm4-story.md .............................. N/A
└── REFERENCE
    └── session/woda/ (story files) ............................. EXISTS
```

### WODA Scribe (woda-scribe/SKILL.md)

```
WODA Scribe
├── REQUIRED ON BOOTSTRAP
│   ├── .claude/agents/woda-scribe/SKILL.md ..................... EXISTS
│   ├── session/woda-scribe.learnings.md ........................ EXISTS
│   └── session/wodaScribe.context.md ........................... EXISTS
├── REQUIRED FOR ROLE WORK
│   ├── session/cmm.improvement.md .............................. EXISTS
│   ├── session/woda-kb.md ...................................... EXISTS
│   └── session/context-burn-log.md ............................. N/A
└── REFERENCE
    └── (no other external docs referenced)
```

### Script Product Owner (script-product-owner/SKILL.md)

```
Script Product Owner (TEMPLATE — not a standalone agent)
├── REQUIRED FOR AUDITS
│   ├── .claude/agents/script-product-owner/SKILL.md ............ EXISTS
│   └── The script being audited ................................ (varies)
└── REFERENCE
    └── (no other external docs referenced)
```

---

## CRITICAL: Missing Documents Summary

**7 docs/ files are referenced across multiple agents but NONE exist:**

| Missing Document | Referenced By | Times Referenced |
|-----------------|--------------|-----------------|
| `docs/context-schema.md` | ALL agents (9) | 9 |
| `docs/oosh-architecture.md` | Orchestrator, Expert, Developer, PO | 4 |
| `docs/completion-system.md` | Expert, Tester, Developer, PO | 4 |
| `docs/test-suite.md` | Expert, Tester | 2 |
| `docs/log-levels-and-testing.md` | Expert, Tester, Developer | 3 |
| `docs/first-principles.md` | PO | 1 |
| `docs/log.md` | Tester, Developer | 2 |

**1 task file referenced but missing:**

| Missing Task | Referenced By |
|-------------|--------------|
| `session/tasks/Task.40.5.cmm4-feedback-loop.md` | ScrumMaster, Orchestrator |

**6 context files missing** (only orchestrator + scrum-master exist):

| Missing Context File | Agent |
|---------------------|-------|
| `session/agents/oosh-expert.context.md` | OOSH Expert |
| `session/agents/oosh-tester.context.md` | OOSH Tester |
| `session/agents/task-agent.context.md` | Task Agent |
| `session/agents/product-owner.context.md` | Product Owner |
| `session/agents/developer.context.md` | Developer |
| `session/agents/agent-trainer.context.md` | Agent Trainer |

---

## Governance Assessment

**No agent can be considered "fully trained" when their SKILL.md tells them to read documents that don't exist.**

Every recovery sequence says "Read docs/context-schema.md if context file needs repair" — that file doesn't exist. Every expert/tester recovery says "Read docs/oosh-architecture.md" — that file doesn't exist. The agents are being told to read phantom references.

**The WODA duo is the healthiest**: their learnings files, context files, and KB all exist. Their SKILL.md files reference files that are actually on disk.

**The cursorOrchestrator team is the worst**: 7 phantom doc references, 4 missing context files, 1 missing task file. An agent recovering after compaction would fail at step 3-5 of every recovery sequence.

### Priority Actions

1. **IMMEDIATE**: Create `docs/context-schema.md` — referenced by ALL 9 agents
2. **HIGH**: Create `docs/oosh-architecture.md` — referenced by 4 agents
3. **HIGH**: Create empty context file templates for the 6 missing agents
4. **MEDIUM**: Create remaining docs/ files or remove references from SKILL.md
5. **LOW**: Create `session/tasks/Task.40.5.cmm4-feedback-loop.md` or update SM reference
