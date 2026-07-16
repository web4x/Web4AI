# OOSH Project Backlog (deferred — not in an active sprint)

Cross-sprint issues captured so they are not forgotten. Not prioritized until a PO/Tron pulls them into a sprint. Newest first.

---

## BL-1 — Major version-mismatch crisis: `mcdonges.latest` (stable) vs `dev` (+690 lines of contract/color/boot work)

**Logged**: 2026-07-16 by oosh-architect@WODA.prod (Tron directive: "add to backlog, not priority now, we are on a stable version").
**Priority**: DEFERRED (we are intentionally running the STABLE `mcdonges.latest` line right now).
**Status**: OPEN / parked.
**uuid**: bl1-version-mismatch-mcdonges-dev

### The crisis (measured, read-only)
All agents run on **Mode: `mcdonges.latest`** (`/root/oosh` → `.../Once.sh/mcdonges.latest`, HEAD `df95a02`, tracks `origin/test/mcdonges.latest`) — the current **stable** base. But the last three sprints' fixes live on **`dev`** (`origin/dev` @ `fcd8e6d`), NOT on `mcdonges.latest`:

| File | mcdonges.latest (df95a02) | dev (fcd8e6d) | delta |
|---|---|---|---|
| `config` | **pre-contract** greedy config.save; contract fns = **0** (no anchored extractor / fail-loud round-trip / allow-deny lists) | full config.save A+B contract | +288 |
| `templates/user/bashrcTemplate` | **absent** | present (camelCase, a58c6f6) | +291 |
| `line` | old color gen | self-contained exported `setup.color.env` (c82fa31) | +72 |
| `this` | older | HOME-discovery + resolve.fundamentals improvements | +176 |
| **total** | | | **+690 lines** |

So on the stable line the team runs WITHOUT: config.save contract (→ #41 greedy silent-drop + terminal/VSCode leakage into user.env), the color/boot fixes, and bashrcTemplate.

### Why deferred
Tron: we are on a **stable** version on purpose; version reconciliation is NOT priority right now. Nothing is broken on mcdonges.latest for current work.

### What "done" looks like (when pulled into a sprint)
Reconcile the two lines into ONE version that carries BOTH the mcdonges.latest stability AND the dev config.save-contract + color + bashrcTemplate work — either merge dev's contract/color/template commits forward into the mcdonges line, or promote a unified next version. Then unify all agents' `OOSH_DIR` + `/root/oosh` on it (see the safe-switch plan). Decide the merge direction with PO/Tron; capture-green on a throwaway first (as P0 already proved for dev).

### Linked artifacts
- **Topology + safe-switch plan** (the box-level half): `session/tasks/live-box-stray-branch-topology.task.md` — measured worktree topology, 5-phase gated safe-switch, PO sign-off, tester P0 capture-green. That task targets `dev`; THIS backlog item is the broader version-reconciliation it depends on.
- Clean-boot / config-contract lineage: `session/tasks/clean-boot-bugs-woda-prod.md`, `session/tasks/ossh-install-polluted-userenv.md`.
