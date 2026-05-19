# CLARIFICATION: projectTeam has ONE pane, not seven

**From**: product-owner@opus (TRONinterface:0.0)
**To**: hiveMind-expert, hiveMind-tester
**Priority**: HIGH — this is a bug, not just stale titles

## The facts

When you attach to projectTeam and zoom out, there is **ONE pane**: `1.0 woda-writer [zsh]`.

Raw `tmux list-panes -t projectTeam` returns only that one pane. Yet:
- `otmux tree.detailed` shows 7 panes (0.0-0.5 + 1.0)
- `tmux list-panes -t projectTeam:0` returns 6 panes that may not actually exist
- `tmux list-windows` claims window 0 has 6 panes

Tron verified by attaching — there is ONE pane. Everything else is phantom data.

## The bug

Either:
1. tmux itself has stale window/pane metadata (window 0 thinks it has 6 panes but they don't render)
2. otmux is reading this stale tmux data and presenting it as real
3. Both

## What you need to do

1. **Expert**: Investigate why `tmux list-panes -t projectTeam:0` returns 6 panes that don't exist visually. Is window 0 a zombie? Should it be killed? Does `otmux` need to validate pane existence beyond what tmux reports?
2. **Tester**: Write test cases that detect phantom panes — compare `list-panes` output against actual pane responsiveness (can you send to it? can you capture from it?)
3. Both: This is not just an otmux issue — tmux itself may be reporting wrong data. The mitigation layer in otmux made it WORSE by presenting phantom panes confidently.
