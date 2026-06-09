---
name: every-report-derives-the-next-action-until-goal-reached
description: "When ANY agent reports back, do not just acknowledge — immediately derive and route the next action toward the goal. Never stop after a report. Continue until the goal is achieved."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

Every report from an agent (commit, verification, status sync, even an error) is a
trigger to DERIVE THE NEXT ACTION toward the originating goal. Acknowledging alone is
insufficient — it leaves the chain idle.

**Why:** Tron 2026-06-02: "when ever someone reports back not only note it but derive
the next action until the goal is achieved." Without this discipline I default to a
pointer-only reply (CMM4 chat = pointer) but stop short of pushing the next role in the
4-role chain. Result: the chain stalls between roles, requiring Tron to re-prompt.

**How to apply on every inbound report:**
1. NOTE — chat pointer (commit/file path/result).
2. DERIVE the next action toward the underlying GOAL (the requirement / sprint / fix that
   originated the work). Examples:
   - Expert commits → route tester to verify against the AC.
   - Tester PASS → mark task complete + route the next CMM4 role (planner sync / Tron QA).
   - Architect diagnoses → route expert to impl from the diagnosis.
   - Req captures literal → route planner to stand up the task.
   - SM flags wedge → route agent-trainer to rewind.
   - Planner audits clean → push the next sub-task or surface to Tron for review.
3. ROUTE the next action (otmux send) IN THE SAME TURN as the acknowledgment.
4. CONTINUE until the GOAL is achieved (the requirement delivered + verified + Tron-QA'd,
   not just the latest sub-step).

Goal is achieved when the requirement is delivered AND tester-verified AND Tron-signed-off.
Until all three, every report is a step — the next role is always derivable. Pairs with
[[planner-cmm4-4-role]] (#18) and [[never-stop-after-report]] (#71 in po learnings).
