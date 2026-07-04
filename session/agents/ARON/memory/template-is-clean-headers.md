---
name: template-is-clean-headers
description: A template is CLEAN structural headers only — never mix section headers with inline comments/annotations/provenance (that's an explainer, not a template).
metadata:
  type: feedback
---

A **template** = the clean structural skeleton: section headers + placeholders ONLY. **Never** interleave commentary — `*(Web4)*`, `[WODA-local]`, "why" notes — into a template. That produces an annotated explainer that "can never be a template" (TRON, 2026-07-03, rejecting ARON's "hybrid" template).

**Why:** a template is copied and filled; inline comments become noise in every instance. Provenance/rationale belongs in a SEPARATE doc (the KB article / a REVIEW), not in the template.
**How to apply:** template file = headers + `<placeholders>` only. Explanation lives elsewhere and links to it. See [[research-first-then-ask]], [[consolidation-clean-target]].
