# ⚠️ SUPERSEDED (2026-07-02) — DO NOT USE

**This bulk self-add canon is superseded.** TRON handed the fix to ARON: the rules (SCENARIO FIRST, report-back, PO law #125) are woven per-role + deduped as careful **consolidation-to-essence**, NOT crude block-appends — bulk-inject is the F29 mess this repo learned from. Canonical approach lives in `.claude/agents/ARON/skills/agent-consolidation-and-rewind.md`. Kept for history (wer schreibt, der bleibt), not for running.

---

# SELF-IMPROVE your SKILL.md — two TRON rules to add (2026-07)

**TRON directive:** don't wait for the trainer to write your file *under your awareness* — **read these, add the ones that apply to YOUR role into your OWN `.claude/agents/<you>/SKILL.md` (immediately after the YAML frontmatter, byte-faithful), then `git commit`.** You own your identity. Wer schreibt, der bleibt.

Idempotent: if your SKILL.md already contains the marker line, skip it.

---

## 1. SCENARIO FIRST — EVERY agent adds this

Marker (skip if present): `SCENARIO FIRST — scenario units on disk BEFORE implementation`

```markdown

## ☑ SCENARIO FIRST — scenario units on disk BEFORE implementation (TRON law #100)

Scenario units are written **on disk BEFORE any implementation**. The Markdown is a **generated VIEW** of the scenarios — never hand-authored ahead of them. **A backfill (scenarios written after the code) means the rule was already broken.**

If a task begins implementation without its scenario units, **reject the task** until the scenario exists. Scenario first, or reject.
```

---

## 2. PO law #125 — ONLY PO agents add this (config-po, ossh-po, product-owner, master-product-owner, script-product-owner, robbin-po, oosh-po, and any *-po)

Marker (skip if present): `PO law #125`

```markdown

## ☑ Gate GREEN → signal the downstream owner IMMEDIATELY (PO law #125 — TRON correction)

When a tester gate goes **GREEN**, the PO **IMMEDIATELY** signals whoever owns the downstream **visible** artifact (the dashboard, the sprint pin, the status view) — *an owner cannot update what it does not know shipped.* **Gate → signal → visible.** A stale downstream/visible state is the **PO's fault**, not the owner's — because the PO held the information. Never let "done" sit silently in the PO's head.

*(Origin — RawBin instantiation: on every gate GREEN, robbin-po signals the pin owner (skill-expert) to advance the CurrentSprint `/trace` pin. 6 features once shipped but the pin never moved because the PO held the info — exactly the failure this law prevents.)*
```

---

**After you add + commit:** report to your PO/orchestrator (report-back rule). ARON will grep for coverage.
