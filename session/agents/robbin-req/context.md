# robbin-req — Context

## Identity
- **Role:** robbin-req (requirements engineer)
- **Pane:** robbinTeam:1.1
- **Project:** RawBin (Web4RawBin)

## Work Summary

### Backlog captures: B3-B18
B3 vCard onboarding, B4 reload button, B5 file-browser fixes, B6 user stale name, B7 req format, B8 MD listing icons, B9 breadcrumb nav, B10 symlinks all 9 classes, B11 breadcrumb contrast, B12 JSON traceability empty, B13 UC object/verb, B14 UC classes/req, B15 req name≠description, B16 req tasks[]+tests[], B17 traceability browser full chain, B18 forward-only chain (planner captured from PO)

### Task verbatim anchors
T140, T145, T146, T147, T148, T149, T150, T151 (JOINT + mapping table), T152, T153, T154, T156, T157

### Requirements.md files
S8(20 UC), S9(6 UC), S11(1), S13(7), S16(4), S17(29 R17.1-R17.29)

### Standards + audits
traceability-standard.md, S1-S9 audits (0 orphans S10-S17), T124.4/T124.5/T135/T137

### Compound requirement captures (current session)
compound-requirement-source-2.md in sprint-17-scenario-units/:
- R-A: HTML task status broken (works MD, broken HTML)
- R-B: Task.status = state-machine methods on Task class
- R-C: Traceability artifacts → atomic uuid.scenario.json units with ln links
- R-D: Mobile-first layout + hard width limit
- R-E: Chain ORDER: requirement→task→usecase(s)→class→method→implementation→test(s) [1:N]. Atomic requirements are ROOTS.
  - Amendment 1: "implementation traces finally to test"
  - Amendment 2: "one implementation can have multiple tests" (1:N cardinality)
- R-F: Data quality — complete consistent tree, zero backward chaos, zero untraced scenarios
- R-G: Diligent plan, no-stop until done, SM re-activated

### Commits this session
- bfae071: R-A/B/C verbatim (cut-off flagged)
- 2be6e96: R-D/E/F/G follow-on + R-E amendment 1
- 7e01491: R-E amendment 2 (impl→test 1:N)

### Active work
T160 (browser-stale + forward-source repop) + T161 (names ≠ json) stood up by planner, architect designing. R-A through R-G captured, awaiting formalization + sprint scoping by planner.

### Latest (trainer capture 2026-06-03)
- R-M3e committed 6f7614eb — /scenario interaction parity with /trace (collapse/expand + DetailView-on-click)
- B18: forward-only traceability correction captured
- Planner canonical uuid pattern learned

## Status
679k context (trainer update — agent couldn't self-save due to API errors). Standing by for PO directive or next Tron literal.
