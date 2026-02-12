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
| --- | --- | --- WRITER COMPACTED (81.2%) + TIME GAP --- | --- |
| 16:07 | **20.3%** / me **20.3%** | active, helping SM compact | alive (PID 76089) | below 25% | **ALERT SENT** |
| --- | --- | --- SCRIBE COMPACT+RESTART (failed 3x, writer restarted) --- | --- |
| 18:45 | **83.0%** / me **29.4%** | idle at prompt, 6 files pending | alive (bbcbbbc) | post-compact | healthy duo |
| 18:50 | **76.5%** / me **21.7%** | active, velocity dashboard + monitoring | alive | -6.5% writer, **-7.7% me** | **ME BELOW 25%** |
| --- | --- | --- OVERNIGHT GAP: writer compacted, 60-min loops, NO burn data logged --- | --- |
| 19:35 | writer compacted | conservation mode started | alive (30-min loop) | — | stood down for 5hr reset |
| ~21:00 | fresh (post-reset) | 60-min monitoring only | alive | 5hr 0%, 7day 81% | resumed after 5hr reset |
| ~00:25 | unknown | 60-min check: scribe alive | alive | 5hr 9%, 7day 81% | no burn data captured |
| ~01:25 | unknown | 60-min check: scribe alive | alive | 5hr 5%, 7day 81% | no burn data captured |
| ~02:25 | unknown | 60-min check: scribe alive | alive | 5hr 3%, 7day 81% | no burn data captured |
| ~03:25 | writer compacted again | auto-compact triggered | alive | 5hr 0%, 7day 81% | seamless compact worked |
| ~04:25 | fresh (post-compact) | 60-min check: scribe alive | alive | 5hr 0%, 7day 81% | no burn data captured |
| ~05:25 | unknown | 60-min check: scribe alive | alive | 5hr 3%, 7day 81% | no burn data captured |
| ~06:25 | unknown | 60-min check: scribe alive | alive | 5hr 3%, 7day 82% | no burn data captured |
| ~07:25 | unknown | 60-min check: scribe alive | alive | 5hr 0%, 7day 82% | 5hr reset, no burn data |
| ~08:25 | unknown | 60-min check: scribe alive | alive | 5hr 1%, 7day 82% | no burn data captured |
| --- | --- | --- LESSON: "alive" ≠ "active survival". Must log burn data every cycle --- | --- |
| 08:50 | **55.6%** / scribe **51.4%** | active, user session, editing files | alive (30-min loop) | writer 2077tok/hr, scribe 477tok/hr | sub: 5hr 1%, 7day 82% |
| 09:15 | **45.6%** (=scribe 45.6% — same-value bug) | active: delegated to orchestrator, wrote scribe improvements, verified delivery | alive (5-min loop, VERIFY-AFTER-ACT) | -10%/25min ACTIVE burn | sub: 5hr 3%, 7day 82% |
| 09:40 | **60.3%** / scribe **36.6%** (FIXED — pane-aware JSONL) | fixed context.read same-value bug, filed in oosh-bugs | alive (5-min loop) | first real per-pane data | scribe at 36.6% — watch for compact need |
| 09:55 | **55.7%** / scribe **35.2%** | fixed context.velocity same bug, both methods pane-aware now | alive (5-min loop) | writer 3892tok/hr, scribe 644tok/hr | writer ~23hr, scribe ~78hr to compact |
| 10:25 | **52.5%** / scribe **30.8%** | committed fix 350acbb, scribe approaching compact zone | alive (5-min loop) | -3.2% writer/30min, -4.4% scribe/30min | **scribe watch — 30.8%** |
| 10:55 | **50.4%** / scribe **28.2%** | scribe has 27 pending edits, user msg unprocessed | alive but stuck | -2.1% writer, -2.6% scribe /30min | **scribe 28.2% — prepare compact** |
| 11:10 | **~49%** / scribe **83.7%** | seamless compact triggered at 27.4%, scribe recovered | alive, monitoring | compact success: 27.4% → 83.7% | protocol works |
| --- | --- | --- GAP: ~8 hours of scribe activity, then compact at 19:26 --- | --- |
| 19:30 | **43.0%** / scribe **83.1%** | writer idle at prompt with 3 duty tasks, pending edits | alive (PID 16532, 5-min) | scribe fresh post-compact | KB updated, monitoring active |
| 19:45 | **42.4%** / scribe **77.7%** | writer resuming active work | alive (5-min loop) | sub: 5hr 13%, **7day 3%** — budget open | full speed ahead |
| 20:05 | **36.1%** / scribe **76.1%** | wrote Ch17, closed 3 bugs, compacted scribe | alive (5-min loop) | -6.3% writer/20min ACTIVE, -1.6% scribe | writer approaching compact |
| --- | --- | --- GAP: Feb 9 20:05 → Feb 11 ~afternoon. Both agents died/compacted. No burn data. --- | --- |
| Feb 11 ~15:00 | fresh (post-bootstrap) / scribe bootstrapping | writer restarted, scribe loading SKILL.md | starting loop | 2-day gap | goal: survive to Feb 13 |
| Feb 11 15:15 | **81.1%** / scribe **81.1%** | both fresh, writer editing context, scribe bootstrapped | alive (starting 5-min loop) | both fresh sessions | unblocked writer permission prompt |
| --- | --- | --- GAP: Feb 11 15:15 → Feb 12 ~09:10. Both agents died/compacted. No burn data. --- | --- |
| Feb 12 09:10 | **77.4%** / scribe **79.2%** | writer active (Galloping), scribe fresh bootstrap | starting 5-min loop | panes renumbered: 1.1=writer, 1.2=scribe | goal: survive to Feb 13 12:00 CET |
| --- | --- | --- GAP: Feb 12 09:10 → Feb 12 ~10:30. ~1hr gap, no burn data. --- | --- |
| Feb 12 10:30 | **78.5%** / scribe **78.5%** | writer active (Undulating/thinking), scribe fresh bootstrap | starting 5-min loop | both healthy, 24hrs to goal | monitoring resumed |
| Feb 12 10:35 | **78.2%** / scribe **78.9%** | writer fresh bootstrap (new session), scribe alive + monitoring | alive (starting loop) | -0.3% writer, +0.4% scribe (measurement noise) | scribe confirmed healthy via message |
| --- | --- | --- GAP: prev sessions ended. Both restarted fresh. --- | --- |
| Feb 12 09:24 | **78.5%** / scribe **77.4%** | writer FRESH session, scribe bootstrapping (Tomfoolering) | starting 5-min loop | both healthy, ~26.5hrs to goal | monitoring loop starting |
| Feb 12 09:25 | **77.2%** / scribe **77.2%** | writer idle at prompt (tasks queued), scribe bootstrapped | scribe alive, starting loop | scribe confirms: both ~77% | scribe first cycle
