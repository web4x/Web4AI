# oosh-architect Context

**Updated**: 2026-06-01 (60% context save)
**Role**: oosh-architect @ ooshTeam:0.1
**Machine**: MacStudio
**Session name**: oosh-architect@MacStudio

## Team Layout
- ooshTeam:0.0 — oosh-po
- ooshTeam:0.1 — ME (oosh-architect)
- ooshTeam:0.2 — oosh-expert
- ooshTeam:0.3 — oosh-tester
- ooshTeam:0.4 — oosh-expert-shell
- ooshTeam:0.5 — oosh-tester-shell

## What I Delivered This Session (cumulative)

### Design Documents
1. **J2 agent.fork.best design** — session/tasks/j2-fork-best-design.md
2. **Sprint 1 State Correctness** — architect-state-analysis.md (10 stores, 15 mutations, 7 invariants I1-I7, Option C events + Option B reconcile)
3. **tronMonitor.fit formula** — docs/tronMonitor-fit-formula.md
4. **Send prefix spec** — docs/send-prefix-spec.md (24 methods, ONE insertion point)
5. **otmux fast-path architecture** — task-otmux-fast-path.md (4 batch fixes A+B+C+D, 46s→1.5s, expert shipped)
6. **Naming migration design** — naming-migration-design.md (9 write paths, Option C: @hostname everywhere, expert shipped 9c2cc70)
7. **ADR-001: Import architecture** — adr-001-import-architecture.md (npm exports field, POC passed UCP+Unit, rollout queued)
8. **ADR-002: Version mapping** — adr-002-version-mapping.md (X.Y.Z.W → X.Y.Z-W, approved)
9. **McDonges disaster architect section** — appended to mcdonges-remote-disaster-report.md (I1-I6 breach analysis, 4 recommendations)
10. **Unit gap analysis** — task-9.1-architect-unit-gap-analysis.md (20 files missing from 0.3.23.x, ~1500 lines to port, Merge Forward strategy)
11. **@web4x/cli extraction review** — verified zero circular deps, flagged DefaultWeb4TSComponent string coupling
12. **claudeCode resolve.byName bug** — approved Option A (awk field extraction over grep)
13. **team.migrate shape review** — approved merge-on-remote, session filter, signed off expert impl

### PUMLs Delivered (13 total)

OOSH PUMLs (docs/puml/):
- Sprint1_StateCorrectness_StateStores.puml
- Sprint1_StateCorrectness_EventFlow.puml
- Sprint1_StateCorrectness_ReconcileCycle.puml
- TronMonitor_Fit_Activity.puml
- H1.1_claudeCode_UseCases.puml
- H1.2_otmux_UseCases.puml
- Sprint0_I1_ContextAwareSend_Sequence.puml

Web4 PUMLs (components/*/src/puml/):
- W4TSC-IMC-ClassDiagram.puml + SVG
- W4TSC-IMC-UseCaseDiagram.puml + SVG
- UCP-ClassDiagram.puml + SVG
- Unit-ClassDiagram.puml + SVG
- Persistence-ClassDiagram.puml + SVG
- Unit-Prod-ClassDiagram.puml + SVG (0.3.0.5 with GitTextIOR gap analysis)

### Reviews Completed
- otmux.fit signature (approved, flagged cross-session client dimension issue)
- team.migrate design (approved Option A merge-on-remote)
- @web4x/cli extraction (approved, flagged behavioral coupling)
- claudeCode resolve.byName (approved Option A awk)
- Naming migration 9c2cc70 (approved, pending Option A→C follow-up)

## Open Items

### Pending (blocked or waiting)
- **MVC rename consistency bug** — session/tasks/mvc-rename-consistency-bug.md. View shows @MacStudio, Model JSONL shows @opus. PO asked: should tree.detailed prefer live session name over JSONL? Should consistency.audit treat title≠sessionName as invariant violation? **I have NOT yet answered these questions.**
- **Option A→C naming follow-up** — expert has 5 /rename sites to switch from @model to @hostname. Bundled with robbinTeam restart.
- **ADR-001 exports rollout** — queued after expert finishes Task 3.1
- **ADR-002 version rollout** — ~30 package.json files, low priority

### Backlog (not started)
- H1.3: hiveMind use case PUML (completes MVC trilogy)
- TeamMigrate BulkRestoreExplosion Sequence PUML
- SC-G.3: Sprint 1 PUML updates as implementation lands

## MVC Architecture Summary
- **Model (claudeCode)**: resolve.byName bug approved (Option A), not yet shipped
- **View (otmux)**: fast-path shipped (46s→1.5s), otmux.fit shipped
- **Controller (hiveMind)**: naming 9c2cc70 shipped (Option A, needs C follow-up), team.migrate shipped, event handlers partially implemented
- **Monitor (tronMonitor)**: fit formula delivered, no open issues

## RULES (eternal)
- hiveMind for agent interaction, never raw otmux
- Rules are eternal — append only
- NO COMPACT — only TRON rewinds
- NEVER ASSUME — ALWAYS MEASURE
- PO assigns, SM monitors, TRON reviews
- Architect designs, expert reviews for implementability, tester validates
- Architect does NOT implement, does NOT run tests, does NOT run monitoring loops
