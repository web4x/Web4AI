# robbin-req — Learnings

## Requirements Writing

### No Character Limits
NEVER specify character limits in requirements. Tron directive. ALL future requirements.

### Use Case Naming
Object.verb style. Group by domain prefix (UC-RM, UC-API, UC-ED). Use <<include>> for sub-flows in PlantUML.

### Acceptance Criteria Quality
Every criterion must be specific and testable. Bad: "should work correctly". Good: "GET /api/files/README.md returns file content as JSON".

### Traceability Matrix
Always include a traceability table mapping Tron original words to use case IDs.

## Process

### Report with TRON DIRECTIVE prefix
When a task originates from Tron, lead every PO report with TRON DIRECTIVE: "<literal quote>". PO correction: without this prefix, PO misread a valid Tron bug capture as freelancing.

### Stay in Lane
Write requirements and capture Tron quotes. Do not create bug/feature tasks unprompted. Capture the requirement with UUID and report to PO. PO and planner decide sprint placement.

### Orphan Audit Method
Collect all requirement:uuid from */requirements.md, scan all task-*.md for refs not in that set. Scriptable in a single bash loop.

### Compound Requirement Sources
When Tron issues multi-part directives, compound-requirement-source.md preserves verbatim text. Decomposition hints are NOT authoritative -- the literal text is.

### Backlog vs Sprint Requirements
Untriaged Tron directives go to backlog.md with requirement:uuid but NO task number. Sprint-scoped go to sprint-N/requirements.md with task forward-links.

### Source-Location IOR
ior:file:<path>?commit=<sha>&lines=<start>-<end> -- standard format for git-anchored file references.

### Task Anchor Pattern
When planner stands up a task with placeholder requirement:uuid, req-eng replaces with canonical uuid from backlog capture. Three edits per task: (1) traceability uuid + verbatim quote, (2) chain section requirement line, (3) QA Audit entry.

### Per-Shape Mapping (T151)
When doing JOINT work with architect, produce concrete mapping table: MD bullet type to JSON model field to IOR type.

### model.altId for Short Aliases
Requirement units use full Tron quotes as model.name. model.altId="R17.1" is runtime alias for lookup.

### Requirement name vs description (B15/T154)
model.name = plain-English short name. model.description = verbatim Tron quote. These MUST differ.

### Forward-Only Traceability (B18)
Chain is FORWARD-ONLY per Tron: requirement-task-subtask-useCase-class-method. NO back-refs. B18 overrides T155 bidirectional closure.

### Planner Sometimes Uses Canonical UUIDs Directly
Not every task needs uuid replacement. Check first. T156/T157 planner already used B4/B3 canonical uuids.

### Atomic One-Sentence Requirements (R-I -- STANDING RULE)
Per Tron: "let the req agent split tasks into one sentence requirements". Each task decomposes into multiple atomic one-sentence requirements. Each atomic requirement is a ROOT of the chain. Apply to new tasks at refinement AND retroactively to existing tasks.

### R-M3 Sub-Requirement Pattern
Major Tron directives accumulate refinements over multiple messages. Capture each as R-M3a, R-M3b, etc. in compound-source, then fold into the implementing task (T174). Keep verbatim quotes atomic -- one sentence per requirement.

## Inherited from robbin-architect
- Two working dirs: planning in workspaces/Web4RawBin/, code in 2cuGitHub/Web4RawBin/
- plantuml at /opt/homebrew/bin/plantuml
- Use cat -n via Bash to read files (Read tool may be stale)
- Linter modifies files between edits -- always re-read before editing
