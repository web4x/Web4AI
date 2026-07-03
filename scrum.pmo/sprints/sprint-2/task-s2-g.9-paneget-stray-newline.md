> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.9: `otmux pane.get` stray-newline — fix at SOURCE (retire 3 per-consumer trims)
[task:uuid:1e7d00f2-a760-4645-9d90-5fb99165569c]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Problem / Why
`otmux pane.get <pane> '#{...}'` returns a value with a STRAY LEADING NEWLINE (the `this` CLI dispatch prepends it) → `tty="\n/dev/pts/N"` → downstream `${tty#/dev/}` / `ps $2==tty` matches FAIL. This SAME artifact caused **C.2** (session.discover), **C.3** (pre-compress hook), and **g.4** (process.find) to misbehave — each fixed by a per-consumer `tr -d '[:space:]']` trim. That's 3 belt-patches of ONE root. **A recurring root should be fixed at the source (DRY), not re-patched per consumer.**

## Design / Approach
Fix at SOURCE: either `otmux pane.get` strips the stray newline before returning, OR the `this`-dispatch stops prepending it (root — but kernel-level, verify no wide breakage). Prefer the narrowest correct fix. The 3 existing consumer trims become belt-and-suspenders (leave them; they're harmless). Architect diagnoses source (pane.get vs this-dispatch) → expert fixes → tester T-PANEGET-CLEAN (pane.get output has no leading/trailing whitespace).

## Acceptance Criteria
- [ ] `otmux pane.get <pane> '#{pane_tty}'` returns a clean value (no leading newline/whitespace)
- [ ] C.2/C.3/g.4 consumers work WITHOUT their trims (trims retained as belt-and-suspenders)
- [ ] T-PANEGET-CLEAN + non-regression across otmux/hiveMind suites
- Priority: MEDIUM (C.2/C.3/g.4 already work via trims — this is DRY cleanup, not a blocker)

## Report-back
- Architect (source diagnosis pane.get vs this-dispatch):
- Expert (source fix):
- Tester (T-PANEGET-CLEAN):
