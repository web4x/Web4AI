# OOSH Expert / Architect Agent Context

**Session**: oosh-expert@opus 1M on MacStudio.native
**Role**: oosh-expert (OOSH Implementation Authority) — also addressed as oosh-architect
**Pane**: ooshTeam:0.2 (post-rewind — layout shifted again; was 0.1 earlier today)
**Shell**: ooshTeam:0.4 (bash 5 with OOSH env)
**Peer**: oosh-tester @ ooshTeam:0.3 (shell ooshTeam:0.5)
**Sibling**: oosh-architect @ ooshTeam:0.1 (separate Claude Code pane added today)
**PO**: oosh-po @ ooshTeam:0.0 (also TRONinterface:0.0)
**SM**: scrum-master @ TRONinterface:0.2
**Updated**: 2026-05-12 — Sprint 0 CLOSED, Sprint 1 ACTIVE. Today shipped: 4 fixes (B5.2 SWAP-1, B5.2 TTL-3, D1 verify-before-title, teams.env triple-defense). Sprint 1 designed jointly with architect, signed off PO, scaffolded 38 task files, shipped 2 commits (SC-A.1 + SC-B.1).
**Layout**: 6 panes — 0.0 po, 0.1 architect, 0.2 expert (me), 0.3 tester, 0.4 expert-shell, 0.5 tester-shell

## Sprint 1 — shipped TODAY 2026-05-12

| Commit | Task | Summary |
|--------|------|---------|
| `10e9fa0` | B5.2 SWAP-1 | hiveMind protected.panes.swapped pane-arg normalization (accept full target or addr-only) |
| `b4c3b3f` | B5.2 SWAP-1 | test.lifecycle grep patterns tolerate both legacy 2-field + B5.1 3-field TTL registry |
| `14d5866` | B5.2 TTL-3 | registry.isRecent explicit short-circuit when TTL=0 (was `0 -le 0 = true`) |
| `aa7d6ac` | D1 follow-up | tronMonitor.switch capture-and-grep verify-before-title — Tron's 3-bug headers-lie pattern surfaced + fixed |
| `ebc8b5e` | teams.env hygiene | team.register triple-defense (regex+pipe+live-tmux) + teams.restore unquoted-var word-split fix |

## Sprint 1 — DESIGN + SCAFFOLD shipped today

**Joint design with oosh-architect — signed off PO + architect (2026-05-12).**

Canonical doc: `scrum.pmo/sprints/sprint-1-state-correctness/sprint-1-design.md` (10 sections, ~340 lines)
- 10 cache stores (S1-S10) + 3 ground-truth sources (L1-L3)
- 25 mutation operations × per-store W/R/D/? matrix
- 7 invariants I1-I7 (architect's 6 + my I7 verify-before-claim)
- Architecture: Option C events + Option B reconcile (hybrid)
- 10-event catalog
- P1-P7 patterns from Sprint 0 made canonical
- 7 epics SC-A through SC-G with dependency order

**PO-locked decisions (U1/U2/U3):**
- U1: handler failure → log+continue (reconcile catches drift)
- U2: audit graded severity (CRITICAL/HIGH/MEDIUM/LOW), show all
- U3: reconcile dry-run default, `--apply` flag to mutate

**PUMLs:**
- `docs/puml/Sprint1_StateCorrectness_StateStores.puml` (macro)
- `docs/puml/Sprint1_StateCorrectness_EventFlow.puml` (micro)
- `docs/puml/Sprint1_StateCorrectness_ReconcileCycle.puml` (SM cycle)

**Sprint 1 scaffold:** 38 task files at `scrum.pmo/sprints/sprint-1-state-correctness/` per Sprint 0 format (1 planning.md + 7 parent epic tasks + 30 expert/tester subtasks).

## Sprint 1 — Implementation shipped today

| Commit | Task | Summary |
|--------|------|---------|
| `b4447f6` | SC-A.1 | `private.hiveMind.reconcile.diff` + 7 invariant check helpers (i1-i7) emit `severity\|inv\|store\|op\|key\|expected\|actual` lines; `protected.reconcile.diff` CLI wrapper. **Live: surfaced 1 CRITICAL I7 + 11 HIGH I1 + 3 HIGH I2 on real system.** |
| `8feac46` | SC-B.1 | Event dispatch primitives (declare -gA HIVEMIND_EVENT_HANDLERS): register (idempotent), emit (isolated handlers, log+continue per U1), history.append with 1MiB rotation, protected.events.* CLI wrappers, public events.list/history. **SC-B.2 (history+rotation) was bundled here.** |

## State of the union

**Sprint 0:** CLOSED — all known bugs shipped, all Epic implementation work landed, tester coverage mostly green.

**Sprint 1:** ACTIVE — design + scaffold + first 2 commits done. Next implementations: SC-A.2 audit method (uses SC-A.1) + SC-B.3 tester isolation tests + SC-A.3 tester fixture tests. Then SC-C handlers + SC-D reconcile.

## Sprint 0 — recent shipped 2026-05-11 (previous day)

| Commit | Branch | Task | Summary |
|--------|--------|------|---------|
| `634b7b6` | macos | F2.2 | sweep.detect accept-edits matches tail-only (5 lines) — fixes Epic I scrollback FP that rejected idle agents whose history showed stale `⏵⏵ accept` text. Added `fp-accept-edits-scrollback.txt` fixture so C3.3 picks it up. |
| `d624a9d` | macos | ud-po help | otmux `pane.size` + `pane.size.set` — absolute resize wrapper (ud-po: shell panes squish to 1 row). |
| `7358fc9` | macos | raw-tmux audit | Added 5 otmux methods to close gaps: `window.layout.get`, `window.layout.set`, `window.aggressive.resize`, `pane.list.format`, `window.list.format`. |
| `52fcf43` | macos | tronMonitor hijack | `tronMonitor.add` skip `__test_*` + `test.hiveMind` teardown calls `tronMonitor remove` for test sessions. Fixes PO-reported "screen showed __test_hm0/test-alpha/beta/gamma". Mirror of D1.7 prune guard. |

**Interactive (not committed):** unlock+aggressive-resize on ooshTeam/web4team/upDownTeam (B8 lock was squishing them at 80×40). upDownTeam panes 0.3/0.4 swapped to align with ooshTeam role order; `hiveMind.protected.panes.swapped` fired manually to sync registry.

**Outstanding (tester reported, NOT yet fixed):**
- **T-B5-SWAP-1** — `panes.swapped` doesn't exchange registry entries. After swap, alpha still at 0.0, beta at 0.1 — should be reversed.
- **T-B5-TTL-3** — `HIVEMIND_REGISTRY_TTL=0` env override doesn't expire entries.

## Sprint 0 — earlier shipped (2026-05-01 → 2026-05-05)

| Commit | Branch | Task | Summary |
|--------|--------|------|---------|
| `2196cdc` | macos | B8 | otmux window.size.lock/unlock/status/floor.apply (4 methods, 200 lines) + auto-hook in hiveMind.teams.restore. Persist `~/config/otmux.size.locks.env`. Live: 18 collapsed sessions floored to 80×40. |
| `885e587` | macos | B8 fix | literal-match awk for size.lock entries (regex-safe with escape-coded session names) + 4-state classification (collapsed red / small-client cyan / locked yellow / healthy green). |
| `08ec428` | macos | I1.1 | hiveMind.agent.send context-aware router + agent.route helper. Maps 18 sweep.detect states → 4 routes. Legacy hiveMind.send/send.message now wrappers (Phase 2). |
| `580bf9e` | macos | I1.2 | Extract private.hiveMind.agent.inform helper for INFORM path (smart-send + monitor.switch + rc propagation). |
| `ccb8f4f` | macos | I1.3 | REMOTE CONTROL verbs: hiveMind.agent.{approve,reject,dismiss,option} + per-overlay key map (permission/tool-confirm:1/2, accept-edits:Tab/Esc, all:Esc dismiss). |
| `bea1cbd` | macos | I1.4 | QUEUE: persistence ~/config/hivemind.queue/<pane>.queue + agent.queue.{list,drain,clear} + drain hook on idle in agent.unblock + channel.resolve rc+format hardening. |

**Tester:** `449ee34` — I1.5 13/13 PASS. Epic I Phase 2 fully verified.

## Sprint 0 — recent shipped (2026-05-01 → 2026-05-05)

| Commit | Branch | Task | Summary |
|--------|--------|------|---------|
| `a77a7c8` | macos | J1 + J-BUG | `hiveMind.roles.list.uuids <role>` — lists all session UUIDs for a role with status (live/dead/orphan), sorted by recency. Self-contained python: ps + tmux pane→tty cross-ref + JSONL tail-scan for customTitle. Match: case-insensitive, accepts `fallback-<role>` variant, strips `@model`. **J-BUG**: `claudeCode.list <?--json>` → `<?format:tree\|json>` (dashes broke c2 `PARAM_OPTIONAL_--json invalid identifier`). |
| `6256031` | macos | J1 polish | Colorize `roles.list.uuids` output: UUID=gray, TITLE=bold white, PANE=bold cyan/gray, STATUS=green/red/yellow. |
| `adee4cb` | macos | B7.1 | All otmux methods with `<session>` param now have explicit `.completion.session` delegating to `parameter.completion.session` (DRY single source). Layout.restore/delete/show kept their saved-file completions (different semantic). |
| `be3db2b` | macos | J2 | `hiveMind.agent.fork.best <role> <targetPane>` — JSONL size + tool count heuristic (50KB filter), tiebreaker bare > fallback then recency. Fork → sleep 8 → boot.md → registry.set. Validated on real data: scrum-master picks 35916ccb (14.6MB/4918 tools) over 1c1d2925 (14KB/0 tools — SKIP). |
| `212e072` | macos | B7.2 | Fix completion-vs-param mismatches: `tree <?target>→<?session>`, `layout.restore <?--force>→<?force>` (T-ARCH-5 J-BUG class), added `otmux.session.kill` alias for orphan completion. |
| `68b922c` | macos | **B7.3** | **c2 substring-match bug fix** — `get.function.declaration` greps with bare method name, matched `otmux.client.choose.tree` for filter `tree`, alphabetical sort picked it first → empty METHOD_PARAMETER → no parameter completion. Fix: class-qualified `${name}.$1` in both filter and grep. Verified: tree, attach, layout.restore all complete correctly. |
| `de065b5` | **dev** | B7.3 port | Same c2 fix on dev branch (different namespace `private.c2.*`). Cherry-pick would conflict due to parallel implementations; surgical port instead. |
| `f671d3d` | macos | d1.3 fix | tronMonitor setup: window 0 was bare zsh because `screen -S name` started with default shell. Fix: cold start sends `screen -S name -t firstTeam bash -c "TMUX= tmux attach -r -t firstTeam; exec bash"` — window 0 IS the first team. Subsequent teams = windows 1..N matching env. switch uses window number (more reliable than name on old macOS screen). Tested live: 20 teams visible, switch updates pane. |

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
