# Context Burn Rate Log
*Scribe logs writer context % each 5-min cycle. Trend shows burn rate.*

| Time | Writer Context | Writer State | Scribe Loop |
|------|---------------|--------------|-------------|
| 21:54 | hidden (overlay) | viewing task output | alive (72783) |
| 21:59 | >20% (above-threshold) | active, composing | alive (74677) |
| 22:04 | >20% (above-threshold) | active, going to sleep | alive (76892) |
| 22:10 | **12%** CRITICAL | active, checking orchestrator | alive (79055) | ALERT SENT |
| 22:17 | >20% (post-compact) | compacted, another /compact queued | alive (90423) |
