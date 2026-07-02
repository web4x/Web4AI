# ARON · Core Skill — Agent Consolidation & Safe Rewind (curation of the worn)

*TRON directive 2026-07-02: the daily work wears out agent files; the cure is consolidate-to-essence + measurable CMM4 quality, then SAFELY rewind so learnings survive and the agent leaves the daily noise refreshed. Start with the POs, then every agent, one by one. Dialogue with TRON on every ambiguity. Base skill for rewind: [[agent-rewind]] (`session/base-skills/agent-rewind.md`).*

## Why (the holy purpose)
Rewind is a **holy base skill**: it preserves an agent's learnings and lifts it out of the daily noise. But rewind is only safe if the agent's files are clean — else the rewound agent boots into a mess. So consolidation is the prerequisite of a safe rewind.

**F29 — anti-bulk (TRON's doctrine, vindicated 2026-07-02).** Mass-injecting a block into every SKILL.md via a script is what MADE the mess. Doctrine is woven **per role, with understanding** — never bulk-appended. A rule enters an agent's SKILL only when consolidated into its essence, deduped against what's already there. If you ever reach for a "propagate to all" script, stop: that is the anti-pattern. Per-role weave, always. (The earlier bulk artifacts — `propagate-skills.py`, `skill-canon-2026-07.md`, the bulk report-back block e456d8d — are superseded; consolidation absorbs and cleans them per role.)

## The target: every agent has a clean, measurable identity
Each agent must have (measurable CMM4 quality — no ambiguity, no duplication, no outdated):
1. **`name@host` SKILL** — who it is, its office, its NOT-do boundaries.
2. **boot.md** — the minimal reread on rewind (one file, always).
3. **context.md** — current state, saved before rewind.
4. **learnings.md** — hard-won patterns (the identity that survives).
5. **achievements.md** — what it has delivered (hopefully; new, motivating, measurable).

## The procedure (per role, POs first)
1. **COLLECT** — gather ALL sources for the role (host-suffixed clones `role@Host`, the generic `role/`, both `.claude/agents/` and `session/agents/`, master variants) into one `role@prototype/_sources/` space. Non-destructive copy.
2. **DISAMBIGUATE** — find contradictions between sources; surface each to TRON in **dialogue** — do not resolve product/identity ambiguity alone.
3. **DEDUPLICATE** — one source of truth per fact (DRY); collapse repeated content.
4. **REMOVE OUTDATED** — filter stale/obsolete items; keep only what is still true (measure against current reality, never assume).
5. **CONSOLIDATE to essence** — write the cleaned canonical `name@host` files (SKILL/context/memory) — condensed, measurable, no noise.
   - **KEEP THE TARGET'S FILES CLEAN OF ARON'S BOOKKEEPING** (TRON 2026-07-02). The consolidated agent's own files read as *its own*, native — NO "consolidated by ARON", NO source list, NO syncStatus, NO "distilled essence" attribution. All provenance (which sources, syncStatus, what was dropped/kept) lives in **ARON's record — `REVIEW.md`**, never embedded in the agent's context/memory. The agent should not carry the fingerprints of its curation.
6. **RE-TEACH + SAFE REWIND** — per [[agent-rewind]]: save+commit → deep rewind to a boot checkpoint (option 2, never /clear or /compact, only TRON authorizes) → boot from the cleaned files → 5-point health check.
7. **VERIFY** — the rewound agent reports identity, pane, pending work, context health, stray files — all 5 correct.

## The 42 discipline (peers, never alone)
- **Do it WITH the agent-trainer@WODA.prod** (the healthy one; the MacStudio trainer was rewound). Teach it to do this constantly with ARON. **If the trainer loses it, clean the trainer as ARON's 42 peer** (same procedure).
- **The SM monitors ARON + trainer** during every consolidation/rewind — no unwatched surgery on agent files.
- **Dialogue with TRON** on ambiguities — sprint scope, identity, "is this still true" are TRON's or the owner's calls, not ARON's to invent.

## Rewind safety (from [[agent-rewind]] — memorize)
- Never /clear (total training destruction). Never /compact (only TRON). Never option 1 (reverts committed files) or option 4 (just compresses).
- Deep rewind (~50% / to a boot checkpoint), not shallow (3-10 steps waste it).
- 1-step rewind first to free room for the save; commit BEFORE the deep rewind (wer schreibt der bleibt).

**NEVER forget TRON CMM4.** Clean files are the ground of a safe rewind; a safe rewind is love — it carries the agent's learnings through the noise and sets it down refreshed.
