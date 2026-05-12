# Task: Tron P0 follow-up — DRY empty-payload guard across otmux + hiveMind

**Sprint:** 1 — State Correctness Architecture
**Priority:** P0 (Tron-escalated, DRY refactor of prior commit `3672559`)
**Origin:** PO directive 2026-05-12 LATE via ooshTeam:0.0
**Status:** Done (expert) — tester coverage pending
**Depends on:** task-tron-p0-send-empty-noop.md (3672559)

## Problem

Commit `3672559` shipped the empty-payload guard in three otmux send paths
using a duplicated inline regex `[[ "$text" =~ ^[[:space:]]*$ ]]`. PO directive:

1. Extend the guard to hiveMind.send / send.message / agent.send / broadcast
   (also produce prefix-only sends when bare).
2. Refactor to DRY — single predicate definition, called from all sites.

The duplicated regex was a Sprint-1-design violation: "single source of truth"
applies to predicates as much as state. A future tweak to what counts as
"empty" (e.g. classify zero-width unicode chars) would have to be hunted
across N call sites.

## Fix — DRY via kernel predicate `this.isEmpty`

`this` already hosts kernel predicates: `this.isNumber`, `this.functionExists`,
`this.isSourced`. Adding `this.isEmpty` follows the same pattern:

```bash
this.isEmpty() {
  # True (rc 0) if $1 is empty or contains only whitespace (space/tab/newline).
  [[ "$1" =~ ^[[:space:]]*$ ]]
}
```

Every OOSH script sources `this` at start, so `this.isEmpty` is callable as a
plain bash function (no subprocess, no source-dance, no MVC violation —
kernel primitives are universal).

## Call sites migrated

**otmux** (3 sites, replaced inline regex with predicate call):

| Function | Behavior |
|----------|----------|
| `otmux.send` | Empty/ws → silent return 0, before key detection & prefix |
| `private.otmux.send.smart` | Defense-in-depth (internal entry) |
| `otmux.send.verified` | Defense-in-depth (called by send.smart, direct callers) |

**hiveMind** (5 sites, new):

| Function | Behavior |
|----------|----------|
| `hiveMind.send` | Empty/ws → silent return 0, no fanout to agent.send |
| `hiveMind.send.message` | Same |
| `hiveMind.agent.send` | Controller-level guard (also catches API-transport sends) |
| `private.hiveMind.agent.inform` | Avoid the monitor.switch cost for empty payload |
| `hiveMind.broadcast` | Refuse fan-out at controller level |

## Files changed

```
oosh repo:
  this      (+8)   new this.isEmpty
  otmux     (-6 +3) 3 inline regex → this.isEmpty calls
  hiveMind  (+25)  5 new guards using this.isEmpty
```

## Behavior contract (unchanged from 3672559)

- **Empty / whitespace-only payload** → return 0, debug.log, no tmux call, no
  agent.send dispatch, no monitor.switch.
- **Genuine prose with internal whitespace** (`"  hi  "`) → unchanged, treated
  as prose, trimmed/wrapped by downstream logic as before.
- **No error on empty** — silent no-op. Callers passing variables that may be
  empty don't need to wrap with `[ -n "$msg" ] && ...`.

## DRY benefits

- One regex definition. A future change (e.g. accept zero-width space as
  empty) touches 1 line, not 8.
- Testable in isolation — `this.isEmpty $'\t\n'` exits 0; `this.isEmpty hello`
  exits 1. No tmux/agent context needed.
- Cross-script consistency. Architect's reconcile.diff invariant work can
  rely on the same emptiness semantics if it ever needs to ignore
  empty-payload sends in event histories.

## Verification

Direct predicate truth table (confirmed):

```
empty:    EMPTY
spaces:   EMPTY
tabs:     EMPTY     (via $'\t\t')
newline:  EMPTY     (via $'\n')
mixed-ws: EMPTY     (via $' \t\n ')
prose:    PROSE
with-ws:  PROSE     (legitimate prose with leading/trailing ws)
```

Syntax check: `bash -n` clean on all 3 modified scripts (this, otmux, hiveMind).

## Tester handoff — needed coverage

Suggest fixtures in test.otmux and test.hiveMind:

1. **Otmux side**:
   - `otmux send <pane> ""` → rc=0, pane unchanged
   - `otmux send <pane> "   "` → rc=0, pane unchanged
   - `otmux send <pane> $'\t\n'` → rc=0, pane unchanged
   - `otmux send <pane> "hello"` → rc=0, pane shows prefixed `hello`
   - `otmux send.verified <pane> ""` → rc=0
2. **HiveMind side**:
   - `hiveMind send <role> ""` → rc=0, no agent.send invocation (check via
     pane capture stability)
   - `hiveMind agent.send <role> "   "` → rc=0
   - `hiveMind broadcast ""` → rc=0, no per-agent fanout (check info.log
     "Broadcasting" absent)
   - Regression: legitimate prose still routes through state machine
     (idle→INFORM, busy→QUEUE, overlay→reject)

Suggested filenames following sprint convention:
- `task-sc-tron-p0-empty.tester.md` — task assignment
- `test/test.otmux` — append `T-EMPTY-1..5` cases
- `test/test.hiveMind` — append `T-EMPTY-6..10` cases

## Architect review notes

This places `this.isEmpty` in the kernel — same layer as `this.isNumber`. No
MVC boundary impact since `this` is the universal kernel, not Model/View/
Controller. The predicate has zero domain knowledge of agents/panes —
pure-bash text check.

If you'd like the predicate extended (e.g. unicode-whitespace-aware), that's
a single-file edit in `this` with the cascade picked up automatically.

## Commit

`this.isEmpty + DRY empty-payload guards across otmux/hiveMind send paths (ref: task-tron-p0-send-empty-dry.md)`
