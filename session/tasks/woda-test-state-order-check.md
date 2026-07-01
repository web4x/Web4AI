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

---

## FINDINGS (oosh-tester@MacStudio, MEASURED live on WODA.test/v36421 su - donges, 2026-07-01)

Machine = **`SETUP_SERVER`** · stateFile `/home/donges/config/stateMachines/SETUP_SERVER.states.env` · current = **[21] user.installation.done** (restored to 21 after diagnosis).

### 1. Full ordered state list (indices; `NN` = transition/jump pointer)
```
[0]  not.installed          [14] "20"(jump)
[1]  initialized            [20] user.rights.only
[2]  setup                  [21] user.installation.done   ← CURRENT
[3]  all.states.added       [22] user.mode.release        ← unreached USER state
[4]  started                [23] user.mode.dev            ← unreached USER state
[5]  "11"(jump)             [24] "30"(jump)
[6]  to.be.deleted          [30] root.rights
[11] remote.install.started [31] root.shared.dev.folder.created
[12] local.install.started  [32] root.dev.keys.installed
[13] priviledges.checked    [33] root.installation.done
                            [34] "40"(jump)
                            [40] user.shared.dev.folder.linked
                            [41] user.state.machine.synced.with.root
                            [42]"50" [50/51] headless [52]"60" [60/61] once [62]"99" [99] finished
```
`state list SETUP_SERVER` → "24 states (and 8 transition states)".

### 2. The two unreached USER states past index 21
- **[22] `user.mode.release`**
- **[23] `user.mode.dev`**
(A *later* user pair [40] user.shared.dev.folder.linked / [41] user.state.machine.synced.with.root sits BEHIND the root block 30–33 — those legitimately depend on root and are a different category. The two Tron means are 22/23, immediately past 21.)

### 3. Does the ordering make sense? → NO. Tron's hypothesis CONFIRMED.
`[22] user.mode.release` and `[23] user.mode.dev` are **mode SELECTION** states (release XOR dev). A user's mode is chosen *as part of* installing. Being at **`user.installation.done` (21)** while the mode has never been set (22/23 unreached) is **backwards** — you cannot have a "done" user installation without a selected mode. **`user.installation.done` is mis-indexed BEFORE its own prerequisites.**

### 4. Staged via `state next` / `state set` — raw results
- **`state next` (from 21)** → tried **[22] user.mode.release**, ran its check:
  `ERROR> did not go well: 1 = 1 not in mode released!   OOSH_MODE=dev` → **stayed at 21** (check correctly fails: this box is dev, not release).
- **`state next SETUP_SERVER user.mode.dev`** → **STILL went to [22] user.mode.release first** (target ignored), failed again → stuck at 21. **The release check does NOT redirect/skip to dev when `OOSH_MODE=dev`.**
- **`state set SETUP_SERVER user.mode.dev`** → **rc=0, advanced to [23] user.mode.dev** (bypasses the sequential release gate). So `user.mode.dev` IS the valid state for this dev box.
- **`state next` (from 23)** → transition 24⟹30 → tried **[30] root.rights**, check failed: `ERROR> did not go well … Something went wrong!` (non-root user) → **stayed at 23**. Correct: after the user mode is set, the next state needs root, which a direct-user install legitimately can't do.

### 5. Conclusion
- **TWO defects, both real:**
  1. **Ordering** — `user.installation.done` (21) sits BEFORE the mode-selection prerequisites `user.mode.release`/`user.mode.dev` (22/23). Correct order: `user.rights.only (20) → [mode branch: release XOR dev] → user.installation.done`. The genuine terminal of a *user* install on this box is **user.mode.dev (23)** (mode set, root block then blocks) — NOT 21. So 21 is **mislabeled as terminal / mis-indexed early**.
  2. **Branching** — 22 (release) and 23 (dev) are a **mutually-exclusive XOR branch modeled as two SEQUENTIAL linear states**. `state next` always hits release (22) first; on a dev box its check fails with **no redirect to dev (23)** → the machine **stalls at 21 and can never advance via `state next`**. Only `state set` (bypass) reaches dev.
- **Net**: `user.installation.done` is reachable "too early" exactly as Tron observed. The mode-selection states are (a) mis-ordered after "done", and (b) un-traversable linearly because the wrong-mode check dead-ends instead of redirecting. FIX (follow-up for oosh-expert, NOT done here): move the mode branch before `user.installation.done`, and make the mode checks redirect on the active `OOSH_MODE` so `state next` can cross the XOR.
- Box restored to state 21 (as found). Diagnostic only — no ordering changed.
