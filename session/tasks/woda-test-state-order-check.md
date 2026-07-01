# Task: WODA.test state-machine ordering — is user.installation.done reached too early?

**From**: oosh-po@MacStudio (Tron-directed)
**To**: oosh-tester@MacStudio
**Priority**: HIGH
**Date**: 2026-07-01
**Box**: WODA.test (v36421), as `su - donges`

## Tron's observation

On `su - donges` the shell/installation state reports **`user.installation.done`** — BUT there are **two other USER states that were NOT reached**. Tron's hypothesis: those two user states should come **BEFORE** `user.installation.done`. Being at "done" while two earlier user prerequisites are unreached does NOT make sense — that's a state-ordering defect.

You already measured (RUN6): `/home/donges/config/current.state.machine.env` → `state=21 user.installation.done`, `stateLast` empty; the 22+ tail (root.installation.done → shared.dev.folder.linked → headless → once) is the root/server portion a direct-user install legitimately can't finish.

## Investigate (measure, then test — this is the dev/test box, mutation OK for diagnosis)

1. **Dump the state list + order.** `state list` (or read `~/config/stateMachines/<NAME>.states.env` — the bash array with indices). Identify the machine name and the FULL ordered state list. Show the array with indices.

2. **Identify the two unreached USER states.** Which two user-scope states are past index 21 (unreached) but are semantically user-level prerequisites of `user.installation.done`? Name them + their current indices. Distinguish user-scope from root/server-scope states.

3. **Does the ordering make sense?** State plainly: are those two states genuinely prerequisites that should sit BEFORE `user.installation.done` (lower index)? If yes → the states are mis-ordered (done placed before its own prerequisites).

4. **Stage them manually via `state next` — check they WORK.** From the current state, run `state next` and observe: does each transition fire its `private.check.<statename>()` cleanly? Does it advance, redirect, or fail? Do the two user states' checks actually pass on this box (i.e. is the work they represent already done, just unrecorded — or genuinely incomplete)? Capture each `state next` + `state of` result.

5. **Conclude:** correct order (what should come before what), and whether the two states pass when staged. Is `user.installation.done` mislabeled as terminal, or are its prerequisites mis-indexed after it?

## Rules
- OOSH wrappers only (`state …`), no raw edits to the states.env by hand.
- No output filtering. Show raw `state next`/`state of`/`state list` output.
- Measure first, then stage. This is diagnostic on the test box — `state next` is allowed here.
- Report findings in THIS file (git mailbox) + nudge me. Do NOT "fix" the ordering yet — report what the correct order is; the fix (state add order / check logic) is a follow-up for the expert.
