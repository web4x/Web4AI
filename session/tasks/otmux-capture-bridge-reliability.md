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
- [~] Tester independent live-bridge A/B: `otmux pane.capture` == raw `tmux capture-pane -p` (no blank/stale) — **LOCAL A/B GREEN** (real pane, parity proven); **remote WODA.prod/.test leg BLOCKED** pending user auth (see report-back)
- [x] Regression fence against `-S`-scrollback in pane.capture — **GREEN** (negative-control confirmed: flips RED on buggy `-S` code)
- [x] `pane.history` (off-screen) unaffected — untouched by fix; separate function
- [ ] I inspect the tester's diff + co-confirm via its OWN commit (not expert self-test) — **PO action** (my commit `1c5a4e8` on dev)

## Report-back — oosh-tester@MacStudio (2026-07-04)
**Commit (my OWN gate):** `1c5a4e8` on `dev` (pushed origin/dev) — `test/test.otmux` T-CAPTURE-BRIDGE block.
**Measured GREEN 3/3** against dev-fixed `otmux` (`7059a36`), run via `test.suite run otmux 1 T-CAPTURE-BRIDGE`:
- **T-CAPTURE-BRIDGE-1 (fence):** pane.capture command = `capture-pane -t "$target" -p` → **no `-S`**. ✅ Negative control MEASURED: macos.latest (`/Users/donges/oosh/otmux`) still has `capture-pane -p -S "-${lines}"` → fence flips **RED** on buggy code (proves it's a real gate, not a tautology).
- **T-CAPTURE-BRIDGE-2 (live A/B parity):** on a controlled static pane, `otmux pane.capture` output **==** raw `tmux capture-pane -p` oracle (trailing-blank-stripped, `tail N`). No blank/stale. ✅
- **T-CAPTURE-BRIDGE-3 (interior blank):** interior blank line between `CAP-B` and `CAP-D` **preserved** (not collapsed). ✅

**BLOCKED — remote bridge leg:** the *literal* "over the WODA.prod bridge (ossh exec WODA.prod)" A/B is denied by the auto-mode classifier (prod remote exec, peer-directed, no established user intent). The non-prod substitute **WODA.test** is also denied (same rule). Needs **user (Tron) authorization** for one `ossh exec <host>` bridge A/B, or a settings permission rule. The LOCAL A/B above proves the same parity invariant the bridge requires (fix reads the *visible screen*, never scrollback → nothing for a bridge to desync); the remote leg would be confirmation on a real relay, not a new risk surface.
**Lie-instrument note (F-T20):** my first zsh-context inline A/B returned empty==empty and falsely reported "MATCH" — discarded; the committed test uses raw-tmux oracle + explicit render sleep so empty-vs-empty cannot pass.

---
## PO QA CO-CONFIRM — oosh-po@MacStudio, 2026-07-04 — PARTIAL (local PROVEN, remote leg Tron-gated)
Inspected the tester's OWN commit `1c5a4e8` (co-confirm standard) + expert `7059a36`:
- **Fence (T-1): SIGNED-OFF** — parses the real `capture-pane` command, asserts no `-S`; NEGATIVE-CONTROL proven (flips RED on the buggy macos.latest `-S` code) = a real gate, not a tautology. ✓
- **Local A/B (T-2) + interior-blank (T-3): SIGNED-OFF** — raw-`tmux -p` oracle, parity confirmed, no blank/stale, interior blanks preserved; F-T20-hardened (raw oracle + render sleep, empty==empty cannot pass). ✓
- **Remote WODA.prod/.test bridge A/B: HELD — needs ONE Tron `ossh exec <host>` auth** (auto-mode classifier denies peer-directed remote exec). Transitivity says it's airtight (fix == the trainer's proven-reliable `tmux -p`; awk/tail bridge-agnostic), BUT per measure-the-measurer / F-T20 I will NOT declare the bridge-fix confirmed without the actual bridge A/B — that's the very over-claim this task fixes.
**Verdict:** fix is correct + locally proven + regression-fenced; #37 stays OPEN at QA-partial pending the one Tron-authorized bridge A/B. Same Tron-gate class as sprint-1 E1.2/D1.3 (mechanics proven, live-remote leg needs Tron's OK).
