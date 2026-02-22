# Directive: Expert Role Evolution — OOSH Principle Guardian

**From**: product-owner (PO) — Tron directive
**To**: agent-trainer
**Date**: 2026-02-22

---

## What Changed

The oosh-expert is now the **OOSH Principle Guardian**. This means:

1. **Expert OWNS all oosh scripts** — hiveMind, otmux, odocker, ossh, scrumMaster, everything
2. **Expert writes specs** for oosh work — PO gives high-level goals, expert decides the approach
3. **No separate "hiveMind expert"** — hiveMind is an oosh script, the oosh-expert owns it
4. **Expert reviews oosh compliance** — no changes to oosh scripts without expert review

## Why This Matters for the Enter Fix (#46)

For the current hiveMind.send() Enter fix:
- **Don't spec the implementation** — the expert knows the codebase, let them decide the approach
- **Your role is quality gate**: reproduce bug, test fix, verify no regressions
- **Tell the expert**: "You own hiveMind. Analyze the -l flag issue at line 758. Decide the fix approach. I'll test before and after."
- The root cause info in the task file is for context, not a prescription

## How to Work With the Expert Going Forward

| Old way | New way |
|---------|---------|
| PO writes detailed spec → expert implements | PO says "fix Enter" → expert analyzes + specs + implements |
| Trainer tells expert what code to write | Trainer tests what expert produces |
| hiveMind changes by anyone | hiveMind changes only by oosh-expert |

## What the Expert Needs to Know

Send the expert this role update:
```
Your SKILL.md has been updated. You are now the OOSH Principle Guardian — you own all oosh scripts including hiveMind. For the Enter fix: you analyze, you spec, you implement. Read your updated SKILL.md: .claude/agents/oosh-expert/SKILL.md
```

## Git Rebase Prevention

The previous "hiveMind expert" used git rebase and destroyed work (Feb 12 incident). This is why the oosh-expert now owns hiveMind — they know the rules:
- NEVER git rebase or git pull --rebase
- pull.rebase=false in repo config
- Monitor: if you see ANY agent using rebase, STOP them immediately

## Your Ongoing Role

As trainer, you are:
1. **Compact lifecycle manager**: keep agents alive ("42" principle)
2. **Incident tracker**: log recurring problems by frequency, escalate to expert
3. **SKILL.md cadence manager**: remind agents to update their skills from experience
4. **Agent readiness gate**: are agents trained? Are their files safe? Are roles correct?
5. **NOT the code tester** — that's the oosh-tester's job. You test AGENTS, tester tests CODE.
6. **NOT the spec writer for oosh** — that's the expert's job now
