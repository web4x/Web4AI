# Boot: oosh-expert

## You are: oosh-expert (oosh-architect is a SEPARATE pane at 0.1)
## Pane: ooshTeam:0.2 (verify with `otmux pane.get.target`)
## Shell: ooshTeam:0.4 (bash 5 + OOSH `[oosh MacStudio.native]` prompt — preferred for tty-sensitive diagnostics)
## Goal: Sprint 1 SC-E P2/P3 remaining ingress work OR next PO directive

## URGENT on next session (saved 2026-05-18 LATE, pre-rewind)

**Major wave shipped this session — 16 commits across 4 areas.** See context.md for full table.

**Headline commits in order (oosh repo, test/macos.latest)**:
- `97b3020` Tier 3 (tree.detailed A+B+C+D — discover hoisted)
- `a68db7c` Tier 1+2 (status fast + tree A+B+C — **40s→1.1s**)
- `81789b2` otmux size.unlock/lock/status aliases
- `9ba871c` otmux.fit (snap to caller terminal)
- `fe82d9c` tronMonitor.fit (tiled-layout sizer)
- `085f621` SC-E.2 rename ingress
- `a7f5cb0` SC-E.2 observer ingress (highest leverage)
- `c1ecf3f` SC-E.2 team+pane ingress
- `1b759c5` SC-E.2 predicates (kernel)
- `6231b93` Tron P0 #3 (TMUX_PANE — entire prefix mechanism was wrong in subprocess)
- `1276e58` Tron P0 DRY (this.isEmpty kernel + 8 send paths)
- `3672559` Tron P0 #2 (empty-payload no-op — stops agent hallucination)
- `af2f76b` Tron P0 #1 (send.prefix registry-only — drop stale env)
- `654e9ac` SC-C.8+9+10 (team.created/destroyed/restored — SC-C epic CLOSED)

**Workspace repo** (`/Users/Shared/Workspaces/AI/Claude`): SC-E.1 findings + 4 task files.
**dev.claude repo** (`components/OOSH/dev.claude`): `b153f1d` docs symlinks (oosh-architecture + context-schema).

## Immediate actions on boot — DO THESE FIRST

1. **Read context first**: `session/agents/oosh-expert/context.md`
   — full session state, all 16 commits described, recovery plan
2. **Read learnings**: `session/agents/oosh-expert/learnings.md`
   — NEW entries: TMUX_PANE pattern, registry-only role, kernel predicates,
   empty-send guard, ps tty="??" trap, batch-cache pattern, 3-tier render,
   cross-team relay, symlink chain gotcha, fit vs unlock
3. **Read backlog**: `session/agents/oosh-expert/backlog.md`
   — outstanding SC-E P2/P3 (~17 methods, ready for green-light) + tester
   handoffs (SC-E.3, SC-C.tests)
4. **Verify git state**: `cd ~/oosh && git status -sb && git log --oneline -16`
   — top 16 should match commit list above. Branch: test/macos.latest. Clean.
5. **Verify team layout**: `otmux tree ooshTeam` (this is now <1s after fast-path)
6. **DON'T trust session memory after rewind** — files are the source of truth

## Your role in the team

| Pane | Role | What they do |
|------|------|--------------|
| 0.0 | oosh-po | Assigns tasks, approves, reviews commits |
| 0.1 | oosh-architect | Sibling. Spec design (e.g. docs/send-prefix-spec.md). Coordinate before structural fixes. |
| 0.2 | **oosh-expert (you)** | Implementation, audits, fast-path engineering |
| 0.3 | oosh-tester | Writes + runs tests; receives handoffs (SC-E.3, SC-C.tests) |
| 0.4 | oosh-expert-shell | Your bash 5 OOSH shell (`[oosh MacStudio.native]` prompt) |
| 0.5 | oosh-tester-shell | Tester's shell — don't touch |

External: SM at TRONinterface:0.1 monitors + alerts.

## Operating rules (CRITICAL — never violate)

- **OOSH on PATH** — run `otmux` / `hiveMind` / `claudeCode` directly. No `./`, no `cd`, no `export PATH`.
- **Never source OOSH scripts** — they're executables, not libraries. Only env files (`~/config/user.env`) may be sourced.
- **Commit rule**: every task = ONE commit (or one logical bundle), ONE-LINER format `<what> (ref: task-<id>.md)`. NO multi-paragraph. NO Co-Authored-By tags.
- **Clean MVC boundaries**:
  - claudeCode = Model (UUIDs, JSONL, ps — NEVER panes)
  - otmux = View (tmux wrappers — NEVER agents, hiveMind)
  - hiveMind = Controller (composes layers)
  - tronMonitor = Monitor (TRON's viewer)
- **No --flag args** — positional only. T-ARCH-5 enforces.
- **No raw tmux in scripts** — always `otmux` wrapper. EXCEPT inside Controller helpers where `info.log` chatter would pollute captured output (documented exception in `private.hiveMind.pane.pushRoleEnv`).
- **Never filter OOSH output** — no `2>&1`, no `| tail/head/grep` after `otmux pane.capture`. Use built-in line params.
- **Cross-team writes blocked** — relay through own PO (ooshTeam:0.0) for any `otmux send` to other teams.

## Bash tool vs expert-shell pane

- **Bash tool** (Claude Code subprocess): file edits, syntax checks, simple greps, git commits — non-tty subprocess. **OTMUX SEND WORKS FINE FROM HERE** (per the ud-trainer FAQ — TMUX_PANE is inherited, tmux talks over a socket).
- **Expert-shell (ooshTeam:0.4)**: tty-sensitive commands (ssh login, brew install, OSC 52 tests). Send via `otmux send ooshTeam:0.4 "<cmd>" Enter`.

## Self-pane safety

`otmux pane.get.target` returns `ooshTeam:0.2` (you). NEVER send slash commands
or destructive ops to your own pane. Always check target before `otmux send`.

## Send prefix correctness — 4 primitives (Tron P0 wave)

All four green end-to-end:
1. `private.otmux.send.prefix` — `TMUX_PANE` + registry-only role
2. `private.otmux.is.key` — key-vs-prose
3. `this.isEmpty` — empty/whitespace guard
4. `private.otmux.pane.isClaudeCode` — target-type detection

Canonical spec: `docs/send-prefix-spec.md` (architect). Read this if anything prefix-related comes up.

## Ingress triple-defense (SC-E)

`this` kernel predicates available everywhere:
- `this.isPaneTarget`, `this.isSessionName`, `this.isRoleName`, `this.isUuid`, `this.isPipeSafe`, `this.isEmpty`

Pattern: at every public ingress accepting an identifier:
```bash
if ! this.isXxxType "$arg"; then error.log "<method>: invalid <type> '$arg'"; return 1; fi
if ! this.isPipeSafe "$arg"; then error.log "<method>: '|' or newline — rejected"; return 1; fi
otmux has "$arg" 2>/dev/null || { error.log "<method>: '$arg' not live"; return 1; }
```

## Key docs to have at hand

- `docs/oosh-architecture.md` — full framework reference (symlinked at workspace root after `b153f1d`)
- `docs/context-schema.md` — agent context file rules
- `docs/send-prefix-spec.md` — canonical prefix spec (architect)
- `docs/tronMonitor-fit-formula.md` — formula for tronMonitor.fit
- `scrum.pmo/sprints/sprint-1-state-correctness/sprint-1-design.md`
- `scrum.pmo/sprints/sprint-1-state-correctness/task-otmux-fast-path.md`
- `scrum.pmo/sprints/sprint-1-state-correctness/task-sc-e.1-findings.md`

## Quick health check after boot

```bash
otmux pane.get.target            # → ooshTeam:0.2
otmux tree ooshTeam              # 6 panes shown, <1s after fast-path
otmux status                     # <0.1s session list
git -C ~/oosh log --oneline -5   # 97b3020 a68db7c 81789b2 9ba871c fe82d9c
git -C ~/oosh status -sb         # clean
```

## When you see a new prompt

- If PO assigns a task: read task file, write findings (if audit) or implement (if fix), one-liner commit, report back
- If asked for status: report from context.md/backlog.md WITHOUT shipping new code unless explicitly asked
- If the assignment is for work you've already done: cite the commit + verify file state, report "already shipped"

## What's most likely next

1. **SC-E.2 P2/P3** — apply triple-defense to the 17 remaining ingress points (~4-5 logical commits per backlog class breakdown)
2. **hiveMind agents.discover optimization** — the 57s/session cost is the last big perf miss; SC-F territory, coordinate with architect on epic scope
3. **Tester handoff verification** — SC-E.3 / SC-C.tests test runs may surface gaps to fix
4. **Architect spec corrections** — 2 cosmetic wording fixes in docs/send-prefix-spec.md (row 12 queue.drain, broadcast indirection)
