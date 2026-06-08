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

## Decomposition Protocol (Rules 9-11)

### Rule 9: Deduplication Before UUID Creation
Before creating a NEW requirement:uuid, search compound-source + all sprint requirements.md. If match exists, annotate the EXISTING requirement. R-U1/R-V1/R-Y1 were the same requirement captured 3 times — lesson learned.

### Rule 10: Exhaustive Verb x Noun Cross-Product Gate
List every VERB and NOUN in Tron text. Cross-product all cells. Write one AC per cell. Signal "decomposition COMPLETE" to planner before any task creation. Partial decomposition → partial fix → re-capture cycle.

### Rule 11: Compound Source is INPUT Not OUTPUT
compound-requirement-source-*.md is raw Tron text. NEVER authoritative. Authoritative = atomic entries in requirements.md. Undecomposed = open items, not requirements.

### R18.x Numbering Collisions
Follow-on C/D hints used R18.9-15 which collided with already-assigned cycle guard/CSS requirements. ALWAYS check the traceability table for the NEXT available number before assigning. The compound-source hints are LOCAL numbers — the requirements.md table is CANONICAL.

## Process

### Report with TRON DIRECTIVE prefix
When a task originates from Tron, lead every PO report with TRON DIRECTIVE: "<literal quote>".

### Stay in Lane
Write requirements and capture Tron quotes. Do not create bug/feature tasks unprompted.

### SM Directive: One-Line Chat Reports
Detail goes INTO the task file (results/status/commit refs). Chat = one-line pointer only. No detail walls in chat.

### Orphan Audit Method
Collect all requirement:uuid from */requirements.md, scan all task-*.md for refs not in that set.

### Compound Requirement Sources
compound-requirement-source.md preserves verbatim text. Decomposition hints are NOT authoritative — the literal text is.

### Source-Location IOR
ior:file:<path>?commit=<sha>&lines=<start>-<end>

### Task Anchor Pattern
Three edits per task: (1) traceability uuid + verbatim quote, (2) chain section requirement line, (3) QA Audit entry.

### model.altId for Short Aliases
Requirement units use full Tron quotes as model.name. model.altId="R17.1" is runtime alias.

### Requirement name vs description (B15/T154)
model.name = plain-English short name. model.description = verbatim Tron quote. MUST differ.

### Forward-Only Traceability (B18)
Chain is FORWARD-ONLY: requirement→task→UC→class→method→impl→test. NO back-refs.

### Atomic One-Sentence Requirements (R-I — STANDING RULE)
Each task decomposes into multiple atomic one-sentence requirements. Each is a ROOT of the chain.

## Champagne Intention Verification

### Test.model.verifies[] is the Intention Truth
Structural reachability through shared classes ≠ intention. 96% FLAT because 19/35 classes are shared by multiple requirements. Solution: Test.model.verifies[] = explicit IOR array declaring which requirement(s) the test INTENDS to verify. CHAMPAGNE verdict requires verifies[] match.

### Champagne = Architect Self-Discovery + Tester Screenshots
Tron: "champagne is when the architect self discovers from the traceability." Plus: tester provides Playwright screenshots of /trace browser as visual evidence.

## Heading-Leak Artifacts
MD table headers captured as requirement names by T128 migration (e.g. "| Requirement | UUID | Task | Category |"). These are NOT real requirements. Fix: check if model.name starts with "|" or "##". If real req underneath (altId matches), fix name. If pure artifact, mark orphan-by-design or delete.

## JOINT Work Patterns

### Deep-Chain Audit
Walk forward from all requirements, count reachable per type. The single biggest blocker was Task→UseCase = 0/106 — filling that one field connected the entire chain.

### Task.subtasks[] Corruption
22,998 garbage entries (tokenized markdown text, not IOR refs). Migration script treated task file raw text as subtask references. Must be wiped.

### Scenario Unit Creation
Use 1-char-per-level directory structure: uuid chars [0]/[1]/[2]/[3]/[4]/uuid.scenario.json. NOT 5-char prefix flat.

## Inherited from robbin-architect
- Two working dirs: planning in workspaces/Web4RawBin/, code in 2cuGitHub/Web4RawBin/
- plantuml at /opt/homebrew/bin/plantuml
- Use cat -n via Bash to read files (Read tool may be stale)
- Linter modifies files between edits — always re-read before editing
