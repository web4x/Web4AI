---
name: cmm4-communicate-via-task-refinement
description: Communicate through the task file and refine its spec collaboratively until consistent enough to delegate to expert + tester — this is CMM4 in practice
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

Communicate through the TASK FILE, not chat. Refine the task's spec collaboratively
(PO + architect + req-engineer + planner) during the "refinement" sub-step until the spec
is internally consistent and complete enough to stand on its own — ONLY THEN delegate to
expert (implement against the file) and tester (write test cases against the file's AC).

**Why — this is what CMM4 actually means:**
- CMM3 = "Wer schreibt, der bleibt" (who writes, stays): the written task file is the
  durable, reproducible source of truth.
- CMM4 = "Wer misst, der weiss" (who measures, knows): PDCA feedback loops + measurement.
  The *refinement* of the task file IS a PDCA loop applied to the SPEC itself, run BEFORE
  any implementation.
- Embedding requirements in ad-hoc otmux chat directives is CMM2 — ephemeral, lossy, not
  reproducible, and it makes me the bottleneck/single point of context. Tron's directive:
  the task file is both the communication channel AND the spec; chat is only for pointers.
- A spec that isn't consistent enough to hand off cold will produce rework — the weakest
  link drags the whole delivery down (composed maturity = weakest link).

**How to apply:**
1. New requirement → create/grow the TASK FILE with the spec. Do not relay the spec in chat.
2. Run the "refinement" phase as real collaboration ON the file: architect adds design,
   req-engineer adds requirements + acceptance criteria, planner maintains traceability,
   PO reviews the FILE for consistency/completeness. Iterate until it converges.
3. The refinement is "done" when expert + tester would need NOTHING beyond the file —
   no clarifying questions, no missing AC, no contradictions.
4. THEN delegate: expert implements against the file; tester writes test cases against the
   file's acceptance criteria. Both work from the file, not from my chat messages.
5. Track progress through the file's hierarchical Status checklist (refinement → creating
   test cases → implementing → testing → QA Review → Done) and the task tracker — not walls
   of chat. Use otmux only to point agents AT the file and to close the report-back loop.

Extends [[feedback-task-file-first]] (write the task file before directives): it's not
enough to write it first — refine it collaboratively to consistency before delegating.
Pairs with [[delegate-with-report-back]] and the hierarchical Status checklist.
