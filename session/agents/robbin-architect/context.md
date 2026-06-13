# robbin-architect Context (Save 2026-06-13 v0.6.0 marathon end)

## STATUS: Active — champagne-debt deep-wire done, awaiting tester Test nodes
Pane: robbinTeam2:0.4
Team: 0.0=po | 0.1=planner | 0.2=expert | 0.3=skill-expert | 0.4=ME | 0.5=req | 0.6=tester | 0.7=shell

## LATEST COMMITS
- a4751a05b deep-wire Method.implementations[] — 15 methods, 14 impl links
- 7f1e8b2ee batch champagne-debt R19.83-101 — 7 chains canonicalized
- 5a5476de8 radical iOS review — 8 quirks, 3 priority fixes
- 7d0219dcd case matrix — 5 distinct cases
- Earlier: R19.83-97 individual chains

## THE REAL BUG (chat-sheet stacking)
Chat-sheet `position:fixed; z-index:50; max-height:60vh` with `translateY(calc(100% - 52px))` — invisible 450px area intercepts ALL touches in lower viewport. Fix: `pointer-events: none` on collapsed sheet, `auto` on visible children.

## CHAIN STATUS
R19.83-101: all have UC→Class→Method→Impl wired. Tester adds Test for champagne.
R19.102: no task (skipped).

## STANDING RULES
- NEVER /compact. Only /rewind.
- NEVER ASSUME — ALWAYS MEASURE.
- Don't create tasks — planner owns that.
- Gate-before-deploy. Match gate to bug physics.
