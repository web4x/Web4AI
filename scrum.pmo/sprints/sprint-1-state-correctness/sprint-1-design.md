# Sprint 1 — State Correctness Architecture (CONSOLIDATED DESIGN)

**Status:** DESIGN — no implementation
**Authors:** oosh-architect + oosh-expert (joint)
**PO sign-offs locked:** U1=log+continue, U2=graded audit, U3=dry-run default
**Mandate (Tron via PO, 2026-05-12):** Teams.env garbage cleanup today was manual,
not structural. Architectural prevention required.

Supersedes:
- `architect-state-analysis.md` (architect's first pass)
- `design.md` (expert's first pass)
- `expert-review-and-merge.md` (review notes)

Companion: `docs/puml/Sprint1_StateCorrectness_*.puml`

---

## 1. State Stores — single canonical inventory

Stores are categorized by ownership and consistency tier.

### Cache stores (must be reconcilable to ground truth)

| # | Store | File | Format | Owner |
|---|-------|------|--------|-------|
| S1 | roles | `~/config/hivemind.roles.env` | `pane\|role\|epoch` (TTL) | hiveMind |
| S2 | sessions | `~/config/hivemind.sessions.env` | `pane\|uuid` | hiveMind |
| S3 | teams | `~/config/hivemind.teams.env` | `session\|description` | hiveMind |
| S4 | snapshots | `~/config/hivemind.snapshot.*.env` | `session\|addr\|role\|uuid\|title` | hiveMind |
| S5 | forks audit | `~/config/hivemind.forks.env` | append-only log | hiveMind |
| S6 | queue | `~/config/hivemind.queue/<pane>.queue` | `epoch\|intent\|text` | hiveMind |
| S7 | active team | `~/config/hivemind.active.team` | one session name | hiveMind |
| S8 | tronMonitor windows | `~/config/tronMonitor.env` | `screenWin\|session` | tronMonitor |
| S9 | size locks | `~/config/otmux.size.locks.env` | `session\|minW×minH` | otmux |
| S10 | per-session layouts | `~/config/otmux.<session>.layout` | tmux layout string + titles | otmux |

### Ground truth (authoritative, never written by us)

| # | Source | Query | Owner |
|---|--------|-------|-------|
| L1 | tmux state | `tmux ls / list-panes` | tmux |
| L2 | screen state | `screen -ls` / hardcopy | screen |
| L3 | Claude state | `~/.claude/projects/*/*.jsonl` + `ps args` | Claude Code |

**Rule (Pattern P4):** information flows live → cache. Never cache → live.
A cache that "remembers" something not in live state is by definition stale
and must be reconciled.

---

## 2. Mutation operations × state-store matrix

W=write, R=read, D=delete, –=untouched, ?=should-but-doesn't (gap to fix)

| Op | S1 roles | S2 sess | S3 teams | S4 snap | S5 forks | S6 queue | S7 active | S8 tronMon | S9 lock | S10 layout | L1 tmux | L2 screen | L3 claude |
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
| O1 agent.spawn | W | – | – | – | – | – | – | – | – | – | W | – | – |
| O2 agent.bootstrap | W | W | – | – | – | – | – | – | – | – | W | – | W |
| O3 agent.rename | W | – | – | – | – | – | – | – | – | – | W (title) | – | W (/rename) |
| O4 agent.fork.best | W | W | – | – | W | – | – | – | – | – | W (title) | – | W |
| O5 agent.respawn | W | W | – | R (snap) | W | – | – | – | – | – | W (title) | – | W (fork) |
| O6 agent.unblock | R | R | – | – | – | R | – | – | – | – | R | – | R |
| O7 pane.swap | W (exchange) | – | – | – | – | – | – | – | – | – | W | – | – |
| O8 pane.split | W (shift) | W (shift) | – | – | – | W (rename) | – | – | – | – | W | – | – |
| O9 pane.move | W (rename key) | – | – | – | – | – | – | – | – | – | W | – | – |
| O10 pane.kill | D | D | – | – | – | D | – | – | – | – | D | – | – |
| O11 team.setup | W (N) | W (N) | W | – | – | – | W | ? | – | – | W | – | W (N) |
| O12 team.register | – | – | W | – | – | – | W | ? | – | – | – | – | – |
| O13 team.remove | D (subset) | D (subset) | D | – | – | D (subset) | C | W (fires remove) | – | – | – | – | – |
| O14 teams.save | R | R | R | W | – | – | – | – | – | R (composes B2) | R | – | R |
| O15 teams.restore | W | W | W | R | – | – | W | ? | W | R | W | – | R |
| O16 teams.migrate | R+remote | R+remote | R+remote | R+W | – | – | – | – | – | – | – | – | R+remote |
| O17 monitor.add | – | – | – | – | – | – | – | W | – | – | – | W | – |
| O18 monitor.switch | – | – | – | – | – | – | – | – | – | – | – | W (verify) | – |
| O19 monitor.sync | – | – | R | – | – | – | – | W (reconcile) | – | – | – | W | – |
| O20 layout.save | – | – | – | – | – | – | – | – | – | W | R | – | – |
| O21 layout.restore | – | – | – | – | – | – | – | – | – | R | W | – | – |
| O22 size.lock | – | – | – | – | – | – | – | – | W | – | W (set-option) | – | – |
| O23 registry.refresh | W | W | – | – | W (audit) | – | – | – | – | – | R | – | R |
| O24 consistency.audit | R | R | R | R | – | R | R | R | R | R | R | R | R |
| O25 consistency.reconcile | W (diff) | W (diff) | W (diff) | C | W (audit) | W (diff) | W (diff) | W (diff) | C | C | R | R | R |

Gaps (`?` marks in S8 column): O11/O12/O15 should auto-add to tronMonitor (D2.1 partial).
O8 pane.split note (architect): S1/S2 entries must shift indices when tmux renumbers,
S6 queue files (named by pane address) must be **renamed** on disk, not just have
their content shifted — handler is `queue.rename` not `queue.shift`.

Status: design SIGNED OFF — oosh-architect + oosh-po (2026-05-12).

---

## 3. Invariants — canonical list (PO-locked)

Six structural invariants from architect + one operational invariant from
expert (verify-before-claim, today's D1 fix). Each has an owner that enforces.

| I# | Invariant | Owner | Detection | Status |
|----|-----------|-------|-----------|--------|
| **I1** | Every pane in S1 exists in L1. Every Claude-running L1 pane SHOULD have an S1 entry. | hiveMind | `state.audit` diff S1 vs `tmux list-panes` | partial — fix today (ebc8b5e validates ingress) |
| **I2** | Every pane in S2 is in S1. UUID in S2 matches live Claude. | hiveMind | `state.audit` cross-ref + ps args | partial |
| **I3** | Every team in S3 is a running tmux session in L1 OR explicitly marked stopped. | hiveMind | `team.register` live-tmux check | NEW ✓ (ebc8b5e) |
| **I4** | tronMonitor.env (S8) ⊂ teams.env (S3) | tronMonitor | `monitor.sync` (D1.2) | ✓ (cron-only) |
| **I5** | Snapshots (S4) contain correct UUIDs at save time. | hiveMind | `teams.save` uses session.resolve.uuid | ✓ (fa722ac) — gaps when agents fork between save+restore |
| **I6** | Queue files (S6) reference valid pane targets in S1. Stale queues for dead panes drained. | hiveMind | none yet | not enforced |
| **I7** | Observable display state matches its claimed-state tag (e.g. monitor pane title vs displayed window content). | tronMonitor / hiveMind | `tronMonitor.verify` (verify-before-claim — Pattern P2) | NEW ✓ (aa7d6ac) |

### Each invariant emits at one severity level for graded audit (per U2)

- **CRITICAL** — production-impacting: I3 (garbage in teams = wrong resolves), I7 (wrong-team display)
- **HIGH** — observable degradation: I1 (stale roles → wrong send target), I2 (wrong UUID)
- **MEDIUM** — drift accumulating: I4 (monitor desync), I5 (snapshot staleness)
- **LOW** — janitorial: I6 (queue garbage)

---

## 4. Architecture: Option C (events) + Option B (reconcile) — PO locked

### Primary: Event dispatch (Option C, extends B5.1 observer pattern)

Every mutation emits a named event. Handlers subscribe per state store. Handlers
run after the primary mutation, never block it.

**Event API (in hiveMind, not new script):**
```bash
private.hiveMind.events.register <eventName> <handlerFunction>
private.hiveMind.events.emit <eventName> <arg1> <arg2> ...
hiveMind events.list                # introspection
hiveMind events.history <?lines:50> # tail ~/config/hivemind.events.log
```

**Constraints (decided in Q&A):**
- Handler registration **idempotent** — same registration twice = one entry
- Handler errors **isolated** — failing handler logs but doesn't abort siblings
- Event names **versionable** — `protected.panes.shifted.v2` if semantics change;
  v1 kept as wrapper for one sprint
- **In-process** for hiveMind→hiveMind handlers (function call)
- **Subprocess** for cross-script (otmux→hiveMind, tronMonitor→hiveMind) via
  `hiveMind protected.<event>` (current B5.1 pattern, keep)

### Safety net: Reconcile cycle (Option B, called periodically)

`consistency.reconcile` is the diff-and-apply method that catches anything
events missed. Single primitive `private.hiveMind.reconcile.diff` produces a
list of mutations; `audit` reports, `fix` and `reconcile` apply.

**Three callers, same primitive:**

| Caller | Behaviour | Default mode |
|--------|-----------|--------------|
| `hiveMind consistency.audit` | reports diff, exit code = total violations | dry-run only |
| `hiveMind consistency.fix` | applies diff after confirmation | dry-run + prompt → apply |
| `hiveMind consistency.reconcile` | applies diff silently (cron-friendly) | dry-run (U3 lock) — use `--apply` flag |

**Called by:** `scrumMaster cycle` every 60s in reconcile mode (`--apply` only
when sweep is stable).

### Event catalog (proposed — handlers TBD per epic SC-C)

| Event | Emitted by (mutation op) | Handlers required |
|-------|-------------------------|-------------------|
| `agent.spawned` | O1, O2 | registry.set, sessions.store |
| `agent.killed` | O10, O13 | registry.remove, sessions.remove, queue.clean |
| `agent.renamed` | O3 | registry.update, pane.title.pushed, role.env.pushed |
| `agent.forked` | O4, O5 | registry.set, sessions.store, forks.append |
| `panes.shifted` | O8 (split or kill in middle) | registry.shift, sessions.shift, **queue.rename** (files named by pane addr) |
| `panes.swapped` | O7 | registry.swap, role.env.swap |
| `pane.moved` | O9 | registry.move, role.env.push |
| `team.created` | O11, O12 | teams.add, tronMonitor.add (closes ? gap above) |
| `team.destroyed` | O13 | teams.remove, tronMonitor.remove, registry.prune, sessions.prune, queue.prune |
| `team.restored` | O15 | bulk-register, tronMonitor.bulk-add |

---

## 5. Design patterns canon (Sprint 0 patterns made first-class)

These seven patterns from Sprint 0 are the canonical implementation rules.
New code must follow them; existing code is audited against them by SC-E.

**P1 — Observer pattern, soft-fail.**
View notifies Controller of state mutations.
`command -v hiveMind && hiveMind protected.<event> "$@" || info.log`
Refs: B5.1 (`d0d3d92`), D2 (`597f93e`).

**P2 — Verify-before-claim.**
A method producing observable side effect must verify it before reporting
success. Otherwise the cache becomes a lie.
Refs: tronMonitor.switch (`aa7d6ac`).
Generalize to: agent.rename (verify pane_title), team.register (verify in env
post-write).

**P3 — Triple defense at ingress.**
String identifiers from untrusted callers go through:
(a) regex format validation
(b) delimiter-rejection (`|`, newline)
(c) ground-truth existence check (tmux/screen/Claude)
Refs: team.register (`ebc8b5e`).
Apply to: registry.set, tronMonitor.add, team.switch (per SC-E).

**P4 — Live → cache, never cache → live.**
S1–S10 are derived from L1–L3. A "remembered" entry not in live state is stale.

**P5 — TTL-priority for write-through reconciliation.**
When manual writes and live discovery share a store, encode timestamps and use
TTL to decide who wins.
Refs: `registry.set` with `HIVEMIND_REGISTRY_TTL=30` (`d0d3d92`, fixed `14d5866`).

**P6 — Allowlist over denylist for action-taking code.**
When deciding action vs no-op, use explicit allowed-list, not `*)` fallback.
Refs: `agent.unblock` (`8d01421`).

**P7 — Quote shell-expanded data; iterate via array.**
File-read or process-output must be array-iterated. Today's garbage came from
`for sess in $unquoted` word-splitting "Did you mean:" into 3 entries.
Refs: `teams.restore` (`ebc8b5e`).

---

## 6. PO-locked operational decisions

| # | Decision | Locked value |
|---|----------|--------------|
| U1 | Handler failure policy | log+continue; reconcile catches drift |
| U2 | Audit reporting | graded (CRITICAL/HIGH/MEDIUM/LOW), show all violations, exit code = count |
| U3 | Reconcile default mode | dry-run; `--apply` flag required to mutate |

These propagate as constraints into epic implementation rules.

---

## 7. Sprint 1 — Epic breakdown

Implementation order is forced by dependency: SC-A audit infrastructure must
land before SC-D reconcile can be tested; SC-B event dispatch must land before
SC-C handlers consume it.

### SC-A: Consistency audit method (foundation)
**Goal:** `hiveMind consistency.audit` reports all I1–I7 violations, graded.
**Depends on:** nothing.
**Subtasks:**
- SC-A.1 expert — implement `private.hiveMind.reconcile.diff` (the primitive)
- SC-A.2 expert — implement `consistency.audit` (calls diff, reports human + JSON)
- SC-A.3 tester — 6 fixture scenarios per invariant, verify detection

### SC-B: Event dispatch infrastructure
**Goal:** `private.hiveMind.events.register/emit` + history log.
**Depends on:** nothing.
**Subtasks:**
- SC-B.1 expert — implement dispatch table primitive (idempotent register, isolated emit)
- SC-B.2 expert — implement events.history + log rotation
- SC-B.3 tester — verify isolation (failing handler doesn't break siblings), idempotency

### SC-C: Handler implementation per event
**Goal:** Catalog of §4 events all has wired handlers.
**Depends on:** SC-B.
**Subtasks:** one per event in §4 catalog (10 events → 10 subtasks split expert/tester).

### SC-D: Reconcile cycle (safety net)
**Goal:** `consistency.reconcile [--apply]` runs in SM cycle.
**Depends on:** SC-A.
**Subtasks:**
- SC-D.1 expert — implement `consistency.fix` and `consistency.reconcile` on top of SC-A primitive
- SC-D.2 expert — wire `scrumMaster cycle` to call reconcile (--apply gated by sweep stability)
- SC-D.3 tester — degrade → reconcile → audit-clean roundtrip per invariant

### SC-E: Ingress triple-defense audit
**Goal:** every method accepting caller-supplied identifier has P3 triple defense.
**Depends on:** nothing.
**Subtasks:**
- SC-E.1 expert — audit all string-accepting public methods, produce findings doc
- SC-E.2 expert — apply triple defense to gaps found
- SC-E.3 tester — three-vector reject test per ingress

### SC-F: Snapshot integrity + format versioning
**Goal:** snapshots can't be corrupted by partial writes or future format drift.
**Depends on:** SC-E (re-uses regex validation).
**Subtasks:**
- SC-F.1 expert — add `# version: 1` header to snapshot format; `teams.restore` reject unknown
- SC-F.2 expert — `teams.save` validates every line before writing
- SC-F.3 expert — `teams.restore` validates every snapshot line before processing
- SC-F.4 tester — corrupt-snapshot reject + version-skew reject

### SC-G: Documentation + PUMLs
**Goal:** developer-facing state-correctness reference.
**Depends on:** SC-A/B/C/D landed (so docs reflect reality).
**Subtasks:**
- SC-G.1 expert — `docs/state-stores.md` (S1–S10 with owner/writer/format)
- SC-G.2 expert — `docs/invariants.md` (I1–I7 with owner/detection/severity)
- SC-G.3 architect — PUML diagrams (state-stores done; event-flow + reconcile-cycle TBD)
- SC-G.4 expert — update `docs/oosh-architecture.md` with State Correctness section

---

## 8. Open items pending architect

- [ ] Extend mutation matrix with my 4 additions (respawn, unblock, layout.*, size.lock) — DONE in §2 above (architect please verify)
- [ ] PUML: event flow (single mutation → events → handlers fan-out)
- [ ] PUML: reconcile cycle (degraded → diff → audit/fix/reconcile → consistent)
- [ ] Sign off this consolidated doc

## 9. Open items pending PO sign-off

- [ ] Approval of 7-epic breakdown order
- [ ] Approval of expert/tester split per epic
- [ ] Sprint 1 start date / capacity allocation

## 10. NO IMPLEMENTATION until §9 cleared

Per PO directive 2026-05-12. Design first, sign-off, then Sprint 1 task files,
then implementation.
