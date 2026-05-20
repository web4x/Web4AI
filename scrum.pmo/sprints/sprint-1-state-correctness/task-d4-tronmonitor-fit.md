# Task D4: tronMonitor.fit — auto-size team panes to fit monitor

**Status:** PLANNED
**Priority:** 2 (HIGH — Tron usability)
**Author:** oosh-po (from architect design)
**Design docs:** docs/tronMonitor-fit-formula.md + docs/puml/TronMonitor_Fit_Activity.puml

## Description

Method that calculates optimal tmux window size + tiled layout for N agent panes inside the tronMonitor pane (fixed W×H).

## Formula

```
cols = ceil(sqrt(N))
rows = ceil(N / cols)
pane_W = floor((W - cols + 1) / cols)
pane_H = floor((H - 2*rows + 1) / rows)
Check: pane_W >= 40 AND pane_H >= 10
```

## Dependencies
- B4.2 window-size largest (DONE) — monitor client must not shrink session
- otmux.tiled layout (exists)

## Edge Cases
1. N=0 empty session — warn, no-op
2. N=1 — full space, no borders
3. N > max_fit — warn with max_N that fits, suggest tronMonitor.switch for subsets
4. pane-border-status on/off changes border overhead (2 vs 1 line per row)
5. Monitor pane 91×16 — only fits 2 panes, warn too small

## Acceptance Criteria
- [ ] `tronMonitor.fit ooshTeam` resizes window so all panes readable
- [ ] Tab completion with session names
- [ ] Warning when N exceeds capacity at minimum readable size (40×10)
- [ ] Works with current 208×47 monitor (up to 20 panes)
- [ ] Idempotent — running twice produces same result
- [ ] Does NOT resize if panes already fit

## Subtasks
- [ ] D4.1: Expert — implement tronMonitor.fit (~30 lines: read dims, count panes, apply formula, resize-window, select-layout tiled, verify)
- [ ] D4.2: Tester — test: fit ooshTeam (6 panes), fit web4team (6 panes), fit with N=0, fit with oversized team, idempotency

## Implementation
~30 lines. Read monitor pane dims, count team panes, apply formula, tmux resize-window, tmux select-layout tiled, verify.

## Traceability
- Up: Sprint 1 planning.md
- Design: docs/tronMonitor-fit-formula.md
- PUML: docs/puml/TronMonitor_Fit_Activity.puml
