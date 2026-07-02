---
name: recovery-ladder-fork-last-resort
description: The agent-recovery ladder — save → dismiss any blocker → auto-compact self-heal → TRUE-FORK last. And how to get a fresh anchor + 1M before any fork.
metadata:
  type: reference
---

Recovery is a ladder, fork is the LAST rung (each proven this session):
1. **Ensure a fresh committed save first** (F-T1). If the agent's save is uncommitted on disk, commit it on its behalf (tester `148f449`). If it's at 100% and can't save, **trigger auto-compact by sending a save prompt** — even when compaction is insufficient to keep it down, the brief room often lets it COMMIT a fresh anchor before bouncing back (planner `4766c0c`), so a later fork recovers from FRESH not stale (the F-T16 cure).
2. **A 100% agent CAN self-heal via auto-compact IF it can process.** A "won't save" agent is often just blocked behind a **dismissible dialog** (feedback dialog / permission prompt) — dismiss it and it may auto-compact (oosh-po, no fork). Only if TRULY frozen (rate-limited, keystrokes don't land) → fork.
3. **TRUE-FORK** (last resort, bloated base): /exit → `claude --name <role>` → /remote-control → **/model → option 2 → `s`** (fresh `claude` defaults to 200k `claude-opus-4-8`; `s`="this session only" actually switches to 1M — Enter only sets the default and KEEPS 200k) → /rename `<role>@host` → boot from files. Old session stays resumable.

**Why:** forking a healthy/recoverable agent is destructive and wasteful; the ladder preserves the most state.
**How to apply:** climb the ladder; never jump to fork. "Functional-but-full" ≠ recovered — verify it can WRITE→COMMIT, not just respond. See [[rewind-picker-mechanics]], [[peer-word-is-not-tron-word]].
