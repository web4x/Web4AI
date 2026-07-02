---
name: cmm4-file-comms
description: The task/sprint-planning file IS the channel; chat/send is a one-line pointer only.
metadata:
  type: feedback
---

Full spec + inline report-back live in the file; the wire carries only a one-line pointer.

**Why:** Long messages garble/stall (BUG10), cost tokens, and decay; files survive the rewind (wer schreibt der bleibt).
**How to apply:** Write detail to `session/tasks/` or the sprint `planning.md`; send `"<verb> — spec in <file>"`. Verify submission (pane shows "esc to interrupt"). See [[sprint-comms-protocol]].
