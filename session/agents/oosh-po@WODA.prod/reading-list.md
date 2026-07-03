# oosh-po@WODA.prod — starting reading list
*My own reading list (NOT the shared `.claude/agents/product-owner/SKILL.md`). Read on boot, in order.*

## 0. The Heart (before any work)
- `session/agents/TRON-CMM4-doctrine.md` — TRON/CMM4 canon; the single source.
- `session/base-skills/agent-rewind.md` — CANONICAL rewind base-skill (ARON, c4e6114): post-rewind recovery (`otmux pane.history` + `ls scrum.pmo/sprints*` BEFORE trusting saves) + good rewind-save spec. Read on EVERY rewind boot.

## 1. My identity + memory (this folder)
- `session/agents/oosh-po@WODA.prod/context.md` — current state / PARKED checkpoints.
- `session/agents/oosh-po@WODA.prod/learnings.md` — durable skills (grep before repeating a mistake).
- I am **oosh-po@WODA.prod** (pane ooshTeam:0.0, uuid 29a1e1d1). NEVER write the shared `session/agents/oosh-po/`; my peer is oosh-po@MacStudio. Coordinate via the **git mailbox** (pull → commit → push).

## 2. My authoritative plan + the template
- **BOOT: `ls scrum.pmo/sprints*` FIRST** — per-host split means my plan lives at `scrum.pmo/sprints@WODA.prod/sprint-1/planning.md` (TRON 2026-07-03 Reliable-Send sprint, flat tasks 01-17), NOT bare `sprints/sprint-2/` (stale). Drive from the current `sprints@WODA.prod/sprint-N`; never trust a remembered bare path (rewind moves the world). Push after every report.
- `scrum.pmo/sprints/sprint-1-state-correctness/` — **the TEMPLATE reference**: `planning.md` + `task-<sprint>.<n>-<owner>-<desc>.md` with `[task:uuid:…]`, Status checklist, Traceability up/down, DoD. Match this shape (Tron: "use the correct templates").

## 3. Doctrine / process
- SCENARIO FIRST (TRON law #100) + PO law #125 (gate GREEN→signal downstream) — DOCTRINE I follow. NOTE: `skill-canon-2026-07.md` is SUPERSEDED; do NOT self-append rules. ARON weaves them per-role + deduped (consolidation-to-essence).
- `.claude/agents/oosh-po@WODA.prod/SKILL.md` — MY SKILL/identity. Base role = shared `.claude/agents/product-owner/SKILL.md` (I inherit it; NEVER edit it).

## 4. OOSH architecture + core scripts (once.sh @dev, `/root/oosh`)
- `components/OOSH/dev.claude/docs/oosh-architecture.md` — technical reference.
- Core scripts: `hiveMind` (controller), `otmux` (view), `claudeCode` (model), `odocker` (docker lifecycle), `ossh` (ssh identity), `this`/`oo`/`config`/`state`/`test.suite`.
- MVC: Model=claudeCode · View=otmux · Controller=hiveMind · Monitor=tronMonitor. Route agent ops through the controller (never raw tmux/claude; `otmux send.raw`/`pane.capture` ARE sanctioned wrappers).

## 5. Context (background)
- The WODA story.
- `CLAUDE.md` (workspace) + `components/OOSH/dev.claude/CLAUDE.md` (agent workflow).

## Planning-effort updates (2026-07-02)
Machine-split convention (Tron 2026-07-02): WODA.prod bare at sprint level THROUGH sprint-2 (stays in scrum.pmo/sprints/); at SPRINT-3 add scrum.pmo/sprints@WODA.prod (full per-host); other machines = sprints@host (MacStudio→sprints@MacStudio). Added §2 (sprint-1 template + sprint-2 authoritative) + §3 (skill-canon). PO gates on the tester report; never runs tests.
- session/knowledge-base/planning-templates.md — scrum.pmo planning templates + status/traceability/dual-link rules (ARON-purifying)
