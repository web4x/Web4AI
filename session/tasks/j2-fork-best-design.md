# J2 Design: agent.fork.best Selection Algorithm

## The Problem

"Most recent" is WRONG for selecting the best fork candidate. Real data from 5 scrum-master sessions:

| UUID | JSONL Size | Lines | Tool Calls | Last Active | Verdict |
|------|-----------|-------|------------|-------------|---------|
| c3c63424 | 10.5 MB | 9714 | 3441 | 12:24 | **BEST — fully trained** |
| 969048a7 | 4.9 MB | 2371 | 804 | 12:34 | fallback fork (inherited) |
| 684cd792 | 4.9 MB | 2357 | 804 | 12:30 | fallback fork (old) |
| 68d6424c | 78 KB | 66 | 21 | 12:27 | broken recovery attempt |
| 1c1d2925 | 15 KB | 19 | 0 | 12:33 | broken recovery attempt |

Sorting by recency picks `1c1d2925` (15 KB, 0 tools, 19 lines) — the worst candidate. The actual best is `c3c63424` (10.5 MB, 3441 tools, 9714 lines) — the oldest dead one.

## Quality Signals (ranked by reliability)

### 1. JSONL File Size (PRIMARY — most reliable)
- **>1 MB** = trained agent with real work history
- **100 KB – 1 MB** = partially trained or short session
- **<100 KB** = failed recovery attempt or fresh boot
- Rationale: a trained SM that swept for hours accumulates MB of JSONL. A /clear + reboot produces KB.

### 2. Tool Call Count (SECONDARY — confirms quality)
- **>100 tool_calls** = agent was actively working
- **10-100** = minimal activity
- **<10** = boot attempt that never got going
- Extracted: `grep -c '"tool_use"' <jsonl>`

### 3. Line Count (TERTIARY — correlates with size)
- **>1000 lines** = extended session
- **<100 lines** = aborted attempt

### 4. Session Duration (DERIVED)
- First timestamp to last timestamp in JSONL
- Short duration (<5 min) with small JSONL = failed recovery
- Long duration (>1 hr) with large JSONL = real work

### 5. Title Pattern (TIEBREAKER)
- `fallback-*` prefix = fork from fallback-agents, not original trained session
- Bare role name = original or direct fork from trained session
- Prefer bare over fallback when quality scores are equal

## Decision Tree

```
agent.fork.best <role> <targetPane>
  │
  ├─ 1. roles.list.uuids <role> → get all candidates
  │
  ├─ 2. For each candidate, compute quality score:
  │     score = jsonl_size_bytes
  │     (file size is the simplest, most reliable discriminator)
  │
  ├─ 3. Filter: exclude candidates with score < 50000 (50 KB)
  │     (these are definitively broken attempts)
  │
  ├─ 4. Sort remaining by score DESC (largest JSONL first)
  │
  ├─ 5. Tiebreaker (same score ±10%):
  │     prefer bare role name over fallback-* prefix
  │     prefer more recent over older
  │
  ├─ 6. Pick top candidate
  │
  ├─ 7. Fork into targetPane:
  │     otmux send.enter <targetPane> "claudeCode fork <uuid>"
  │
  ├─ 8. Wait for startup (sleep 8)
  │
  ├─ 9. Send boot file if exists:
  │     session/agents/<role>/boot.md
  │
  └─ 10. Update registry:
        hiveMind registry.set <targetPane> <role>
```

## Fallback Heuristics

If NO candidate passes the 50 KB filter:
- Warn: "No trained session found for <role>. All candidates are small (<50 KB)."
- Fall back to most recent anyway (at least it's a session)
- Suggest: "Consider bootstrapping fresh: hiveMind agent.bootstrap <role>"

If ONLY fallback-* candidates exist:
- Use them — they're forks from when the agent was healthy
- Warn: "Using fallback fork — may have stale context"

## Output Format

```
agent.fork.best scrum-master TRONinterface:0.1

Candidates for scrum-master (5 found):
  BEST → c3c63424  10.5 MB  3441 tools  scrum-master          May 01 12:24
         969048a7   4.9 MB   804 tools  fallback-scrum-master  May 01 12:34
         684cd792   4.9 MB   804 tools  fallback-scrum-master  Apr 27 12:30
  SKIP → 68d6424c    78 KB    21 tools  scrum-master          May 01 12:27
  SKIP → 1c1d2925    15 KB     0 tools  scrum-master          May 01 12:33

Forking c3c63424 into TRONinterface:0.1...
Boot file sent: session/agents/scrum-master/boot.md
Registry updated: TRONinterface:0.1 → scrum-master
```

## Implementation Notes

- JSONL size: `wc -c < <file>` — zero parsing needed, instant
- Tool count: `grep -c '"tool_use"' <file>` — one grep, fast even on 10 MB
- The 50 KB threshold is conservative — even a basic boot + 1 sweep produces >100 KB
- Do NOT parse JSONL line by line for timestamps — too slow for 10 MB files. Use `stat -f %m` for mtime (already available from roles.list.uuids)

## What This Does NOT Solve

- **Annotation/tagging**: Users can't mark sessions as "good" or "bad". Future: `claudeCode session.tag <uuid> <label>`
- **Cross-machine recovery**: JONSLs on remote machines need `team.pull` first
- **Autocompacted sessions**: A session that autocompacted has a NEW UUID — the old large JSONL is orphaned. The new one is small. Needs chain-following logic (future Epic).
