# OOSH Expert Agent Context

**Session**: oosh-expert@opus 1M on MacStudio.native
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: ooshTeam:0.1 (renamed, pane.lock'd)
**Shell**: ooshTeam:0.3 (bash 5, OOSH env loaded)
**Peer**: oosh-tester @ ooshTeam:0.2 (shell ooshTeam:0.4)
**PO**: product-owner @ ooshTeam:0.0 / TRONinterface:0.0
**SM**: scrum-master @ TRONinterface:0.0
**Updated**: 2026-04-24
**State**: Sprint 0 active — Epic A, B, C, D, F mostly delivered. 14 commits shipped this session, all to `test/macos.latest`. Awaiting tester coverage on several tasks.

---

## Current Sprint: Sprint 0 — Lifecycle Consolidation

**Sprint file:** `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md`
**Goal:** MVC consolidation — claudeCode (Model) / otmux (View) / hiveMind (Controller) / tronMonitor (Monitor) with cold-restart capability.

### Delivered this session (14 commits, chronological)

| Commit | Task | Summary |
|--------|------|---------|
| `ca49445` | G1 | Per-session max_tokens detection (1M vs 200k) — was -226% for 1M agents |
| `ae002cd` | G1 DRY | Extract 3 env constants (CLAUDE_MAX_TOKENS_DEFAULT/1M, COMPACT_THRESHOLD_PCT) |
| `1dc8b91` | A2.1+A2.2 | session-op portability — session.current rc=1, context.self TMUX guard |
| `ec7fe28` | B2 | otmux layout.save/restore/list/show/delete (5 methods, 145 lines) |
| `26c4fdf` | D1.4→D1.7 | tronMonitor prune atomic kill + `__test_*` guard |
| `a030f68` | D1.5→D1.9b | pane resolution respects env + validates existence |
| `cd23b6e` | D1.6→D1.9c | screen resilience + remove kill fix + validator correctness |
| `e9723ff` | D1.4+D1.5 | attach -r enforcement + window-size=largest on team sessions |
| `75ab018` | B3.1 | otmux pane.lock idempotent (auto-unlocks first) |
| `597f93e` | D2.1+D2.2 | team.register/remove → tronMonitor add/remove observer |
| `afc57d3` | C3.2 | sweep.detect fixtures — 25 files (18 states + 7 edge variants) |
| `f5bc1b8` | SM bug | agent.monitor timeout guard on tronMonitor switch |
| `0f9330b` | D1.10 | tronMonitor rewritten to Tron's proven recipe (named windows + inline cmd) |
| `3fd0420` | F1 | scrumMaster velocity.log/rate/alert/history (CMM4 time-series) |
| `a2161a7` | docs | "Starting an OOSH Shell — just type bash" in README + docs/oosh.md |

### Audit findings documented (no code changes per sprint rule)

- **A1.1** `task-a1.1-findings.md` — 68 claudeCode methods classified: 47 Model, 14 View leaks, 4 Controller leaks, 1 raw tmux, 3 tmux assumptions
- **A1.2** `task-a1.2-findings.md` — 13 View leaks with refactor plan (68 → ~40 method Model surface)
- **A2**   `task-a2-findings.md`   — 12 methods tested `env -u TMUX -u TMUX_PANE`; UUID resolution chain documented
- **B1**   `task-b1-findings.md`   — 5 otmux leaks (2 HIGH, 2 MEDIUM, 1 ACCEPTED); B1.2 decision: Controller wraps View
- **C1**   `task-c1-findings.md`   — cold-restart gap analysis; 9 missing capabilities; integration plan with B2 ready
- **Bug**  `task-bug-agent-monitor-segfault.md` — SM-reported; defensive mitigation shipped as f5bc1b8

### Sprint tasks still blocked / pending

- **A1.3, A2.3, B1.3, B2.3, C1.4, C3.3, D2.3** — all tester tasks
- **C1 implementation** — audit done (C1.1/C1.2/C1.3); code changes queued pending C1.4 tester coverage
- **A1.2 fixes** — PO-approved order: raw-tmux 1-liner → session.probe split → agent.recover delete — pending A1.3 tester coverage

---

## Team Layout (ooshTeam session)

| Pane | Role | Shell |
|------|------|-------|
| 0.0 | product-owner | Claude Code (oosh-po) |
| 0.1 | oosh-expert (me) | Claude Code, renamed + pane.lock'd |
| 0.2 | oosh-tester | Claude Code |
| 0.3 | oosh-expert-shell | bash 5.3.9 + OOSH env |
| 0.4 | oosh-tester-shell | bash 5.3.9 + OOSH env |

Tron + SM at `TRONinterface:0.0..2`. PO alternates between ooshTeam:0.0 and TRONinterface:0.0.

---

## Commit rule (SM directive, enforce always)

One-liner format: `<what changed> (ref: task-<id>-<name>.md)`. Every task = one commit. Before reporting done:
1. `git status -sb` — only the branch line (no modifieds/untrackeds I created)
2. `git log -1 --oneline` — matches the current task

No multi-paragraph commits, no Co-Authored-By tags, details belong in task file.

---

## Key architectural decisions made this sprint

1. **MVC layer purity rules** (A1.2):
   - Model takes data not panes (`<uuid>`, `<jsonlFile>`, `<pid>` — never `<pane>`)
   - Model returns data, never sends
   - Controller composes — it's the only thing that crosses boundaries
2. **Pure parser pattern** (A1.2): take captured TUI text, return data. Testable with fixture strings. Examples: `session.probe.fromCapture`, `context.read.fromCapture`, `model.parse.statusBar`
3. **Observer pattern for cross-layer events** (D2, B1): `command -v <peer> && <peer> event ... || info.log` — soft-fail, loose coupling
4. **tronMonitor proven recipe** (D1.10): 3 mandatory invariants — `TMUX=` prefix, `-r` flag, `exec bash` tail
5. **CMM4 measurement** (F1): time-series replaces instantaneous readings — persist samples, compute windows, alert on rate

---

## Open bugs (backlog)

- JSONL stdin fd3 (some reads fail with redirection)
- Fork project dir (forked sessions may cd to wrong project)
- agent.restart pane safety (ensure.pane should verify pane is empty)
- tronMonitor multi-instance (screen name + env file per monitorPane)
- `docs/otmux.clipboard.md` untracked in /Users/donges/oosh — not mine, left untouched

---

## RECOVERY STEPS

1. Read this context + `learnings.md` + `backlog.md`
2. `otmux pane.get.target` — confirm `ooshTeam:0.1`
3. Verify peer tester alive: `otmux pane.capture ooshTeam:0.2 10`
4. Check `git log --oneline -5 test/macos.latest` — should end at my most recent commit
5. Read sprint planning: `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md`
6. Await PO assignment or tester handoff response

## Outstanding follow-ups (when PO returns / tester reports)

- A1.3 tester pass → then implement A1.2 fix order (raw-tmux 1-liner first)
- C1.4 tester pass → then implement cold-restart code changes per C1.2 design
- Follow-up on SM-flagged agent.monitor bug (mitigation shipped, full fix queued)
