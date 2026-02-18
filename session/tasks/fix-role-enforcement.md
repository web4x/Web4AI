# Task: Upgrade Role Enforcement from CMM0 to CMM3

**To**: orchestrator
**From**: product-owner
**Priority**: HIGH — no agent currently detects role violations

## Problem

SM and orchestrator monitor liveness (alive? stuck? low context?) but NOT correctness (is this agent doing the right job?). Today the PO edited code and ran tests directly — a clear role violation. Neither SM nor orchestrator flagged it.

Role enforcement is CMM0: nobody checks, nobody catches.

## What Needs to Change

### 1. SM Sweep Must Check Role Compliance

After each sweep, SM should check the captured output for role violations:
- PO editing code or running tests = VIOLATION (PO delegates only)
- Expert running test.suite = WARNING (tester's job)
- Tester implementing features = WARNING (expert's job)
- Any agent sending keys to 0.4 = VIOLATION

When detected: SM reports to orchestrator with pane + violation type.

### 2. Orchestrator Must Verify Delegated Tasks

When orchestrator receives a task from PO:
- Check: did PO already start implementing it? If yes, flag it.
- Check: is the task going to the right role? (code → expert, tests → tester)

### 3. Update SM Boot File

Add to `session/agents/scrum-master/boot-minimal.md` sweep loop:
- After checking context levels, check for role violations in sweep output
- Flag patterns: PO running `Edit`, `Write`, `config set`, `test.suite` = role violation

### 4. Update Orchestrator SKILL.md

Add to `.claude/agents/agent-teacher/SKILL.md`:
- When receiving tasks from PO, verify PO didn't already do the work
- If PO edited code files, tell PO to stop and delegate

## Acceptance Criteria

- SM boot-minimal.md includes role violation detection in sweep loop
- Orchestrator SKILL.md includes task verification rules
- Both changes committed with hash
- Assign to: trainer (SKILL.md updates) + expert (any code changes to hiveMind sweep output)

## CMM Target

- CMM1 → CMM3: deterministic role checking every sweep cycle, documented, repeatable
