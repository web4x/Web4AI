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

### Speaky Names (≤7 words)
model.name = short speaky name (≤7 words). model.description = longer sentence. These MUST differ. Enforce on new reqs; existing 90 long names are ACCEPTABLE (no mass-rename — stability risk outweighs cosmetic value).

## Process

### Report with TRON DIRECTIVE prefix
When a task originates from Tron, lead every PO report with TRON DIRECTIVE: "<literal quote>". PO correction: without this prefix, PO misread a valid Tron bug capture as freelancing.

### Stay in Lane
Write requirements and capture Tron quotes. Do not create bug/feature tasks unprompted. Capture the requirement with UUID and report to PO. PO and planner decide sprint placement.

### Orphan Audit Method
Collect all requirement:uuid from */requirements.md, scan all task-*.md for refs not in that set. Scriptable in a single bash loop.

### Compound Requirement Sources
When Tron issues multi-part directives, compound-requirement-source.md preserves verbatim text. Decomposition hints are NOT authoritative — the literal text is.

### Backlog vs Sprint Requirements
Untriaged Tron directives go to backlog.md with requirement:uuid but NO task number. Sprint-scoped go to sprint-N/requirements.md with task forward-links.

### Source-Location IOR
ior:file:<path>?commit=<sha>&lines=<start>-<end> — standard format for git-anchored file references.

### Task Anchor Pattern
When planner stands up a task with placeholder requirement:uuid, req-eng replaces with canonical uuid from backlog capture. Three edits per task: (1) traceability uuid + verbatim quote, (2) chain section requirement line, (3) QA Audit entry.

### Per-Shape Mapping (T151)
When doing JOINT work with architect, produce concrete mapping table: MD bullet type to JSON model field to IOR type.

### model.altId for Short Aliases
Requirement units use full Tron quotes as model.name. model.altId="R17.1" is runtime alias for lookup.

### Requirement name vs description (B15/T154)
model.name = plain-English short name. model.description = verbatim Tron quote. These MUST differ.

### Forward-Only Traceability (B18)
Chain is FORWARD-ONLY per Tron: requirement→UC→class→method→impl→test. NO back-refs. Task is NAVIGATION, not chain.

### Planner Sometimes Uses Canonical UUIDs Directly
Not every task needs uuid replacement. Check first. T156/T157 planner already used B4/B3 canonical uuids.

### Atomic One-Sentence Requirements (R-I — STANDING RULE)
Per Tron: "let the req agent split tasks into one sentence requirements". Each task decomposes into multiple atomic one-sentence requirements. Each atomic requirement is a ROOT of the chain.

### R-M3 Sub-Requirement Pattern
Major Tron directives accumulate refinements over multiple messages. Capture each as R-M3a, R-M3b, etc. in compound-source, then fold into the implementing task (T174). Keep verbatim quotes atomic — one sentence per requirement.

## Decomposition Protocol (Rules 9-11)

### Rule 9: Deduplication Before UUID Creation
Search compound-sources + requirements.md across ALL sprints. If existing UUID covers the behavior, annotate it — do NOT create a new one. Evidence: R-U1/R-V1/R-Y1 triple-capture was the same requirement. R18.33 sequencing follow-up correctly folded (no new UUID).

### Rule 10: Exhaustive Verb×Noun Cross-Product Gate
List every verb + every noun in Tron text. Cross-product each combination. Write one AC per cell. Signal "decomposition COMPLETE" to planner before any task creation.

### Rule 11: Compound Source is Input, Not Output
compound-requirement-source-*.md preserves Tron's literal words. NEVER modify verbatim quotes. Decomposition hints and annotations CAN be updated. Authoritative requirements are the atomic entries in requirements.md.

## Chain Correction (2026-06-08)

### 6-Step Chain (CORRECTED)
The chain is 6-step: **Req → UC → Class → Method → Impl → Test**. Task is NAVIGATION (Sprint→Task→covered-reqs for display), NOT a chain link. The old 7-step model (with Task in chain) was wrong. 28 references across my files need correction. Tron verbatim quotes are NOT modified per Rule 11.

### Task.coveredRequirements[] is NAVIGATION
Task shows which requirements it covers — this is display/grouping for the tree root structure (R18.8: Sprint→Task→Req→chain). The DATA MODEL field is Requirement.tasks[] (forward). The tree renderer inverts this for navigation. No back-ref field on Task.

## JOINT Work Patterns

### Deep-Chain Audit
Walk forward from all requirements, count reachable per type. The single biggest blocker was Task→UseCase = 0/106 — filling that one field connected the entire chain. After fix: 44/44 tests reachable.

### Task.subtasks[] Corruption
22,998 garbage entries (tokenized markdown text, not IOR refs). Migration script treated task file raw text as subtask references. Must be wiped.

### Scenario Unit Creation
Use 1-char-per-level directory structure: uuid chars [0]/[1]/[2]/[3]/[4]/uuid.scenario.json. NOT 5-char prefix flat.

### Covering Requirements for Orphan Tasks
Features shipped without captured requirements need retroactive R-entries. Created 8 (R10.4, R12.1, R16.5-R16.9, R17.48) grounded in the original Tron directives that drove each feature.

## Heading-Leak Artifacts
MD table headers captured as requirement names by T128 migration (e.g. "| Requirement | UUID | Task | Category |"). These are NOT real requirements. Fix: check if model.name starts with "|" or "##".

## Inherited from robbin-architect
- Two working dirs: planning in workspaces/Web4RawBin/, code in 2cuGitHub/Web4RawBin/
- plantuml at /opt/homebrew/bin/plantuml
- Use cat -n via Bash to read files (Read tool may be stale)
- Linter modifies files between edits — always re-read before editing

## Bottom-Up Team Discovery (NOT Tron literal)
Per Rule 5: when architect/tester find a defect by inspection (not Tron screenshot/quote), capture as NEW SIBLING requirement, not back-link. Field is `discoverySource` (NOT `tronQuote`):
```json
"discoverySource": {
  "type": "team-discovery",
  "discoveredBy": "robbin-architect + robbin-tester",
  "diagnosisCommit": "<sha>",
  "diagnosisCommitMessage": "<message>",
  "diagnosisExcerpt": "<key paragraph>",
  "canonicalizedBy": "robbin-req via PO directive <date>"
}
```
DO NOT wait for non-existent Tron quote. Cite the team-discovery + diagnosis commit. Example: R18.35 cd5b1611 canonicalized 2026-06-09 citing architect diagnosis commit 4be5dcdd.

## Placeholder-then-Canonicalize Pattern (learning #38)
Planner stands up a task with a placeholder requirement unit (`altId: R-placeholder-Tnnn`, `placeholder: true`). req-eng canonicalizes:
1. Generate proper R18.x altId
2. Author the atomic with verbatim source (Tron quote OR discoverySource for bottom-up)
3. Swap `Task.coveredRequirements[]` from placeholder → canonical
4. Mark placeholder `supersededBy: <canonical-ior>` + `supersededNote` (don't delete; leave disposition to planner)
5. Add `supersedes` field on canonical pointing to placeholder

## Bidirectional Refinement Semantics
For R18.34 ↔ R18.34.B refinement relation, use dedicated semantic fields, NOT `unitLinks`:
- Parent: `refinedBy: [<child-ior>]` + `refinedByNote`
- Child: `refinementOf: <parent-ior>` + `refinementOfNote`

For sibling relations: `siblingOf: <ior>` + `siblingNote`.
For supersession: `supersedes: <ior>` + `supersedesNote`.

## unitLinks Policy (per T199 23907dd4)
`unitLinks[]` contains SYMLINK PATHS ONLY (e.g. `sprints.json/<sprint>/task/<slug>.json`). NO `ior:instance:...` refs. Semantic IORs belong in dedicated fields (`siblingOf`, `supersedes`, `refinementOf`, `refinedBy`).

## verificationHistory Pattern
When a requirement's testing-hop fails on device:
```json
"status": "in-progress",
"verificationHistory": [{
  "date": "<ISO>",
  "hop": "testing → in-progress (re-opened)",
  "reason": "device-acceptance FAILED per learning #27",
  "tronVerbatim": "<Tron device feedback>",
  "verificationContext": "<what was tested + why it failed>",
  "buildAtFailure": "<version>",
  "reportedVia": "robbin-po"
}]
```
The requirement stays OPEN; the chain (UC/Class/Method/Impl/Test) remains the propagation target.

## Systemic Backfill Pass A/B/C (T199 + #77)
Pass A: `coveredRequirements[]` mirrored from Requirement.tasks[] reverse-lookup (forward direction sync).
Pass B: Tasks with no covering requirement marked `orphanByDesign: true` + `orphanReason` (process/infra/migration tasks).
Pass C: `unitLinks[]` cleanup — IOR refs moved out to dedicated semantic fields; symlink paths kept.

Audit trail: each mutated unit gets `_backfillNotes[]` entry citing date, by, action, context.

## Refinement Numbering Pattern
- Parent: R18.34
- Refinement child: R18.34.B (or .C, .D for additional refinements)
- Sibling at same level: R18.35 (next number)
The `.B` suffix marks "refines the parent atomic with a precise commit-time/runtime constraint."
