> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.6: otmux pane.get stray-newline — fix at SOURCE (recurring root)
[task:uuid:6003c2b0-997f-45c1-976d-b0b74573143b]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review (expert-verified live; awaiting tester T-PANEGET-CLEAN)
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
- Expert (source fix): **DONE 2026-07-02 `bcd8f84`** (dev). **SOURCE FOUND (traced, not guessed):** it was NOT `otmux pane.get` nor the `this` dispatch — it was **`log.init.colors()`** (in the `log` script), which `otmux.start()` calls before EVERY dispatch. It probed LOG_DEVICE writability with **`echo "" 2>/dev/null > "$LOG_DEVICE"`** — a blank-line write. When `LOG_DEVICE=/dev/stdout` (the WODA.prod convention agents/tests use), that `echo ""` **lands a blank line on stdout**, prepended to every `otmux`/`hiveMind` command's output → the exact `"\n/dev/pts/N"` / `"\nARON@v60211"` artifact that broke C.2 (session.discover), C.3 (boot hook), g.4 (process.find tty). Ungated (a writability probe, not a LOG_LEVEL log) → appears even at LOG_LEVEL 0; invisible when LOG_DEVICE=/dev/stderr (agents' default) but corrupts any stdout-LOG_DEVICE caller. **FIX:** probe with **`: 2>/dev/null >> "$LOG_DEVICE"`** — `:` writes NOTHING (no newline), `>>` append (no truncate, so a file LOG_DEVICE isn't wiped either — a latent second bug), still fails on an unwritable device → fallback intact. Applied to all **5** occurrences of the probe in `log`. **Verified live (LOG_DEVICE=/dev/stdout):** `otmux pane.get … '#{pane_tty}'` → clean `/dev/pts/3` (no leading blank); `otmux sessions` first line clean; `process.find` works; unwritable LOG_DEVICE still falls back to /dev/stderr. **Non-regr:** log 45/0, send-matrix 12/0, dispatch-submit 5/0, teamsave-parity 3/0. The C.2/C.3/g.4 per-consumer trims now = belt-and-suspenders (kept — defense in depth).
- Tester (T-PANEGET-CLEAN): READY — with `LOG_DEVICE=/dev/stdout`, `otmux pane.get <target> '#{pane_tty}'` (and any format) emits byte-exact value with NO stray leading/trailing newline; `otmux`/`hiveMind` command stdout is clean; the C.2/C.3/g.4 consumer-trims still pass (defense-in-depth); unwritable LOG_DEVICE still falls back (no regression). Commit `bcd8f84` on dev.
