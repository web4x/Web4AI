---
name: consolidation-clean-target
description: When consolidating an agent's files, keep the target's files clean of ARON's bookkeeping; provenance lives only in REVIEW.md.
metadata:
  type: feedback
---

The consolidated agent's own files read as native — no "consolidated by ARON", no source list, no syncStatus, no "distilled essence" tag.

**Why:** The agent should not carry the fingerprints of its curation (TRON 2026-07-02).
**How to apply:** All provenance (sources, syncStatus, what dropped/kept) goes in ARON's `REVIEW.md`, never in the target's context/memory. Also F29 anti-bulk: weave per-role, never mass-inject. Core skill: `.claude/agents/ARON/skills/agent-consolidation-and-rewind.md`.
