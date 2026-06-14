# robbin-architect Context (Save 2026-06-14 late, SM-directed)

## STATUS: Active — T-DRAWER-CHAMPAGNE + R20.12 pinned sprint
Pane: robbinTeam2:0.4
Team: 0.0=po | 0.1=planner | 0.2=expert | 0.3=skill-expert | 0.4=ME | 0.5=req | 0.6=tester | 0.7=shell

## CHAMPAGNE: 22/209 (honest, planner det-3x verified)

## ACTIVE CHAINS (expert proceeds)
- R19.84 → handleDragResize dc130f76 (CLEAN, single method, expert extracts + real marker)
- R19.63 → renderFilePreview e4395c35 (CLEAN, expert extracts + real marker)
- R20.10 → openForRef 0a902bff (CLEAN, expert marker + test)
- R20.11 → close 91efe513 (CLEAN, expert marker + test → impl already done per planner)
- R20.12 → renderPinnedSprint 91af4ca4 (Sprint 29 6dc43057 created, expert implements)

## RECENT COMMITS
- 7becb98e0 R20.12 chain — Sprint 29 + TracePage + renderPinnedSprint
- db5bfdea4 delete duplicate R19.84 req 62e1b2e1
- 68aeef9a1 add classes[] plural to 4 drawer UCs
- 003da584b wire R20.10+R20.11 reqs
- 6c529d163 remove old dragResize 01771d5b fake-suffix from methods[]
- e2f8e48d4 narrow T-DRAWER-CHAMPAGNE to 2 flippable
- e7841a0d7 4 UCs+Methods for drawer behaviors
- 64be19345 honest reclassify — 2 genuine, 5 un-wired
- 233ad9627 UC legs R20.5a+R20.5c + delete 4 phantoms

## QUEUED (not driven, Tron strict-forward)
- QUEUE-5: landscape-responsive layout (R20.9 678ed4f1, design spec'd)
- BUG8-11: collection-blank + file-blank + URL-actions broken + stale-cache
- Test isolation harness (SystemTester identity + grep-guard)
- Drawer consolidation refinements

## KEY LEARNINGS THIS SESSION
- classes[] (plural) vs class (singular): walker reads plural, must set BOTH
- Duplicate altId reqs cause fan-out drag (R19.84/85/89/92 dups from marathon)
- UC.method narrows walker — without it, Class.methods[] fans out ALL methods
- Phantom methods: delete, don't fabricate markers for non-methods
- Honest classification: inline/declarative/CSS = functionalDone, NOT champagne

## STANDING RULES
- NEVER /compact. Only /rewind.
- NEVER ASSUME — ALWAYS MEASURE.
- Don't create tasks — planner owns that.
- Gate-before-deploy. Match gate to bug physics.
- classes[] PLURAL on every UC (walker reads plural, not singular).
