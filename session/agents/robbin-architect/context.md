# robbin-architect Context (Save 2026-06-14 post-rewind, v0.6.24)

## STATUS: Standby — awaiting PO re-dispatch
Pane: robbinTeam2:0.4
Team: 0.0=po | 0.1=planner | 0.2=expert | 0.3=skill-expert | 0.4=ME | 0.5=req | 0.6=tester | 0.7=shell

## GIT-VERIFIED
- HEAD: 5d7c271a9 (v0.6.23 R20.12 pinned current sprint)
- Version: 0.6.24 LIVE+tagged
- Anchor: d796cb7 (SM-directed save, pre this cycle)

## DELIVERED THIS MARATHON
- Drawer consolidation: ChatPanel into rb-detail-drawer, 3 switchable panels (chat/detail/preview)
- renderDetailForRef: self-contained ref→fetch→typed-detail-element (b1dd1275a design, implemented)
- Single-render guarantee: drawer owns rendering, router delegates ref-only
- BUG3 CSS (display:flex→block for detail/preview panels)
- BUG4 deselect→chat (setMode('chat') not close)
- BUG5 drawer stacking (pointer-events:none on drawer, auto on children)
- R20.12 pinned current sprint on /trace
- R20.2 grab-bar DRY, R20.3 default-collapsed, R20.4 Bug/ChangeRequest OOP, R20.5 detail-view sections
- R20.6 SelectionModel (8 atomics: singleton, tap, long-press, CSS, drag, consolidate, highlight)
- CR1 Champagne→Traceability Chain rename
- BUG1 chain-excludes-self
- item-view-states-standard.md (3 states → 2 states + selection, icon-only deprecated)
- Champagne-debt batch closure R19.83-101 (7 chains + 14 impl links)

## SPRINT 29 STATE
- WIP = 1
- Champagne: 22 (markers in, tests pending from tester)
- Repopulation fixed

## OPEN (pre-rewind, may be resolved)
- BUG5 residual: v0.6.15 measurement showed document click listener fires tap A but ZERO events tap B. Touch consumed before click synthesis — likely drawer's drag-resize touchstart handler calls preventDefault. Next step was touchstart/touchend document-level capture. May be resolved in v0.6.16-24.

## STANDING RULES
- NEVER /compact. Only /rewind.
- NEVER ASSUME — ALWAYS MEASURE.
- Don't create tasks — planner owns that. Architect creates UC+Class+Method only.
- Gate-before-deploy. Match gate to bug physics.
- Marker UUID = uuidgen-fresh OR verbatim 36-char copy.
- 6-step chain LOCKED: Req → UC → Class → Method → Impl → Test. Task = NAVIGATION.
