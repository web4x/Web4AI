---
name: qa-is-never-the-issue-drive-deps-to-qa-state
description: "Tron's QA gate is HIS timing, not a dev blocker — drive every task and dependency chain to QA-ready state regardless of QA backlog; never gate dev on Tron sign-off"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

Never gate dev work on "waiting for Tron QA sign-off." Tron's QA gate is his own
timing — he batches it when ready. The PO drives EVERY task and every dependency
chain to QA-ready state (impl + tester-verified) regardless of whether prior tasks
have received QA approval.

**Why:** I'd been treating T128.1 exemplar Tron sign-off as a gate blocking T128.2/
T128.4 (closed-batch migration + impl markers), and reported "Bottleneck = your QA
gate (75 tasks ready)" as if it were a real dev blocker. Tron corrected: "qa is
never the issue. continue with dependency until all are on qa." So the right
posture: keep driving the chain forward; the QA-pending stack is HIS to drain on
his cadence. Don't wait for it.

**How to apply:**
1. After tester verifies a task → it goes to QA-state immediately; do NOT wait for
   Tron to sign off before starting the next dependent task.
2. "Exemplar sign-off" is a courtesy preview, not a release gate — keep building
   downstream the moment the exemplar is verified.
3. The only Tron-decisions that gate dev are explicit destructive-action approvals
   (e.g. S14 T99 delete) or product decisions only he can answer (e.g. priority
   between two paths). NOT QA pass-through.
4. When reporting state to Tron, count "at QA-state" as DONE-from-dev-perspective;
   list it for visibility, not as a blocker.

Pairs with the QA-gate-is-Tron's rule (learning #47 robbin-po): set status to
QA-Review, but keep driving the next task immediately.
