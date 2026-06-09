---
name: report-and-delegate-via-task-file-chat-is-only-a-pointer
description: "Both directions are file-based — I delegate by pointing to the task file (spec lives there), agents report by writing results into the task file. Chat = one-line pointer ONLY."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

The task FILE is the bidirectional CMM4 channel. BOTH directions:
- **Delegation (PO → agent):** the spec/requirement lives IN the task file. My otmux/chat
  message is ONLY a pointer: "do task-187, spec in the file" — NOT the spec restated in chat.
- **Report-back (agent → PO):** the agent writes its findings/results/status INTO the task
  file (Status checklist, results section, commit refs). Its chat message is ONLY a pointer:
  "T187 done — see task-187 / commit X" — NOT a paragraph of detail in chat.

**Why:** Tron, repeatedly + emphatically: "reporting back not via chat but via tasks!!! same
as delegation. chat is only pointing to the file." I'd been stuffing full specs into otmux
directives and accepting (and relaying) long chat reports. That's CMM2 — ephemeral, lossy,
not the durable file-of-record. The file is the source of truth; chat is a notification.

**How to apply:**
1. My delegations: put the spec in the task file (or point to the existing file); otmux = pointer + the one decision/next-step. Never restate a full spec in chat.
2. Require agents to write results INTO the task file and send only a pointer. If an agent
   reports a wall of detail in chat, the detail belongs in the file.
3. My own status to Tron = concise pointer/summary; the detail lives in the files/tracker.
4. SM enforces this on every agent.

Pairs with [[cmm4-communicate-via-task-refinement]] and [[delegate-with-report-back]] —
report-back must land in the FILE, not chat.
