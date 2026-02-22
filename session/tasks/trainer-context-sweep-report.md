# Context Sweep Report

**From**: agent-trainer
**Date**: 2026-02-22 ~14:30 UTC

## Results

| Agent | Pane | Context % | Tokens | Status | Action needed |
|-------|------|-----------|--------|--------|---------------|
| oosh-expert | 0.1 | **40%** | 79k/200k | IDLE | OK — continue working. Save context at 35%. |
| product-owner | 0.4 | **UNABLE** | — | BUSY | PO was actively processing Docker task. /context rendered but scrolled away before capture. Retry when idle. |
| agent-trainer | 0.5 | **UNABLE** | — | WORKING | Cannot self-measure (42 principle). Need peer to measure. |

## Expert Detail (40% — OK)

```
claude-opus-4-6 · 79k/200k tokens (40%)
System prompt: 7.5k (3.7%)
System tools: 19.7k (9.9%)
MCP tools: 7.3k (3.7%)
Custom agents: 3.8k (1.9%)
Memory files: 5.5k (2.7%)
Skills: 2.9k (1.5%)
Messages: 37.8k (18.9%)
Compact buffer: 3k (1.5%)
Free space: 112k (56.2%)
```

Expert has 56% free — safe to continue working. Self-care trigger at 35%.

## PO Issue

Sent `/context` to 0.4 via `otmux send projectTeam:0.4 "/context" Enter`. PO acknowledged ("Tron ran /context") but was actively processing Docker setup. PO's response generation scrolled past the /context output. This is the "42" race condition — only works on IDLE panes.

**Recommendation**: PO should run /context themselves and note the result, or pause Docker task briefly for measurement.

## Self-Measurement

The "42" principle: an agent cannot capture its own /context output. My response generation would overwrite the TUI before I can capture it. Need PO or SM to measure me.

## Learnings

- /context only works reliably on IDLE panes (at `❯`, not processing)
- BUSY agents continuously generate output, making capture impossible
- For busy agents: either ask them to pause, or have them self-report (they can see the flash)
- Future improvement: build a tool that writes /context results to a file instead of TUI-only
