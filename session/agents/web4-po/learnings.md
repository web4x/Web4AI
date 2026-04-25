# web4-po Learnings — 2026-04-25

## Process Learnings

### 1. Permission Prompts Kill Velocity
Agents get blocked every 2-3 minutes on file edit/bash permissions. "Allow all edits during this session" doesn't persist across new directories. Each monitoring cycle, I had to unblock 1-2 agents. This is the single biggest impediment.
**Action:** Escalated to Tron. Need broader allow rules in .claude/settings.json.

### 2. Remote Control Queues Messages
When Tron has Remote Control active on agent panes, otmux sends get queued instead of processed. Agents appear idle but messages are waiting. Learned this the hard way — multiple directives never reached agents.
**Action:** Check for "Remote Control active" in pane capture before assuming agents are idle.

### 3. Never Compact Other Agents
356k/1M = 36%, not "nearly full". I wrongly assumed the expert was near context limit. Agents manage their own lifecycle — PO never compacts them.
**Action:** Saved as memory feedback.

### 4. Fork Verification is Critical
Forked the wrong session UUID twice for the architect (used expert's UUID instead of my own). Process args verification (`ps -p PID -o args=`) is the only reliable way to confirm which session was actually forked.
**Action:** Always verify fork parent UUID via process args after forking.

### 5. /rename Must Come From Outside
Cannot run /rename on own session via Bash tool — it's a TUI-internal command. Must be sent by another agent or Tron via otmux send.
**Action:** Ask oosh-expert or Tron to rename sessions.

### 6. Sprint Planning Format (from Web4Articles)
Source: `/Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/`
- planning.md with prioritized task list
- task-N-description.md with UUID, traceability up/down, acceptance criteria
- task-N.M-role-description.md subtasks with role in filename
- requirements.md with bidirectional [requirement:uuid:] links
- Sprint 22 is the best real example

### 7. MDAv4 Unit Pattern
Source: `/Users/Shared/Workspaces/2cuGitHub/Web4Articles/MDAv4/`
- M3/CLASS/{ClassName}.unit — metaclass definition
- {component}/src/ts/layer2/{ClassName}.ts.unit — same UUID, placed next to source
- origin field → IOR to canonical source
- references[] → bidirectional link tracking
- typeM3 → CLASS | RELATIONSHIP | FOLDER
- Traceability chain: PUML → M3 CLASS → .ts.unit → .ts file

### 8. Web4 Shell Init Required
`bash --init-file source.env` from UpDown project root. Without it, web4tscomponent/once/etc not on PATH. Prompt shows `[web4 0.3.23.1 | user@host]` when properly initialized.

### 9. Background Monitoring Pattern
`sleep N && otmux pane.capture ... | run_in_background` works well for periodic team checks. 3-minute intervals are good balance — enough for agents to make progress, frequent enough to catch permission blocks.

### 10. Architect as Separate Agent Works Well
Forking PO as architect gave the architect full sprint planning context + Web4 principles + MDAv4 knowledge. The architect completed all 15 subtasks autonomously with high quality. Key: the fork carried all the PO's understanding.

## Technical Learnings

### 11. UnitModel Already Had MDAv4 Fields
The Unit component at 0.3.0.5 lineage already has origin, typeM3, references[]. Only needed to add FOLDER to TypeM3 enum. Don't assume extraction lost features — verify first.

### 12. EAMD Layer Corrections
- L1 = Kernel and OS Infrastructure (not generic "Infrastructure")
- L3 = Interfaces AND Runtime Types (JsInterface, UcpModel, TypeDescriptor are runtime classes)
- L4 = Async Orchestration added by UpDown for P7 (not original EAMD)

### 13. 423-Line UcpComponent Reduction Was Correct
Architect spec (Task 4.1) proved: the removed CLI path accessors were a circular dependency violation (UcpComponent→DefaultCLI back-reference). Correct fix: 2 protected helpers that derive from model.componentRoot, not restoring the back-reference.

## CMM Observations

### 14. Composed Level = Weakest Link
Strong compilation (L3) + strong PUML coverage (L3) still yields L1 overall because zero PDCA files and zero Tootsie tests. Must fix weakest links first.

### 15. PO Role is Sprint Velocity Driver
The PO's main job during sprint execution: unblock agents, update planning, assign next work, track progress. Most time spent on permission prompt unblocking and monitoring, not quality decisions. Process improvement needed.
