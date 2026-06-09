---
name: Write task file first, then delegate
description: Never send requirements via otmux chat — write the task file first, then tell the agent to read it
type: feedback
originSessionId: 1d62067c-ab0b-4d6b-9615-2302051b3a29
---
WRITE THE TASK FILE FIRST. Never relay requirements via otmux chat directives.

**Why:** Chat directives get garbled in relay — the PO's understanding of Tron's requirement gets mangled when paraphrased via otmux send. The expert implements what they received, not what Tron said. Task files are the single source of truth.

**Process:**
1. Tron states requirement
2. PO writes task file with EXACT requirement (copy Tron's words, don't paraphrase)
3. PO tells expert: "Read task-79-landing-page-version-nav.md and implement"
4. Expert reads file, implements what it says
5. If requirement changes: UPDATE THE FILE, then tell expert to re-read

**Anti-pattern:** `otmux send expert "do X and Y and also Z"` — this is CMM1 (ad hoc, no traceability, gets garbled).

**How to apply:** Every time you're about to send a directive via otmux, ask: "Is this in the task file?" If not, write it there first.
