> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.6: otmux pane.get stray-newline — fix at SOURCE (recurring root)
[task:uuid:6003c2b0-997f-45c1-976d-b0b74573143b]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Description
**Recurring root**: `otmux pane.get` (via the this-dispatch) prepends a STRAY NEWLINE to its output → consumers get `'\n/dev/pts/N'` etc. This artifact caused **THREE** issues, each trimmed at the CONSUMER: C.2 (session.discover), C.3 (boot-identity), g.4 (process.find tty → isClaudeCode misclassify). Trimming per-consumer is whack-a-mole. **Fix at SOURCE** — `pane.get` (or the this-dispatch path) must not emit the stray leading newline — then the per-consumer trims become belt-and-suspenders.
**Role**: architect (locate the source — pane.get vs the this-dispatch newline) → expert (fix at source) → tester (T-PANEGET-CLEAN).

## Definition of Done
- `otmux pane.get <target>` emits the value with NO stray leading/trailing newline
- the C.2/C.3/g.4 consumer-trims still pass (defense-in-depth), and a NEW consumer wouldn't hit the artifact
- T-PANEGET-CLEAN: `pane.get` output has no stray newline; byte-exact

## Report-back
- Architect (source locate):
- Expert (source fix):
- Tester (T-PANEGET-CLEAN):
