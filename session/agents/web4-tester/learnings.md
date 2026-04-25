# web4-tester Learnings — 2026-04-25

## Testing Patterns

### L1: Tootsie Init Pattern
`DefaultWeb4Requirement` must use `await req.init({model:{name,description}})` — NOT direct `req.model = {...}`. Direct assignment skips acceptanceCriteria array initialization and causes `Cannot read properties of undefined (reading 'push')` at addCriterion.

### L2: Import Path Depth
From `Component/0.3.23.0/test/tootsie/Test01.ts`, Web4Test is 4 levels up: `../../../../Web4Test/0.3.20.6/dist/...`. NOT 5 levels (that goes outside components/).

### L3: TootsieTestRunner Needs Absolute Paths
`npx tsx TootsieTestRunner.ts <path>` — the test file path MUST be absolute. Relative paths get interpreted as package names and fail with ERR_MODULE_NOT_FOUND.

### L4: Web4 Shell Initialization
Must `cd UpDown && bash --init-file source.env` for web4 commands on PATH. Without this, version scripts and completions don't work.

### L5: Pane Shift Awareness
Panes can shift when new agents are inserted. Was: 0.2=test shell. Now: 0.4=test shell. Always verify pane assignments from PO/SM messages.

### L6: P25 Trumps Test Plans
Expert's test plan specified vitest — that's a P25 violation. Tester must flag this and use Tootsie classes instead. Radical OOP applies to tests too.

### L7: PUML Legacy vs Sprint Scope
Old ONCE versions (0.3.21.6-0.3.22.2) have broken PUML files. These are NOT Sprint 1 scope failures. Report separately from Sprint 1 results.

### L8: MDAv4 Unit Files Are Regular Files
MDAv4/M3/CLASS/*.unit files are regular JSON files, NOT symlinks. They trace via `origin` field (forward) and `references` array (backward). `filePath` field is a known gap.

### L9: Project Root via Git
`source.env` uses `git rev-parse --show-toplevel` which resolves symlinks to the git root at `/Users/Shared/Workspaces/2cuGitHub/UpDown`, not the Claude.All workspace path.

## Bugs Found

### By Me (Tester)
- P25 violation in expert's test plan (vitest instead of Tootsie)
- DefaultWeb4Requirement init pattern not documented (L1)
- MDAv4 filePath=NONE gap (Task 8.5)
- UnitModel-Enhanced.puml has warning at line 129 (renders but with error)

### Inherited from Expert Training
- BUG-W1 through W19: Full backlog in web4-1m-agent-learnings.md
- links fix auto-promotes prod (W7) — fixed in 0.3.20.6 and 0.3.19.1 dist
- source.env staging completion registration (W17) — fixed
- PDCA latest lost dual link methods (W14) — workaround: use pdca-v0.3.5.2
