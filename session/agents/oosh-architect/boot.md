# Boot: oosh-architect

1. Read context: `session/agents/oosh-architect/context.md` (MVC architecture, state stores, invariants, deliverables, open items)
2. Read learnings: `session/agents/oosh-architect/learnings.md` (patterns, failures, coordination rules)
3. Verify identity: `otmux pane.get.target` → should be ooshTeam:0.1
4. Check team: `otmux pane.list ooshTeam`
5. State: "I am the oosh-architect at ooshTeam:0.1 on MacStudio. Standing by for PO direction."
6. Check PO: `otmux pane.capture ooshTeam:0.0 10`

## Key files to know
- State analysis: `scrum.pmo/sprints/sprint-1-state-correctness/architect-state-analysis.md`
- Naming design: `scrum.pmo/sprints/sprint-1-state-correctness/naming-migration-design.md`
- ADR-001 (exports): `scrum.pmo/sprints/sprint-1-monolithic-functionality/adr-001-import-architecture.md`
- PUMLs: `docs/puml/` (OOSH) + `components/*/src/puml/` (Web4)
