# Tester verification of the bounded slice (2026-08-17) — handed to the runway agent

robbin-tester did the canon-verification for the bounded slice (INDEX-5 + 2 conflicts), then the PO ruled DEFER
(Tron has live S37 sprint work; memory curation is hygiene). Handing the verification off so the runway agent
executes in seconds without re-deriving. ★ This verification ITSELF proves the F1 "don't-index/prune-on-description"
rule: 2 of ARON's 5 INDEX candidates are ALREADY in the canon (`session/base-skills/agent-rewind.md`) → they are
PRUNE, not INDEX. Read bodies/canon before acting, as ARON flagged.

## INDEX-5 — REFINED after reading canon (agent-rewind.md):
- `ghost-suggested-prompt-not-real-text` → **INDEX** (unique; canon has C-u/staged but NOT the ghost-vs-real distinction).
- `version-bump-needs-restart` → **INDEX** (Web4RawBin R31.7 DEPLOY mechanic — different domain from agent-rewind; belongs under Deploy/build/version in MEMORY.md).
- `infra-dep-lost-across-rewinds-verify-docker-samehost-reproducible` → **INDEX** (unique; canon has no docker/plantuml infra-dep mechanic).
- `cu-before-context-injection` → **PRUNE (already in canon)** — agent-rewind.md line 124 "Composer must be CLEAR first — if a pending instruction is staged, C-u to clear it". Redundant instance.
- `panel-capture-agent-context` → **PRUNE/MERGE (already in canon)** — agent-rewind.md lines 11 + 65 cover pane.size.set enlarge + PANEL top-capture for a peer /context read. Redundant.

## 2 CONFLICTS — verified against canon:
- `trainer-drives-rewinds-not-aron` → **RETIRE (delete)**. STALE/WRONG: ARON drives rewinds now as trainer-backup (proven repeatedly this stretch). Canon says peer/SM drives (42); the "route to trainer only" claim is superseded.
- `never-rewind-more-than-50-percent` → **RETIRE (delete)**. Superseded by canon line 9 HOST-DEPENDENT depth cap (Pi ≤50% / capable host deeper).
- `rewind-threshold-80-for-1m-agents` → **RETIRE (delete)**. Superseded by canon line 35 "≥85% used + measure-then-decide + weekly-nuance" (the flat 80% trigger is the un-refined instance).

## Then: robbin-tester flips `check-memory-pointers.mjs --strict` ONLY after the FULL 72-orphan backlog is cleared (report-only stays by design until then). Do NOT prune the mass on description-only.
