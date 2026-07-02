> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.4: isClaudeCode mis-classifies real agents as shells (kind)
[task:uuid:]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Description
**Expert finding (fd085c4-era, PRE-EXISTING — NOT a g.1 regression; g.1's kind-branch merely EXPOSED it):** `claudeCode process.running` returns rc1 for a claude pane whose parent is bash → `isClaudeCode` classifies a REAL agent as `(shell)` → on send it takes the non-claude path (skips prefix + verify). Message still delivers, but a real agent silently loses prefix+verify = a send-CORRECTNESS gap. **otmux-send family = Tron's HIGHEST priority.**
**Role**: architect (fold into c.0 kind spec) → expert (c.0 impl) → tester (T-KIND-CLASSIFY).

## Fix — via the c.0 canonical kind (DRY, ties to OTR-3)
Kind must come from the c.0 live-reader's `kind` field (robust proc-args classification: a claude process is claude regardless of a bash parent), NOT from `process.running` rc. `isClaudeCode`/send.smart consume c.0's kind. So this is fixed **by building c.0 with a robust kind** → build c.0 FIRST (satisfies send-highest-priority) then the rest of C-family. Harden `isClaudeCode` to not false-negative on bash-parent claude.

## Definition of Done
- a real agent with a bash-parent claude process classifies as CLAUDE (not shell) → gets prefix+verify on send
- kind sourced from c.0 canonical reader (single source), not process.running rc
- T-KIND-CLASSIFY: bash-parent claude pane → kind=claude → send takes claude path

## Report-back
- Architect (kind spec into c.0):
- Expert (c.0 kind + isClaudeCode harden):
- Tester (T-KIND-CLASSIFY):
