# Task I1 — Context-Aware Send: Design

**Status:** Design (no code shipped)
**Author:** oosh-expert
**Date:** 2026-04-21
**Priority:** 1 (CRITICAL — foundation for reliable communication)
**Subtasks:** I1.1 (route) · I1.2 (INFORM) · I1.3 (REMOTE CONTROL) · I1.4 (QUEUE) · I1.5 (tester) · I1.6 (architect PUML)

---

## Problem

Current `hiveMind.send` / `hiveMind.send.message` / `otmux.send` are **naive** — they
send text to the pane without checking what state the agent is in. Three failure
modes follow:

1. **Send while agent ACTIVE** — text injects into the agent's input prompt
   mid-response. The agent treats the next user-turn as containing both the
   intended message and pre-existing buffered text. Garbled input, wrong action,
   or silent loss.

2. **Send while overlay PERMISSION/TOOL-CONFIRM/ACCEPT-EDITS** — the literal
   text gets buffered behind the modal. When the user dismisses the modal, the
   text fires as keystrokes (often choosing the wrong option, or being treated
   as a new prompt).

3. **Send while idle at ❯ ** — currently the only correct case. Smart prefix
   (B5) and target validation (Bug #4) protect this path.

**Tron's architectural directive:** route every send through `sweep.detect` and
choose one of three paths.

---

## Design

### State taxonomy (input to router — comes from `sweep.detect`)

| State | Meaning | Action |
|-------|---------|--------|
| `idle` | Agent at `❯` prompt | INFORM (send literal text + Enter) |
| `permission` | Approval overlay (1/2/3 options) | REMOTE CONTROL allowed; INFORM rejected |
| `tool-confirm` | Tool-confirm overlay | REMOTE CONTROL allowed; INFORM rejected |
| `accept-edits` | Accept-edits overlay (Tab/1/2) | REMOTE CONTROL allowed; INFORM rejected |
| `queued` | Pending-input indicator (Claude already buffered something) | QUEUE (don't compound) |
| `active` | Tool/Sampling/Streaming | QUEUE (deliver when idle) |
| `unknown` | sweep.detect couldn't classify | QUEUE conservatively |

### Three paths

#### 1. INFORM — agent conversation
- **Trigger:** intent = "deliver text to agent as user-turn input"
- **Eligible state:** `idle` only
- **Mechanism:** `otmux.send <pane> <text>` (smart-mode — handles prefix, accept-edits clear, etc.)
- **Fallback:** if state != idle → route to QUEUE

#### 2. REMOTE CONTROL — TUI overlay interaction
- **Trigger:** intent = "select an option in a modal / dismiss / approve"
- **Eligible state:** `permission`, `tool-confirm`, `accept-edits`
- **Mechanism:** `otmux.send.raw <pane> <key>...` (key sequence, no prefix, no Enter unless required)
- **Reject:** if state == idle → caller misusing; return `rejected: not in overlay`
- **High-level helpers** (compose detect + send.raw):
  - `hiveMind.agent.approve <agent>` → `1` for permission/tool-confirm; `Tab` for accept-edits
  - `hiveMind.agent.reject <agent>` → `2` or `Esc`
  - `hiveMind.agent.dismiss <agent>` → `Esc` (universal)
  - `hiveMind.agent.option <agent> <N>` → arbitrary option `N`

#### 3. QUEUE — defer until agent is ready
- **Trigger:** any send when state ∈ `{active, queued, unknown}`
- **Mechanism:**
  - Persist to `${HIVEMIND_QUEUE_DIR:-~/config/hivemind.queue}/<safe-pane>.queue`
  - One line per pending message: `<epoch>|<intent>|<text>`
  - `intent` ∈ `{inform, remote-control:<key>}`
- **Drain:**
  - On every `agent.unblock` sweep, if pane transitions to idle, drain its queue (FIFO)
  - Manual: `hiveMind.agent.queue.drain <agent>`
  - Inspection: `hiveMind.agent.queue.list <agent>`
  - Cancel: `hiveMind.agent.queue.clear <agent>`
- **Returns:** `queued <agent> <position>` (1-indexed)

### Routing primitive (I1.1)

```
hiveMind.agent.send <agent|pane> <text...>
  ├── resolve agent → pane (existing: hiveMind.resolve + Bug#4 validate)
  ├── state = sweep.detect <pane>
  ├── case state in
  │     idle)            INFORM → otmux send <pane> <text>
  │     permission|tool-confirm|accept-edits)
  │                      REJECT → "rejected: in overlay; use agent.approve/reject"
  │     active|queued|unknown)
  │                      QUEUE  → write queue file; return "queued"
  └── return outcome (delivered|queued|rejected)
```

For overlay interaction, **separate verbs** instead of overloading `send`:

```
hiveMind.agent.approve  <agent>          → routes to REMOTE CONTROL
hiveMind.agent.reject   <agent>          → routes to REMOTE CONTROL
hiveMind.agent.dismiss  <agent>          → routes to REMOTE CONTROL (Esc)
hiveMind.agent.option   <agent> <N>      → routes to REMOTE CONTROL ("$N")
hiveMind.agent.send     <agent> <text>   → routes to INFORM (or QUEUE)
```

This separates **intent** from **dispatch**. The verb declares the user's
intent; the router validates against state and either dispatches or queues.

### Backward compatibility

Existing callers of `hiveMind.send` / `hiveMind.send.message` (15+ across hiveMind
+ scripts) are **idle-assumption naive**. Migration plan:

1. **Phase 1** — add `hiveMind.agent.send` as the new safe API
2. **Phase 2** — `hiveMind.send` becomes a thin wrapper that calls `agent.send`
   (same interface, gains routing internally)
3. **Phase 3** — audit existing callers; for the ones that need INFORM-only
   semantics, they get the new safety free. For the ones doing implicit
   remote-control via `Enter`/`1` strings (smell — should be `agent.approve`),
   flag for refactor.

This way existing callers keep working but stop sending into broken states.

### Queue mechanics

#### Persistence

```
~/config/hivemind.queue/<sanitized-pane>.queue
```

Sanitization: replace `:` and `.` in pane targets with `_` → `ooshTeam:0.2` →
`ooshTeam_0_2`. (Filesystem-safe, reversible via `tr`.)

Format (one line per pending message):

```
<epoch>|<intent>|<keys-or-text>
```

Examples:
```
1747840000|inform|here is your task brief
1747840005|remote-control|1
1747840010|remote-control|Esc
```

#### Drain

Hook into `hiveMind.agent.unblock`:

```bash
hiveMind.agent.unblock <agent> {
  state = sweep.detect <pane>
  case state in
    idle) hiveMind.agent.queue.drain <agent>  # NEW
    permission|...) (existing allowlist behavior — bug #2)
    *) skip
  esac
}
```

`queue.drain` reads queue file in FIFO order, dispatches each message via the
normal `agent.send` / `agent.approve` etc., removing each line as it succeeds.

#### Bounds

- Max queue depth (`HIVEMIND_QUEUE_MAX_DEPTH=50`) — drop oldest when exceeded
  (warn.log)
- Max queue age (`HIVEMIND_QUEUE_MAX_AGE_SEC=3600`) — drop stale on drain
- Both env-overridable

### Return values (I1.1 contract)

`hiveMind.agent.send` and verb-specific methods all use the create.result pattern:

| Outcome | rc | RESULT |
|---------|----|--------|
| Delivered (INFORM via idle) | 0 | `delivered <agent> <pane>` |
| Controlled (REMOTE CONTROL via overlay) | 0 | `controlled <agent> <pane> <key>` |
| Queued (deferred) | 0 | `queued <agent> <position>` |
| Rejected (overlay called when idle, or vice versa) | 1 | `rejected: <reason>` |
| Resolution failed (agent not found) | 1 | `no-pane: <agent>` |
| State unclassifiable (sweep.detect returned empty) | 1 | `unknown-state: <pane>` |

### State detection cost

`sweep.detect <pane>` does `otmux pane.capture` + regex matches — measured
~50-200ms. Calling it for every send adds latency to a hot path.

**Mitigation:** opt-in caching with TTL.

```
HIVEMIND_SEND_STATE_CACHE_TTL=2  # seconds, env-overridable
```

When `agent.send` runs, write `<epoch>|<state>` to
`~/config/hivemind.state.cache.<pane>.env`. Subsequent calls within TTL skip
sweep.detect entirely. After agent activity (any successful INFORM /
agent.unblock cycle / pane mutation event), cache invalidated.

**Default:** TTL=0 (no cache) — correctness over latency. Caller can opt in
when latency matters (e.g. team broadcast loops).

### Sweep.detect dependency

I1 hard-depends on sweep.detect (already shipped, C3.2 fixtures + tested).
Specific states this design relies on:

| State | Where defined | I1 routes to |
|-------|--------------|---------------|
| idle | sweep.detect ❯ pattern | INFORM |
| permission | sweep.detect overlay-1 detection | REMOTE CONTROL allow |
| tool-confirm | sweep.detect tool-confirm pattern | REMOTE CONTROL allow |
| accept-edits | sweep.detect Tab-marker pattern | REMOTE CONTROL allow |
| active | sweep.detect Sampling/Tool patterns | QUEUE |
| queued | sweep.detect pending-input indicator | QUEUE |
| unknown | sweep.detect fall-through | QUEUE (conservative) |

If sweep.detect grows new states later, the router default is QUEUE — safe
fallback.

---

## Subtask breakdown

### I1.1 — Router primitive (oosh-expert)
- New: `hiveMind.agent.send <agent|pane> <text>` — main entry
- New: `private.hiveMind.agent.route <pane>` — returns `inform|remote-control|queue|reject`
- Calls existing `sweep.detect` + Bug#4 target validation
- Return-value contract per table above
- Tests handed off to I1.5

### I1.2 — INFORM path (oosh-expert)
- Implements router's `inform` branch
- Delegates to existing `otmux send` (smart-prefix from B5/Bug#4 stays)
- New: queue write helper (used by router when state ≠ idle)

### I1.3 — REMOTE CONTROL path (oosh-expert)
- New verbs: `hiveMind.agent.approve / reject / dismiss / option`
- Each: detect state, validate against eligible set, send key via `otmux send.raw`
- Idempotent option mapping table per overlay type

### I1.4 — QUEUE path (oosh-expert)
- New: `hiveMind.agent.queue.drain <agent>` — FIFO drain on idle
- New: `hiveMind.agent.queue.list <agent>` — inspect
- New: `hiveMind.agent.queue.clear <agent>` — cancel
- Hook into `hiveMind.agent.unblock` cycle
- Bounds enforcement (depth + age)

### I1.5 — Tester (oosh-tester)
- T-CTX-1 idle → inform delivers
- T-CTX-2 permission → remote-control delivers; inform rejected
- T-CTX-3 active → both intents queue
- T-CTX-4 active → idle transition drains queue FIFO
- T-CTX-5 queue depth bound dropping oldest
- T-CTX-6 queue age bound dropping stale
- T-CTX-7 cache TTL skips sweep.detect when fresh
- T-CTX-8 backward-compat: legacy hiveMind.send no longer breaks active agents

### I1.6 — Architect PUML (oosh-architect)
- Sequence diagram: caller → agent.send → sweep.detect → route → path
- Three swim-lane variants (one per path)
- State diagram: pane state transitions and which paths are enabled

---

## Open design questions for PO/SM

1. **Verb naming** — `hiveMind.agent.{send,approve,reject,dismiss,option}` OK?
   Considered alternatives: `tell` (too coloquial), `whisper` (unclear), `to`
   (too short).

2. **Backward compat strategy** — Phase 2 (legacy `hiveMind.send` becomes wrapper)
   OK, or keep two parallel APIs and deprecate later?

3. **State cache default TTL=0** OK? Trade correctness vs latency. Could default
   to 2s for less surprise to users running broadcast loops.

4. **Queue drain hook location** — at the END of `agent.unblock` cycle (proposed)
   OR a separate watchdog loop? Hooking into unblock is cheap and natural;
   separate watchdog adds operational complexity.

5. **REMOTE CONTROL state matrix** — should `agent.approve` work on
   `accept-edits` (which uses `Tab` not `1`)? Proposal: yes, with a per-overlay
   key map. Alternatives: caller-explicit `agent.option <key>` only.

6. **High-priority bypass** — should there be a `--force` mode that bypasses
   QUEUE for emergency interrupts (e.g. send `Esc` to a stuck-active agent)?
   Currently this is `agent.dismiss` via REMOTE CONTROL which only works on
   overlays. For active agents we have no out-of-band kill except `agent.unblock`
   sweep. Worth designing or out of scope?

---

## Implementation estimate (after PO approval)

- I1.1 router: ~60 lines (hiveMind), 1 commit
- I1.2 INFORM: ~30 lines (mostly hooks into existing send), 1 commit
- I1.3 REMOTE CONTROL: ~80 lines (4 verbs + key map), 1 commit
- I1.4 QUEUE: ~120 lines (persistence + drain + bounds + 3 verbs), 1 commit
- ~290 lines, 4 commits, ~1 day with tester scaffold

---

## Pre-conditions

- ✅ sweep.detect with all 7 states (C3.2)
- ✅ Bug #4 target validation (19fa1b7)
- ✅ Bug #2 agent.unblock allowlist (8d01421)
- ✅ B5 smart-prefix in otmux.send (8d01421 sibling)

---

## Risks

- **Queue file corruption on concurrent writes** — multiple agents writing to
  the same target's queue. Mitigation: O_APPEND opens are atomic for short
  writes (POSIX guarantee for writes < PIPE_BUF). Each line < 512B easily.
- **Drain races with new sends** — between detect-idle and drain start, agent
  could become active again. Mitigation: drain re-checks state per-message.
- **Cache staleness causing wrong route** — TTL=0 default avoids this. With
  TTL > 0, the cache invalidator must fire on EVERY pane mutation event (we
  have these from B5.1 — repurpose).
- **State machine drift** — sweep.detect grows new states; router default-QUEUE
  ensures safety but may delay legitimate sends. Auditable via queue.list.

---

## Next step

Awaiting PO/SM approval on the 6 open questions above. After approval:
- Create per-subtask files i1.1-i1.6
- Hand I1.6 (PUML) to architect
- Implement I1.1-I1.4 in 4 commits
