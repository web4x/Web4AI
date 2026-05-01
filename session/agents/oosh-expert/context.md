# OOSH Expert / Architect Agent Context

**Session**: oosh-expert@opus 1M on MacStudio.native
**Role**: oosh-expert (OOSH Implementation Authority) — also addressed as oosh-architect
**Pane**: ooshTeam:0.2 (post-rewind — layout shifted again; was 0.1 earlier today)
**Shell**: ooshTeam:0.4 (bash 5 with OOSH env)
**Peer**: oosh-tester @ ooshTeam:0.3 (shell ooshTeam:0.5)
**Sibling**: oosh-architect @ ooshTeam:0.1 (separate Claude Code pane added today)
**PO**: oosh-po @ ooshTeam:0.0 (also TRONinterface:0.0)
**SM**: scrum-master @ TRONinterface:0.2
**Updated**: 2026-05-01 (Epic J1 + J-BUG shipped after rewind recovery)
**Layout**: 6 panes now — 0.0 po, 0.1 architect, 0.2 expert (me), 0.3 tester, 0.4 expert-shell, 0.5 tester-shell

## Sprint 0 — Epic J shipped 2026-05-01 (post-rewind recovery)

| Commit | Task | Summary |
|--------|------|---------|
| `a77a7c8` | J1 + J-BUG | `hiveMind.roles.list.uuids <role>` — lists all session UUIDs for a role with status (live/dead/orphan), sorted by recency. Self-contained python: ps + tmux pane→tty cross-ref + JSONL tail-scan for customTitle. Match: case-insensitive, accepts `fallback-<role>` variant, strips `@model`. Completion: `role.list` + `fallback-` prefixed. **J-BUG**: `claudeCode.list <?--json>` (dashes broke c2 → `PARAM_OPTIONAL_--json invalid identifier`) renamed to `<?format:tree\|json>`; legacy `--json` still accepted. |
| `6256031` | J1 polish | Colorize `roles.list.uuids` output: UUID=gray, TITLE=bold white, PANE=bold cyan/gray, STATUS=green(live)/red(dead)/yellow(orphan). Matches `claudeCode list` scheme. |

## Sprint 0 — earlier commits today (2026-04-30 post-rewind)

| Commit | Task | Summary |
|--------|------|---------|
| `19fa1b7` | Bug #4 | Validate pane target before send. New `private.otmux.target.isPane` (regex: `%N` or `sess:win.pane`); rejects whitespace/error.log text. Applied to all 6 send methods. `hiveMind.send`/`send.message` now check `rc` separately + format-validate the resolved target. |
| `559e03a` | A1.2 fix 2b | session.probe Controller migration. New `hiveMind.agent.session.probe <agentName\|pane>` does View I/O + delegates to Model parser. Deleted `claudeCode.session.probe` composite. 7 callers migrated (1 internal claudeCode + 6 hiveMind). Pure parser `session.probe.fromCapture` remains. |
| `d860bec` | B6 | otmux client lifecycle. `client.list` tabular (TTY/SESSION/SIZE/FLAGS/IDLE) — exposes stale clients via idle column. `client.detach` reliable + auto `refresh-client -S` to re-sync sizes after detach. NEW `client.cleanup <?filter:read-only>` bulk-detaches matching clients. Live: detached 3 stale 54x26 read-only clients (97h idle was the smoking gun), layout restored to 109x53. |

## Pending — Epic J

- **J2 BLOCKED** — `agent.fork.best <role>` selection logic awaits architect design. PO directive: do NOT implement until architect ships design.
- **J2.1/2.2/2.3** — implementation + auto-boot + tests, all queued behind J2 design.
- **J1.3 tester** — multi-UUID scenario test against `hiveMind roles.list.uuids`.
- **J3** — architect updates MVC PUML (sequence + use-case) with recovery flow.

**Bug #4 root cause:** `error.log` writes to stdout (GOTCHA). Captured failed-resolve output landed in `$target`, the empty-check passed, malformed target was sent to `tmux send-keys -t` which silently fell back to focused pane, leaking content.

**B4 verified shipped earlier:** `44ad07e` (B4.1 attach.readonly), `e0ddb95` (B4.2 window-size=largest), `7d27904` (B4.2 polish aggressive-resize).
**State**: Sprint 0 closing — B5 + Bug #2 + Bug #3 landed today. 4 fresh commits. Tester ran G1.3 (5/5 PASS) and E1.1 (7/8 PASS, critical path GREEN). Only outstanding sprint item is A1.2 fix 2b (session.probe full Controller migration) — still awaiting greenlight.

---

## Sprint 0: Lifecycle Consolidation — STATUS

**Sprint file:** `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md`
**Goal:** Consolidate MVC stack — claudeCode (Model) / otmux (View) / hiveMind (Controller) / tronMonitor (Monitor) with cold-restart capability.

### Delivered TODAY 2026-04-30 (4 commits + 1 test/macos.latest port)

| Commit | Task | Summary |
|--------|------|---------|
| `d0d3d92` | B5.1 | Pane operations notify Controller + registry.set TTL priority |
| `da032b1` | B5.1 align | Rename callbacks to match B5.3 PUML spec (`panes.shifted`/`panes.swapped`/`pane.moved`) |
| `8d01421` | Bug #2 | agent.unblock strict ALLOWLIST — never interrupt active agents |
| `163b0a0` | Bug #3 | panes.swapped/pane.moved push HIVEMIND_ROLE to plain shells |

**Cross-branch consolidation earlier today:**
| Commit | Branch | Summary |
|--------|--------|---------|
| `9b7138e` | test/macos.latest | B1.3 surgical port from prod (6 raw `tmux` → `$TMUX_CMD` + Controller-private leak fix) |
| `7d27904` | test/macos.latest | B4.2 polish port — `aggressive-resize on` + `otmux.window.size` runtime method |

### Delivered earlier this sprint (23 commits to test/macos.latest, chronological)

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

**Outstanding expert work:** NONE. All sprint-0 epics shipped.
- A1.2 fix 2b shipped today (559e03a). Bug #4 shipped today (19fa1b7).
- Next: Epic I (context-aware send) — awaiting task file from PO.

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
