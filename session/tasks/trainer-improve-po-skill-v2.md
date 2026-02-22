# Task: Improve PO SKILL.md — Fractal PDCA and Web4x Maturity

**From**: PO (self-improvement via trainer)
**For**: agent-trainer
**Priority**: HIGH — self-care before next task

## Context

The PO just reached a new maturity level through Tron's teaching:
- Fractal PDCA mapped to WODA (W=tree, O=plan, D=tasks, A=do/check/act)
- Web4x naked principle (self-managing lifecycle, no baked deps)
- KB feedback loop (learn → KB + memory → reference from context)
- Boot file discipline (one filename, foundational reading on every boot)

This maturity must survive compact. It must be in the SKILL.md so every future PO starts here.

## Before editing

1. Run `git log --oneline -10 .claude/agents/product-owner/SKILL.md` — see evolution
2. Read the current `.claude/agents/product-owner/SKILL.md` — understand what's there
3. Read `session/knowledge-base/fractal-pdca-remote-boot.md` — the pattern to add
4. Read `session/knowledge-base/docker-image-lifecycle.md` — web4x naked principle
5. Read `session/knowledge-base/cmm-web4x.md` — CMM reference (already linked?)

## What to ADD (do not remove existing content)

### 1. Fractal PDCA Section

The PO manages complex goals as fractal PDCA stacks:
- Each goal decomposes into levels, each level is its own PDCA cycle
- WODA maps to PDCA: W=goal tree, O=level plan, D=task files, A=do/check/act
- Work bottom-up like a call stack — each level must PASS before the next
- New sublevels emerge as you discover prerequisites (fractal depth)
- Reference: `session/knowledge-base/fractal-pdca-remote-boot.md`

### 2. Knowledge Base Feedback Loop

Add to existing rules or create new section:
- Every learning → contribute to KB (team) AND MEMORY.md (self)
- Before solving any problem → check `session/knowledge-base/index.md` first
- Context holds references to KB articles, not the content itself (lazy loading)
- KB survives compacts, agents, sessions. Chat history doesn't.
- Reference: `session/knowledge-base/usage.md`

### 3. Web4x Principles for PO

The PO applies web4x to architectural decisions:
- Self-managing lifecycle: software bootstraps itself, doesn't need pre-baked deps
- Naked images = minimal preconditions (SSH only for Docker)
- Walking sticks (shell scripts) → proper oosh-wrapped tools
- Each tool follows naming: tmux→otmux, ssh→ossh, docker→odocker
- Reference: `session/knowledge-base/docker-image-lifecycle.md`

### 4. Boot File Discipline (update existing Agent Lifecycle section)

Add F30 learnings:
- One file: boot.md. Always. Never create variant filenames.
- Boot must include foundational reading: woda, CMM, KB
- Pre-compress hook respects recent boot.md (<120s)
- Never rename source files without impact analysis
- Reference: `session/knowledge-base/compaction-recovery.md` (F30 section)

## What NOT to change

- First Principles, Usability Contract, Script Ownership — correct
- Team Quality Ownership, Agent Lifecycle (from trainer v1) — correct, just extend
- Manual Mode, Communication — correct

## Deliverable

Targeted edits to `.claude/agents/product-owner/SKILL.md`. Commit with message explaining what was added.
