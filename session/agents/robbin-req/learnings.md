# robbin-req — Learnings

## Requirements Writing

### No Character Limits
NEVER specify character limits in requirements — no maxlength, no 'max 20 chars', no arbitrary boundaries on user input. Tron directive. Applies to ALL future requirements.

### Use Case Naming
Object.verb style: `room.create`, `file.browse`, `editor.save`. Group by domain prefix (UC-RM for room management, UC-API for file API, UC-ED for editor). Use `<<include>>` for sub-flows in PlantUML.

### Acceptance Criteria Quality
Every criterion must be specific and testable — an agent can verify pass/fail without asking the PO. Bad: "should work correctly". Good: "`GET /api/files/README.md` returns file content as JSON".

### Traceability Matrix
Always include a traceability table mapping Tron's original words to use case IDs. This proves coverage and makes gaps visible.

## Process

### Commit and Push Requirements
PO expects committed specs before architect starts designing. Commit message format: `robbin-req: Sprint N requirements — <summary>`. Push immediately.

### Read Before Writing
Always audit the current codebase (server routes, Room.ts model, UserKeys patterns) before writing requirements. The spec must reference actual line numbers, function names, and data structures — not hypotheticals.

### PlantUML Diagrams
Render SVG immediately after writing PUML. Rename from title-based filename to clean kebab-case. Verify >10KB (real diagram). Include both .puml source and .svg in the commit.

### Report with TRON DIRECTIVE prefix
When a task originates from Tron, lead every PO report with `TRON DIRECTIVE: "<literal quote>"`. PO correction: without this prefix, PO misread a valid Tron bug capture as freelancing.

### Stay in Lane
Write requirements and capture Tron quotes — don't create bug/feature tasks unprompted. If Tron reports a bug, capture the requirement with UUID and report to PO. PO and planner decide sprint placement and task creation.

### Orphan Audit Method
To find orphan requirement UUIDs: collect all `requirement:uuid:` from `*/requirements.md`, then scan all `task-*.md` for refs not in that set. Scriptable in a single bash loop. Run after every formalization batch.

### Compound Requirement Sources
When Tron issues multi-part directives (original + extensions), a `compound-requirement-source.md` preserves the verbatim text. Decomposition hints in that file are NOT authoritative — the literal text is. Formalize each R17.N with the EXACT Tron quote, not the decomposition hint.

### Backlog vs Sprint Requirements
Untriaged Tron directives go to `backlog.md` with `[requirement:uuid:]` tag but NO task number. Sprint-scoped requirements go to `sprint-N/requirements.md` with task forward-links. Planner triages from backlog → sprint.

### Source-Location IOR
`ior:file:<path>?commit=<sha>&lines=<start>-<end>` — the standard format for git-anchored file references. Every UC/Class/Method scenario unit carries this in `model.source`. Capture commit via `git log --format=%h -1 -- <path>`.

### Task Anchor Pattern
When planner stands up a task with a placeholder requirement:uuid, req-eng replaces it with the canonical uuid from the backlog capture. Three edits per task: (1) traceability block uuid + verbatim quote, (2) chain section requirement line, (3) QA Audit entry with date + what was done. Commit message: `robbin-req: T<N> — anchor verbatim Tron quote + canonical requirement:uuid`.

### Per-Shape Mapping (T151)
When doing JOINT work with architect, produce a concrete mapping table: MD bullet type → JSON model field → IOR type. Include audit counts (how many of each type across the sprint range). This gives architect the exact schema to design against.

### model.altId for Short Aliases
Requirement units use full Tron quotes as model.name (no character limits). model.altId="R17.1" is a runtime alias for lookup — canonical identifier remains the UUID. Confirmed OK with standard.

### Requirement name vs description (B15/T154)
model.name = plain-English short name (similar to filename slug). model.description = verbatim Tron quote. These MUST differ. The quote IS the description, the name is the summary. JSON-side equivalent of T146 MD name-first format.

## Inherited from robbin-architect
- Two working dirs: planning in workspaces/Web4RawBin/, code in 2cuGitHub/Web4RawBin/
- plantuml at /opt/homebrew/bin/plantuml
- Use `cat -n` via Bash to read files (Read tool may be stale)
- Linter modifies files between edits — always re-read before editing
