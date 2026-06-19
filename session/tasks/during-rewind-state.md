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

## Design notes (DRY)
- Store the override in ONE place the sweep + send + status all read — e.g. a `hivemind.state.env` (pane|state) or annotate the existing registry/forks source. Do NOT add a parallel discovery path.
- DURING_REWIND is an OVERRIDE layer: live-state detection (#6) runs underneath; if an override is set, it wins. Clear path returns to live detection.
- Reuse the send-routing switch (#8 work): add a `rewind-hold` route alongside INFORM/QUEUE/reject.
- camelCase + dots; completions for `<role>` (resolve names) and the state value.

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
- Architect (design): NOT STARTED — ___
- Expert (implement): NOT STARTED — commit ___
- Tester (test): NOT STARTED — ___ / ___ pass
