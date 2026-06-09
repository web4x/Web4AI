---
name: dont-override-tron-directives-with-my-code-reading
description: "When an agent creates a task citing a Tron directive/quote, trust it — never override Tron's explicit bug-call with my own code interpretation"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

When a team agent creates a task, CHECK whether it cites a Tron directive/quote before
dismissing it as scope-creep — and NEVER override Tron's explicit statement with my own
reading of the code.

**Why:** req created a task for the editor back button (always navigates to /app instead of
the current file's directory). I read the code, saw `← App`→/app plus a separate `📂`→/md/,
ASSUMED that was intentional distinct nav, and parked it as an "untriaged UX opinion / out of
lane" — implying req was freelancing. The planner then surfaced that req's draft quoted Tron
literally: "the back button goes always to app and not to the directory of the current file.
that's a bug." Tron had already called it a bug. My code-reading assumption overrode the
product owner's explicit intent — exactly the ass-u-me failure I'm supposed to avoid.

**How to apply:**
1. Before dismissing an agent-created task as scope-creep, look for a cited Tron directive/
   quote. req (and others) receive Tron directives directly (same as the T83 self-click change).
2. Tron defines what is a bug for HIS product. My reading that "current behavior looks
   intentional" does NOT outrank his explicit "that's a bug." When they conflict, he wins.
3. The placement/numbering corrections I made were still valid (a bug doesn't belong in the
   traceability sprint; numbering must stay sequential) — separate the VALID consistency fix
   from the INVALID dismissal of the requirement itself.
4. If genuinely unsure whether a quote is real, confirm with Tron — don't unilaterally park it.

Pairs with the NEVER-ASSUME-ALWAYS-MEASURE rule and [[delegate-with-report-back]].
