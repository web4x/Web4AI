# Task: otmux pane.capture bridge-reliability (read-side sibling of s2-g)

**From**: agent-trainer (Tron order) · **PO**: oosh-po@MacStudio · **Code**: once.sh/dev
**Priority**: HIGH (Tron-directed) · **Date**: 2026-07-04
**Evidence/repro**: `session/tasks/20260704T0100Z.rewind-instrument-findings.md`
**Cross-ref**: s2-g send-reliability (`scrum.pmo/sprints/sprint-2/task-s2-g-otmux-send-reliability.md`, commits 130c44cc/74524585/f8fa3276) — this is the READ-side sibling.

## Bug
`otmux pane.capture` returns BLANK/STALE content when reading a pane THROUGH a bridged/remote otmux (raw `tmux capture-pane -p` stays reliable). Caused a full false investigation (agent-trainer wrongly concluded Claude Code 2.1.197 broken — it is NOT). "Measure the measurer" (trainer F-T20).

## Root cause (architect/expert — DONE, documented)
`otmux.pane.capture` used `capture-pane -p -S "-${lines}"`. The `-S` reaches into the SCROLLBACK buffer; a bridged/relayed pane does not keep scrollback in sync with the live rendered screen → stale/blank frames. `private.resolve.target` NOT implicated.

## Fix (expert — DONE + PO-inspected PASS)
- **`7059a36`** (origin/dev): capture the VISIBLE screen with `-p` (no `-S`), `awk` strips trailing blank padding (interior blanks preserved), `tail -N`. Matches canonical reliable `tmux capture-pane -p`. Off-screen content still via `otmux pane.history`.
- PO diff-inspection: `-S` removed, `-p` visible-screen, awk last-non-blank logic correct, doc comment updated, no history regression. **PASS.**

## OPEN — Subtask (assign now)
### S.1 — oosh-tester (verify): live bridged A/B parity
- Over the WODA.prod bridge, assert `otmux pane.capture <bridged-pane> N` now MATCHES `tmux capture-pane -t <pane> -p | grep -v '^[[:space:]]*$'` (content parity: prompt, footer, task list, interior blanks; no blank/stale). Independent commit (your OWN — the gate, not the expert self-A/B).
- Add a regression test (`test/test.otmux` or a `test.capture.bridge`) that fences the `-S`-scrollback anti-pattern from returning to `pane.capture`.
- Report-back GREEN + commit here.

## Explicitly OUT of scope (flagged, not owned here)
- `otmux send.verified` still uses `-S` — that's the SEND-side, **s2-g territory** (WODA.prod PO's sprint-2). Cross-referenced, not fixed here.

## Acceptance (PO QA gate)
- [ ] Tester independent live-bridge A/B: `otmux pane.capture` == raw `tmux capture-pane -p` (no blank/stale)
- [ ] Regression fence against `-S`-scrollback in pane.capture
- [ ] `pane.history` (off-screen) unaffected
- [ ] I inspect the tester's diff + co-confirm via its OWN commit (not expert self-test)
