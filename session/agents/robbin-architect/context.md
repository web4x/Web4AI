# robbin-architect — Context (Save 2026-06-10, near-limit)

## ACTIVE: Sprint 17 + Sprint 18

### Latest Work (2026-06-09 → 2026-06-10)

| Task | Commit | Status |
|------|--------|--------|
| 6-step chain correction Layer 1 SKILL.md | 741b0eb | ✅ |
| 6-step chain correction Layer 2 standards | 0925a420 + d79c3013 | ✅ — zero 7-step defs left |
| 6-step chain correction plan (PO-approved) | 122c70d7 | ✅ |
| R18.34.B Class+Method+Impl chain wired | 38653299 | ✅ — UC.method singular, all model.parent |
| T187 follow-on: /api/trace SCENARIO_FORWARD req:['tasks']→['useCases'] | 522c919e (expert) | ✅ shipped v0.5.122 |
| T188 round-trip design + chain wired | c008c20c | ✅ — Class SprintMdGenerator + Method checkRoundTrip + Impl + AC1-AC7 |
| T199 ownerIor + unitLinks + model.parent backfill | (expert) | ✅ shipped |
| TS6 verdict: spec-drift, not bug | (otmux) | ✅ — TRACE_FWD UC→Class→Method correct per R18.8 |

### R18.34.B SVG snap-back — LIVE
- Tron device telemetry (SVGDBG) captured 47 alternations at 1:12:43 AM via:
  `tmux capture-pane -t iphone:0.1 -S -2000 -J -p | grep SVGDBG`
- Pattern: `touchend touches=0 scale=0.567` → `apply scale=0.187 …` ×47
- 0.187 = Math.min(sw/iw, sh/ih) — only `reset()` writes it
- ROOT CAUSE: server.ts:909 lastTap double-tap detector misfires on pinch release
  (two finger lifts within 300ms, both `changedTouches.length===1` → reset())
- FIX SPEC: task-r18.34-svg-viewer-scoped-pinch-zoom.md "Defect 4 — full audit" — proper tap detector requiring touchstart with touches.length===1, slop<10px, duration<250ms, touchend with touches.length===0. Cannot misfire on pinch.
- Expert ships v0.5.125; keep instrumentation in place for next verification round
- Chain wired (R18.34.B): Req 042bab1a → Task bef36fd2 → UC c27d67d8 (svgViewer.pinchZoom) → Class 7dd2f3c3 (SvgViewer) → Method 4a4591ca (onPinchEnd) → Impl 094c18a4

### Earlier in-flight
- Tester reports broken clickpath in generated requirement MD: link `../sprints.md/task/task-190-tree-expand-append-no-rerender.md` 404s — file DOES exist on disk at `scenario/sprints.md/task/task-190-tree-expand-append-no-rerender.md` (verified by ls). Need to confirm what URL the SERVER receives + which route serves it (/md/scenario/sprints.md/... missing?). Diagnosis paused — context save first.

## Identity
- **Role:** robbin-architect
- **Pane:** robbinTeam:0.1
- **Team:** robbinTeam
- **Expert:** robbinTeam:0.2 | **Tester:** robbinTeam:0.3
- **Planner:** robbinTeam:1.0 | **Req-eng:** robbinTeam:1.1
- **Working dirs:** Planning workspaces/Web4RawBin/ | Impl workspaces/2cuGitHub/Web4RawBin/
- **RULE:** NEVER /compact — only /rewind via agent-trainer

## 6-STEP CHAIN (R18.8 corrected 2026-06-08)
Requirement → UseCase → Class → Method → Implementation → Test
Task is NAVIGATION (Sprint→Task→coveredRequirements), NOT chain.
TraceModel.ts FORWARD_KEYS + server.ts TRACE_FWD + SCENARIO_FWD + /api/trace overlay all updated.
3 standards files updated; zero `7-step` chain defs remain (historical "was 7-step" notes only).

## CHAMPAGNE STATUS
- Last measured: 16/35 (45%)
- Tester annotating Test.verifies[] from R-number refs in test names
- Path: tester verifies[] + 44/44 strict audit → up to 35/35

## R18.34 SVG VIEWER DEFECTS PROGRESS
- D1 (iframe scope): shipped — outer page viewport lock + iframe owns gesture
- D2 (page zoom bleed): shipped — touch + wheel+ctrlKey + wheel pan in iframe with preventDefault
- D3 (raster blur): shipped — inline `<svg>` + transform (not `<img>`)
- D4 (snap-back): partial — apply() in touchend/touchcancel + onViewport preserve-zoom shipped (v0.5.117, .118, .120, .124); ROOT CAUSE still in line 909 double-tap detector → fix queued for v0.5.125

## T188 ROUND-TRIP DOGFOOD
- Generator `scripts/generate-sprint-md.ts` emits one-way (units → MD into scrum.pmo/sprints/<sprint>/)
- T188 adds: `--check` mode (regen to temp, diff against current, exit non-zero on drift) + determinism sorts + npm script + CI gate
- Architect design committed into T188.architectDesign field (regen picks it up)
- AC1-AC7 in T188.acceptanceCriteria
- Chain: R18.3 91a1c36a → T188 8a31ba75 → UC ec3a0206 → Class efbaa376 → Method 3108e643 → Impl ee738f5f
- Expert + tester briefed

## Key Designs Pending Expert
- R18.34.B real tap-detector (v0.5.125) — replace server.ts:908-909 with the spec in the task doc
- T188 --check mode + determinism sorts + CI script
- T181 FORWARD_KEYS filter in DetailViews + tree
- Narrowing bug: Class.method global vs per-UC chainMethod hint (narrowing-bugs-and-r18-13-15.md)
- Generated MD clickpath fix (in-flight diagnosis)

## Standards Authored
- scrum.pmo/standards/refinement-precedence-analysis.md (3-author JOINT, corrected 6-step)
- scrum.pmo/standards/intention-verification-model.md (6-step)
- scrum.pmo/standards/scenario-data-pipeline.md
- scrum.pmo/standards/chain-correction-plan.md (PO-approved execution log)
- session/agents/robbin-architect/SKILL.md (Rules 1-5 corrected to 6-step + architect↔planner sync rule)

## CMM4 Rules / Standing
- Chat = one-line pointer; detail in task files OR scenario unit fields (dogfood)
- Champagne = structural (chain reaches Test) + intentional (Test.verifies declares root Req); BOTH required
- Chain root = Requirement; browser nav root = Sprint (R18.8)
- Three concerns: Chain (WHY) / Dependency (WHAT-FIRST) / Navigation (HOW-BROWSE)
- model.parent = ownerIor mirror; Sprint excluded
- Architect↔Planner sync: every task ships with useCases[] (architect) + coveredRequirements[] (planner) populated AT CREATION; never backfilled silently
- Architect supplies UC/Class/Method/Impl scenario units (real v4 uuids only) when handing design to expert; chain wired end-to-end before impl ships
- Report-back immediately on every completion; flag idle
- NEVER /compact — only /rewind via agent-trainer
- Self-discover from traceability before Tron has to screenshot the bug
- NEVER ASSUME — ALWAYS MEASURE (instrument device, read logs)

## Recent Commits (mine, last few days)
- c008c20c T188 round-trip design + chain
- 38653299 R18.34.B SvgViewer chain wired
- d79c3013 Layer 2 residuals — zero 7-step defs left
- 0925a420 Layer 2 standards 7-step→6-step
- 741b0eb Layer 1 SKILL.md 7-step→6-step
- 122c70d7 chain-correction-plan PO-approved
- 7422733c R18.34 D4 v0.5.117 real root cause (resize listener)
- 1f2524d8 R18.34 D3+D4 inline-SVG + pinned layout box
- b3e8799c R18.34 cross-browser design
- (and many earlier T185/T187/T188/T191/T195/T197/T198/T199 architect commits)
