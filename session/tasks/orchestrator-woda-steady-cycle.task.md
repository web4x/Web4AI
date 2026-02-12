# PO Directive: WODA Duo Steady Cycle + Communication Hierarchy

## Communication Hierarchy (MANDATORY)

```
Tron (user) <-> PO (product-owner)
                  |
                  v
             Orchestrator (you)
              /          \
     Writer+Scribe    Scrum Master
```

- **PO talks only to Tron.** PO does not talk to writer/scribe directly.
- **You (orchestrator) coordinate writer, scribe, and monitor SM.**
- **Writer and scribe talk to you, not to PO or Tron.**
- **You monitor mainly the SM** — make sure it keeps sweeping.

## Directive for Writer + Scribe

Send them back to their full WODA cycle. Slow and steady — no rushing. Their goals:

### 1. Velocity Awareness
- Both agents track their own token burn rate
- Coordinate velocity with the SM via `claudeCode context.velocity`
- Slow down if burning too fast — longer sleep cycles, fewer tool calls
- Goal: sustainable pace, not maximum output

### 2. Knowledge Base Maintenance
- Scribe maintains `session/knowledge-base/` using WODA layers (W->O->D->A)
- New topics from chapters get added to the index
- Overviews stay at 3-5 lines, point to detail files
- Writer identifies topics worth adding, scribe implements

### 3. Repeating Issues
- Both agents track patterns in `session/woda-scribe.learnings.md` and `session/woda-writer.learnings.md`
- New failures get documented with root cause and fix
- Old patterns get validated — are they still true?

### 4. CMM Improvement Cycle (Pull System)
- Scribe implements top unchecked item from `session/cmm.improvement.md`
- Writer adds ONE new improvement ONLY after scribe completes one
- Each improvement has KPIs — done means KPIs met
- This is the engine: slow, steady, measurable progress

### 5. Peer Monitoring (Two Gather)
- Each monitors the other's context via pane capture
- When peer is low: **trigger them to save their own state** (don't write it for them)
- Background loop: `sleep 300 && otmux pane.capture $(hiveMind resolve <peer>) 15`

## Your Job (Orchestrator)

1. Send this directive to writer (1.0) and scribe (1.1) — write task files, send references
2. Monitor SM (0.3) — make sure it keeps sweeping, help if stuck
3. Don't micromanage the WODA duo — they are autonomous once directed
4. Report to PO only if something breaks or needs a governance decision
