# Scribe: Add 4 new KB topics from projectTeam Reboot

These patterns emerged from chapters 1-9 and aren't in the knowledge base yet.

## New Topics to Add

### 10. Root Cause: PATH and Permissions
The permission economy's root cause is compound bash commands (`cd /path && ./cmd`). Simple commands on PATH (`cmd method args`) match permission patterns and auto-approve. Fix: OOSH PATH export. Documented in Ch9.
-> Details: explain the `cd && ./` → permission prompt chain, the PATH fix, settings.json pattern matching
-> Actions: export PATH line, update settings.json patterns

### 11. Training Pipeline
Trainer creates curriculum (SKILL.md Reading Lists) -> expert/tester consume them -> write context files -> check for work. Three-step delegation across four agents. Wrong directory (Ch6) but right content. Proved in Ch8 when expert and tester both reported TRAINED.
-> Details: the delegation chain (PO -> trainer -> curriculum -> consumers), what Reading Lists contain, context file pattern
-> Actions: how to train a new agent (send training task, verify completion, check context file)

### 12. Generational Transition
Agents burning through context = first generation dying. Fresh agents consuming training = second generation waking. The dying generation's output (curriculum, KB) prepares successors. Compaction protocol: save state (57 lines) -> /compact -> boot file -> resume. Not planned — structural.
-> Details: trainer at 1%/scribe at 9% compacting while expert/tester activating, context file as bridge
-> Actions: how to manage generational handoff (detect low context, trigger save, verify recovery)

### 13. Orchestrator Emergence
Designed to coordinate, became a heartbeat. Found the one action producing most value (pressing Enter in SM's pane) and did nothing else. 59 minutes, 17.2k tokens, minimal correct outputs. The keep-SM-unblocked clause became its entire role.
-> Details: the orchestrator's think cycle, token consumption vs output ratio, Enter chain pattern
-> Actions: (observation pattern, not an action — note that emergence can't be prescribed)

## Format
Follow WODA structure: add to W (index.md), O (overviews.md), D (detail files), A (action files where applicable).
