[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 19: claude-target FIXTURE harness — captured-proof for the [C] cases (04/05/10/11/12)
[task:uuid:c1f1x-fixture-harness]

## Traceability
- up
  - [Sprint 1 Planning @ WODA.prod](./planning.md)
- down
  - unblocks: [task-04 claude-target](./task-04-claude-target.md) · [task-05 bash-parent-claude](./task-05-bash-parent-claude.md) · [task-10 slash-command-picker](./task-10-slash-command-picker.md) · [task-11 at-prefix-once](./task-11-at-prefix-once.md) · [task-12 long-wrapping](./task-12-long-wrapping.md)
- reuses: `test/test.send-selfheal` fake-claude fixture (647ce3d)

## Deliverable (architect design → expert impl → tester)
A REUSABLE **fake-claude TUI fixture** so the `[C]` claude-target cases are **captured-proof** (assert on `pane.capture`), NOT eyeballed on a live agent. Extends the send-selfheal fixture into a shared harness the [C] task tests source.

## The reference + THE trap it already solved
`test.send-selfheal` (647ce3d): `claude` = a **copy of the bash BINARY** (so `pane_current_command==claude` → the fixture gate AND `isClaudeCode` both hold; a bash *script* would report comm=bash). It runs `fake.claude.sh` rendering a real `❯`; on Enter it CLEARS the input + moves text ABOVE a fresh `❯` (a real COMMIT); C-u clears. `stty -echo` → only program stdout counts = times DELIVERED (dup detection). Isolated scratch panes.
**THE TRAP (must not regress):** the OLD `cat` fixture had NO `❯` → empty region → the g.7 verify passed TRIVIALLY. **A fixture must faithfully emulate the ADVERSARIAL behavior** (autocomplete eating Enter, wrap hiding the tail) so the test proves the CODE handles it — not that the fixture is lenient. This is the #1 rule of the harness.

## Harness = one shared helper + fixture MODES
`setup_fake_claude <mode>` (mirrors send-selfheal's setup) → spins an isolated scratch pane, launches `claude` (bash-binary copy) on `fake.claude.tui.sh <mode>`, waits until `pane_current_command==claude`, returns the pane target. The fixture SCRIPT gains modes, each emulating exactly the REAL behavior its case keys off:

| Case | Fixture MODE — must faithfully emulate | Test asserts (captured) |
|---|---|---|
| **task-04** claude-TUI | base: `❯` + Enter-commit + C-u (already there) | prefix `[@…]` applied; after send, probe LEFT the `❯` region → rc0 committed |
| **task-05** bash-parent | launch the fake `claude` UNDER a **bash parent** (`bash -c 'exec … claude …'`) so `pane_current_command==bash` BUT a claude child runs | kind resolves **claude** (via c.0 proc-args, NOT `process.running` rc) → gets prefix+verify (g.4 false-neg guard) |
| **task-10** /command picker | on `/`, render fake **slash-autocomplete**; on `/rewind`+Enter render a **PICKER** (`❯ 1. Restore conversation … 4. Never mind`), Up/Down moves highlight, Enter selects; a **stall submode** (select renders NOTHING) for the rewind fail-safe | picker OPENED (capture signature); navigate to option; select → sub-menu OR stall→fail-safe rc2 (never blind-re-Enter) |
| **task-11** @-prefix once | on buffer starting `[@`, render fake **@-mention autocomplete**; **Enter with popup open + NO prior Escape → SELECTS the suggestion (does NOT commit)** = the autocomplete-eats-Enter ROOT; **Escape → dismiss → next Enter commits** | committed line has EXACTLY ONE `[@…` (BUG9/E5); Escape-then-Enter commits; without Escape it stages (proves the Escape is load-bearing) |
| **task-12** long/wrap | NARROW fixture pane + faithful char echo → a >120-char line WRAPS across rows (tail on a continuation row with NO `❯`) | g.7 region-scan (last-`❯`→bottom) still detects commit; a staged wrapped line → rc2 (not false rc0) |

Shared sub-behaviors the modes compose: **generating state** (`esc to interrupt` marker, toggled) for the never-Escape-when-generating guard (also serves task-13 busy); **C-u clear**; **stty -echo** delivery counting.

## Design rules (correct-by-construction for a TEST fixture)
1. **Faithful adversary** — emulate the failure the code must survive (Enter eaten, wrap hides tail, bash-parent hides kind). Never a lenient fixture (the `cat` trap).
2. **Deterministic + non-interactive** — every assertion reads `otmux pane.capture` (whole capture, no tail/head); no eyeball, no real agent, no network.
3. **Isolated** — scratch tmux session + `$WORK/bin` PATH shim; kill on teardown; touch ZERO real agents/registry (the reconcile-fork isolation precedent).
4. **One helper, many modes** — DRY: `setup_fake_claude <mode>` shared by all [C] tests + `test.send-matrix` groups A/E/H + task-10's picker (and reusable by T-REWIND-DRIVE).

## Acceptance / handoff
- [ ] `setup_fake_claude <mode>` + `fake.claude.tui.sh` with the 5 modes above; `pane_current_command==claude` (bash-binary copy) so isClaudeCode holds; bash-parent submode for task-05.
- [ ] each mode faithfully emulates its adversarial behavior (Enter-eaten popup, picker, wrap, bash-parent) — NOT lenient.
- [ ] the 5 [C] task tests (04/05/10/11/12) assert purely on capture; GREEN; zero real-agent touch.
- **Expert**: build the shared harness by extending `test.send-selfheal`'s fixture; commit. **Tester**: wire tasks 04/05/10/11/12 onto it — each predict→drive→capture→assert; add the fixture-faithfulness self-check (a mode that WOULD false-pass a lenient fixture must FAIL a broken code path).

## Report-back
- Architect (fixture harness design): **DONE 2026-07-03** — reusable fake-claude TUI (bash-binary copy = isClaudeCode true) extending the send-selfheal fixture; 5 MODES each faithfully emulating the ADVERSARIAL behavior its [C] case keys off (claude-TUI ❯-commit / bash-parent kind / slash-picker+stall / @-autocomplete-eats-Enter-unless-Escape / narrow-wrap); `setup_fake_claude <mode>` shared helper; captured-proof, deterministic, isolated. #1 rule: faithful adversary, never a lenient fixture (the `cat`-no-`❯` trap). Unblocks 04/05/10/11/12 for expert/tester.
- Expert (impl):
- Tester (wire the 5 cases):
