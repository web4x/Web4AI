# Review Sprint: MVC Identity Consistency — fix TMUX_PANE stale identity + claudeCode must route through hiveMind controller

**From**: oosh-po (Tron directive 2026-06-24: "do a full review sprint with the architect to fix this mess. usage of claudeCode shall consistently use hiveMind controller to keep the registry current")
**Sprint team**: oosh-architect (design review + fix spec) → oosh-expert (implement) → oosh-tester (verify)
**Priority**: CRITICAL
**Status**: OPEN

## The Two Problems

### Problem A: `$TMUX_PANE` is a birth-time snapshot — stale after pane swap/move

**Measured (oosh-po at robbinTeam2, 2026-06-24):**
- Raw tmux `display-message -p "#{pane_index}"` → **0** (correct, active pane)
- `otmux pane.get.target` → **robbinTeam2:0.3** (WRONG — reports the birth pane, not current)
- `$TMUX_PANE` = `%8` → pane 3 (architect's pane at process birth; agent was swapped to pane 0)

**Root cause**: `$TMUX_PANE` is set ONCE by tmux when the shell process starts. It's an env var, not a live query. After `swap-pane`, `move-pane`, or any pane rearrangement, the env var is STALE but the code trusts it as truth.

**Affected code (audit — 18 sites across 3 scripts):**

| Script | Line(s) | Usage | Impact |
|--------|---------|-------|--------|
| `otmux` | 2759 `pane.get.target` | `-t "${TMUX_PANE:-}"` | Returns wrong pane address for caller |
| `otmux` | 2744 `pane.get` | `-t "${TMUX_PANE:-}"` | Returns wrong pane ID/index |
| `otmux` | 1897 `send.prefix` | `-t "$TMUX_PANE"` | Sender prefix shows WRONG pane → receivers misidentify sender |
| `otmux` | 1895 `send.prefix` guard | `[ -z "$TMUX_PANE" ]` | OK (existence check only) |
| `otmux` | 1294-1298 `session.current` | `-t "$TMUX_PANE"` | Wrong session if pane moved across sessions |
| `otmux` | 1338-1341 `layout.dynamic` | `-t "$TMUX_PANE"` | Targets wrong window |
| `otmux` | 1380-1389 `fit` | `-t "$TMUX_PANE"` | Reads wrong client dimensions |
| `hiveMind` | 2258 `agent.send` | `tmux display -t "$TMUX_PANE"` | callerRole from WRONG pane → wrong sender identity |
| `hiveMind` | 2316 `delegate` | same pattern | Wrong delegation attribution |
| `hiveMind` | 7461 `team.sweep` | `own_pane="$TMUX_PANE"` | Skips wrong pane (skips someone else, sweeps self) |
| `hiveMind` | 7668 `team.monitor` | `own_pane="$TMUX_PANE"` | Same self-skip bug |
| `claudeCode` | 1591-1594 `context.self` | `$TMUX_PANE` guard | Reads context of wrong pane |

**Note (otmux:1885-1897 comment):** There's a comment "Self-pane resolution MUST use $TMUX_PANE (Tron P0 #3, 2026-05-12 LATE)" — this was a prior directive that assumed TMUX_PANE is stable. It was correct for the non-swap case but doesn't survive pane rearrangement. The architect must reconcile: either (a) panes must NEVER be swapped (enforce at otmux level), or (b) self-identification must use a live method that survives swaps.

### Problem B: raw `claudeCode` calls in hiveMind bypass the controller → registry goes stale

**Tron directive**: "usage of claudeCode shall consistently use hiveMind controller to keep the registry current."

The MVC architecture is: Model=claudeCode, View=otmux, Controller=hiveMind. But hiveMind itself calls claudeCode directly ~30 times (process.find, session.id, session.name, session.probe, process.running, context.read, fork, join, new). Every raw `claudeCode fork/join/new` that doesn't go through hiveMind's lifecycle hooks (agent.spawn/bootstrap/restart) skips `registry.refresh` → registry goes stale → `hiveMind resolve` returns wrong answers → cascade.

**Key violation sites in hiveMind (audit — 30 raw claudeCode calls):**

| Category | Lines | Issue |
|----------|-------|-------|
| `claudeCode fork $uuid` via `otmux send.enter` | 3071, 4569, 4663, 7302 | Fork happens but no registry.refresh fires → new UUID not registered |
| `claudeCode process.find/running` | 980, 2378, 4164, 4200, 6247 | Read-only — OK, doesn't change state |
| `claudeCode session.id/name/probe` | 990, 1678, 2390 | Read-only — OK |
| `claudeCode context.read` | 8368, 8454 | Read-only — OK |
| `claudeCode new` via `otmux send.enter` | 6365 | New session, no registry.refresh → agent invisible to registry |
| Remote `claudeCode fork` via ossh | 4178, 6677 | Cross-machine fork, no registry update on either side |

**The principle**: ANY operation that creates/moves/renames a Claude session MUST route through hiveMind lifecycle methods (agent.spawn, agent.bootstrap, agent.restart, agent.rename) which auto-call `registry.refresh`. Read-only queries (process.find, session.name, context.read) are fine as raw calls — they don't change state.

## Architect Deliverables

### D1: Design — fix self-identification after pane swap
- Analyse: can `$TMUX_PANE` be updated after swap? (No — it's a process env var.) Can tmux hooks update it? Can we use a different mechanism (e.g. `tmux display-message -p` without `-t` targets the ACTIVE pane in the current client)?
- Decision: (a) ban pane swaps and enforce at otmux level, OR (b) replace ALL 18 `$TMUX_PANE` self-identification sites with a live-query helper (e.g. `private.otmux.self.pane()` that returns the ACTIVE pane, not the birth pane). Consider: when the script is NOT the active pane (background, subshell), what does "no -t" return?
- Reconcile with the "Tron P0 #3" comment at otmux:1885 — explain WHY the old directive doesn't survive swaps and what replaces it.

### D2: Design — claudeCode state-changing calls must route through hiveMind
- Catalogue which claudeCode calls are READ-ONLY (ok as raw) vs STATE-CHANGING (must go through controller).
- For each state-changing site: specify which hiveMind lifecycle method replaces the raw call, or what registry.refresh hook needs adding.
- Special case: remote forks via ossh (lines 4178, 6677) — registry.refresh can't run locally for a remote pane. Design: remote registry.refresh via `ossh exec "hiveMind registry.refresh"`.

### D3: Design — self-care principle applied to identity
- After any pane swap/move, the identity chain (pane→role→UUID) must self-validate and self-repair. How? (E.g. after `otmux pane.swap`, auto-call `registry.refresh` on the affected panes.)
- `otmux pane.swap/move/join` must be lifecycle-aware: update registry, NOT just rearrange tmux geometry.

## Expert Deliverables (after architect design approved)

- Fix all 18 `$TMUX_PANE` sites per architect design
- Route all state-changing claudeCode calls through hiveMind lifecycle methods
- Wire pane.swap/move/join to trigger registry.refresh
- `private.otmux.self.pane()` helper (or equivalent) — live self-identification
- Tests: T-IDENTITY-SWAP (swap panes, verify self-ID correct), T-REGISTRY-LIFECYCLE (fork via controller → registry current; fork via raw → registry stale; detect the gap)

## Tester Deliverables

- T-IDENTITY-SWAP: create 2 panes, swap them, verify `pane.get.target` returns CORRECT post-swap address (not birth address)
- T-REGISTRY-LIFECYCLE: fork/join/new via hiveMind lifecycle method → assert registry.refresh fires → registry current. Raw claudeCode fork → assert registry NOT updated (documents the gap the fix closes)
- T-SENDER-PREFIX-SWAP: after pane swap, verify sender prefix `[@role pane]` shows CORRECT pane address
- T-SELF-SKIP: after pane swap, verify team.sweep skips the CORRECT self-pane (not the birth pane)

## Acceptance Criteria

- [ ] After ANY pane swap: `otmux pane.get.target` returns the CORRECT current pane address (not birth address)
- [ ] After ANY pane swap: sender prefix shows CORRECT pane identity
- [ ] ALL Claude session creation (fork/join/new) goes through hiveMind lifecycle → registry automatically current
- [ ] hiveMind.resolve returns correct pane for any agent, even after swaps
- [ ] team.sweep/team.monitor skip the CORRECT self-pane after swaps
- [ ] Remote forks update the remote registry (via ossh exec hiveMind registry.refresh)
- [ ] The "Tron P0 #3" comment at otmux:1885 is updated to reflect the new understanding
- [ ] Zero raw `claudeCode fork/join/new` calls remain in hiveMind outside lifecycle methods (read-only calls excluded)

## Report-back (edit here; report to oosh-po)
- Architect (D1+D2+D3 design):
- Expert (implementation + commits):
- Tester (T-IDENTITY-SWAP + T-REGISTRY-LIFECYCLE + T-SENDER-PREFIX-SWAP + T-SELF-SKIP results):
