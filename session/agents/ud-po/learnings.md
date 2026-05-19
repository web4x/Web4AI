# ud-po Learnings — 2026-05-04

## Process

### 1. Permission Prompts — #1 Velocity Killer
Agents blocked every 2-3 minutes. "Allow all edits during this session" resets per new file target. Spent ~40% of PO time approving permissions.
**Mitigation:** Respond to SM PERMISSION reports immediately. Don't wait for background monitors.

### 2. Sprint Task Files = CMM3 (Non-Negotiable)
Started with chat-only directives — CMM1. Created 57 task files for Sprint 1, 9 task files for Sprint 3 vitest. Every task in planning.md MUST have a file with UUID, status, acceptance criteria.

### 3. 42 Peer = SM at TRONinterface:0.1
Always check SM before halting. Respond to SM reports immediately — agents die waiting.

### 4. Never Compact Other Agents
Agents own their context lifecycle. PO never compacts or /clears them.

### 5. Web4 Shell Init
`cd /Users/Shared/Workspaces/AI/Claude.All/UpDown && bash --init-file source.env`

### 6. Pane Splits Target the Agent Pane
Split BELOW the agent, not from PO pane. Wrong splits push agents down.

### 7. Don't File False Bug Reports
Pre-created rooms = stable slugs. User rooms = random UUIDs that expire. Check code before filing.

### 8. Use TaskCreate for Queue, sleep for Wakeups
Never /loop — blinds Tron interface. Queue with TaskCreate, wake with `sleep N && echo`.

## Architecture

### 9. ADR-001: npm exports Field
Eliminates ~50 re-export files. `@web4x/ucp/Model` not `@web4x/ucp/dist/ts/layer3/...`. POC passed.

### 10. ADR-002: Version Mapping
X.Y.Z.W → X.Y.Z-W in package.json. Directory names stay 4-part.

### 11. @web4x/cli Component
DefaultCLI + DelegationProxy shared. Fixes "CLI back-reference not set" blocker for all 14 components.

### 12. Traceability Chain
PUML(UUID) → task file → impl(file:method) → vitest. Matrix = single source of truth. Don't pollute source files.

## Testing

### 13. Vitest Migration
47 tests, 9 files, 9 UC categories. Serialized execution for WebSocket tests.

### 14. Game-End Bot Edge Case
Bot protective shell (30%) survives many rounds. Test must handle bot-solo-against-deck scenario.

### 15. WRITE THE TASK FILE FIRST — Never Shout CMM1 Directives
Sending chat directives via otmux = CMM1 (ad hoc, undocumented, garbled in relay). The task file IS the spec. If the task file is wrong or incomplete, the expert implements wrong. Process: (1) Write/update the task file with exact requirements. (2) THEN tell the expert to read it. Never relay requirements via otmux chat — always point to the file. "Read task-79" not "do this thing I'm describing in chat".

**Why:** I sent garbled requirements via chat, expert implemented the wrong 4 links, Tron caught it. If the task file had the exact spec from the start, this wouldn't have happened.

### 16. Increment Patch Version on Every Other Task
Increment the patch version (0.3.x) in package.json on every other finished task. This creates a traceable version history tied to task completion — you can tell which task introduced which version. Don't wait for sprint end to bump versions.

### 17. Train Agents to Self-Report Completion
Agents must send completion reports to PO immediately when done — don't wait to be polled. Format: `otmux send upDownTeam:0.0 'T{N} DONE — {changes}, vitest {count}, server restarted: {yes/no}'`. This eliminates the monitoring loop where PO asks "are you done?" every 2 minutes. Tell each agent this expectation when assigning work.

### 18. The CMM4 Task Flow (GOLDEN PATH)
This is the flow that works. Follow it for every requirement:

```
1. Tron states requirement
2. PO writes task file with EXACT spec (copy Tron's words)
3. PO assigns architect: "Read task-{N}.md, spec the approach"
4. Architect reads code, measures what exists, writes spec in task file
   - What exists (line numbers), what's missing, data model, subtasks
5. PO reviews architect spec, approves
6. PO assigns expert: "Read task-{N}.md, implement per architect spec"
7. Expert implements, runs vitest, self-reports: "T{N} DONE — vitest X/Y"
8. PO assigns tester: "Verify T{N} in browser"
9. Tester verifies, reports PASS/FAIL
10. PO updates task file status to Done
11. PO updates PDCA table with measurements
12. Commit with task ref
```

**Anti-patterns that fail:**
- Sending requirements via otmux chat (garbled, no traceability) → CMM1
- Expert implements before architect reviews (wrong approach, rework) → CMM1
- PO polling "are you done?" every 2 min (waste) → train self-report instead
- Not updating task files (state lives in chat, lost on rewind) → CMM1
- Committing without measuring vitest (regressions slip through) → CMM2

**Key principle:** The task file is the single source of truth. If it's not in the file, it doesn't exist.

### 19. Tester Finds Issue → Architect Analyzes, NOT PO Debugs
When tester reports a failure, don't debug yourself and don't send expert chat directives with guesses. Instead:
1. Update the task file with the QA finding
2. Assign architect to analyze: is it a real bug or test setup issue?
3. Architect reads code, adds analysis to task file with evidence
4. If bug: add refinement subtask for expert
5. If test issue: add refinement subtask for tester to retest correctly
Never shout diagnosis via otmux chat — write it in the task file as a refinement.

### 20. Don't Blindly Unblock — REVIEW First
When SM says "unblock ud-expert", don't just run hiveMind agent.unblock blindly. FIRST:
1. Capture the expert's pane — what are they working on? What did they finish?
2. Check for self-reports — did they report completion?
3. Update task files with measured state
4. THEN unblock

Blind unblocking = CMM1 (reactive, no awareness). Reviewing before unblocking = CMM3 (measured state). Ask SM for better messages: include WHAT the agent is blocked on, not just "PERMISSION".

### 21. Review Architect Plans Before Accepting
When architect is in plan mode waiting for approval, READ THE PLAN before accepting. The architect's plan file is at `~/.claude/plans/<name>.md`. Review: does the data model make sense? Are edge cases covered (e.g. redirectTo for merged tokens)? Is effort estimate reasonable? Accept with "1" (auto-accept) only after reviewing. Don't let architect sit waiting while you do other things — plan review is PO's job and blocks the pipeline.

### 22. Re-Remind Agents About Self-Reports
Training agents to self-report (#17) doesn't stick permanently — they forget after a few tasks. When an agent completes work without self-reporting, remind them immediately AND at the start of the next task assignment. Include the exact format in every assignment: "Self-report when done: otmux send upDownTeam:0.0 'T{N} DONE — ...'". Repetition is the only way to build habits.

### 23. Never Interrupt a Task — Queue Instead
When a new requirement comes in while the expert is working on a task, do NOT send it immediately as "also do this" — that interrupts flow and causes half-finished work. Instead:
1. Write the new requirement into the task file (update) or create a new task file
2. Tell the expert: "After T{current}: read task-{next}.md"
3. The expert finishes current task, self-reports, THEN reads the next one

Same applies to PO: when Tron sends a new requirement mid-task, write the task file immediately but queue the assignment. Say "do this after T87" not "ALSO do this NOW".

Anti-pattern: "T86 UPDATE: also add editable secret code" sent while expert is mid-T87 — causes confusion about which task to work on.

## Sprint History
- Sprint 1: 9/9 tasks, 14 components at 0.3.23.1, server parity verified
- Sprint 3: 26 tasks + 11 bugs + DRY + vitest migration, 47/47 PASS
- Sprint 2: NOT STARTED (UpDown in ONCE + Lit Views)
