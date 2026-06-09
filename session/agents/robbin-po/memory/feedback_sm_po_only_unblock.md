---
name: SM unblocks POs only
description: Scrum Master only unblocks POs directly — all other agent blockers get reported to PO for review
type: feedback
originSessionId: 35916ccb-330e-46a0-8795-0f05f1ebce09
---
SM unblocks POs and agent-trainer only. For ALL other agents: ask PO to REVIEW then decide.

**Why:** CMM4 = review before action. Blind unblocking bypasses quality control. PO must see what the permission is asking before approving. SM was sending "RUN THIS NOW: hiveMind agent.unblock" which caused blind unblocking without review.

**How to apply:** 
- POs/agent-trainer: SM reviews the prompt first (`hiveMind agent.monitor`), then unblocks if safe.
- Non-PO agents: Ask PO to REVIEW: "SM: <agent> (<pane>) <STATE>. Review with: hiveMind agent.monitor <agent> <session> 10 — then unblock if safe: hiveMind agent.unblock <agent>"
- NEVER ask for blind unblock — always ask for review first.
