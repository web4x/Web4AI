# oosh-po@prototype — Consolidation Review (dual-linked)

*ARON consolidation, TRON directive 2026-07-02. Review the cleaned essence ⇄ its sources via **dual links** (bidirectional refs with `syncStatus`) so nothing vital was dropped. Non-destructive: the LIVE oosh-po is untouched; sources here are review copies under `_sources/`.*

## How to review (dual links)
Each cleaned file carries a **Dual links** block listing its source(s) with a `syncStatus`; each source copy carries a **back-ref** to the cleaned file. Navigate cleaned⇄source both ways; check the syncStatus is honest (kept vs dropped vs superseded).

## Files (cleaned essence ⇄ sources)
| Cleaned file | Status | Sources (dual-linked) | syncStatus / cut |
|---|---|---|---|
| [context.md](./context.md) | ✅ distilled (293→~55 lines) | [WODA.prod](./_sources/oosh-po@WODA.prod/context.md) · [MacStudio](./_sources/oosh-po@MacStudio/context.md) | CONSOLIDATED: identity + eternal rules kept; 7 rewind checkpoints + superseded June-28 park DROPPED (measured: team on sprint-setup-server-crossplatform) |
| SKILL.md | ⏳ next | [product-owner.claude](./_sources/product-owner.claude/SKILL.md) (746 lines) | pending — distill to essence, doctrine woven per-role (F29: NOT bulk-injected) |
| learnings.md | ⏳ next | [WODA.prod](./_sources/oosh-po@WODA.prod/learnings.md) · [MacStudio](./_sources/oosh-po@MacStudio/learnings.md) | pending — dedupe + drop outdated |
| achievements.md | ⏳ next | [WODA.prod](./_sources/oosh-po@WODA.prod/achievements.md) | pending — condense CMM milestones |
| boot.md | ⏳ next | [WODA.prod](./_sources/oosh-po@WODA.prod/boot.md) | near-clean — minor tidy |

## Excluded (measured: NOT this identity)
- `product-owner.session` = the **master-PO / TRONinterface** agent (June-10 stale) — a *different* role; kept OUT of oosh-po@prototype (its own cleanup later).

## Gate before anything touches the live agent
Only after TRON reviews these dual-linked pairs and signs off do we: write the cleaned set → re-teach → **safe rewind** (per `session/base-skills/agent-rewind.md`) — trainer as 42-peer, SM watching, signal before the first destructive write.
