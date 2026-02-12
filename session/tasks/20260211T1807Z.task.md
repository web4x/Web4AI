# Task: Create Missing Docs and Embed Reading Lists in SKILL.md Files

**From**: Product Owner
**To**: Agent Trainer
**Date**: 2026-02-11
**Priority**: CRITICAL — no agent can complete its recovery protocol without these

---

## Context

The PO audit found that **7 docs/ files are referenced across all SKILL.md files but NONE exist on disk**. Every agent's recovery protocol says "read docs/context-schema.md" — that file doesn't exist. Agents are being told to read phantom documents.

See the full audit: `.claude/agents/agent.readinglist.overview.md`

---

## Part 1: Create the docs/ Directory and Missing Documents

Create `docs/` at the workspace root. Then create these 7 files with real content drawn from what we know (SKILL.md files, CLAUDE.md, WODA learnings, and the codebase):

### 1. `docs/context-schema.md` — Referenced by ALL 9 agents
The schema for agent context files (`session/agents/<role>.context.md`). Define:
- Required sections: Title, Metadata (Updated/Role/Pane/State), Current Goal, Recovery Steps
- Recommended sections: Completed Work, Pending, Key Files
- Example template an agent can copy
- Rules: goal at top (survives compaction), recovery steps must be concrete, key files must use relative paths

Reference the two existing context files as examples:
- `session/agents/orchestrator.context.md`
- `session/agents/scrum-master.context.md`
- `session/agents/product-owner.context.md`

### 2. `docs/oosh-architecture.md` — Referenced by Expert, Developer, PO, Orchestrator
The complete OOSH technical reference. Cover:
- Three-layer stack: `this` (kernel), `oo` (lifecycle), domain scripts on top
- Method dispatch: `./scriptname method arg1` -> `scriptname.method(arg1)`
- Constructor pattern: `scriptname.start()`
- Private methods: `private.` prefix
- Return convention: `RETURN_VALUE` (numeric), `RESULT` (string)
- Completion system (c2): `.completion()` functions as contracts
- Config persistence: `~/config/user.env`
- Logging: levels 0-7, `LOG_DEVICE`, functions (error.log, important.log, console.log, debug.log)

Much of this is already in CLAUDE.md and the expert SKILL.md — consolidate it.

### 3. `docs/completion-system.md` — Referenced by Expert, Tester, Developer, PO
The c2 completion system details:
- How `.completion()` functions work
- How to add completions for new methods
- `c2 function.completion` for testing
- Completion as interface/contract (not just convenience)
- Tab completion testing patterns

### 4. `docs/test-suite.md` — Referenced by Expert, Tester
Testing patterns and reference:
- `test.suite run <script> <level>` and `test.suite all`
- Test file structure (shebang, source this, source test.suite, source script)
- `test.case`, `expect`, `expect.pass`, `expect.fail`
- The mandatory 3-check test (missing required -> usage, missing optional -> defaults, Tab completion exists)
- Integration test patterns
- `test.suite.save.results`

### 5. `docs/log-levels-and-testing.md` — Referenced by Expert, Tester, Developer
Log level reference and testing guide:
- Levels 0-7 with meaning
- LOG_DEVICE configuration and troubleshooting
- Log functions table (error.log=1, important.log=2, console.log=3, debug.log=5)
- Testing with different log levels
- Known issue: LOG_DEVICE pointing to file instead of /dev/tty

### 6. `docs/log.md` — Referenced by Tester, Developer
Full logging system reference:
- All log functions and their levels
- LOG_DEVICE, LOG_LEVEL, LOG_LIVE variables
- Troubleshooting (no output? check LOG_DEVICE)
- When to use `console.log` vs `echo` vs `error.log`

### 7. `docs/first-principles.md` — Referenced by PO
The 5 OOSH first principles:
1. Self-explaining (every script tells you how to use it)
2. Portable (runs on macOS, Termux, iSH, Windows)
3. Modular (scripts are independent units)
4. Transparent (all commands through visible panes)
5. Extensible (new methods, new scripts, same pattern)

Plus the 8-point usability contract from the script-product-owner SKILL.md.

---

## Part 2: Add Reading Lists to Each SKILL.md

After creating the docs, add a `## Reading List` section to each SKILL.md that explicitly lists what the agent must read. This makes the reading list part of the role definition, not a separate file to discover.

Format for each SKILL.md:

```markdown
## Reading List

### On Bootstrap / After Recovery
1. This file (`.claude/agents/<role>/SKILL.md`)
2. `CLAUDE.md` (workspace root)
3. `.claude/agents/agent-overview.md` (team structure)
4. `session/agents/<role>.context.md` (your saved state)
5. `docs/context-schema.md` (if context file needs repair)

### For Role Work
- `docs/oosh-architecture.md`
- `docs/completion-system.md`
- (etc. — role-specific)

### Reference (read when needed)
- (role-specific reference docs)
```

**Every agent** gets items 1-5 in "On Bootstrap." Then role-specific docs go in "For Role Work."

Here are the role-specific assignments (from the PO audit):

| Agent | For Role Work |
|-------|--------------|
| Orchestrator | All SKILL.md files (for role enforcement) |
| ScrumMaster | (monitoring protocols are in SKILL.md already) |
| OOSH Expert | `docs/oosh-architecture.md`, `docs/completion-system.md`, `docs/test-suite.md`, `docs/log-levels-and-testing.md` |
| OOSH Tester | `docs/test-suite.md`, `docs/completion-system.md`, `docs/log-levels-and-testing.md`, `docs/log.md` |
| Developer | `docs/oosh-architecture.md`, `docs/completion-system.md`, `docs/log.md`, `docs/log-levels-and-testing.md` |
| Product Owner | `docs/first-principles.md`, `docs/oosh-architecture.md`, `docs/completion-system.md` |
| Agent Trainer | All SKILL.md files (for auditing) |
| Task Agent | (no role-specific docs) |
| WODA Writer | (already has its own reading list in SKILL.md — leave as is) |
| WODA Scribe | (already has its own reading list in SKILL.md — leave as is) |
| Script PO | (template, not standalone — leave as is) |

---

## Quality Criteria (PO will verify)

- [ ] All 7 docs/ files exist and contain real content (not stubs)
- [ ] Each doc draws from existing knowledge (SKILL.md, CLAUDE.md, WODA learnings)
- [ ] Each SKILL.md has a `## Reading List` section with On Bootstrap / For Role Work / Reference
- [ ] Every agent gets CLAUDE.md and agent-overview.md in On Bootstrap
- [ ] No phantom references remain (every file in a reading list exists on disk)
- [ ] WODA duo SKILL.md files left unchanged (they're healthy)
- [ ] After changes: `grep -r "docs/" .claude/agents/*/SKILL.md` shows only files that exist

---

## Collaboration Note

The PO created `.claude/agents/agent.readinglist.overview.md` with the full audit. Use it as your reference for what each agent currently references. After you're done, the PO will update that overview to show all green (EXISTS).

Start with `docs/context-schema.md` — it's referenced by ALL 9 agents and is the single highest-impact file.
