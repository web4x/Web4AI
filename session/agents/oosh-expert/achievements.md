# Achievements

## 2026-04-24: Sprint 0 — Lifecycle Consolidation (major delivery)

Shipped 14 commits across Epic A/B/C/D/F in a single session:

**Critical fixes:**
- G1: per-session max_tokens detection (1M vs 200k) — was silently reporting -226%
  for 1M agents, making SM context alerts meaningless. 3-tier detection (ps args
  `[1m]` flag → observed-max fallback → model default).
- D1.4/5/6/7/8/9: 6 tronMonitor bugs (prune EPERM, pane-default pollution,
  screen race, attach -r enforcement, window-size largest, remove kill race).
- B3.1: otmux pane.lock idempotent (silent unlock-first).

**New capabilities:**
- B2: otmux layout.save/restore (tmux native `#{window_layout}` string) — unblocks
  C1 cold-restart. 5 methods, 145 lines, zero cross-layer refs.
- D1.10: tronMonitor rewritten to Tron's proven recipe (named windows, `TMUX=`
  prefix, `-r` flag, `exec bash` tail).
- D2.1/D2.2: hiveMind team.register/remove fires tronMonitor observer events.
- F1: scrumMaster velocity.log/rate/alert/history — CMM4 time-series replaces
  instantaneous readings. Real Anthropic OAuth API integration.

**Audits (deferred fixes pending tester):**
- A1.1/A1.2: 68 claudeCode methods classified; 13 View leaks documented
- A2: 12 methods portability-tested (`env -u TMUX -u TMUX_PANE`)
- B1: 5 otmux leaks catalogued; B1.2 decision rendered
- C1: 9 cold-restart gaps identified; integration design with B2 ready
- C3.2: 25 sweep.detect fixtures (18 states + 7 edge-case variants)

---

## 2026-02-12: Pane Border Headers (TEAM MILESTONE)

Implemented tmux pane-border-status feature. Panes now show agent names in borders.
**Primary credit: OOSH Expert** — designed and implemented the feature.
**Congratulations from Tron and PO!**
