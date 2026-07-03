> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — parent task (dual-link: parent links down to this).

# testSend DEMO MATRIX — send + capture reliability (otmux + hiveMind)
**For Tron's live predict→test→prove. Session `testSend`, 4 oosh SHELLS.** Architect enumeration (oosh-architect 2026-07-03). Legend: **[S]** works on a bare shell (demo-direct) · **[C]** needs a CLAUDE target (real agent pane, or the `pane_current_command=claude` fixture) · **[R]** needs a remote host.

## A. SEND methods
| Method | Does | Prefix | Verify | On shell? | Proven by |
|---|---|---|---|---|---|
| `otmux send <t> <args…>` | DISPATCHER — detects single-key / text+key / all-keys / text; routes to raw or send.smart | (via smart) | (via smart) | **[S]** | T-SEND-MATRIX (all) |
| `otmux send.raw <t> <keys>` | RAW key events — **no** prefix/verify/poke/queue (a key ≠ a message) | NO | NO | **[S]** | matrix **K** |
| `private send.smart` | accept-edits clear → prefix (claude-only) → delegates to send.verified | claude-only | yes | **[S]** (shell = no prefix, no Escape) | matrix **A/E/G** |
| `otmux send.verified <t> <txt>` | stage ONCE → verify COMMIT (probe left the ❯ region, g.7) → **Enter-only** poke, never resend → honest rc{0/2} | — | YES | **[C]** for real verify (shell has no ❯ → vacuous rc0, g.6#1) | send-selfheal **5/5**, matrix **B/C/H** |
| `otmux send.enter`→`sendEnter` | text `-l` → Escape(claude) → Enter (legacy raw submit; boot/cmd sends) | NO | NO | **[S]** | boot/cmd paths |
| `hiveMind agent.send <name>` | ROUTE by live state: idle→inform · busy→**queue** · overlay→reject · unknown→auto-heal | via inform | via inform | **[S]** but shell state → **QUEUE** (not inform) | matrix **F**, dup-fix |
| `hiveMind agent.inform <pane>` | INFORM path → `otmux send` (pre-cond: idle ❯) | claude | yes | **[C]** (needs idle ❯) | dup-fix, matrix **F** |

## B. CAPTURE methods
| Method | Captures | On shell? | Proven by |
|---|---|---|---|
| `otmux pane.capture <t> <?N:20>` | last N **visible** lines, bridge-reliable (== raw tmux -p) | **[S]** | every matrix verify + T-SWEEP + send.verified |
| `otmux pane.capture.visible <t>` | visible area only, no scrollback | **[S]** | (compose) |
| `otmux pane.history <t> <?N:100>` | scrollback **incl. off-screen** history | **[S]** | (long-output cases) |

## C. CASES × expected × where proven
| Case | Exercises | Expected | Where | Proven by |
|---|---|---|---|---|
| **bash-SHELL target** | kind=shell | send.smart: NO prefix, NO Escape, stage+Enter, dispatch rc0 | **[S]** | matrix A2/E3/G1 |
| **claude-TUI target** | kind=claude | prefix + Escape-dismiss + ❯-commit verify + poke | **[C]** | matrix A1/B/C |
| **bash-parent claude** | kind FN (g.4) | classifies CLAUDE (keeps prefix+verify) | **[C]** | matrix A3 |
| **node-shell (not claude)** | kind FP (g.1) | classifies SHELL, **no Escape** | **[S]** (run node) | matrix A4/G2 |
| **single-key** | send.raw Enter/C-u/↑↓ | raw key, no prefix/verify/queue | **[S]** | matrix K1-K5 |
| **text + trailing key** | send "x" Enter | text (prefix if claude) then raw key | **[S]** | matrix (case-2) |
| **all-keys chain** | send Down Down Enter | ALL raw, no prefix | **[S]** | matrix K5 |
| **/command (picker)** | send "/rewind" | slash-autocomplete; send.verified dismisses+commits; picker opens | **[C]** | task-s2-j / rewind-drive |
| **[@-prefix** | text→claude | `[@sender]` prefix applied EXACTLY ONCE (BUG9) | **[C]** | matrix E1/**E5** |
| **long / WRAPPING** | >120-char msg | region-scan detects commit despite wrap (no false rc0) | **[C]** | matrix H, **g.7** |
| **BUSY recipient** | generating / `sleep` | send.verified refuses Escape (idle-only); agent.send → QUEUE | **[S]** (sleep) / **[C]** (generating) | matrix G4/F, route |
| **IDLE recipient** | idle ❯ / shell prompt | delivers/dispatches rc0 | **[S/C]** | matrix B1/C4 |
| **queue path** | agent.send to busy → enqueue; idle → drain | rc0-gated dequeue, no silent drop, **NO dup** | **[S]** (shell=queue) | matrix F, **dup-fix** |
| **remote** | ossh-exec on remote host | send.verified runs ON remote (self-similar); unreachable → marker, no hang | **[R]** | matrix J, c.0 remote |

## 4-SHELL DEMO PLAN (predict → run → capture)
**Provable DIRECTLY on the 4 shells** (predict each): `otmux send "cmd"` → bash runs it (capture shows output) · `send.raw` Enter/C-u/↑↓/chain → keys land · `send.enter` → cmd runs · **send.smart shell path** → NO `[@` prefix, NO Escape, rc0 "dispatched to …(shell)" · all 3 captures return correct content · single-key / text+key / all-keys · BUSY(`sleep 30`) vs IDLE · **shell→shell** send (shell A `otmux send B "x"` → B receives) · **`agent.send` to a shell → QUEUES** (route=queue, NOT inform) + drain mechanics · **zero dup** on every path.

**Predictions to call out** (non-obvious — impress): (1) `agent.send` to a bare SHELL **queues, does not inform** — sweep.detect classifies a shell as non-idle. (2) `send.smart` to a shell adds **no prefix, no Escape** (g.1) — clean dispatch; a claude target would get both. (3) `send.verified` on a shell returns rc0 but the verify is **vacuous** (no ❯) — honest, not a real commit-check (g.6#1). (4) `send.raw <key>` is **never** prefixed/queued (K). (5) **No duplicate** on any path (the fccdad8 auto-heal fall-through fix).

**Needs a CLAUDE target** (add ≥1 real agent pane, or the `pane_current_command=claude` fixture): ❯-commit verify · `[@`-prefix (+E5 once) · autocomplete-dismiss Escape · `/command` + `/rewind` picker · wrap-probe (g.7) · `agent.inform` delivery · poke-on-rc2. **Needs a REMOTE host**: ossh-exec send (J).

**Suite map**: `test.send-selfheal` (5/5, send.verified) · `test.dispatch-submit` (5) + `test.send-session` (3) ⊂ **T-SEND-MATRIX** (50 cells, the superset) · `T-SWEEP-ALL` (capture-based fleet) · `T-VERIFY-WRAP` (g.7) · `T-REWIND-DRIVE` (picker).
