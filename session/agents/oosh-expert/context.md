# OOSH Expert Agent Context

**Session**: oosh-expert@opus 1M on MacStudio.native
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: ooshTeam:0.1 (renamed, pane.lock'd)
**Shell**: ooshTeam:0.3 (bash 5, OOSH env loaded)
**Peer**: oosh-tester @ ooshTeam:0.2 (shell ooshTeam:0.4)
**PO**: product-owner @ ooshTeam:0.0 / TRONinterface:0.0
**SM**: scrum-master @ TRONinterface:0.2
**Updated**: 2026-04-27
**State**: Sprint 0 expert work effectively complete. 23 commits to test/macos.latest this sprint. Tester has covered C1.4 + B3.1 + B1.3 + A2.3 + G1.3. Only A1.2 fix 2b queued (full session.probe migration to Controller).

---

## Sprint 0: Lifecycle Consolidation — STATUS

**Sprint file:** `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md`
**Goal:** Consolidate MVC stack — claudeCode (Model) / otmux (View) / hiveMind (Controller) / tronMonitor (Monitor) with cold-restart capability.

### Delivered this sprint (23 commits to test/macos.latest, chronological)

| Commit | Task | Summary |
|--------|------|---------|
| `ca49445` | G1 | Per-session max_tokens detection (1M vs 200k) — was -226% for 1M agents |
| `ae002cd` | G1 DRY | 3 env constants (CLAUDE_MAX_TOKENS_DEFAULT/_1M/COMPACT_THRESHOLD_PCT) |
| `1dc8b91` | A2.1+A2.2 | session-op portability — `env -u TMUX -u TMUX_PANE` works |
| `ec7fe28` | B2 | otmux layout.save/restore/list/show/delete (5 methods, 145 lines) |
| `26c4fdf` | D1.4→D1.7 | tronMonitor prune atomic kill + `__test_*` guard |
| `a030f68` | D1.5→D1.9b | pane resolution respects env var, validates existence |
| `cd23b6e` | D1.6→D1.9c | screen resilience + remove kill fix + validator correctness |
| `e9723ff` | D1.4+D1.5 | attach -r enforcement + window-size=largest on team sessions |
| `75ab018` | B3.1 | otmux pane.lock idempotent (auto-unlocks first) |
| `597f93e` | D2.1+D2.2 | team.register/remove → tronMonitor observer wiring |
| `afc57d3` | C3.2 | sweep.detect 25 fixtures (18 states + 7 edge variants) |
| `f5bc1b8` | SM bug | agent.monitor defensive timeout on tronMonitor switch |
| `0f9330b` | D1.10 | tronMonitor matches Tron's proven recipe |
| `3fd0420` | F1 | scrumMaster velocity.log/rate/alert/history (CMM4 time-series) |
| `a2161a7` | docs | "Starting an OOSH Shell — type bash" in README + docs/oosh.md |
| `1996c9a` | F2 | sweep.detect prose-scrub `// -- /* * <!--` + 6 fp fixtures |
| `66ddcd6` | A1.2 fix 1 | private.claudeCode.complete.panes raw tmux → otmux (1-liner) |
| `6d264df` | A1.2 fix 2 | extract session.probe.fromCapture pure parser (Model purity) |
| `de65ac2` | A1.2 fix 3 | delete claudeCode.agent.recover (duplicate of hiveMind.unblock) |
| `7c818c3` | F3 | subscription API resilience — rate-limit graceful + cache.age |
| `22bb525` | C1 | teams.save/restore compose B2 layout + kind/cwd/model + polling |
| `c6033dd` | C1 fix | teams.restore positional fork\|join arg (T-ARCH-5 violation fix) |
| `44ad07e` | B4.1 | otmux.attach `<?readonly>` + attach.readonly alias |
| `e0ddb95` | B4.2 | otmux setup.default sets window-size=largest |

**Tester commits already in master:**
- `dc9d2cb` B1.3 — otmux MVC boundary tests (zero leaks)
- `cb31d3f` A2.3 — claudeCode portability without tmux
- `a515fdc` + `3f786b0` G1.3 — context.read 1M tests
- `c0e59d0` C3.3 — sweep.detect fixture-based tests
- `d092295` C1.4 — cold-start restore full cycle (8 tests)
- `fb30cc2` B3.1 — pane.lock relock idempotent (4 tests)

### Audit findings docs (scrum.pmo/sprints/sprint-0-lifecycle-consolidation/)

| File | Covers |
|------|--------|
| `task-a1.1-findings.md` | 68 claudeCode methods classified — 47 Model / 14 View leak / 4 Ctrl leak / 1 raw tmux / 3 tmux assumptions |
| `task-a1.2-findings.md` | 13 View leaks with refactor plan — 68→40 method Model surface, pure parser pattern |
| `task-a2-findings.md` | 12 portability-tested methods (`env -u TMUX -u TMUX_PANE`) |
| `task-b1-findings.md` | 5 otmux leaks (2 HIGH, 2 MED, 1 ACCEPTED); B1.2 decision: Controller wraps View |
| `task-c1-findings.md` | Cold-restart 9 missing capabilities; B2 integration plan |
| `task-e1-test-results.md` | claudeCode 125/201 (62%), hiveMind 337/376 (90%), otmux capture lost |
| `task-f3-scrummaster-subscription-api-resilience.md` | Rate-limit graceful spec |

### Sprint tasks state

**All expert implementation epics shipped (A/B/C/D/F/G).**

**Pending (all tester):**
- A1.3 — boundary violation tests (T-BOUNDARY 7/7 passing)
- A2.3 — portability tests (DONE, cb31d3f)
- B1.3 — boundary violation (DONE, dc9d2cb)
- B2.3 — server restart recovery (queued)
- C1.4 — full cycle test (DONE, d092295)
- C3.3 — fixture-based detection tests (DONE, c0e59d0)
- D2.3 — integration tests (queued)
- E1.1/2/3 — end-to-end integration (queued)
- G1.3 — 1M context (DONE, a515fdc/3f786b0)

**Outstanding expert work (only one item):**
- **A1.2 fix 2b** — fully relocate `claudeCode.session.probe` to `hiveMind.agent.session.probe`. Pure parser already shipped (6d264df). Migration touches 8 callers (1 in claudeCode + 7 in hiveMind). Awaiting greenlight — not done autonomously because PO didn't explicitly authorize.

---

## Team Layout (ooshTeam session)

| Pane | Role | Shell |
|------|------|-------|
| 0.0 | product-owner / oosh-po | Claude Code |
| 0.1 | oosh-expert (me) | Claude Code, renamed + pane.lock'd |
| 0.2 | oosh-tester | Claude Code |
| 0.3 | oosh-expert-shell | bash 5.3.9 + OOSH env (sourced via `bash` after `~/.bashrc`) |
| 0.4 | oosh-tester-shell | bash 5.3.9 + OOSH env |

**External:** PO sometimes at TRONinterface:0.0. Scrum-master at TRONinterface:0.2.

---

## Commit rule (SM directive — enforce always)

One-liner format: `<what changed> (ref: task-<id>-<name>.md)`. Every task = one commit. Before reporting done:
1. `git status -sb` — only the branch line (no modified/untracked files I created)
2. `git log -1 --oneline` — matches the current task

No multi-paragraph commits, no Co-Authored-By tags, details belong in the task file.

---

## Key architectural decisions made this sprint

1. **MVC layer purity rules** (A1.2):
   - Model takes data not panes (`<uuid>`, `<jsonlFile>`, `<pid>` — never `<pane>`)
   - Model returns data, never sends
   - Controller composes — only thing that crosses boundaries
2. **Pure parser pattern** (A1.2): take captured TUI text, return data. Testable with fixture strings. Examples: `session.probe.fromCapture`, `context.read.fromCapture`, `model.parse.statusBar`
3. **Observer pattern for cross-layer events** (D2, B1): `command -v <peer> && <peer> event ... || info.log` — soft-fail, loose coupling
4. **tronMonitor proven recipe** (D1.10): 3 mandatory invariants — `TMUX=` prefix, `-r` flag, `exec bash` tail
5. **CMM4 measurement** (F1): time-series replaces instantaneous readings — persist samples, compute windows, alert on rate
6. **Per-session max_tokens** (G1): 3-tier detection — ps args `[1m]` flag → observed-max safety net → model-base default
7. **Single-source env constants** (G1 DRY): top-of-file `${VAR:=default}` + `export` propagates to python subprocesses

---

## Open bugs (backlog)

- JSONL stdin fd3 — some reads fail with redirection
- Fork project dir — forked sessions may cd to wrong project directory
- agent.restart pane safety — ensure.pane should verify pane is empty before sending commands
- tronMonitor multi-instance — derive screen name + env file from monitorPane
- agent.monitor → tronMonitor switch recursion — mitigated via timeout (f5bc1b8); full fix queued

---

## RECOVERY STEPS (in order)

1. Read this context.md
2. Read `learnings.md` — hard-won rules (commit style, MVC purity, regex pitfalls)
3. Read `backlog.md` — outstanding items
4. Read `boot.md` — fresh boot procedure
5. `otmux pane.get.target` — confirm `ooshTeam:0.1`
6. `otmux pane.capture ooshTeam:0.2 10` — verify peer tester alive
7. `cd ~/oosh && git log --oneline -10` — most recent commit should match top of "Delivered" table above (e0ddb95 or fb30cc2)
8. Read sprint planning: `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md`
9. `git status -sb` in both `~/oosh` and `/Users/Shared/Workspaces/AI/Claude` — should be clean for my files
10. Await PO assignment or tester handoff response

## When you are next assigned work

- If A1.2 fix 2b is greenlit: 8 callers across claudeCode (1) + hiveMind (7) — pure parser already shipped (6d264df), just need Controller method `hiveMind.agent.session.probe` + migration
- If new tasks: write findings doc first, code second; one-liner commit; reference task file
