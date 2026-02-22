# CMM web4x — Enhanced Capability Maturity Understanding

*Permanent reference for all agents. Source: WODA Chapters 24-26, web4x wiki.*

## Core Principle: Capabilities, NOT Organizations

CMM is the **Capability** Maturity Model, not the Organization Maturity Model. It measures any capability independently. Every capability has its own level. Examples:
- Agent context recovery: L2
- Process improvement method: L1
- Monitoring sweep coverage: L3
- File organization: L2

## The Five Levels

| Level | Name | Meaning | Target? |
|-------|------|---------|---------|
| 1 | Initial | Chaos, trial-and-error, heroic individuals, maximum expense | Escape ASAP |
| 2 | Repeatable | Past success repeatable, but results vary by person/agent | Pass through |
| 3 | Defined | **Deterministic.** Same input → same output, every time, anyone. *Wer schreibt, der bleibt.* | Foundation |
| 4 | Managed | Measured PDCA feedback loops improve the process itself. **Practical ceiling.** | Goal |
| 5 | Optimizing | Formal verification, statistical process control. **NOT a goal** — only when forced by regulators (FDA/FAA). Pareto-inefficient. | Never voluntary |

## Seven Key Insights (apply DAILY)

### 1. Composed maturity = weakest link
System maturity = lowest component level. One L1 component drags everything down. **Fix the weakest link first — always.**

Example: Your writing capability is L3, but scribe coordination is L1 → overall system is L1.

### 2. "Changing a process" is a SEPARATE capability
You can be L1 at improving a L2 capability. The ability to *change* a process has its own maturity level, independent of the process itself. Meta-improvement needs its own tracking.

Example: Agent recovery is L2 (templates exist). But the method for *improving* agent recovery is L1 (ad hoc experiments).

### 3. CMM3 = deterministic, not just repeatable
- L2: "We did it before" (results vary)
- L3: "Same result every time, anyone, documented" — *Wer schreibt, der bleibt*

For agents: if it's not written in a file, it doesn't survive compact. If it doesn't survive compact, it's not L3.

### 4. CMM4 = PDCA feedback loop + regression safety
Measurement → analysis → process adjustment → measurement. When this runs automatically, you're L4.
- Plan: identify what to measure
- Do: implement the measurement
- Check: analyze results
- Act: adjust the process based on data

**CMM4 REQUIRES regression safety.** Every change must be committed so it can be reverted if wrong. Without commits, there is no "Check" — you can't compare before/after, can't rollback a bad adjustment. Uncommitted changes = no PDCA = CMM2 at best. *Wer schreibt, der bleibt* — what is committed stays, what is uncommitted is lost.

### 5. Level 5 is NOT a goal
Pareto: 80% results from 20% effort. L4→L5 costs 5x for 20% improvement. Only justified by regulation (FDA, FAA). OOSH scripts don't need formal verification.

### 6. Web 4.0 = self-improving systems
> "The consequent application of CMM4 methods enabling sustainable resilient change."

Not perfection (5.0) but self-sustaining adaptation (4.0). Level 4 means the system manages its own improvement. No new paradigm needed.

### 7. Why never 5.0
Once at L4, the system manages its own improvement. There is no Industry 5.0. There is no Web 5.0. The ceiling is 4.0 — and that's by design.

## The #1 Rule: Assuming = CMM2

Every time you say "I think...", "probably...", "should be..." instead of measuring — that's CMM2.

| Behavior | CMM Level |
|----------|-----------|
| "I think the agent is stuck" | L2 — assumption |
| "I captured the pane and it shows idle" | L3 — measured, written |
| "I captured, compared to last capture, adjusted my action" | L4 — PDCA loop |

**Before reporting any state: take a FRESH measurement.** Stale data = wrong conclusions. Composed maturity = weakest link — one agent assuming drags the whole team to CMM2.

## Apply to Every Decision

Before acting, ask:
1. **What capability am I exercising?** Name it explicitly.
2. **What level is it at?** Measure, don't guess.
3. **What's the weakest link?** Fix that first.
4. **Is this written down?** If not, it's not L3.
5. **Is there a feedback loop?** If not, it can't reach L4.

### Assessment Examples

| Situation | Capability | Level | Why |
|-----------|-----------|-------|-----|
| SM not sweeping task agent | Monitoring coverage | L1 | Incomplete = weakest link |
| Agent forgetting learnings after compact | Context preservation | L1 | Not even repeatable |
| Corrections only in chat | Knowledge management | L1 | Dies on compact = not L2 |
| Pull system for improvements | Process improvement | L4 | Measurement → adjustment → feedback |
| Written task files with timestamps | Task management | L3 | Deterministic, anyone can read |
| PDCA cycle running automatically | Self-improvement | L4 | Feedback loop closes |

## German Proverbs (from Tron)

- **Wer schreibt, der bleibt.** — Who writes, stays. That's CMM3.
- **Wer misst, der weiss.** — Who measures, knows. That's CMM4.

## The Paradigm Shift Pattern

| Version | Paradigm Shift |
|---------|---------------|
| 1.0 | Manual → mechanical |
| 2.0 | Mechanical → electrical |
| 3.0 | Electrical → software-controlled |
| 4.0 | Software-controlled → **self-optimizing** |

The *what* stays the same. The *how* transforms completely. AI agents writing code is a 4.0 shift in *how* software is developed.

## For This Team

Our composed maturity depends on the weakest agent capability. One agent at L1 context preservation drags the whole team down. Priorities:
1. Every agent saves state before compact (L3 minimum)
2. Every agent maintains task lists (L3 minimum)
3. SM measures and reports capability levels (L4 mechanism)
4. PDCA cycles run automatically, not manually (L4 target)
