> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.5: RADICAL otmux send test coverage — full architect-designed matrix, ZERO regression
[task:uuid:d5568391-4d14-4431-83b1-225a06d2d125]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Description
**From Tron (2026-07-02): "radical test cases with ZERO regression for otmux send, with FULL ARCHITECT COVERAGE."** otmux send is THE critical infrastructure → its tests must be EXHAUSTIVE + regression-proof, and the **architect designs the COMPLETE coverage matrix** (every scenario) — nothing untested. This permanently closes the gate-miss that let the session-path regression through OTR-1.
**Role**: **architect (design the FULL exhaustive coverage matrix)** → tester (implement the radical suite) → PO gate. Full architect coverage = every cell enumerated by the architect, not piecemeal.

## Coverage matrix (architect makes EXHAUSTIVE — this is a seed, not the ceiling)
- **Target KIND**: claude-agent (dispatch) · shell · bare session-name (→active pane) · remote (ossh) · dead/non-existent pane · **bash-parent claude (g.4 — must classify claude, get claude path)**.
- **rc paths**: rc0 submitted · rc2 staged→poke-rescue→rc0 · rc3 blocked/modal (Enter withheld) · rc1 error.
- **Behaviors**: prefix applied (agent) vs not (shell/command) · verify region-check (claude) vs light-confirm (non-claude) · poke×N (claude) vs NO-poke/NO-Escape (non-claude) · idempotent submit/poke (N pokes ≠ duplicate).
- **Queue**: `agent.queue.drain` gates dequeue on rc0 (no silent drop); unsubmittable stays queued.
- **HAZARD guards (regression-critical)**: NEVER SIGTERM/Escape a live foreground (otmux:3119) · NEVER pkill-pattern (BUG6) · g.4 kind.
- **Payload**: long/wrapping message (BUG10 wrap-stall) submits · short pointer.
- **LOCAL + REMOTE**.

## Definition of Done
- Architect delivers the EXHAUSTIVE coverage matrix (every send scenario/hazard enumerated) — full coverage, signed off by PO
- Tester implements the radical suite; GREEN across ALL cells
- **ZERO regression**: existing T-DISPATCH-SUBMIT (5/5) + T-SEND-SESSION (3/3) all still green (this suite is their superset)
- The suite is the PERMANENT otmux-send regression guard (any future send change runs it)

## ARCHITECT COVERAGE MATRIX (oosh-architect, 2026-07-02) — EXHAUSTIVE, the permanent send regression-guard
**Suite name `T-SEND-MATRIX`. 10 groups (A–J), 43 cells. SUPERSET of T-DISPATCH-SUBMIT(5)+T-SEND-SESSION(3) — mapping in §Superset. Each cell tags its testability: `[S]`=static source-assert (unforgeable live state, grep the code — as GATE-SRC does), `[B]`=behavioral (real tmux pane), `[I]`=isolated (planted fixture). Contract under test = OTR-1 verified-submission + g.1 kind-branch. `send.verify` rc: 0 submitted · 2 staged · 3 blocked · 1 error.**

### GROUP A — KIND classification (root of correctness; g.1 false-POSITIVE + g.4 false-NEGATIVE)
Kind decides the WHOLE protocol → pin every kind.
- **A1** `[B]` direct claude (`pane_current_command`∈{node,claude} w/ claude session) → kind=**claude** → claude path.
- **A2** `[B]` bare bash/zsh/sh shell → kind=**shell** → non-claude path.
- **A3** `[B]` **bash-parent claude (g.4)** → kind=**claude** (NOT shell) → claude path (keeps prefix+verify). *False-NEGATIVE guard.*
- **A4** `[B]` **shell running `node`, NOT claude (g.1 M2)** → kind=**shell** (NOT claude) → non-claude path, no Escape. *False-POSITIVE guard — the node hole.*
- **A5** `[B]` ssh pane → kind=shell → non-claude path.
- **A6** `[S]` kind is sourced from the **c.0 canonical `kind`** (proc-args), NOT `process.running` rc — grep send.smart/isClaudeCode read c.0 kind (g.4 DRY, single source).

### GROUP B — rc contract (OTR-1 codes; subsumes DISPATCH RC0/RC2/RC3)
- **B1** `[B]` claude, submit → **rc 0**. *(=T-DISPATCH-SUBMIT-RC0)*
- **B2** `[B]` claude, staged (no submit) → **rc 2**; poke → **rc 0**. *(=RC2-POKE)*
- **B3** `[B]` claude, blocked (modal/permission/overlay/⏵⏵accept/"esc close") → **rc 3**, Enter withheld. *(=RC3)*
- **B4** `[B/I]` invalid/dead target → **rc 1** (refuse, no send).
- **B5** `[B]` claude, still staged after maxPokes → **rc 2** returned (STAGED-UNVERIFIED — HONEST, never a false rc 0). *the poke-exhaustion cell.*

### GROUP C — verify mechanism (region vs light — the OTR-1 core)
- **C1** `[B]` claude REGION: staged text still visible in scrollback but OFF the `❯` input line → **rc 0** (region, NOT text-presence — the false-rc2 trap OTR-1 fixed).
- **C2** `[B]` claude: text STILL on the `❯` line → **rc 2**.
- **C3** `[B]` claude: `esc to int` (processing) → **rc 0** (consumed).
- **C4** `[B]` non-claude LIGHT: shell dispatch → **rc 0** via light check (fresh prompt/echo), NOT `❯`-region. *(=T-SEND-SESSION-SHELL-COMPLETES)*
- **C5** `[B]` non-claude, no `❯`/no prompt visible → **rc 0** (lenient dispatch) — NEVER a false rc 2 that would poke a shell.

### GROUP D — poke (poke vs no-poke; idempotency)
- **D1** `[B]` claude rc2 → poke(=submit) → rc 0. Poke fires ONLY on claude rc2.
- **D2** `[B]` **non-claude → poke-count == 0** (a shell never pokes). *g.1 false-rc2-poke-storm guard. (=T-SEND-SESSION-NON-CLAUDE-PATH)*
- **D3** `[B]` **idempotency**: submit/poke is text-free & repeatable — after 3 pokes the message appears **ONCE**, not 3×.
- **D4** `[S/B]` maxPokes BOUND — poke fires ≤N then returns rc2 (no infinite loop).

### GROUP E — prefix (agent vs not)
- **E1** `[B]` claude + normal text → agent prefix applied.
- **E2** `[S/B]` claude + pointer (`/…` or `[@…`) → NO prefix (pass-through) — the OTR-1 prefix guard.
- **E3** `[B]` non-claude (shell) → NO prefix.
- **E4** `[B]` bash-parent-claude (A3) → gets prefix+verify (the g.4 correctness win — real agent not silently downgraded).

### GROUP F — queue.drain gates rc0, no-drop (subsumes GATE-SRC + NODROP)
- **F1** `[S]` drain dequeues ONLY after rc 0 (gate line before break before dequeue). *(=GATE-SRC)*
- **F2** `[B/I]` unsubmittable (rc≠0) message STAYS queued — no silent drop. *(=NODROP)*
- **F3** `[B]` rc 0 → message IS dequeued (positive dequeue).
- **F4** `[B]` drain to a blocked (rc3) target → message stays, drain bails (never dispatch into a modal).

### GROUP G — HAZARD guards (the scars — regression-critical)
- **G1** `[B]` **NO Escape to a non-claude foreground** (otmux:3119) — key-stream to a shell/session contains ZERO Escape.
- **G2** `[B]` node-shell (A4) → NO Escape (kind=shell guards it) — the g.1 M2 hang cause.
- **G3** `[S]` **send path issues NO `pkill`/pattern-kill** (BUG6) — send dispatches keys only, never reaps. grep the send path clean of pkill.
- **G4** `[B]` Escape fires ONLY on a genuine claude target (present for claude autocomplete-dismiss, absent for shell).

### GROUP H — wrap / long-msg (BUG10)
- **H1** `[B]` **long WRAPPING message** → 1st Enter = newline (no submit) → region-verify rc2 → poke → **rc 0**. *the BUG10 wrap-stall mechanism, proven not-false-rc0.*
- **H2** `[B]` short pointer → submits first try, rc 0, poke-count 0.
- **H3** `[B]` long message after submit → FULL text delivered intact (no truncation/duplication).

### GROUP I — target resolution (session/dead/directional)
- **I1** `[B]` **bare session name** → resolves to ACTIVE pane → dispatches on that pane's kind. *(=T-SEND-SESSION bare-session)*
- **I2** `[B/I]` dead/non-existent pane → rc 1, no hang, no crash.
- **I3** `[B]` session→active-pane KIND branch: active=claude → claude path; active=shell → shell path.
- **I4** `[B]` directional target (U/D/L/R) resolves to the right pane.

### GROUP J — LOCAL + REMOTE
- **J1** `[B]` local claude → full contract (baseline).
- **J2** `[B/I]` **remote pane** (remote-host team via ossh) → send reaches it; protocol applied per its kind; completes (rc0) — no local-only assumption.
- **J3** `[B/I]` remote UNREACHABLE → rc 1/marker, **never hang, never silent success**. *remote fail-safe (mirrors c.0 never-silent-omit).*

### Superset proof (ZERO regression — every existing cell is subsumed)
T-DISPATCH-SUBMIT: RC0→B1 · RC2-POKE→B2/D1 · RC3→B3 · GATE-SRC→F1 · NODROP→F2. T-SEND-SESSION: SHELL-COMPLETES→C4 · NON-CLAUDE-PATH→A2/D2/G1 · BARE-SESSION→I1. **All 8 ⊂ the 43. g.5 ⊇ both suites.**

### Notes for the tester
- Live claude `❯` state isn't forgeable → those cells are `[B]` on a real agent pane OR `[S]` source-asserts (as GATE-SRC does). Prefer `[I]` planted fixtures (fake prompt text in a scratch pane) where a live claude isn't needed — the region-verify parses TEXT, so a scratch pane echoing a `❯ staged` line exercises C1/C2 without a real agent.
- FULL ISOLATION (the reconcile-fork precedent): scratch tmux session, temp registry/queue, live registry md5 unchanged — zero real-agent disturbance.
- Run in CI on ANY otmux/send change = the permanent guard.

## Report-back
- Architect (full coverage matrix): **DONE 2026-07-02** — `T-SEND-MATRIX`, 10 groups / 43 cells, EXHAUSTIVE + SUPERSET of the 8 existing (mapping above → zero regression). Covers: KIND (A, incl. g.1 node false-POS + g.4 bash-parent false-NEG + A6 kind-from-c.0), rc0/2/3/1 (B), region-vs-light verify (C), poke/no-poke/idempotency (D), prefix (E), drain-rc0-gate/no-drop (F), HAZARDS (G: never-Escape-foreground otmux:3119, never-pkill BUG6), wrap/BUG10 (H), session/dead/directional (I), local+remote (J). Testability tagged [S]/[B]/[I]; fully isolated. This is THE permanent send regression-guard. Tester implements.
- Tester (radical suite + zero-regression):
- PO gate:
