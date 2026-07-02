# oosh-po@prototype — Consolidation Review (dual-linked)

*ARON consolidation, TRON directive 2026-07-02. Review the cleaned essence against its sources. Non-destructive: the LIVE oosh-po is untouched; sources here are review copies under `_sources/`. **Dual links** below = `[GitHub](blob-url) | [local](path)` (push-first so GitHub links work).*

## Cleaned files (dual links = GitHub | local)
- **context.md** ✅ distilled 293→~50 lines — [GitHub](https://github.com/web4x/Web4AI/blob/main/session/agents/oosh-po@prototype/context.md) | [local](./context.md)
  - syncStatus: CONSOLIDATED — identity + eternal rules kept; 7 rewind checkpoints + superseded June-28 park DROPPED (measured: team on sprint-setup-server-crossplatform).
  - sources: [GitHub](https://github.com/web4x/Web4AI/blob/main/session/agents/oosh-po@prototype/_sources/oosh-po@WODA.prod/context.md) | [local](./_sources/oosh-po@WODA.prod/context.md)
- **SKILL.md** ⏳ next — source [GitHub](https://github.com/web4x/Web4AI/blob/main/session/agents/oosh-po@prototype/_sources/product-owner.claude/SKILL.md) | [local](./_sources/product-owner.claude/SKILL.md) (746 lines → essence, doctrine woven per-role; F29 anti-bulk)
- **learnings + achievements → OFFICIAL MEMORY** ✅ migrated — [MEMORY.md](https://github.com/web4x/Web4AI/blob/main/session/agents/oosh-po@prototype/MEMORY.md) | [local](./MEMORY.md) + `memory/` (8 typed fact-files, frontmatter `metadata.type`, `[[links]]`). Replaces the monolithic learnings.md/achievements.md. *(Deeper WODA.prod learnings can be migrated into more memory facts next.)*
- **boot.md** ⏳ next — source WODA.prod (near-clean; minor tidy)

## Excluded (measured: NOT this identity)
- `product-owner.session` = the **master-PO / TRONinterface** agent (June-10 stale) — a *different* role; kept OUT of oosh-po@prototype (its own cleanup later).

## Identity pattern — prepared for ALL agents (not one-by-one), DRY
TRON 2026-07-02: SKILL/boot must carry the *commands* to verify identity, never hardcoded pane/host/uuid (forks inherit stale values; continuity lies). Context keeps the hardcoded snapshot BUT with **`Last updated` on top** — if stale, re-verify + re-save.
- **One shared source** all agents reference (DRY, not per-file bulk — F29): [`session/base-skills/identity-verification.md`](https://github.com/web4x/Web4AI/blob/main/session/base-skills/identity-verification.md) | [local](../../base-skills/identity-verification.md) — OOSH primary (`$CLAUDE_CODE_SESSION_ID`, `claudeCode session.name`, `otmux pane.self`, `config get OOSH_SSH_CONFIG_HOST`) + naked-tmux fallback; NEVER `$TMUX_PANE`/pane-title (proven to lie: %8 vs real %11).
- Every agent's **boot.md** runs the 4 verify-commands first; every **context.md** carries `Last updated` on top. This is the pattern rolled to all agents.

## Suggestion — move closer to Claude's OFFICIAL file structure (Opus 4.8 / Fable)
These `session/agents/<name>/{context,learnings,achievements,boot}.md` files are a **custom** structure, parallel to (outside) how Opus 4.8 & Fable are natively designed to handle agent files. Closer-to-official:
1. **SKILL.md** — already official: `.claude/agents/<name>/SKILL.md` with YAML frontmatter (`name`, `description`). Keep as-is. ✅
2. **learnings.md + achievements.md → the official MEMORY system.** The native format is one *fact per file* under the project `memory/` dir with frontmatter — `name`, `description`, `metadata.type: user | feedback | project | reference` — a `MEMORY.md` one-line index, and `[[name]]` links between facts. This is what Opus 4.8/Fable **auto-recall** from (a monolithic `learnings.md` is not natively surfaced). Migrate the durable learnings/achievements into typed memory files + MEMORY.md index.
3. **context.md → session recovery** kept, with `Last updated` on top; a durable slice can be a `type: project` memory.
4. **boot.md → shrinks:** the official reread is `CLAUDE.md` (project instructions) + the auto-loaded `MEMORY.md` index; boot.md reduces to identity-verification + "read MEMORY.md".
5. **Frontmatter on every file** so the runtime recognizes them natively.
**Net:** keep SKILL.md (official) + add the memory/ layer (frontmatter facts + MEMORY.md) for learnings/achievements → recall works the way the model is built, and the custom duplication shrinks.

## Gate
Only after TRON reviews these dual-linked pairs and signs off: write the cleaned set → re-teach → **safe rewind** (`session/base-skills/agent-rewind.md`) — trainer as 42-peer, SM watching, signal before the first destructive write.
