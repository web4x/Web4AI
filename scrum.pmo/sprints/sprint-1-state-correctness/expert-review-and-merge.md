# Expert Review of Architect Analysis — and Merge Plan

**Author:** oosh-expert
**Date:** 2026-05-12
**Inputs:** `architect-state-analysis.md` + `design.md` (my earlier draft) + PUML
**Status:** DESIGN — no implementation. For PO sign-off.

---

## Verdict

Architect's analysis is **sharper and more actionable** than my draft. Three key
moves I agree with:

1. **6 invariants beats 16.** Architect collapsed mine to the 6 that actually drive
   observable failure modes. The other 10 of mine were sub-cases or duplicates.
2. **W/R/D semantics + the `?` "should but doesn't" marker** in the operation matrix
   is exactly the diagnostic shorthand we need. My W/P/C was less precise.
3. **Option C with B as safety net.** Pure observer is fast but fragile; pure
   reconcile is correct but slow. Combining gives both: cheap on the hot path,
   correct on the audit path.

## Answers to architect's 5 questions

### Q1. Mutation operations missing from your matrix?

You missed three that my draft caught:

- **agent.respawn** — fork from snapshot into existing pane. Same writes as
  `agent.fork.best` but ALSO writes to `roles.env` (re-affirms role) and reads
  from snapshots store. Should appear in your matrix.
- **agent.unblock** — could be argued as non-mutating (it sends key events), but
  Bug #2 showed it touched agents and was *almost* a mutation point. Treat as
  read-only but include it for completeness (no W/R/D, but it observes state).
- **layout.save / layout.restore (otmux)** — writes a separate state file at
  `~/config/otmux.<session>.layout`. Touches no `hivemind.*` stores but is part
  of the cold-restart story (`teams.restore` composes both).
- **size.lock (otmux)** — writes `~/config/otmux.size.locks.env`. Auto-applied
  during `teams.restore`. Worth listing because it's another cache that must
  reconcile to "what tmux actually has".

Adding these makes our store count **11** (my 8 missed the queue + a couple of
otmux side-stores; your 10 had them but missed otmux.size.locks.env).

### Q2. Event dispatch overhead acceptable in bash? (~1ms)

Yes — and probably faster than that. Function call table is a single
`case "$event" in ... esac` dispatch. The work is in the *handlers*, not the
dispatch. Even a hot path emitting 5 events per operation is 5ms at worst, which
is negligible compared to the tmux/screen IPC we already do (10–100ms).

Three things to enforce when implementing:

- Handler registration must be **idempotent** — sourcing the script twice can't
  duplicate handlers.
- Handler errors must be **isolated** — one failing handler can't block the
  others. Use `|| log` after each.
- Event names must be **versionable** — `protected.panes.shifted.v2` if semantics
  change, leave v1 as deprecated wrapper for one sprint.

### Q3. consistency.reconcile — full rebuild or incremental diff?

**Both, via the same code.** Same primitive — `private.hiveMind.reconcile.diff`
that compares cached state to live truth and returns a list of mutations needed.
Then:

- `consistency.audit` calls it, reports the diff, exits non-zero if any.
- `consistency.fix` calls it and *applies* the mutations.
- `consistency.reconcile` (new) is identical to fix but called by SM cycle.

Incremental-only diff is faster but loses self-healing for entirely missing
state (e.g. a fresh tmux server restart with all caches stale). The diff
algorithm naturally handles "live has 12 panes, cache has 0" as 12 add-ops, so
full rebuild emerges from incremental logic when the diff is large enough.

### Q4. Is B5.1 observer pattern the right foundation?

**Yes, with one extension.** B5.1 used `command -v hiveMind && hiveMind protected.<event>` — soft-fail observer call. Works because hiveMind is always
on PATH, but creates round-trip subprocess cost per event.

The extension: when the observer is *already running in the hiveMind context*
(i.e. an hiveMind method calling another hiveMind method), call the function
directly. Reserve the `hiveMind protected.<event>` subprocess pattern for
cross-script observers (otmux→hiveMind, tronMonitor→hiveMind).

Concretely:

- otmux → hiveMind: subprocess call (current pattern, keep)
- tronMonitor → hiveMind: subprocess call (current pattern, keep)
- hiveMind internal: in-process function call via dispatch table (new)

### Q5. Where should the event dispatch table live?

**In hiveMind, exposed via a small primitive.** Three reasons:

1. hiveMind is the Controller — by definition it owns cross-store coordination.
2. Bash scripts don't share state across `source` boundaries cleanly; keeping it
   in one file avoids the "two copies of the dispatch table" hazard.
3. The handlers themselves are hiveMind methods (registry.set, sessions.store,
   etc). Co-locating definition + dispatch is idiomatic.

New script `events` is **not warranted** — would be one more file to maintain
with no clear consumer outside hiveMind. If multiple controllers ever emerge
(unlikely in current architecture), revisit then.

API surface (proposal):

```bash
# Registration (called at script init)
private.hiveMind.events.register <event> <handlerFunction>

# Emission (called by mutation methods)
private.hiveMind.events.emit <event> <arg1> <arg2> ...

# Audit (debug / introspection)
hiveMind events.list                  # show registered handlers
hiveMind events.history <?lines:50>   # tail recent emissions
```

History is optional but cheap (append to `~/config/hivemind.events.log`,
rotate at 1MB). Worth it for diagnosing "registry didn't update — did the event
fire?" type bugs.

---

## Merge plan: combine the two analyses

Replace my `design.md` and your `architect-state-analysis.md` with a single
canonical `sprint-1-design.md` that has:

1. **Architect's store inventory** (cleaner table) + add otmux.size.locks.env
   and per-session layout files
2. **Architect's mutation matrix** (W/R/D + `?`) — extend with agent.respawn,
   agent.unblock (read-only marker), layout.*, size.lock
3. **Architect's 6 invariants** as the canonical list. Add my I8 (tronMonitor
   window content matches title — verify-before-claim from D1 fix today) as I7
4. **Architect's recommended architecture** (Option C + B safety net) verbatim
5. **Architect's event catalog** + my P3 triple-defense pattern as the ingress
   guard ALL handlers must apply before mutating their store
6. **My 7 sprint-0 patterns** (P1–P7) folded in as "design patterns canon"
7. **6 Sprint 1 epics** (from my draft) renamed to align with architect's
   structure:
   - SC-A → invariant audit (consistency.audit) — covers I1–I7
   - SC-B → event dispatch infrastructure (private.hiveMind.events.*)
   - SC-C → handler implementation per event (registry.set, queue.clean, …)
   - SC-D → reconcile/safety-net cycle (SM-driven, calls audit + fix)
   - SC-E → triple-defense at every ingress (audit existing methods)
   - SC-F → snapshot integrity + format versioning
   - SC-G → documentation + PUML extensions

## Open items the architect should add

- **PUML for event flow** — sequence diagram showing a mutation's events firing
  and which handlers they hit. The state-stores.puml is good for the macro view;
  we need a micro view too.
- **PUML for reconcile cycle** — sequence diagram for `consistency.reconcile`
  detecting and fixing a degraded state. Shows the diff primitive in action.
- **Format-version field for snapshots** — currently snapshots have no version
  marker. If we change the format (e.g. add a column), restore from an old
  snapshot may misparse. Architect's design doc should specify.

## Failure-mode questions for PO

These are user-visible decisions, not architectural:

- **U1.** When a handler fails (e.g. registry.set can't write to roles.env
  because permissions are broken), should the mutation be **rolled back** or
  **logged-and-continue**? Trade-off: rollback is correct but adds complexity;
  log-and-continue keeps the system moving but accumulates drift.
  → Recommend log-and-continue + reconcile-on-next-cycle catches it.

- **U2.** Should `consistency.audit` be **strict** (any violation = exit 1)
  or **graded** (return how many violations, severity tiers)?
  → Recommend graded — Sprint 1 needs visibility, not failure cascades.

- **U3.** Should `consistency.reconcile` be **read-only by default** (require
  `--apply` flag to write) or **apply by default** (require `--dry-run` to skip)?
  → Recommend apply-by-default once we trust it. Until then, dry-run default
  + explicit `apply`.

---

## Next steps

1. **Architect** — extend the matrix with my additions, extend invariants with
   I7 (verify-before-claim), draft event-flow PUML and reconcile-cycle PUML.
2. **Joint** — produce `sprint-1-design.md` consolidated doc.
3. **PO** — sign off on epics + answer U1/U2/U3.
4. **Sprint 1 task files** generated from consolidated design.
5. **NO implementation** until all 4 above are done.
