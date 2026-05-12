# Sprint 1: State Correctness Architecture

**Status:** DRAFT — joint design between oosh-expert + oosh-architect. DO NOT implement.
**Mandate (PO via Tron, 2026-05-12):** Today's teams.env garbage cleanup was manual,
not structural. State WILL degrade again without architectural prevention. Define
invariants for every MVC operation, assign enforcement, plan as Sprint 1 tasks.
**Authors:** oosh-expert (initial draft), oosh-architect (TODO review/extend)

---

## 1. The State Stores

Everything an agent's identity, location, and lifecycle depends on must be in
exactly one of these, with clear owner and writer.

| # | Store | Path | Purpose | Authoritative Source |
|---|-------|------|---------|----------------------|
| S1 | **roles registry** | `~/config/hivemind.roles.env` | `pane → role` (with TTL timestamp) | hiveMind (Controller) |
| S2 | **sessions** | `~/config/hivemind.sessions.env` | `pane → claude UUID` | hiveMind (Controller), updated from live discovery |
| S3 | **teams** | `~/config/hivemind.teams.env` | `session → description` | hiveMind (Controller) |
| S4 | **snapshots** | `~/config/hivemind.snapshots.env` | `role → UUID|timestamp|ctxPct` (golden fork sources) | hiveMind (Controller) |
| S5 | **active team** | `~/config/hivemind.active.team` | current PO/SM focus session | hiveMind (Controller) |
| S6 | **forks audit** | `~/config/hivemind.forks.env` | append-only log of forks (audit only) | hiveMind (Controller) |
| S7 | **tronMonitor windows** | `~/config/tronMonitor.env` | `screenWindow# → teamSession` | tronMonitor (Monitor) |
| S8 | **size locks** | `~/config/otmux.size.locks.env` | `session → minW×minH` | otmux (View) |
| L1 | **tmux (live)** | `tmux ls/list-panes` | true panes, sessions, titles | tmux itself |
| L2 | **screen (live)** | `screen -ls` / hardcopy | true tronMon windows | screen itself |
| L3 | **Claude (live)** | `~/.claude/projects/*/*.jsonl` + `ps args` | true running agents | Claude Code itself |

Stores S1–S8 are CACHES. L1–L3 are GROUND TRUTH. Caches must be reconcilable to
ground truth (single direction: live → cache, never cache → live).

---

## 2. MVC Operations (the State Mutators)

Each operation must declare which stores it mutates and which invariants it
must restore on completion.

| # | Op | Tool (initiator) | Stores touched | Notes |
|---|----|------------------|----------------|-------|
| O1 | **spawn** | hiveMind | S1, S2 (write-through) | New pane created; agent launched |
| O2 | **bootstrap** | hiveMind | S1, S2, L1, L3 (start) | Full bring-up: pane + claude + /rename |
| O3 | **rename** | hiveMind | S1; broadcast `protected.session.renamed` | Session/pane gets new identity |
| O4 | **kill** | hiveMind / user | S1, S2 (drop) | Agent terminated, pane destroyed |
| O5 | **swap** | otmux→hiveMind observer | S1 (exchange entries) | tmux swap-pane physically swaps content |
| O6 | **split** | otmux→hiveMind observer | (no S1 change — new pane is empty until spawn) | New pane appears; orphan until claimed |
| O7 | **move/join** | otmux→hiveMind observer | S1 (rename key) | Pane goes to different window/session |
| O8 | **fork** | hiveMind/claudeCode | S2 (new UUID), S6 (append) | New claude session from parent |
| O9 | **respawn** | hiveMind | S1, S2 (re-write); from S4 snapshot | Replace dead pane content with snapshot UUID |
| O10 | **restore** | hiveMind teams.restore | S1, S2, S3 (rebuild from snapshot file) | Cold-start of an entire team |
| O11 | **migrate** | hiveMind teams.migrate | none locally; remote system gets snapshot | Push state to another host |
| O12 | **team.register** | hiveMind / observer | S3 | New team becomes visible to monitoring |
| O13 | **team.remove** | hiveMind / observer | S3, fires `tronMonitor.remove` | Team unregistered |
| O14 | **monitor.add** | tronMonitor (observer of O12) | S7, L2 | Screen window created |
| O15 | **monitor.switch** | tronMonitor | (no env write — only screen state) | Tron flips display |
| O16 | **monitor.sync** | tronMonitor | S7 (reconcile to S3) | Cron-able drift cleanup |
| O17 | **consistency.fix** | hiveMind | S1, S2 (prune dead) | Manual reconciliation |
| O18 | **layout.save/restore** | otmux | side-state file (per-session layout) | Pane geometry persistence |
| O19 | **size.lock** | otmux | S8 | Auto-applied during O10 |

---

## 3. Invariants (what must hold after every operation)

These are CORRECTNESS INVARIANTS. Any tool can check them; one tool OWNS each one.

| I# | Invariant | Owner (enforces) | Detection method | Status today |
|----|-----------|------------------|------------------|--------------|
| I1 | For every entry in S1, the pane exists in L1 | hiveMind | `consistency.fix` prunes | partial (manual) |
| I2 | For every entry in S2, the UUID JSONL exists | hiveMind | scan ~/.claude/projects | not enforced |
| I3 | For every entry in S3, the tmux session exists in L1 | hiveMind | NEW: `team.register` live-tmux check (just shipped ebc8b5e) | NEW ✓ |
| I4 | Entries in S3 contain only valid session-name chars | hiveMind | NEW: regex + pipe check (ebc8b5e) | NEW ✓ |
| I5 | For every entry in S4, the UUID JSONL exists | hiveMind | `snapshot.list` color-codes stale | partial |
| I6 | S5 (active team) refers to a session in S3 | hiveMind | `private.hiveMind.active.team` validates | ✓ |
| I7 | For every entry in S7, the team is in S3 | tronMonitor | NEW: `sync` reconciles (D1.2) | ✓ but cron-only |
| I8 | Screen window content matches its S7-claimed team | tronMonitor | NEW: `switch` verify-before-title (aa7d6ac) | NEW ✓ |
| I9 | For every Claude process in L3, S2 has its UUID for its pane | hiveMind | live discovery on lifecycle edges | ✓ |
| I10 | For every pane running a Claude TUI in L1, S1 has a role | hiveMind | `agent.unblock`, `registry.refresh` | partial |
| I11 | Entries in S1/S2 use canonical pane format `sess:win.pane` | hiveMind | NEW: `panes.swapped` normalization (10e9fa0) | NEW ✓ |
| I12 | Roles registered in S1 are valid role names | hiveMind | `registry.set` regex check | ✓ (older work) |
| I13 | Sessions in S3 never receive descriptions with `\|` or newlines | hiveMind | NEW: pipe rejection in team.register (ebc8b5e) | NEW ✓ |
| I14 | After O5/O7 (swap/move), shell `HIVEMIND_ROLE` env matches new role | hiveMind | `pushRoleEnv` (Bug #3, 163b0a0) | ✓ |
| I15 | For every team in S3, tronMonitor has a window (if monitor running) | tronMonitor | sync (D1.2, e66036f) | ✓ but cron-only |
| I16 | No two entries in S1 share the same pane | hiveMind | upsert pattern in `registry.set` | ✓ |

**Open invariants needing implementation** (Sprint 1 candidates):
- I2 — orphan-UUID detection in S2 (drift cleanup)
- I7/I15 active enforcement (today only on demand or via cron)
- I10 active enforcement (today reactive only)
- I17 (NEW): For every pane running a Claude process, its current customTitle matches its S1 role
- I18 (NEW): Total invariant audit method `hiveMind consistency.audit` reports ALL violations

---

## 4. Per-operation invariant matrix

Marks `W`hich invariants the operation must restore (W=writes-and-checks),
`P`reserve (no mutation, but must not break), or `C`heck (read-only verify):

| Op \ Inv | I1 | I2 | I3 | I4 | I5 | I6 | I7 | I8 | I9 | I10 | I11 | I12 | I13 | I14 | I15 | I16 |
|---|----|----|----|----|----|----|----|----|----|-----|-----|-----|-----|-----|-----|-----|
| O1 spawn | W | – | – | – | – | P | – | – | W | W | W | W | – | – | – | W |
| O2 bootstrap | W | – | – | – | – | P | – | – | W | W | W | W | – | – | – | W |
| O3 rename | W | – | P | P | – | P | – | – | P | W | W | W | – | W | – | W |
| O4 kill | W | – | P | – | – | P | – | – | W | – | – | – | – | – | – | – |
| O5 swap | W | – | P | – | – | – | – | – | – | – | W | – | – | W | – | W |
| O6 split | P | – | P | – | – | – | – | – | – | – | – | – | – | – | – | – |
| O7 move | W | – | – | – | – | – | – | – | – | – | W | – | – | W | – | W |
| O8 fork | – | W | – | – | – | – | – | – | W | – | – | – | – | – | – | – |
| O9 respawn | W | W | – | – | C | – | – | – | W | W | W | W | – | – | – | W |
| O10 restore | W | W | W | W | C | W | – | – | W | W | W | W | W | – | – | W |
| O11 migrate | – | – | – | – | – | – | – | – | – | – | – | – | – | – | – | – |
| O12 team.register | – | – | W | W | – | – | – | – | – | – | – | – | W | – | – | – |
| O13 team.remove | – | – | W | – | – | C | – | – | – | – | – | – | – | – | W | – |
| O14 monitor.add | – | – | – | – | – | – | W | – | – | – | – | – | – | – | W | – |
| O15 monitor.switch | – | – | – | – | – | – | – | W | – | – | – | – | – | – | – | – |
| O16 monitor.sync | – | – | – | – | – | – | W | – | – | – | – | – | – | – | W | – |
| O17 consistency.fix | W | W | – | – | – | – | – | – | W | W | W | W | – | – | – | W |
| O18 layout | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P |
| O19 size.lock | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P |

---

## 5. Architectural patterns observed in Sprint 0 that worked

These principles should be canonical for Sprint 1:

**P1 — Observer pattern, soft-fail.**
View notifies Controller of state mutations: `command -v hiveMind && hiveMind protected.<event> "$@" || info.log`.
Used: `otmux.session.rename`, `otmux.split`, `otmux.pane.swap`, `otmux.pane.move`.
Sprint-0 commit refs: B5.1 (`d0d3d92`), D2 (`597f93e`).

**P2 — Verify-before-claim.**
A method that produces an observable side effect (title, displayed state, registry entry) must verify the effect before reporting success. Otherwise the cache lies.
Used: `tronMonitor.switch` (aa7d6ac).
Generalizable to: `agent.rename` (verify pane_title), `team.register` (verify in env).

**P3 — Triple defense at ingress (Bug #4 class).**
Any function that accepts a string identifier from a caller it doesn't fully trust must:
(a) regex-validate the format
(b) reject delimiters that would corrupt the storage format
(c) check existence in ground truth (tmux/screen/Claude) if applicable
Used: `team.register` (ebc8b5e). Should apply to: `registry.set`, `tronMonitor.add`, `team.switch`.

**P4 — Live → cache, never cache → live.**
Caches (S1–S8) are derived from ground truth (L1–L3), not the other way around.
A cache that "remembers" a session that no longer exists is a bug, not a feature.

**P5 — TTL-priority for write-through with reconciliation.**
When manual writes and live discovery both update the same store, encode timestamps and use TTL to decide who wins.
Used: `registry.set` with `HIVEMIND_REGISTRY_TTL=30` (d0d3d92, fixed in 14d5866).
Should apply to: S2 sessions (manual fork → write-through, refresh later).

**P6 — Allowlist over denylist for action-taking code.**
When a method decides "take action vs no-op", use explicit allowed-list, not `*)` fallback.
Used: `agent.unblock` (8d01421). Should apply to: any future state-mutating sweep.

**P7 — Quote shell-expanded data; iterate via array.**
Anything read from a file or another process must be array-iterated, not unquoted-var-iterated. Today's garbage came from `for sess in $unqouted` word-splitting "Did you mean:".
Used: `teams.restore` (ebc8b5e).
Should apply to: any other unquoted shell iteration we still have.

---

## 6. Sprint 1 — proposed task breakdown

**Pattern:** epic per state-correctness theme. Each epic has expert (audit + design) + tester (boundary tests).

### Epic SC-A: Invariant audit method (centralized check)
- SC-A1: `hiveMind state.audit` — single command runs all I1–I16 checks, reports JSON+human
- SC-A2: integrate into `hiveMind dashboard` as a "consistency: OK / N violations" line
- SC-A3: tester — 5+ fixture scenarios that simulate violations

### Epic SC-B: Active enforcement (replace reactive with proactive)
- SC-B1: turn cron-only `tronMonitor sync` into observer-triggered (O13 → O16)
- SC-B2: I10 — periodic registry.refresh on lifecycle edges (most edges done; audit gaps)
- SC-B3: I2 — orphan-UUID detection in sessions.env

### Epic SC-C: Triple-defense applied to all ingress points
- SC-C1: audit which methods accept caller-supplied identifiers (panes, roles, sessions, UUIDs)
- SC-C2: apply regex + delimiter + existence checks uniformly
- SC-C3: tester — for each ingress, verify all 3 attack vectors rejected

### Epic SC-D: Atomicity for multi-store ops
- SC-D1: O3 rename must update S1 AND `pane_title` AND `HIVEMIND_ROLE` env — atomic or transactional
- SC-D2: O5/O7 swap/move — same; partial-failure rollback?
- SC-D3: O10 restore — already mostly atomic; harden retry/idempotency

### Epic SC-E: Snapshot integrity (prevents future garbage class)
- SC-E1: `teams.save` validate every session name before writing snapshot line
- SC-E2: `teams.restore` validate every snapshot line before processing
- SC-E3: snapshot format version field; reject unknown versions

### Epic SC-F: Documentation + naming convention
- SC-F1: doc page "State Stores" — S1–S8 with owner, writer, format
- SC-F2: doc page "Invariants" — I1–I16+ with owner, detection method
- SC-F3: update `docs/oosh-architecture.md` with section on State Correctness

---

## 7. Open design questions (for architect's input)

1. **Atomicity scope.** Should multi-store ops (O3, O5, O7, O10) be atomic (all-or-nothing) or eventually consistent (each store independently restored)? Today's pattern is eventually-consistent + repair. Atomic would require a write-ahead log.

2. **Observer vs polling.** Is observer (P1) enough or do we need a watchdog that periodically checks invariants and self-heals? `scrumMaster.cycle` already does this for some — should it run I1–I16?

3. **Ground-truth queries vs cached state.** Some operations are slow to ground-truth (e.g. JSONL scans for I2). Should there be a tiered freshness model — fast cache for hot path, slow ground-truth for audit?

4. **Failure semantics.** When `team.register` rejects (e.g. live-tmux check fails), what should the caller do? Today returns 1 silently. Should it emit an observer event so other components know?

5. **External edits.** If a user manually edits `~/config/hivemind.*.env`, do we treat that as authoritative or transient? Today: transient (next refresh overwrites with TTL=30 default).

---

## 8. Next steps

- [ ] **oosh-architect review** — extend tables, flag missing operations/invariants, answer Q7
- [ ] **Joint PUML diagram** — sequence diagram for each MVC operation with state-store touchpoints
- [ ] **Sprint 1 task files** generated from §6 once design is signed off
- [ ] **PO review** — sign off on epics + priority order

---

*Sprint 1: State Correctness Architecture (design phase)*
*Following PO/Tron directive 2026-05-12 — structural prevention not manual cleanup*
