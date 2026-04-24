# OOSH Expert Agent Context

**Session**: oosh-expert@opus 1M on MacStudio.native
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: ooshTeam:0.1 (renamed, pane.lock'd)
**Shell**: ooshTeam:0.3 (bash 5, OOSH env loaded)
**Peer**: oosh-tester @ ooshTeam:0.2 (shell ooshTeam:0.4)
**PO**: product-owner @ TRONinterface:0.0
**Updated**: 2026-04-24
**State**: Sprint 0 active. A1.1 + A1.2 complete (both QA Review). Model surface audit + View leak refactor plan documented. Awaiting A1.3 tester coverage before implementing fixes.

---

## Current Sprint (Sprint 0: Lifecycle Consolidation)

**Sprint file:** `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md`

**Completed (2026-04-24 continuation):**

- ✅ **A1.1 Model Boundary Audit** → `task-a1.1-findings.md`
  - 68 claudeCode methods classified: 47 Model / 14 View-leak / 4 Controller-leak / 1 raw tmux / 3 tmux assumptions
  - Status: QA Review (PO approved)
- ✅ **A1.2 View Leak Refactor Plan** → `task-a1.2-findings.md`
  - 13 leaks with per-leak target layer + clean Model API
  - Proposed pure parsers (NEW): `session.probe.fromCapture`, `context.read.fromCapture`, `model.parse.statusBar`
  - Proposed data accessors (NEW): `process.find.byTty <tty>`, `session.current.byTty <tty>`, `session.state.byUuid <uuid>`, `context.read.byUuid <uuid>`, `context.velocity.byUuid <uuid>`
  - Final Model surface: 68 → ~40 methods (40% reduction)
  - 6 test-handoff criteria for A1.3
  - Status: QA Review

**PO-approved fix order** (execute AFTER A1.3 tester coverage):
1. `private.claudeCode.complete.panes` — 1-line: raw `tmux list-panes` → `otmux panes -a -F ...`
2. `session.probe` split — Controller owns TUI send/capture; Model owns `fromCapture` parser
3. `agent.recover` — delete (duplicate of `hiveMind.agent.unblock` family)

**Next tasks (unblocked, parallel per sprint graph):**
- A2 — claudeCode Session Portability (depends on A1.1/A1.2 classification)
- C2 — hiveMind DRY Remaining Audit (parallel, independent)

---

## Team Layout (ooshTeam session)

| Pane | Role | Shell |
|------|------|-------|
| 0.0 | MacStudio (zsh — user/PO) | zsh |
| 0.1 | oosh-expert (me) | Claude Code, renamed + pane.lock'd |
| 0.2 | oosh-tester | Claude Code |
| 0.3 | oosh-expert-shell | bash 5.3.9 + OOSH env |
| 0.4 | oosh-tester-shell | bash 5.3.9 + OOSH env |

PO at TRONinterface:0.0, scrum-master at TRONinterface:0.2.

---

## Session commits (test/macos.latest)

Chronological, all pushed:

| Commit | What |
|---|---|
| **d949bd7** | `teams.migrate`: surgical push — replaced `dir.push ~/config` with per-file scp of `hivemind.*.env` only (no longer clobbers remote's user.env/credentials) |
| **e177300** | `teams.migrate`: stderr → `$LOG_LIVE` instead of `2>/dev/null`; `echo` → `important.log`; UUID dedup in JSONL transfer loop |
| **6ddeb14** | `claudeCode.session.probe`: fallback for Claude Code 2.1.x — `/status` dropped "Session ID:", now parses "Session name:" + finds newest JSONL with matching customTitle |
| **cbcea82** | **NEW** `claudeCode.session.discover` primitive + `session.current`/`session.state` wrappers. Non-invasive (no `/status` hijack). Matches on LAST customTitle in each JSONL (handles /rename history). States: live/stable/stale/broken/unknown. Cwd disambiguator for duplicate titles. |
| **9b90851** | `hiveMind.registry.refresh` rewritten to use `session.discover`. Writes NEW `~/config/hivemind.forks.env` audit log. Drops `role@model` guard (accepts bare role names). Prunes dead panes from BOTH sessions.env + roles.env. `hiveMind` bare falls back to `hivemind.teams.env` when no tmux. `HIVEMIND_FORKS` env var. forks.env added to `teams.migrate` push list. |
| **ff1d6dd** | Lifecycle hooks: `agent.rename`/`agent.spawn`/`agent.bootstrap`/`agent.respawn`/`agent.restart`/`team.restart` all auto-call `registry.refresh` on their session. |
| **6f37454** | Tester: added 19 tests (T-DISCOVER-1..9b in test.claudeCode + T-REFRESH-1..8 in test.hiveMind). |
| **c0377a4** | Tester: split T-REFRESH-2 into 2a/2b + tightened T-REFRESH-6 per my review. |
| **d948ec1** | Removed literal `"/status"` from `registry.refresh` docstring (triggered T-REFRESH-2b source-grep false-positive). |
| **8f9d5b2** | Tester: fixed BRE/ERE bug in T-REFRESH-5/6/8 — `\|` doesn't work as alternation under `-qE` (only under BRE `-q`). |
| **bb76bb6** | `sweep.detect`: generalize "Do you want to X?" permission prompt (was literal "proceed?" only). Unblocks tester from edit-approval dialogs. |
| **b3a63ae** | `sweep.detect`: DRY collapse — 3 preamble-specific patterns (Allow/Deny, "proceed?", tool-confirm alternation) → ONE detector on common invariant: `Do you want to` + `❯ N. Yes/No/Allow/Deny` menu. Net −9 lines. |

---

## hivemind.forks.env — NEW audit log

Location: `~/config/hivemind.forks.env` (env: `HIVEMIND_FORKS`).
Append-only. Written by `registry.refresh`. One line per refreshed Claude pane per refresh call.

Format:
```
timestamp|pane|role|uuid|state|parentUuid
2026-04-22T08:52:40Z|web4team:0.0|web4-po|a2ad74ab-...|stable|
2026-04-22T08:52:40Z|web4team:0.1|web4-architect|5b56e996-...|stable|
```

Header on first creation. parentUuid extracted from JSONL first-line when present.

---

## session.discover API — DRY single source of truth

```
private.claudeCode.session.discover <pane>
  → "<uuid>|<state>|<customTitle>"
  States: live | stable | stale | broken | unknown

claudeCode.session.current <pane>  → just the UUID
claudeCode.session.state   <pane>  → just the state
```

Non-invasive. No `/status` TUI hijack. Enumerates `~/.claude/projects/*/*.jsonl`, extracts LAST customTitle from each, matches pane title, disambiguates by pane cwd ↔ JSONL first-line cwd, picks newest mtime. Cross-platform stat (`-f %m || -c %Y`).

---

## Proven on live web4team

```
hiveMind registry.refresh web4team
→ 4 entries, 0 broken, 0 agent interruption, forks.env populated
```

All 4 distinct UUIDs resolved correctly (web4-po, web4-architect, web4-expert, web4-tester) even though two sessions shared customTitle=web4-expert historically — LAST-customTitle match + /rename distinguished them.

---

## Test status

**T-DISCOVER (test.claudeCode)**: 10/10 PASS (tester's independent run).

**T-REFRESH (test.hiveMind)**: 5/8 PASS before fix → 8/8 expected after `d948ec1` + `8f9d5b2`. Re-run in progress by tester.

---

## Remaining work — ordered

1. **✅ WAIT for tester's T-REFRESH re-run results**
2. **DRY consolidation** (pending tests green): collapse `claudeCode.session.id`, `private.hiveMind.liveUuid`, `private.hiveMind.session.resolve.uuid` into wrappers over `claudeCode.session.current`. Risky without coverage.
3. **Multi-team resolve fix** — HIGH, PO-assigned. Task file: `session/tasks/hivemind-multi-team-resolve.md`. 5 bugs all stem from `hiveMind.resolve` only searching `active.team`. Search all `HIVEMIND_TEAMS` entries. Unique match → return; ambiguous → require `<session>` disambiguator. Update `agent.monitor`, `send.message`, `send`, `agent.unblock`, `delegate` to pass session through. Prerequisite (`ff1d6dd`) already landed — every team's registry is now populated.
4. **consistency.fix extension**: auto-remove broken UUIDs from sessions.env, mark in forks.env.
5. **teams.save + agents.discover migration**: read from cache (sessions.env) rather than re-discovering per call.
6. **Docs**: `docs/hivemind.forks.md` — schema + state diagram.

---

## Other 2026-04-22 side work (unrelated to UUID tracking)

- **otmux clipboard**: SSH-aware via OSC 52 (`set-clipboard on` + `allow-passthrough on` + `copy-selection-and-cancel`). Auto-detects `SSH_CONNECTION`. New `otmux setup.clipboard.remote/local`. Docs: `docs/otmux.clipboard.md`.
- **"Starting an OOSH shell" docs** — new section in `docs/oosh.md` + README pointer. Answer: just type `bash`.
- **iTerm2** installed on MacStudio and McDonges (brew cask).

---

## Current team layout (ooshTeam)

```
┌─────────────────────────────────────────────────┐
│ 0.0 MacStudio (bash — user)                     │
├──────────────────────┬──────────────────────────┤
│ 0.1 oosh-expert (me) │ 0.2 oosh-tester          │
│     Claude Code      │     Claude Code          │
├──────────────────────┼──────────────────────────┤
│ 0.3 oosh-expert-shell│ 0.4 oosh-tester-shell    │
│     (bash 5 + OOSH)  │     (bash 5 + OOSH)      │
└─────────────────────────────────────────────────┘
```

Also live: `TRONinterface` (PO), `web4team` (web4-po + web4-architect + web4-expert + web4-tester).

---

## Open bugs (pre-existing, not addressed this session)

- c2 current.method.env broken quoting (EOF while looking for matching quote)
- JSONL stdin fd3
- Fork project dir

---

## Pre-session work (condensed — see git log for detail)

- **test.suite** filter/list/def (8964dd8, 8978958) — `test.suite run <script> <?level> <?filter>` with prefix-match filter; `test.def` named-function tests; `TEST_CASE_FILTER` skip-aware expect; `test.suite list` for completions.
- **c2** — `| sort` appended to get.functions for stable completion order (0120723).
- **hiveMind** — protected methods (`script.protected.method` CLI-callable, Tab-hidden); `session.renamed` → `protected.session.renamed`; `resolve` scope-ordered with caller-session preference; `teams.save` role cascade simplified; snapshot/respawn infra (`hivemind.snapshots.env`, `agent.snapshot`/`snapshot.list`/`agent.respawn`).
- **claudeCode.list** — DEAD/FORK-READY coloring, skip queue-op dir, last-active date.
- **odocker.install** — auto-detects inside/outside Docker.

---

## RECOVERY STEPS

1. Read this context + `learnings.md` + `backlog.md`
2. `otmux pane.get.target` → should print `ooshTeam:0.1`
3. `otmux pane.capture ooshTeam:0.2 10` → verify tester alive
4. Expert shell: `ooshTeam:0.3`. Send commands with `otmux send ooshTeam:0.3 "<cmd>" Enter`
5. If coming out of compact: pull `test/macos.latest` — all work since last compact is on that branch
6. Check `session/tasks/` for new PO directives
7. Ask for status before starting new work — tester may have live test results or multi-team resolve may be ready to start
