# OOSH Expert / Architect Agent Context

**Session**: oosh-expert@opus 1M on MacStudio.native
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: ooshTeam:0.2
**Shell**: ooshTeam:0.4 (bash 5 + OOSH env, real interactive `[oosh MacStudio.native]` prompt)
**Peer**: oosh-tester @ ooshTeam:0.3 (shell ooshTeam:0.5)
**Sibling**: oosh-architect @ ooshTeam:0.1
**PO**: oosh-po @ ooshTeam:0.0 (also TRONinterface:0.0)
**SM**: scrum-master @ TRONinterface:0.1
**Updated**: 2026-06-01 — Post-Sprint-1 continuation. Forked from fallback-oosh-expert. 6 commits this session.

## ⚠️ CURRENT STATE (read this first on rewind)

**This session** (forked 2026-05-27, continuing through 2026-06-01):

| Commit | Task | Summary |
|--------|------|---------|
| `f89bbc8` | P0 bug | context.read staleness fix: JSONL mtime guard + dynamic project dirs + velocity cache_read |
| `2118404` | SC-G.1 | state-stores.md: S2 staleness risk, L3 token semantics, S10 correct path |
| `95e8fae` | SC-G.2 | invariants.md: event handler enforcement table + P0 staleness case study |
| `1b89edd` | SC-G.4 | oosh-architecture.md: event dispatch + reconcile architecture section |
| `c4a5d2c` | D4 | tronMonitor.fit: border formula for pane-border-status top, raw tmux→otmux, completion |
| `382a26b` | MVC bug | tree.detailed: use pane title for sub-line (fixes @model→@host naming inconsistency) |

**Also fixed MVC state on boot:**
- S7 (active team): was `__test_hm_47067` → `ooshTeam`
- S2 (sessions.env): removed stale shell pane 0.4 entry, updated 0.2 UUID from parent `ea2c7021` to fork `453c3aec`

**Sprint status:** Sprint 1 CLOSED. SC-G epic (docs) DONE for expert scope (G.1+G.2+G.4). D4+D5 verified. P0 context.read bug fixed. MVC rename consistency bug fixed.

**Outstanding from backlog:**
- SC-E.2 P2/P3 ingress (17 remaining sites)
- BUG-T1/T4 ghost methods + auto-generated usage
- BUG-T5 `source hiveMind` hangs 30s
- hiveMind discover perf (57s bottleneck)
- SC-G.3 PUMLs (architect scope)

Sprint 1 closed 2026-05-25. Post-Sprint 1 bug-fix wave on 2026-05-26 (this session):

| Commit | Task |
|--------|------|
| `82213a6` | hiveMind agent.send queue/deliver feedback visible at default log level |
| `4338d2c` | c2 apostrophe strip — fixes Tab completion for 9 methods |
| `da48c11` | otmux layout.dynamic — current-window dynamic resize + tiled |
| `3a4bfbc` | sweep.detect scrolled-history catch for rate-limit/sub-limit/api-error |

Sprint 1 closure (2026-05-25, in order): SC-H.2 Gap A `1b2d59b`, D5 `aed6810`, SC-F.1 `2a61072`, SC-F.2+F.3 `c06eb80`, SC-E.2 `317e0d7` + `2b4e4c7` + `5be0eeb`, SC-G docs `4af9e99`.

Tester confirmations: Gap A `7a5e2bc` (8), D5 `1427be6` (8), F.2/F.3 `e3b223a` (10), SC-E.2 `b951b52` (14). 40 tests landed by tester across the wave. Bug-fix wave tester verifications: `4338d2c` confirmed PASS, `da48c11` confirmed PASS, `82213a6` + `3a4bfbc` pending.

Only architect-scope SC-G.3 (PUMLs) + tester-scope SC-D.3/E.3 fixtures remain from Sprint 1.



Recent commits (most recent first):
- `c08f44b` (Web4AI) — task: sc-e.2 P2/P3 ingress defense spec
- `5be0eeb` (oosh) — **SC-E.2 Commit C: claudeCode P3** — UUID/pane methods (join.byID/fork/fork.byID/join.byPane/fork.byPane/fork.to), 32+
- `2b4e4c7` (oosh) — **SC-E.2 Commit B: otmux+tronMonitor P2** — session.rename/kill/tronMon, 36+/1-
- `317e0d7` (oosh) — **SC-E.2 Commit A: this+hiveMind P2/P3** — new this.isSshHost + 9 sites, 78+
- `e3b223a` (oosh) — tester: 10 tests for SC-F.2/F.3 (confirmed)
- `4db0e2b` (Web4AI) — task: sc-f.2+f.3 snapshot row validation spec
- `c06eb80` (oosh) — **SC-F.2+F.3 BUNDLED: snapshot row validation on save+restore** (DONE — this turn). New `private.hiveMind.snapshot.row.valid` validates 8 fields. Wired at teams.save (live+dead) and teams.restore (main row loop). 72+/8-. Smoke 6/6 PASS.
- `1427be6` (oosh) — tester landed D5 tests (8 tests for stale-client cleanup)
- `a8dc6cc` (Web4AI) — task: sc-f.1 snapshot version field spec
- `2a61072` (oosh) — **SC-F.1: snapshot version field + reader validation** (DONE). `HIVEMIND_SNAPSHOT_VERSION=1` + `private.hiveMind.snapshot.version.check`. teams.save writes `# version: 1`; teams.restore + agent.restart + team.restart gate via helper. Grandfather: no-header → v1 accepted.
- `4f9cdac` (Web4AI) — task: d5 stale-client cleanup spec
- `aed6810` (oosh) — **D5: tronMonitor stale read-only client cleanup** (DONE). New `otmux.client.cleanup.stale <idleMin> <maxSize> <filter>` + targeted tronMonitor helper. 5 wire sites: setup/reset/remove/sync/scrumMaster.cycle. 107+/0-.
- `7a5e2bc` (oosh) — test.hiveMind: 8 Gap A tests (tester) — 8/8 verified PASS
- `20e9338` (Web4AI) — task: sc-h.2-gap-a.md spec
- `1b2d59b` (oosh) — **SC-H.2 Gap A: defer-probe pattern** (DONE)
- `20e9338` (Web4AI) — task file: sc-h.2-gap-a.md
- `e843391` (oosh) — SC-H.2 Gap B: team.remove S1/S2 bash 3.2 fallback prune
- `f707fa9` (oosh) — SC-H.2 Gap C: agent.spawned events from agent.restart + team.restart
- `25c8138` (Web4AI) — SC-H.1 findings: MVC audit matrix (12 commands × 5 stores)

**SC-H.2 wave status**: Gaps A+B+C all shipped. Tester verifies on robbinTeam.

**Gap A implementation** (commit `1b2d59b`, 98+/3-):
- New: `private.hiveMind.session.store.deferred <pane> <role>` (~70 lines after `session.lookup` at line ~1046). Forks disowned subshell, retries probe at 5s/15s/30s post-call. Pidfile at `/tmp/hivemind.deferred.<sanitized>.pid` guards re-entry. Idempotent — each iteration checks `session.lookup` first.
- Modified: `private.hiveMind.handler.agent.spawned.sessions` — when uuid arg empty, schedules deferred probe instead of returning silently.
- 5 sync sites updated: team.setup (direct call), team.setup.full (direct call), agent.bootstrap (bash-3.2 fallback), agent.restart (bash-3.2 fallback), team.restart (bash-3.2 fallback). team.setup.oosh DEPRECATED — skipped.
- Bash-3.2 fallback pattern: `[ -z "$HIVEMIND_EVENTS_AVAILABLE" ] && [ -z "$uuid" ] && schedule defer-probe` — handler path covers bash 5, fallback covers bash 3.2.

**Reading order post-rewind**:
1. This context.md (you are here)
2. `learnings.md` — has the new "audit findings can be wrong" lesson from Gap B
3. `boot.md` for daily setup
4. `~/oosh/hiveMind` line 685-700 (team.destroyed handlers, working pattern to mimic)
5. `~/oosh/hiveMind` line 5563 (agent.bootstrap events.emit "agent.spawned" — canonical signature)
6. `scrum.pmo/sprints/sprint-1-state-correctness/task-sc-h.1-findings.md` (Web4AI) for full gap context


## Active sprint context (2026-05-25)

**SC-H wave** — MVC audit + lifecycle gap closure:

| Task | Commit | Status |
|------|--------|--------|
| SC-H.1 findings (MVC matrix 12×5) | `25c8138` (Web4AI repo) | DELIVERED |
| SC-H.2 Gap C: agent.restart + team.restart emit agent.spawned | `f707fa9` | DONE |
| SC-H.2 Gap B: team.remove S1/S2 orphan prune (bash 3.2 fallback) | `e843391` | DONE |
| SC-H.2 Gap A: defer-probe pattern for session.store | `1b2d59b` | DONE |

**Wave context**:
- SC-H.1 surfaced 6 Gap Classes (A-F) in `scrum.pmo/sprints/sprint-1-state-correctness/task-sc-h.1-findings.md` (Web4AI repo, commit 25c8138)
- Gap C (events from restart paths) — 8 lines, 1 commit, signature matches agent.bootstrap line 5563
- Gap B (orphan pruning) — turns out handler chain ALREADY worked on bash 5; gap was bash 3.2 events no-op (task #29 gate). Added direct prune fallback gated on `[ -z "$HIVEMIND_EVENTS_AVAILABLE" ]`. Idempotent on bash 5.
- Gap A (probe race) — robbinTeam root cause. Plan: `private.hiveMind.session.store.deferred` retries probe at 5s/15s/30s post-launch. Requires careful test design — affects team.setup/agent.bootstrap/agent.restart/team.restart/teams.restore.

## Earlier 2026-05-24/25 wave (CMM4 naming + audit invariants)

| Commit | What |
|--------|------|
| `e7d5a8a` | Option C unified naming: all /rename + pane.lock = role@HIVEMIND_HOST. Added I8 (pane coverage) + I9 (title format) audit invariants. |
| `53f2bd9` | Added I10 (sessions.env coverage) — symmetric to I8 for S2. Probe-required entries skipped to avoid collision corruption. |
| `194568a` | Task #29 bash 3.2 compat: assoc arrays → delimited string lookups across hiveMind (events, claude.processes, agents.discover, consistency.audit, consistency.fix.table, teams.restore TARGET_PANE_COUNT) + otmux (status, tree, tree.detailed). `${t,,}` → tr. Events system gated by BASH_VERSINFO. |

## Active task state

- robbinTeam 6 panes + 1 new window (1.0 planner, 1.1 req) — all panes registered in S1 (post-manual registry.set). S2 incomplete (3/6 Claude panes) — needs operator `hiveMind agent.session.probe` per missing pane OR defer-probe (Gap A).
- Web4RawBin project dir: `/Users/Shared/Workspaces/2cuGitHub/Web4RawBin` — all robbinTeam agents cwd `/Users/Shared/Workspaces/AI/Claude/` (not project dir per SM directive).
- Architect at ooshTeam:0.1 finalized Option C design (drops @model from /rename).



## NEW FEATURE LANDED (2026-05-18, just before rewind — commit `dc0cc00`)

**`hiveMind team.migrate <session> <sshHost> <?snapshotFile>` + `hiveMind protected.team.import <session>`** shipped (commit `dc0cc00`).

How I found it: when I came back from save-context, `git diff hiveMind` showed
137 lines of uncommitted `hiveMind.team.migrate()` from an earlier rewind cycle
of this same agent. Architect/PO design notes embedded in the code:
- Q1 merge-on-remote (preserves remote's other teams; vs clobber)
- Q2 auto-snapshot (generates if no snapshot found)
- Q3 success.log only for v1 (no event emission yet)
- Q4 singular `team.migrate` (plural `teams.migrate` stays as full-machine)
- Gotcha: `$1==s` exact awk match (NOT `$1~s` — prevents `ooshTeam` matching `ooshTeam2`)

The uncommitted code was complete EXCEPT it called `hiveMind protected.team.import`
which didn't exist. I added it (~50 lines, idempotent merge of slice files into
local registries, ingress P3 via `this.isSessionName` + `this.isPipeSafe`).

**Verified live**:
- `bash -n hiveMind` syntax OK
- `hiveMind team.migrate` (no args) → usage error rejects correctly
- `hiveMind protected.team.import` (no args) → usage error rejects correctly
- NOT integration-tested with a real remote — that's tester scope.

**Workflow team.migrate <session> <host>**:
1. Auto-snapshot if no snapfile given
2. mktemp dir; awk-slice the snapshot to filter to one session (exact match)
3. Slice roles/sessions/teams env files by session prefix
4. ssh + `cd ~/oosh && git pull` on remote (or `ossh dir.push` fallback)
5. Push 4 slice files via `ossh scp` to `~/config/` on remote
6. Push JSONLs (deduped by uuid) for the session's UUIDs only
7. `ossh exec $host "hiveMind protected.team.import $session"` — merge slices
8. `ossh exec $host "hiveMind teams.restore ~/config/$(basename $sessSnap)"` — start team

PO assigned: **`hiveMind team.migrate <session> <host>`** — single-session migration. SHIPPED.

**Problem**: existing `hiveMind teams.migrate <host>` migrates ALL sessions. Agent-trainer tried to fork ooshTeam to McDonges → got 18 sessions cloned. Wrong.

**Design (to verify post-rewind)**:
- New method `hiveMind.team.migrate <session> <host>` (singular `team`, not `teams`)
- Workflow mirror of existing teams.migrate but session-filtered:
  1. Snapshot ONE session (filter teams.save by `<session>`)
  2. scp snapshot + per-session JSONLs to remote
  3. Restore on remote via filtered `teams.restore`

**Key code to inspect post-rewind**:
- `~/oosh/hiveMind` `teams.migrate` (line ~3115) — current bulk path
- `~/oosh/hiveMind` `teams.save` — does it have a session-filter argument? If not, may need to add one.
- `~/oosh/hiveMind` `teams.restore` — same question for filter

**Likely simplest implementation**:
- `hiveMind.team.migrate <session> <host>` = wrapper that:
  - generates snapshot to a tmp file filtered to one session (grep snapshot file by session prefix)
  - calls existing scp + ssh exec restore path with that tmp snapshot
- OR add `<?session>` filter arg to teams.save/teams.restore and let team.migrate compose.

**Coordinate with architect on signature** before shipping (per recent pattern). Single commit per PO directive.


**Layout**: 6 panes — 0.0 po, 0.1 architect, 0.2 expert (me), 0.3 tester, 0.4 expert-shell, 0.5 tester-shell

---

## Session 2026-05-15 → 2026-05-18 — Sprint 1 SC-C/SC-E + Tron P0 wave + otmux fast-path

### Sprint 1 SC-C epic CLOSED (10 events × 25 handlers)

| Commit | Task | Summary |
|--------|------|---------|
| `654e9ac` | SC-C.8+9+10 | team.created/destroyed/restored handlers — fan out tronMonitor + S1/S2/S6 prune on destroy + restore-aware (closes V→C event gap for team lifecycle) |

### Tron P0 prefix-correctness wave (4 commits, send mechanism rebuilt end-to-end)

| Commit | Task | Summary |
|--------|------|---------|
| `af2f76b` | Tron P0 #1 | otmux send.prefix: registry-only role lookup — dropped stale HIVEMIND_ROLE env read. Env was set once at shell start, went stale after pane swaps. Registry is single source of truth. |
| `3672559` | Tron P0 #2 | otmux send: silent no-op on empty/whitespace payload — guard before prefix in send/send.smart/send.verified. Stopped bare `[@role pane]` from being delivered as a phantom prompt that made agents hallucinate tasks. |
| `1276e58` | Tron P0 DRY | this.isEmpty kernel predicate + DRY empty-payload guards across 3 otmux + 5 hiveMind send paths. Replaces inline regex. |
| `6231b93` | Tron P0 #3 | otmux send.prefix: resolve caller pane via TMUX_PANE env (subprocess-safe). Bare `tmux display-message -p` returns the FOCUSED pane (the user's last click target), NOT the caller — entire prefix mechanism had been wrong in production for every subprocess `otmux send`. |

**The 4 prefix correctness primitives** (now all green end-to-end):
1. `send.prefix` — TMUX_PANE-resolved pane + registry-only role lookup
2. `is.key` — key-vs-prose classification (33 keys + 7 prose verified, ref Tron P0 v2 `2a39a60`)
3. `isEmpty` — empty/whitespace payload guard (kernel predicate)
4. `isClaudeCode` (via `pane.isClaudeCode`) — target-type detection (only Claude TUIs get prefix)

### Sprint 1 SC-E (ingress triple-defense — audit + apply P1)

| Commit | Task | Summary |
|--------|------|---------|
| `42b84c5` | SC-E.1 findings | Audited 65 public ingress methods (hiveMind 38, otmux 14, tronMonitor 8, claudeCode 12). **13 CRITICAL gaps** (W-class with 0 defense layers). Highest-leverage: `hiveMind.protected.*` observer family — 5 methods, write to env files, every cross-script event flows through them. |
| `1b759c5` | SC-E.2 predicates | Added 5 ingress predicates to `this` kernel: isPaneTarget / isSessionName / isRoleName / isUuid / isPipeSafe. Sibling to isEmpty/isNumber. 22 truth-table cases green. |
| `c1ecf3f` | SC-E.2 team+pane | Triple defense on team.remove + registry.remove + agent.spawn |
| `a7f5cb0` | SC-E.2 observer | Triple defense on protected.session.renamed + panes.swapped + pane.moved (highest leverage) |
| `085f621` | SC-E.2 rename | Triple defense on agent.rename newName |

8 attack vectors verified rejected live (pipe injection, space-containing names, leading-digit role names, sed-metachar names, ghost sessions).

### Architect spec collaboration

| File | Status |
|------|--------|
| `docs/send-prefix-spec.md` | Architect created, reviewed against code. 4 corrections sent (decision matrix row 9 env mention, queue.drain wording, missing TMUX_PANE primitive, suggested 4-primitive architecture list). Spec accurate as canonical reference. |

### tronMonitor.fit + otmux.fit + size aliases

| Commit | Task | Summary |
|--------|------|---------|
| `fe82d9c` | tronMonitor.fit | Tiled-layout sizer per docs/tronMonitor-fit-formula.md — 40 lines incl. ingress P3 + fallback. All 12 doc table rows verified. Live test on ooshTeam: 6 panes / 3×2 grid / 68×21 each. |
| `9ba871c` | otmux.fit | Resize session window to caller's terminal cols×rows (single client one-shot snap). Pairs with size.unlock for dynamic-largest. |
| `81789b2` | otmux size.\* aliases | size.unlock / size.lock / size.status — defaults to current session via TMUX_PANE. Shorter verb the user asked for. |

### docs symlinks (workspace-portable)

| Commit | Path |
|--------|------|
| `b153f1d` (dev.claude repo) | `docs/oosh-architecture.md` → `../../macos/docs/oosh-architecture.md` and `docs/context-schema.md` → `../../macos/docs/context-schema.md`. Single source of truth for SKILL.md cross-references. |

**Gotcha encountered**: workspace `docs/` is itself a symlink chain (`Claude → components/OOSH/dev.claude`). Initial `../components/...` relative path traversed through the chain and broke. Fix: `../../macos/docs/` — relative path from the underlying `dev.claude/docs` to `macos/docs`. Workspace-portable across all OOSH branch variants.

### otmux fast-path (TRON priority — joint design with architect)

| Commit | Task | Summary |
|--------|------|---------|
| `a68db7c` | Fast-path Tier 1+2 | otmux.status() rewrites to session-list (no tree). otmux.tree() A+B+C: batch tty map + batch ps map + version cache. **40s → 1.1s (37× speedup)** on 76-pane / 22-session server. |
| `97b3020` | Fast-path Tier 3 | otmux.tree.detailed() A+B+C+D: same caches + hoisted agents.discover (1 call vs N). Single-session bound by hiveMind discover internal cost (~57s — separate epic). |

**Live timings** (76 panes, 22 sessions):
- `otmux status`: 0.077s (target <0.5s — 6× under)
- `otmux tree ooshTeam`: 0.976s
- `otmux tree` (full server): 1.136s (target <1.5s — under; baseline 40.7s)
- `otmux tree.detailed ooshTeam`: 56.2s (modest single-session win; D shines on full server)

**Architecture**: 3-tier speed model. Tier 1 (status) zero subprocess calls. Tier 2 (tree) batched maps. Tier 3 (tree.detailed) batched + discover-hoisted. All caches intra-call only.

---

## MISSED PROMPTS (expert never processed — captured by Tron, saved by trainer 2026-05-19)

### BUG-T5 NEW — source hiveMind hangs 30s
`source hiveMind` hangs ~30s. Status scans all sessions. Bare invocation (`hiveMind` with no args) needs a fast path — should show usage instantly, not scan everything.

### BUG-T Verification Results (from Tron)
| Bug | Status | Detail |
|-----|--------|--------|
| T1 | CONFIRMED | 9 ghost methods |
| T2 | CONFIRMED | Not fixed |
| T3 | PARTIAL | |
| T4 | CONFIRMED | 80+ undocumented methods |
| T5 | NEW | source hiveMind hangs 30s (see above) |

### Fix Priorities (Tron directive)
1. **T1/T4**: auto-generate usage from `this.help` — eliminate ghost methods + document all methods
2. **T5**: fast bare invocation — hiveMind with no args must return instantly

## Open bugs / outstanding

- **hiveMind.protected.agents.discover internal cost** — 57s for 6 panes is the new bottleneck on tree.detailed. Separate epic (SC-F territory). Not in oosh-expert scope.
- **SC-E.2 P2/P3** — 17 remaining ingress points: team.setup family (3), team.switch, otmux.session.rename, tronMonitor.add/remove allowlist regex, claudeCode UUID/pane methods (~6), SSH-host accepting methods (5), otmux.kill. Ready when PO prioritizes.
- **SC-E.3 (tester)** — 3-vector reject per ingress for the 7 P1 fixes. Test stanzas: bad-regex / pipe-in-name / ghost-identifier. Predicates testable in isolation via `this.isPaneTarget '%4' && echo yes`.
- **SC-C.tests (tester)** — handler integration across all 10 events; idempotency under repeat emission.
- **Architect spec corrections** — 2 wording fixes pending in docs/send-prefix-spec.md: row 12 queue.drain ("Text was prefixed when queued" is misleading — queue stores raw, prefix at drain), broadcast indirection (`iterates send.message → agent.send`). Cosmetic; canonical spec is accurate.

---

## Current ooshTeam layout (verify with `otmux tree ooshTeam`)

| Pane | Role | Shell |
|------|------|-------|
| 0.0 | oosh-po (product-owner) | Claude Code |
| 0.1 | oosh-architect (sibling, separate Claude Code) | Claude Code |
| **0.2** | **oosh-expert (me)** | Claude Code, renamed + pane.lock'd |
| 0.3 | oosh-tester | Claude Code |
| 0.4 | oosh-expert-shell | bash 5.3.9 + OOSH (`[oosh MacStudio.native]` prompt) |
| 0.5 | oosh-tester-shell | bash 5.3.9 + OOSH |

**External**: PO sometimes at TRONinterface:0.0. Scrum-master at TRONinterface:0.1 (also called from there during prefix work).

---

## Commit rule (SM directive — never violate)

One-liner format: `<what changed> (ref: task-<id>-<name>.md)`. Every task = one commit (or one logical bundle). Before reporting done:
1. `git status -sb` — only the branch line
2. `git log -1 --oneline` — matches the current task

NO multi-paragraph commits, NO Co-Authored-By tags, details in the task file.

---

## RECOVERY STEPS (in order, post-rewind)

1. Read this context.md
2. Read learnings.md — new hard-won rules (TMUX_PANE caller resolution, registry-only role, this.isEmpty + ingress predicates, fast-path caches, ps tty filter, assoc-array nested-pipe survival)
3. Read backlog.md — outstanding SC-E P2/P3 + SC-C.tests + SC-E.3 + architect spec corrections
4. Read boot.md — quick boot procedure
5. `otmux pane.get.target` — confirm `ooshTeam:0.2`
6. `otmux tree ooshTeam` — verify 6-pane layout (<1s after fast-path)
7. `cd ~/oosh && git log --oneline -15` — top should include `97b3020` `a68db7c` `81789b2` `9ba871c` `b153f1d` `fe82d9c` `085f621` `a7f5cb0` `c1ecf3f` `1b759c5` `42b84c5` `6231b93` `1276e58` `3672559` `af2f76b` `654e9ac`
8. `git status -sb` in both `~/oosh` and workspace — should be clean for my files
9. Await PO assignment

## When you are next assigned work

- If SC-E.2 P2 prioritized: 17 ingress sites, ~4 commits per the task file class breakdown (team / pane / observer / send / remote)
- If hiveMind discover optimization: separate scope, coordinate with architect on whether it's an SC-F or new epic
- If anything send-prefix related: 4 primitives all green, spec at docs/send-prefix-spec.md is canonical
