---
name: rewind-picker-mechanics
description: Hard-won mechanics of driving the /rewind picker safely — depth, menu-by-label, zoom, Enter timing, and how to read true context health.
metadata:
  type: reference
---

- **50% is the safe max depth; NEVER go to the top** (99% rewind leaves <33k, kills the agent — F-T8). Land on a natural checkpoint (Tron/PO directive, task delivery) near 50%.
- **Pick the restore option by LABEL "Restore conversation", never by number.** 5-option menu (code pending) = option 2; 4/3-option (no code) = option 1. NEVER option 1 in the 5-option menu (reverts code). Read the menu, confirm the label, then select.
- **Small panes clip the picker** — zoom (`resize-pane -Z`) to full height before navigating; you cannot drive a picker you can't read. Restore the prior zoom/view after.
- **Slash commands need care:** `/rewind` + ONE Enter opens the picker; a double-Enter auto-selects "(current)" and closes it. The select-Enter can silently fail to render the restore menu at **100% + running background shells** (oosh-expert) — if it won't complete, escalate to fork.
- **Judge context health by the pane SATURATION WARNING, not `context.read %`** — the latter misreads on 1M (4.8 / 22 / 84.9 / "unknown" all seen). Warning present = distress; absent = healthy.

**Why:** the rewind protocol exists to preserve state; a mis-drive kills or regresses the agent.
**How to apply:** MEASURE before every keystroke (CMM4 pre-flight); one step, then re-measure. See [[recovery-ladder-fork-last-resort]].
