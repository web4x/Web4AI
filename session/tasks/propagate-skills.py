#!/usr/bin/env python3
# ============================================================
# ⚠️ SUPERSEDED (2026-07-02) — DO NOT RUN.
# TRON handed the fix to ARON: the rules are woven per-role + deduped as
# careful consolidation-to-essence, NOT bulk-injected (bulk = the F29 mess).
# Canonical approach: .claude/agents/ARON/skills/agent-consolidation-and-rewind.md
# Kept for history (wer schreibt, der bleibt), not for execution.
# ============================================================
"""Runnable by TRON (settings-level auth) to apply two authorized SKILL.md propagations.
The auto-mode self-mod guard blocks agents from mass-editing behavior-config on a relayed
"TRON said so"; running THIS script as the actual user establishes real user intent.

    python3 session/tasks/propagate-skills.py

Idempotent (marker-guarded), byte-faithful blocks embedded inline, inserted after the YAML
frontmatter. Prints counts per propagation. Then the trainer verifies + commits + reports.

Host-portable: repo root derived from this file's location (works on WODA.prod or MacStudio)."""
import os, glob

HERE = os.path.dirname(os.path.abspath(__file__))
AGENTS = os.path.normpath(os.path.join(HERE, "..", "..", ".claude", "agents"))

# --- Propagation 1: SCENARIO FIRST -> ALL agent SKILL.md (TRON law #100, via ARON) ---
SCENARIO_MARKER = "SCENARIO FIRST — scenario units on disk BEFORE implementation"
SCENARIO_BLOCK = """
## ☑ SCENARIO FIRST — scenario units on disk BEFORE implementation (TRON law #100)

Scenario units are written **on disk BEFORE any implementation**. The Markdown is a **generated VIEW** of the scenarios — never hand-authored ahead of them. **A backfill (scenarios written after the code) means the rule was already broken.**

If a task begins implementation without its scenario units, **reject the task** until the scenario exists. Scenario first, or reject.
"""

# --- Propagation 2: PO law #125 -> the 6 PO SKILL.md (via robbin-po) ---
PO125_MARKER = "PO law #125"
PO125_ROLES = ["config-po", "master-product-owner", "ossh-po", "product-owner", "robbin-po", "script-product-owner"]
PO125_BLOCK = """
## ☑ Gate GREEN → signal the downstream owner IMMEDIATELY (PO law #125 — TRON correction)

When a tester gate goes **GREEN**, the PO **IMMEDIATELY** signals whoever owns the downstream **visible** artifact (the dashboard, the sprint pin, the status view) — *an owner cannot update what it does not know shipped.* **Gate → signal → visible.** A stale downstream/visible state is the **PO's fault**, not the owner's — because the PO held the information. Never let "done" sit silently in the PO's head.

*(Origin — RawBin instantiation: on every gate GREEN, robbin-po signals the pin owner (skill-expert) to advance the CurrentSprint `/trace` pin. 6 features once shipped but the pin never moved because the PO held the info — exactly the failure this law prevents.)*
"""

def insert_after_frontmatter(text, block):
    lines = text.split("\n")
    at = None
    if lines and lines[0].strip() == "---":
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                at = i + 1; break
    if at is None:
        for i, ln in enumerate(lines):
            if ln.lstrip().startswith("#"):
                at = i + 1; break
    if at is None:
        return None
    b = block.rstrip("\n") + "\n"
    return "\n".join(lines[:at] + b.split("\n") + lines[at:])

def propagate(paths, marker, block, label):
    total = len(paths); ins = skip = fail = 0; fails = []
    for p in paths:
        with open(p, encoding="utf-8") as f: t = f.read()
        if marker in t: skip += 1; continue
        nt = insert_after_frontmatter(t, block)
        if nt is None: fail += 1; fails.append(p); continue
        with open(p, "w", encoding="utf-8") as f: f.write(nt)
        ins += 1
    after = sum(1 for p in paths if marker in open(p, encoding="utf-8").read())
    print(f"[{label}] total={total} inserted={ins} skipped={skip} failures={fail} contain_after={after}")
    for x in fails: print("  FAIL: " + x)

all_skills = sorted(glob.glob(os.path.join(AGENTS, "**", "SKILL.md"), recursive=True))
po_skills = [os.path.join(AGENTS, r, "SKILL.md") for r in PO125_ROLES if os.path.isfile(os.path.join(AGENTS, r, "SKILL.md"))]

propagate(all_skills, SCENARIO_MARKER, SCENARIO_BLOCK, "SCENARIO-FIRST (all)")
propagate(po_skills, PO125_MARKER, PO125_BLOCK, "PO-LAW-125 (POs)")
print("Done. Trainer will now verify (git numstat, byte-diff), commit, and report coverage.")
