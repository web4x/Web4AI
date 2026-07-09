[Back to Planning Sprint 2](./planning.md)

# Task D1: Fix config.save Greedy Varname Extraction
[task:uuid:cb9d9044-9cc2-49c8-8e8c-4f1789a12d7a]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [Sprint 2 Planning](./planning.md)

## Description
`config.save`'s sed grabs `NAME=` substrings from a var's VALUE instead of the actual variable name. A var like `FORMAT_PARSE_METHOD="declare -- METHOD='%s'..."` gets its inner `METHOD` matched, not `FORMAT_PARSE_METHOD`. Architect specs the correct extraction (name before `=`), expert fixes the sed, tester verifies: `config save` with a var whose value contains `NAME=...` → var persisted correctly.

---
*Sprint 2 @MacStudio · Epic D: config.save Root Bug · Priority 2*
