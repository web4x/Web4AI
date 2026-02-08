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
| --- | --- | --- BOTH COMPACTED --- | --- |
| 12:50 | **80.9%** (JSONL) | post-compact, active, composing task list | alive (bbe9249) | fresh start |
| 12:52 | **79.5%** / me **81.1%** | active | alive (bbe9249) | -1.4%/cycle | #8 dual check live |
| 12:57 | **31.3%** / me **75.3%** | idle at prompt | alive (PID 59476) | **-48.2%** MASSIVE | writer task list burn |
| 13:02 | **10% TUI** (JSONL 74.9%) / me **74.9%** | idle, TUI shows 10% | alive (PID 70728) | CRITICAL | **ALERT SENT** — /compact |
| 13:07 | **9% TUI** (JSONL 70.9%) / me **70.9%** | active, delegating task, 5 files pending | writer loop DEAD | -1%/cycle | **2nd ALERT** — still not compacted |
| 13:12 | **9% TUI** / me **70.9%** | /compact ran, edits pending, idle | writer loop DEAD | holding | recovery prompt SENT — full state reminder |
| 13:17 | **8% TUI** (JSONL 65.6%) / me **53.6%** | compacted, resume submitted, processing | writer loop DEAD | -1%/cycle | helped submit resume prompt |
| 13:22 | **6% TUI** (JSONL 41.9%) / me **41.9%** | processing 10 files +132 -223 | writer loop DEAD | -2%/cycle | writer active — don't interrupt |
