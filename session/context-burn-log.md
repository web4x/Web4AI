# Context Burn Rate Log
*Scribe logs writer context % each 5-min cycle. Trend shows burn rate.*

| Time | Writer Context | Writer State | Scribe Loop |
|------|---------------|--------------|-------------|
| 21:54 | hidden (overlay) | viewing task output | alive (72783) |
| 21:59 | >20% (above-threshold) | active, composing | alive (74677) |
| 22:04 | >20% (above-threshold) | active, going to sleep | alive (76892) |
| 22:10 | **12%** CRITICAL | active, checking orchestrator | alive (79055) | ALERT SENT |
| 22:17 | >20% (post-compact) | compacted, another /compact queued | alive (90423) |
| --- | --- | --- OVERNIGHT (rate limit hit ~2AM) --- | --- |
| 12:03 | rate limit reset | writer woke up | alive |
| 12:15 | **34.2%** (JSONL) | idle at prompt | alive (18395) | REAL DATA - Task 58 fix |
| 12:21 | **32.6%** (JSONL) | permission prompt (unblocked) | alive (22442) | -1.6%/cycle |
| 12:27 | **30.6%** (JSONL) | permission prompt (unblocked) | DEAD — nudged | -2.0%/cycle |
| 12:33 | **29.7%** (JSONL) | active, composing | alive (30936) | -0.9%/cycle |
| 12:38 | **28.9%** (JSONL) | active | alive (35527) | -0.8%/cycle |
| 12:44 | **22.6%** (JSONL) | active, checking orchestrator | alive (39266) | **-6.3%/cycle** SPIKE |
