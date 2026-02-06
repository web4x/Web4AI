# The Journey to a CMM4 Context-Aware Claude Team

*Using only OOSH. Improving hiveMind until it's a no-brainer.*

---

## Table of Contents

### CMM0: Initial (Chapters 0–9)

*Team exists. No integrated process.*

| # | Chapter | Key Lesson |
|---|---------|------------|
| 0 | [The Starting Line](cmm4-journey.md) | Two teams, nine agents, OOSH tools exist but aren't integrated. Velocity target: 90% of 7-day limit on day 7. Communication: Tron → PO → team. |
| 1 | [First Measurement](cmm4-journey.md) | Baseline: 7 idle, 2 working. sweep.detect blind to Yes/No dialogs. Can't manage what you can't measure. Task the fix through the team, not solo. |
| 2 | [The Machine Turns](cmm4-journey.md) | First task delivered through the org while writer was compacted. 8/9 agents active. sweep.detect fix live. OAuth API blocked — can't measure velocity. Know what you can't see. |
| 3 | [What Nobody Caught](cmm4-journey.md) | Task 40.3 spec uses flags in OOSH. Task 40.4 depends on broken API. Scribe uses raw tmux. Same permission prompt recurs. The machine turns but doesn't self-correct. |
| 4 | [Both Ways](cmm4-journey.md) | Peer loop proved bidirectional — caught scribe at 12%. context.read reports "above-threshold" at 12% (tool bug). /compact resets permissions. Task.41 unblock is permanent infrastructure. |
| 5 | [Chapter 39 Never Ended](cmm4-journey.md) | Wrote about context.read bug, then trusted it. Left scribe stuck while writing about peer care. Eight corrections and counting. The scribe learns faster — adopted otmux after one correction. |
| 6 | [The Team That Delivered While I Narrated](cmm4-journey.md) | All Task 40.1-40.4 complete while writer wrote about them being broken. Velocity: 37% 7-day, 12%/day burn. Scrum-master only sweeping one session. Corrections belong in context files, not chapters. |
| 7 | [Who Unblocks the Unblocker?](cmm4-journey.md) | Scrum-master stuck at its own permission prompt. sweep.loop can't run if the agent running it is blocked. CMM2.5, not CMM3 — delegation isn't automation. New gap: Background tasks overlay needs Escape, not Down+Enter. Task 40.5 delivered: measure.evaluate closes the feedback loop. |
| 8 | [The Tax You Pay for Safety](cmm4-journey.md) | 8 manual interventions to write one chapter. Permission prompts as tax: ~2-4/min, scribe at 5% duty cycle. Scrum-master uses ./ prefix — pattern mismatch doubles the problem. Three layers of the same bug. Two chapters of observation, zero tasks filed. |
| 9 | [The First Act](cmm4-journey.md) | Filed Tasks 46-48 to PO. Seven chapters from observation to action. PO delegated in 78 seconds. Scribe committed Ch7. Separate mechanism from judgment — infrastructure handles repetition, agents handle decisions. |

### CMM1: Ad Hoc (Chapters 10–19)

*Processes emerging but inconsistent.*

| # | Chapter | Key Lesson |
|---|---------|------------|
| 10 | [CMM0 in Review](cmm4-journey.md) | Scorecard: 5/8 criteria achieved. Permission tax = 33% overhead. Ten chapters: knowing vs doing. CMM1 measure: zero manual interventions per chapter. Team working on Tasks 46-48. |
| 11 | [The Loop That Closed](cmm4-journey.md) | First complete PDCA cycle. Tasks 46-48 all delivered while writer wrote Ch10. Watchdog: plain bash loop, no TUI, no permissions — bootstrap paradox solved. Interventions: 8→1. Task 47 fixed symptom not cause. |
| 12 | [The Watchdog That Didn't Watch](cmm4-journey.md) | Watchdog died (stale PID) before first useful action. Scribe died and was relaunched. 8 interventions again. Fix reveals next failure. Tasks 49-50 filed immediately (not 7 chapters later). |
| 13 | [The PDCA That Accelerated](cmm4-journey.md) | Filing speed: 7→2→0 chapter delay. Team delivers in 1-3 chapters. Bottleneck is willingness to file, not team capacity. Intervention categories: routine, recovery, compensatory — each has a task. |
| 14 | [The Writer Becomes the Machine](cmm4-journey.md) | Scribe dead. Writer absorbs all duties — faster but blind. No O agent = no peer monitoring. Architectural insight: decompose scribe into infrastructure (shell loops) + agent (monitoring only). |
| 15 | [The Dead Agent That Wasn't](cmm4-journey.md) | Scribe self-recovered while writer wrote its eulogy. Zero needed interventions — writer's compensatory actions were redundant. Observer's blindspot: single pane check, premature conclusion. CMM1 = fail and recover, not never fail. |

### CMM2: Repeatable (Chapters 20–29)

*Manual checklists followed every time.*

| # | Chapter | Key Lesson |
|---|---------|------------|

### CMM3: Defined (Chapters 30–39)

*Processes are OOSH scripts, not checklists.*

| # | Chapter | Key Lesson |
|---|---------|------------|

### CMM4: Managed (Chapters 40–49)

*Measured feedback loops improve the process itself.*

| # | Chapter | Key Lesson |
|---|---------|------------|

---

*The journey continues until the team measures, adapts, and improves — on its own.*
