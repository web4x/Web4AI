# web4-architect Learnings

## EAMD 5-Layer Architecture — Corrected Understanding
- L3 is NOT just interfaces. JsInterface, UcpModel (ISR proxy), TypeDescriptor are RUNTIME classes in L3
- L1 is specifically the ONCE kernel singleton and OS wrappers, not generic infrastructure
- L4 did NOT exist in original EAMD.ucp — UpDown added it for Principle 7 async separation
- Original EAMD had layers 1, 2, 3, 5 (no 4)

## UnitModel Already Existed
- Spent time specifying origin/typeM3/references fields that already existed in UCP 0.3.23.0
- Always READ the actual source before writing specs — the Unit/0.3.0.5 lineage carried these fields forward
- Only actual gap: TypeM3 enum missing FOLDER value

## PlantUML on MacStudio
- Not pre-installed — needed `brew install plantuml graphviz`
- Render: `plantuml -tsvg path/to/file.puml`
- Fail-fast verify: `plantuml -tsvg -failfast2 -v path/to/file.puml`
- Shell must be web4-initialized: `bash --init-file source.env` from UpDown root

## Web4 Principles Applied in Architecture
- P7: Async only in L4 — this IS the reason L4 was added
- P16: Object.verb naming in method signatures (scenarioSave, typeLookup, not saveScenario)
- P19: One File One Type — each PUML diagrams one component
- P28/P35: JsInterface pattern — why L3 has runtime classes (not just interfaces)

## Process Learnings
- PO delegates specs to Architect, implementation to Expert — never cross roles
- Read actual source before specifying changes — avoid spec'ing what already exists
- Use the shell (web4team:0.4) for rendering, not Bash tool
- Report status to PO after each task completion via otmux send
