# PO Governance Review: Agent Overview & Role Clarifications

**From**: Product Owner
**To**: Agent Trainer
**Date**: 2026-02-11
**Priority**: High — role definitions must be accurate before team operates

---

## 1. CRITICAL: "agent-teacher" vs "orchestrator" naming inconsistency

The orchestrator's SKILL.md lives at `.claude/agents/agent-teacher/SKILL.md`.
The overview says `Orchestrator (agent-teacher/)`.

This is the EXACT same naming inconsistency documented in Ch23 of the WODA story (`send.enter` vs `sendEnter`). The directory name doesn't match the role name. An agent recovering after compaction that reads `agent-teacher/SKILL.md` may confuse itself — am I the orchestrator or the teacher?

**Action**: Either rename the directory to `orchestrator/` OR add a clear note at the top of the SKILL.md: "Directory: agent-teacher/ — Role: Orchestrator". The agent-overview.md should use one consistent name.

## 2. Product Owner role is under-specified in the overview

Current overview entry (4 lines):

```
Product Owner (product-owner/)
├── Define & enforce first principles
├── Audit scripts against usability contract
├── Block non-compliant changes
└── Never implement or test
```

This misses critical PO functions documented in the actual SKILL.md:

- **Govern expert+tester ownership model** — the PO ensures every script has an owner pair
- **Review changes for architectural regression** — not code review, process review
- **Report in structured Governance Review format** — the PO has a defined output format
- **Bridge between sessions** — the PO can audit across cursorOrchestrator AND claudeWoda
- **Quality gate for documentation** — as demonstrated by the WODA story review task

**Proposed update:**

```
Product Owner (product-owner/)
├── Define & enforce first principles (5: self-explaining, portable, modular, transparent, extensible)
├── Audit scripts against 8-point usability contract
├── Govern expert+tester ownership model — every script has an owner pair
├── Block non-compliant changes, report in Governance Review format
├── Quality gate for documentation and story accuracy
└── Never implement, test, or review individual code lines
```

## 3. Communication chain has a contradiction

The orchestrator's SKILL.md says:
```
User → Product Owner (quality gate) → Orchestrator → ScrumMaster → Expert / Tester
```

The PO's SKILL.md says:
```
Receive audit requests from: Orchestrator
Report compliance status to: Orchestrator
```

So the PO is both ABOVE the orchestrator (as quality gate from user) and BELOW (receiving work from orchestrator). This is actually correct — the PO has two modes:

1. **Quality gate mode**: User → PO → Orchestrator (PO validates direction before orchestrator executes)
2. **Audit mode**: Orchestrator → PO (orchestrator requests a governance audit, PO reports back)

This dual relationship should be documented explicitly in both SKILL.md files and the overview.

## 4. PO relationship to WODA session is undefined

My SKILL.md mentions only cursorOrchestrator concepts (scripts, test.suite, c2 completions). But I was just assigned to review the WODA story — a claudeWoda artifact. My role should explicitly cover:

- Cross-session governance authority (PO audits across ALL sessions)
- Documentation quality assessment (not just script compliance)
- Story/narrative accuracy review (does documentation match reality?)

**Action**: Add to PO's SKILL.md under "Role Boundaries — DO":
```
- Audit across all sessions (cursorOrchestrator, claudeWoda, etc.)
- Review documentation and story accuracy against first principles
```

## 5. Overview missing the WODA duo's relationship to the main team

The overview lists woda-writer and woda-scribe as separate entries with their own protocols. But their relationship to the PO, orchestrator, and expert is unclear:

- When the writer delegates bugs, who receives them? (Answer: orchestrator, but overview doesn't show this)
- When the writer finds OOSH issues (Ch28 rate-limit cascade), does the PO get informed? (Should yes, currently no)
- When the scribe implements improvements, who validates against usability contract? (Should be PO, currently nobody)

**Proposed addition to overview — a cross-session section:**

```
Cross-Session Relationships
├── woda-writer delegates bugs → Orchestrator (cursorOrchestrator)
├── woda-scribe improvements → validated by PO against usability contract
├── PO audits → both cursorOrchestrator AND claudeWoda artifacts
└── Orchestrator passes PO directives → both sessions
```

## 6. "Script Product Owner" role clarity

The `script-product-owner/SKILL.md` is described as a template, not a separate agent role. But it appears in the agent directory listing as if it were an agent. The overview doesn't list it at all.

**Action**: Either add it to the overview with a note "(template — not a standalone agent)" or remove it from the directory listing discussion in the trainer's SKILL.md.

## 7. Missing from ALL AGENTS section

The "ALL AGENTS" section in the overview is good. One addition needed:

```
├── Role boundaries: DO NOT do another role's work (Ch28, Ch39 lessons)
```

This was the #1 failure pattern in the WODA story — agents doing each other's jobs. It should be in the universal rules.

---

## Summary of Actions for Agent Trainer

| # | Action | Files Affected |
|---|--------|---------------|
| 1 | Fix agent-teacher/orchestrator naming inconsistency | agent-teacher/SKILL.md, agent-overview.md |
| 2 | Expand PO entry in overview to 6 lines | agent-overview.md |
| 3 | Document PO dual communication mode | product-owner/SKILL.md, agent-teacher/SKILL.md |
| 4 | Add cross-session authority to PO | product-owner/SKILL.md |
| 5 | Add cross-session relationships section to overview | agent-overview.md |
| 6 | Clarify script-product-owner as template | agent-overview.md or agent-trainer/SKILL.md |
| 7 | Add "no role violation" to ALL AGENTS | agent-overview.md |

---

**PO Governance Note**: These findings are process-level, not code-level. I am not requesting implementation changes. I am requesting that the role definitions accurately reflect how the team actually operates. The WODA story (39 chapters) documents extensive evidence of role confusion (Ch28: writer writing code, Ch39: writer doing scribe's job). Accurate role definitions are the CMM3 fix.
