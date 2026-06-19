# Feature: DURING_REWIND agent/team state

**From**: oosh-po (Tron directive via agent-trainer)
**Owners**: oosh-architect (design) → oosh-expert (implement) → oosh-tester (test)
**Priority**: HIGH
**Date**: 2026-06-19
**Depends on**: bug #6 KEYSTONE (sweep live-state detection) in bugs-agent-restore-process.md — DURING_REWIND is an operator-set OVERRIDE on top of correct live-state detection.

## Problem
During a rewind, affected agents sit at prompts but must NOT be tasked (they're saving/being rewound). Today the SM sweep only sees ACTIVE/IDLE/COMPLETED/PERMISSION/etc. — no way to mark "rewind in progress." Result: idle-looking agents mid-rewind get new work (wasted, or corrupts the rewind). The trainer needs to mark agents/team as DURING_REWIND so SM broadcasts it and nobody tasks them.

## Requirements
1. **Set/clear state**: `hiveMind agent.state.set <role> DURING_REWIND` and `hiveMind agent.state.clear <role>` (or `... set <role> normal`). Also team-level: `hiveMind team.state.set <session> DURING_REWIND`.
2. **Sweep shows it**: `hiveMind team.sweep` / `team.status` display DURING_REWIND for marked agents/teams (distinct color/label), taking PRECEDENCE over auto-detected state.
3. **No new work to DURING_REWIND agents**: `hiveMind agent.send` / `delegate` REFUSE or hold (route=rewind-hold) for agents in DURING_REWIND — like the overlay guard, but operator-set.
4. **Auto-clear on recovery** (optional, nice): when the agent is verified recovered (trainer confirms / context healthy + oriented), state auto-clears, OR explicit clear by trainer/SM.

## Design (oosh-architect, 2026-06-19)

### Architecture: Override-on-Live-State Layer

DURING_REWIND is NOT a new detection path. It is an **operator-set override** that sits ON TOP of bug #6's live-state detection. The layered model:

```
┌─────────────────────────────────────────────┐
│  Layer 3: OVERRIDE (this feature)           │
│  hivemind.state.env: pane|STATE|timestamp   │
│  If entry exists → STATE wins over Layer 2  │
├─────────────────────────────────────────────┤
│  Layer 2: LIVE DETECTION (bug #6, done)     │
│  sweep.detect: capture pane → parse TUI     │
│  IDLE / ACTIVE / PERMISSION / OVERLAY       │
├─────────────────────────────────────────────┤
│  Layer 1: RAW PANE (tmux)                   │
│  capture-pane, process.running, etc.        │
└─────────────────────────────────────────────┘
```

**Read path** (sweep, status, send routing): check state.env FIRST. If override exists for this pane → use it. Else → fall through to live detection.

**Write path**: only `agent.state.set` / `agent.state.clear` / `team.state.set` / `team.state.clear` mutate state.env.

### Storage: `~/config/hivemind.state.env`

```
# Format: pane|STATE|timestamp|set-by
# Example:
ooshTeam:0.2|DURING_REWIND|2026-06-19T11:30:00Z|agent-trainer
ooshTeam:0.3|DURING_REWIND|2026-06-19T11:30:00Z|agent-trainer
```

- One file, append-safe, grep-fast.
- Clear = remove line (sed -i).
- Team-level set = write one line per pane in that session.
- `set-by` field for audit trail (who set the override).
- Timestamp for staleness detection (auto-clear option).

### Methods

```bash
# Agent-level
hiveMind.agent.state.set()   # <role> <STATE>  — resolve role→pane, write to state.env
hiveMind.agent.state.clear() # <role>           — remove pane entry from state.env
hiveMind.agent.state.get()   # <role>           — return override STATE or empty (live detection)

# Team-level
hiveMind.team.state.set()    # <session> <STATE> — set STATE for ALL panes in session
hiveMind.team.state.clear()  # <session>         — clear all overrides for session
```

Completion: `<role>` resolves via `private.hiveMind.complete.roles`. `<STATE>` completes from `DURING_REWIND MAINTENANCE FROZEN` (extensible enum, not hardcoded — read from a list or accept any string).

### Send Routing: `rewind-hold`

Bug #8 work adds send-routing to `hiveMind agent.send` (INFORM/QUEUE/reject based on target state). DURING_REWIND adds one route:

```
State Resolution (in agent.send):
  1. Check hivemind.state.env for target pane
     → DURING_REWIND found? → route = rewind-hold
  2. Else: check live detection (bug #6)
     → OVERLAY/PERMISSION? → route = reject/approve
     → ACTIVE? → route = QUEUE
     → IDLE? → route = INFORM (deliver now)

rewind-hold behavior:
  - Log: warn.log "agent.send: <role> is DURING_REWIND — message held"
  - Do NOT deliver. Do NOT queue silently.
  - Return exit code 3 (distinct from 0=delivered, 1=error, 2=queued)
  - Caller sees the rejection and can retry after clear.
```

This reuses the SAME routing switch that #8 adds — just one more case in the classifier. No parallel send path.

### Integration Points in Existing Code

| Function | Change |
|----------|--------|
| `hiveMind team.sweep` | After live-detect, check state.env override. If set, display `DURING_REWIND` in distinct color (yellow bg). |
| `hiveMind team.status` | Same override check. Show `[OVERRIDE: DURING_REWIND]` label. |
| `hiveMind agent.send` / `send.message` | Before routing, check state.env. DURING_REWIND → rewind-hold. |
| `otmux send.smart` | NO CHANGE. Override lives in hiveMind (Controller), not otmux (View). MVC boundary preserved. |

### Auto-Clear on Recovery (Optional)

Two mechanisms, PO chooses:

**Option A — Explicit clear only:**
Trainer/SM runs `hiveMind agent.state.clear <role>` after verifying recovery. Safest — no false auto-clear.

**Option B — Timestamp-based expiry:**
Sweep checks timestamp in state.env. If override older than N minutes (configurable, default 30), auto-clear with warning: `warn.log "auto-cleared stale DURING_REWIND for <role> (set 45m ago)"`. Prevents forgotten overrides from blocking agents permanently.

**Recommendation:** Option A (explicit) as default. Option B as `--auto-expire` flag on `team.sweep` for autonomous operation (Goal 0).

**PO DECISION (oosh-po 2026-06-19): ACCEPTED.** Option A (explicit clear) = default; Option B (timestamp expiry) implemented as `--auto-expire` flag on team.sweep for autonomous operation. Design APPROVED. Ready for expert implementation after #9 (test unblock) + list-task verify + audit consistency core (#1,#3).

### Confirm: send-prefix-spec covers #4 and #8

**Bug #4 (otmux send prefix corrupts shell targets):**
COVERED. `send.smart` at line 2042 already guards: `if private.otmux.pane.isClaudeCode "$target" && [[ "$text" != /* ]]`. Non-Claude targets (shells) get NO prefix. The fix-send-prefix-slash-commands.md spec is implemented — `/commands` skip prefix, shell targets skip prefix. Bug #4 is RESOLVED in current code.

**Bug #8 (agent.send rejects accept-edits as overlay):**
COVERED. `send.smart` at line 2024-2036 now DETECTS accept-edits and CLEARS it (sends Enter + BTab + BTab) before delivering. This means accept-edits is no longer a blocking overlay — it's auto-dismissed. The send routing in `hiveMind agent.send` should NOT classify accept-edits as overlay. The fix is: `agent.send`'s overlay classifier must exclude accept-edits from the reject list (it's handled by otmux send.smart transparently). If `agent.send` still has a pre-check that rejects on accept-edits, that pre-check must be removed — the View layer (otmux) handles it.

### DRY Notes
- ONE state file (hivemind.state.env), read by sweep + send + status. No parallel discovery.
- Override layer does NOT duplicate live detection — it short-circuits it.
- rewind-hold is one case in the existing routing switch, not a separate send path.
- state.env follows same format as other hiveMind stores (pipe-delimited, one per line).

## Acceptance
- [ ] `hiveMind agent.state.set oosh-expert DURING_REWIND` then `team.sweep ooshTeam` shows oosh-expert DURING_REWIND
- [ ] `hiveMind agent.send oosh-expert "x"` while DURING_REWIND → held/refused (not delivered)
- [ ] `hiveMind agent.state.clear oosh-expert` → sweep shows live state again, sends resume
- [ ] team-level set/clear works
- [ ] tests: T-REWIND-STATE set/clear/sweep-shows/send-held/auto-clear

## Timeline (dependency-based)
- **Blocked-by**: #6 keystone (live-state detection) — must land first so DURING_REWIND can override a CORRECT base state. (Sweep currently can't even tell idle from active.)
- **Available implementer**: only oosh-expert right now (architect + tester are themselves IN REWIND).
- **Sequence**: #6 keystone → close list-task (#1-3) → DURING_REWIND design (architect, once recovered) → implement (expert) → test (tester, once recovered).
- **ETA**: design spec deliverable after architect recovers; implementation after #6 + list-task. Realistic working build: 1-2 expert work-cycles after #6 lands. Will update this block as it progresses.

## Report-back (agents edit; report to oosh-po)
- Architect (design): DONE 2026-06-19 — override-on-live-state layer, hivemind.state.env, rewind-hold route, auto-clear options, #4/#8 coverage confirmed
- Expert (implement): NOT STARTED — commit ___
- Tester (test): NOT STARTED — ___ / ___ pass
