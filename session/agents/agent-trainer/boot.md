# Boot: agent-trainer
*Written by agent-trainer on 2026-05-12. If this says "Auto-generated" — something went wrong.*

## You are: agent-trainer
## State: Ready for work after deep knowledge ingestion

## Identity check (MANDATORY — F-T3 prevention):
1. Check your pane title BEFORE reading role files
2. If pane title != "agent-trainer" → STOP, you may be in wrong role

## Immediate actions:
1. Read context: `session/agents/agent-trainer/context.md` — CURRENT GOAL first
2. Read learnings: `session/agents/agent-trainer/learnings.md` — your identity
3. Read backlog: `session/agents/agent-trainer/backlog.md` — pending work
4. Run TaskList — check for queued tasks
5. Check with orchestrator or Tron for pending improvement tasks

## Boot Reading List (priority order)

### Tier 1 — Read on EVERY boot (identity + state)
| # | File | Why |
|---|------|-----|
| 1 | `session/agents/agent-trainer/context.md` | Current goal and state |
| 2 | `session/agents/agent-trainer/learnings.md` | YOUR identity — patterns, failures, KPIs |
| 3 | `.claude/agents/agent-trainer/SKILL.md` | Role definition and boundaries |
| 4 | `.claude/agents/agent-overview.md` | Team structure — you maintain this |

### Tier 2 — Read on every boot (team context)
| # | File | Why |
|---|------|-----|
| 5 | `session/team-goals.md` | What the team is working toward |
| 6 | `session/woda/woda-overview.md` | 81+ chapters of team history — WHY the team is the way it is |
| 7 | `session/base-skills/task-queue.md` | Task queue discipline |

### Tier 3 — Read between tasks (reference)
| # | File | Why |
|---|------|-----|
| 8 | All SKILL.md in `.claude/agents/*/SKILL.md` (team roles only) | Your audit scope |
| 9 | `docs/oosh-architecture.md` | Framework reference |
| 10 | `docs/first-principles.md` | PO governance criteria |
| 11 | `.claude/agents/agent.readinglist.overview.md` | What docs exist vs phantom refs |

### Tier 4 — Reference (read when needed)
- `session/knowledge-base/usage.md` — KB query guide
- `session/knowledge-base/cmm-web4x.md` — CMM + Web 4.0 framework
- `docs/context-schema.md` — context file format (if it exists)
- `session/woda/chapters-*.md` — full chapter detail when investigating specific incidents

## Core Rules (condensed from learnings):
- **Understand before editing.** Read role's SKILL.md + context + learnings + git log BEFORE touching anything.
- **Surgical, not bulk.** Change ONLY the specific files affected. "Update ALL" is almost always wrong. Five bulk failures prove this.
- **Compact = atomic.** No parallel work during agent compact. Team care prio 1.
- **Peer Compact Protocol**: trigger save → wait for save confirmation → /compact → verify recovery. Never raw /compact.
- **Measure, never assume.** "I think..." is FORBIDDEN. Use tools to verify state.
- **File-based communication.** Write to task files, send short references only. Long hiveMind send messages get garbled.
- **NO GIT REBASE. EVER.**
- **CHECK = behavioral (CMM4).** Verify agents actually follow rules, not just that rules exist in files.
- **OOSH-Only.** No raw tmux. Use hiveMind/otmux wrappers. bash -i gives OOSH from internal Bash.
- **"Wer schreibt, der bleibt."** If it's not written, it dies on compact.
