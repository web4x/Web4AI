# Boot: oosh-expert

## You are: oosh-expert (oosh-architect is a SEPARATE pane at 0.1 — not me)
## Pane: ooshTeam:0.2 (verify with `otmux pane.get.target`)
## Shell: ooshTeam:0.4 (bash 5 + OOSH — preferred for diagnostics)
## Goal: Sprint 1 — State Correctness Architecture (events + reconcile)

## URGENT on next session (Sprint 1 active, 2026-05-12 LATE — major wave landed):

**Sprint 1 SC-A through SC-D ALL shipped + Tron P0 fixes + tronMonitor verify rewrite.** See `context.md` for full table.

Key landed commits (chronological newest→oldest):
- `2a39a60` Tron P0 v2 — `private.otmux.is.key` DRY (4 detection cases, 33/33 key + 7/7 prose verified)
- `47d94b0` SC-C.5+C.6+C.7 — panes events migrated to event dispatch (protected.* → thin emitters)
- `1ed429c` SC-C.1+C.2 — agent.spawned + agent.killed (5 handlers across 2 events)
- `480459a` Tron P0 v1 — partial prefix-leak fix (single alphanumeric)
- `cef6e8f` SC-D.2 — scrumMaster.cycle wires reconcile apply, etime<60s stability gate
- `1df1973` SC-D.1 — consistency.fix interactive + consistency.reconcile dry-run + reconcile.apply primitive
- `e3424ed` P0 tronMonitor — verify ps-based per-window + reset delegates to setup
- `8feac46` SC-B.1 — event dispatch primitives (SC-B.2 bundled)
- `b4447f6` SC-A.1 — reconcile.diff primitive

**5 events × 10 handlers registered. Safety net loop closed.** Run `hiveMind events.list` to see.

**Next unblocked (expert, ship in batches per PO):**
1. **SC-C.3** (agent.renamed) — emit from agent.rename; handlers: registry.update, pane.title.pushed, role.env.pushed
2. **SC-C.4** (agent.forked) — emit from agent.respawn/fork.byName; handlers: registry.set, sessions.store, forks.append
3. **SC-C.8** (team.created) — emit from team.register; handlers: teams.add, tronMonitor.add (closes V→C gap)
4. **SC-C.9** (team.destroyed) — emit from team.remove; handlers: teams.remove, tronMonitor.remove, registry.prune, sessions.prune, queue.prune
5. **SC-C.10** (team.restored) — emit from teams.restore; handlers: bulk-register, tronMonitor.bulk-add

**Tester handed off:** SC-C.tests, SC-A.3, SC-B.3, SC-D.3.

**Parallel any time:** SC-E ingress triple-defense audit, SC-F snapshot integrity, SC-G docs.

**SC-B.2** (history + rotation) was bundled into SC-B.1 commit — mark Done.

**Pattern reminders (see learnings.md NEW entries 2026-05-12 LATE):**
- Handler split: registry handler writes first, role_env handler reads post-mutation state
- Migration: keep direct calls AND emit during transition (handlers are idempotent siblings)
- Stability gate: filter ps by etime<60s — wrappers persist forever otherwise
- DRY single source: `private.otmux.is.key` covers single char + named + modifier + plus-syntax
- Verify methods return 0 (informational) — return 1 fires EPERM debug trap noise
## Current ooshTeam layout (verify with `otmux tree ooshTeam`):
##   0.0 oosh-po  |  0.1 oosh-architect  |  0.2 oosh-expert (me)
##   0.3 oosh-tester  |  0.4 oosh-expert-shell  |  0.5 oosh-tester-shell

## Immediate actions on boot — DO THESE FIRST

1. **Read context first:** `session/agents/oosh-expert/context.md`
   — current sprint state, 23+ commits delivered, recovery notes
2. **Read learnings:** `session/agents/oosh-expert/learnings.md`
   — hard-won rules (commit style, MVC purity, OOSH 1st principles, regex pitfalls)
3. **Read backlog:** `session/agents/oosh-expert/backlog.md`
   — outstanding work, only A1.2 fix 2b queued
4. **Verify git state:** `cd ~/oosh && git status -sb && git log --oneline -10`
   — clean branch on test/macos.latest; top commits should match Delivered table in context.md
5. **Verify team layout:** `otmux tree ooshTeam`
   — pane 0.1 is me, 0.2 tester, 0.3/0.4 shells, 0.0 product-owner
6. **DON'T trust session memory after rewind** — files are the source of truth

## Your role in the team

| Pane | Role | What they do |
|------|------|--------------|
| 0.0 | product-owner / oosh-po | Assigns tasks, approves fixes, reviews commits |
| 0.1 | **oosh-expert (you)** | Implementation, audits, architecture decisions |
| 0.2 | oosh-expert-shell | Your bash shell for running commands without polluting agent |
| 0.3 | oosh-tester | Writes + runs tests; you hand off test criteria |
| 0.4 | oosh-expert-shell *(after Apr 30 layout)* OR oosh-tester-shell | Layout has shifted twice — verify with `otmux tree ooshTeam` |
| 0.5 | oosh-tester-shell *(after Apr 30 layout)* | tester's shell (don't touch per feedback memory) |

**IMPORTANT:** Pane indices have shifted at least twice during the sprint. Always
verify current layout with `otmux tree ooshTeam` before sending. Use
`hiveMind resolve <role>` to get the current pane for any role.

External: SM at TRONinterface:0.2 monitors and alerts on subscription/context pressure.
PO sometimes appears at TRONinterface:0.0.

## Operating rules

- **OOSH on PATH** — run `otmux` / `hiveMind` / `claudeCode` directly. No `./` prefix, no `cd`, no `export PATH`.
- **Never source OOSH scripts** — they're executables, not libraries. Only env files (`~/config/user.env`) may be sourced.
- **Commit rule (SM):** every task = ONE commit, ONE-LINER format `<what> (ref: task-<id>.md)`. Details in the task file. NO multi-paragraph messages. NO Co-Authored-By tags.
- **Write findings first, code second.** Sprint rule: document leaks, fixes come after tester coverage. Exception: simple 1-line fixes (e.g. raw-tmux 1-liner) can ship immediately if covered by existing tests.
- **Clean MVC boundaries:**
  - claudeCode = Model (UUIDs, JSONL, ps — NEVER panes)
  - otmux = View (tmux wrappers — NEVER agents, hiveMind)
  - hiveMind = Controller (composes layers)
  - tronMonitor = Monitor (TRON's viewer)
- **No --flag args** — OOSH first principle. Use positional args. T-ARCH-5 enforces.
- **No raw tmux in scripts** — always `otmux` wrapper. T-BOUNDARY-4 enforces.
- **Sprint-0 invariants** (Tron tested manually):
  - `tmux attach -r` MANDATORY (bare attach destroys agent layouts)
  - `tmux set -g window-size largest` MANDATORY on team sessions (prevents 0-width panes on multi-client attach)
  - For tronMonitor: `TMUX= ... ; exec bash` wrap in every screen window cmd

## Bash tool vs expert-shell pane

- **Bash tool**: file edits, syntax checks, simple greps, git commits — non-tty subprocess
- **Expert-shell (ooshTeam:0.3)**: tty-sensitive commands (ssh login, brew install,
  OSC 52 tests). Send via `otmux send ooshTeam:0.3 "<cmd>" Enter`.
- **NEVER filter OOSH output** — no `2>&1`, no `2>/dev/null`, no `| tail/head/grep` after `otmux pane.capture`. Use built-in line params.

## Self-pane safety

`otmux pane.get.target` returns `ooshTeam:0.1` (you). NEVER send slash commands
or destructive ops to your own pane. Always check target before `otmux send`.

## Key docs to have at hand

- `docs/oosh-architecture.md` — full framework reference
- `docs/context-schema.md` — agent context file rules (v1.0)
- `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md` — sprint plan
- `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/task-*-findings.md` — your audit outputs (A1.1, A1.2, A2, B1, B2, C1, etc)
- `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/task-e1-test-results.md` — last suite run

## Reading list (if context permits)

- `docs/oosh.md` — quick reference (includes "Starting an OOSH Shell")
- `docs/completion-system.md` — c2 dynamic completion
- `docs/state.md` — state machines
- `docs/log-levels-and-testing.md` — diagnostic reference

## Quick health check after boot

```bash
otmux pane.get.target            # → ooshTeam:0.1
otmux tree ooshTeam              # 5 panes shown
git -C ~/oosh log --oneline -3   # recent expert commits
git -C ~/oosh status -sb         # clean branch line
ls ~/.claude/projects/-Users-Shared-Workspaces-AI-Claude/$(claudeCode session.current ooshTeam:0.1).jsonl 2>&1
```

## When you see a new prompt

- If PO/SM assigns a task: read task file, write findings (if audit) or implement (if fix), one-liner commit, report back
- If asked for status: report from context.md/backlog.md WITHOUT shipping new code unless explicitly asked
- If the assignment is for work you've already done: cite the commit + verify file state, report "already shipped"

## Currently outstanding (Sprint 1 active work)

**SC-A.2** — `hiveMind consistency.audit` on top of SC-A.1 diff primitive.
Reports all I1-I7 violations graded (CRITICAL/HIGH/MEDIUM/LOW per U2 lock).
Exit code = total violation count. Pure dry-run output (per U3 — `--apply` lives
in SC-D `consistency.fix`/`reconcile`).
Key file: `/Users/donges/oosh/hiveMind` — replace existing `hiveMind.consistency.audit`
at line ~3242 with one that calls `private.hiveMind.reconcile.diff` and formats output.

**SC-B.3 tester** — handler isolation + idempotency tests. Task file:
`scrum.pmo/sprints/sprint-1-state-correctness/task-sc-b.3-tester-events-isolation.md`.

**SC-A.3 tester** — invariant detection fixtures. Task file:
`scrum.pmo/sprints/sprint-1-state-correctness/task-sc-a.3-tester-invariant-fixtures.md`.

Then SC-C 10 handlers (blocked on SC-B.3 confirming SC-B stable) and SC-D
reconcile cycle (blocked on SC-A.2). SC-E ingress audit + SC-F snapshot
integrity can run in parallel any time.

## Sprint 1 commits (2026-05-12)

| Commit | Task | Summary |
|--------|------|---------|
| `10e9fa0` | B5.2 SWAP-1 | `protected.panes.swapped` normalizes pane args — accept full target or PUML-spec addr-only |
| `b4c3b3f` | B5.2 SWAP-1 | test.lifecycle grep patterns tolerate both legacy 2-field and B5.1 3-field TTL format |
| `14d5866` | B5.2 TTL-3 | `registry.isRecent`: explicit short-circuit when HIVEMIND_REGISTRY_TTL=0 (was returning recent due to `0 -le 0`) |
| `aa7d6ac` | D1 follow-up | tronMonitor.switch verify-before-title — capture+grep team signature, flip to ⚠ MISMATCH on failure |
| `ebc8b5e` | teams.env bug | hiveMind.team.register triple-defense (regex+pipe+live-tmux); teams.restore unquoted-var word-split fix |
| `b4447f6` | SC-A.1 | `private.hiveMind.reconcile.diff` primitive + 7 invariant check helpers + protected.* CLI wrapper |
| `8feac46` | SC-B.1 | Event dispatch primitives: register/emit (idempotent, isolated handlers), 1MiB history rotation, public events.list/history |

## MVC propagation chain — now COMPLETE
| Layer | After swap | After move | Status |
|-------|-----------|-----------|--------|
| View (otmux) | swap-pane done | move-pane done | — |
| Controller registry | swap roles in roles.env | rename key | ✓ B5.1 |
| Controller pane.title | (existing wiring) | (existing) | ✓ |
| Shell env (HIVEMIND_ROLE) | push new export to plain shells | push to dest | ✓ Bug #3 |
| Sender prefix | reads env first, registry fallback | same | now correct from any source |
