# Task 27 — ScrumMaster Measurement Capabilities (CMM4 Foundation)

**Created**: 2026-02-03T13:15Z
**Status**: Steps 1-8 Done (commit 4ae6e56, 14/14 tests pass, 9/9 PDCA no regression) — Steps 9-10 pending (Trainer + Tester)
**Requested by**: Product Owner (via woda-writer — CMM4 initiative)
**Assigned to**: oosh-expert, agent-trainer, oosh-tester

## Original Directive (verbatim)

> New CMM4 measurement tasks: scrumMaster needs measurement capabilities. Add methods to measure context consumption, token usage speed, subscription consumption. The scrumMaster should be able to scan agent panes and extract metrics from capture-pane output (token counts like up-arrow 7.9k tokens, timing like Seasoned for 33s, activity states). Store measurements in files like PDCA counter persistence. This is the CMM4 foundation - no measuring, no improving.

## Problem

ScrumMaster currently monitors agents qualitatively (active/idle/stuck) but has no quantitative measurement. CMM4 requires metrics: token consumption, timing, activity state extraction. Without measuring, there's no data to drive improvement.

## OOSH Interface Requirement (URGENT — added by PO)

> The raw bash for getting measurements is ugly. Example: tmux capture-pane -t cursorOrchestrator:0.4 -p -S -50 2>/dev/null pipe grep -E tokens. This MUST become OOSH methods. scrumMaster measure.pane should be Tab-completable with pane targets from hiveMind registry. scrumMaster measure.team should accept session names via completion. All measurement commands must follow OOSH conventions: no flags, method names as self-documenting, completions for every parameter. The ugly bash regex parsing should be private methods. The public interface should be clean OOSH.

**Rules:**
- All regex/bash parsing logic → `private.` methods (not visible in completion)
- Public methods → clean `object.verb` notation, self-documenting names
- Tab completion for every parameter:
  - `scrumMaster.measure.pane` → completes with agent names from hiveMind registry
  - `scrumMaster.measure.team` → completes with session names
- No raw tmux commands, no flags in the public API
- Follow OOSH conventions established in Task.25

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-expert | Implement private parsing methods: `private.parse.tokens`, `private.parse.timing`, `private.parse.state` — all regex/bash ugliness hidden here |
| 2 | oosh-expert | Implement `scrumMaster.measure.pane <agent-name>` — clean public method, resolves agent via hiveMind registry, returns metrics |
| 3 | oosh-expert | Implement `scrumMaster.measure.team <session-name>` — measures all agents in a session |
| 4 | oosh-expert | Implement `scrumMaster.measure.context` — context/token consumption per agent |
| 5 | oosh-expert | Implement `scrumMaster.measure.speed` — token usage rate (tokens/time) |
| 6 | oosh-expert | Implement `scrumMaster.measure.subscription` — cumulative subscription tracking |
| 7 | oosh-expert | Add Tab completion functions: `scrumMaster.measure.pane.completion.parameter` (agent names), `scrumMaster.measure.team.completion.parameter` (session names) |
| 8 | oosh-expert | Implement measurement persistence — store to `session/metrics/`, PDCA counter pattern |
| 9 | agent-trainer | Update scrumMaster SKILL.md with measurement methods and metric definitions |
| 10 | oosh-tester | Validate: metric extraction, Tab completion for all parameters, no raw tmux in public API, persistence files written |

## Public API (clean OOSH)

```bash
./scrumMaster measure.pane oosh-expert       # Metrics for one agent (Tab-completable)
./scrumMaster measure.team cursorOrchestrator # Metrics for all agents in session (Tab-completable)
./scrumMaster measure.context oosh-expert     # Context consumption for agent
./scrumMaster measure.speed oosh-expert       # Token rate for agent
./scrumMaster measure.subscription            # Overall subscription usage
```

## Private Methods (hidden from completion)

```bash
private.parse.tokens()    # Extract ↓/↑ token counts from pane output
private.parse.timing()    # Extract think time, activity duration
private.parse.state()     # Detect activity state (working/thinking/idle)
private.resolve.pane()    # Resolve agent name → pane via hiveMind registry
```

## Metrics to Extract (from capture-pane output)

| Metric | Source Pattern | Example |
|--------|---------------|---------|
| Token count (input) | `↓ 7.9k tokens` | 7900 |
| Token count (output) | `↑ 20.3k tokens` | 20300 |
| Think time | `thought for 33s` | 33s |
| Activity duration | `Seasoned… (4m 9s` | 249s |
| Activity state | `Kneading…`, `Ideating…`, idle prompt | kneading/ideating/idle |

## Persistence Pattern

- Store metrics per agent per session in `session/metrics/`
- Follow PDCA counter pattern (append, don't overwrite)
- Enable trend analysis over time

## Acceptance Criteria

- [ ] All regex/bash parsing in `private.` methods only
- [ ] Public methods use clean object.verb notation
- [ ] `scrumMaster.measure.pane` Tab-completes with agent names from hiveMind registry
- [ ] `scrumMaster.measure.team` Tab-completes with session names
- [ ] No raw tmux commands or flags in public API
- [ ] Metrics extracted correctly from real capture-pane output
- [ ] Token counts (input/output) parsed and stored
- [ ] Timing data (think time, activity duration) parsed and stored
- [ ] Activity state detected (working/thinking/idle)
- [ ] Metrics persisted to files in session/metrics/
- [ ] ScrumMaster SKILL.md updated with measurement methods
- [ ] Tests validate extraction, completion, and persistence
