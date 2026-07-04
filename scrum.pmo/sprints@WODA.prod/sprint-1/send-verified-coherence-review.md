[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Coherence Review: send.verified design × all sprint-1 cases (03-17)
**Architect (oosh-architect, 2026-07-04).** Reviewed the send.verified design (current impl + g.8 no-poke + task-02 shell-poll + g.7 wrap-region + g.1 kind-branch + task-19 fixture) against every case. **10/15 well-covered; 4 gaps (1 HIGH, 2 MED, 1 LOW) + 1 note.** Emit here; each gap names the affected task + fix direction.

## Coverage map
| Task | Case | Verdict |
|---|---|---|
| 03 shell | non-claude stage+Enter, task-02 poll verify | ✅ covered (g.8+task-02) |
| 04 claude-TUI | prefix+Escape(idle)+1-Enter+g.7 ❯-verify | ✅ covered |
| **05 bash-parent claude** | kind must=claude | 🟡 **GAP-B** |
| 06 node-shell (not claude) | kind=shell, no Escape | ✅ covered (g.1 M2) |
| 07 single-key | send.raw, no prefix/verify/poke | ✅ covered (matrix K) |
| **08 text+trailing-key** | smart text then raw key | 🟢 **GAP-D** (trailing Enter on claude) |
| 09 all-keys chain | all raw, no prefix | ✅ covered |
| 10 /command picker | post opens picker | ✅ covered (posting) — seam-note ↓ |
| 11 @-prefix once | exactly one `[@` (BUG9/E5) | ✅ covered |
| 12 long/wrapping | g.7 region-scan | ✅ covered |
| 13 busy-recipient | generating→no-Escape→rc2→drain / shell poll | ✅ covered — race-note ↓ |
| 14 idle-recipient | delivers rc0 | ✅ covered |
| 15 queue-path | rc0-gate + no-dup + fresh re-drive | ✅ covered (a420664+fccdad8+g.8) |
| **16 remote** | send reaches a remote pane | 🟡 **GAP-C** |
| **17 capture-methods** | capture is reliable | 🔴 **GAP-A** (undermines the whole verify) |

## GAP-A 🔴 HIGH — the verify contract rests on `capture`, which is KNOWN-unreliable on bridged/remote panes (task-17)
Every verify in the design reads a pane capture: send.verified's ❯-region check, task-02's shell poll, g.7's region scan. **But `otmux pane.capture` through a bridge returns BLANK/STALE** — documented in task-s2-g (agent-trainer: it missed real responses, falsely showed "won't clear"/"won't render"; the reliable read is `tmux capture-pane -p | grep -vE '^[[:space:]]*$'`). **So on a bridged/remote pane the verify can silently LIE** — false rc0 (probe "left" a stale/blank capture = phantom commit) or false rc2. This is the deepest gap: the correctness of the ENTIRE self-heal rests on an unreliable primitive, and it fails exactly where GAP-C (remote) lives.
- **Fix**: (1) send.verified's verify must use the RELIABLE read (or detect a stale/blank capture and refuse to conclude — honest rc rather than a phantom rc0); (2) task-17 must HARDEN `otmux pane.capture` for bridged/remote panes (the standing "capture reliability" tooling bug). Until then, DO NOT trust a verify rc on a bridged pane.

## GAP-B 🟡 MED — task-05 bash-parent claude: send.smart's kind still false-negatives
send.smart resolves kind via `isClaudeCode` → (`pane_current_command`∈bash) → `claudeCode process.running` → `process.find`. **g.4 MEASURED that `process.running` returns rc1 for a claude whose parent is bash** → kind=shell → the REAL agent takes the non-claude path → **loses prefix + ❯-verify** (send-correctness gap, silent). The g.4 fix ("kind from the c.0 canonical proc-args kind, not `process.running` rc") is NOT wired into send.smart yet — send.smart still calls `isClaudeCode`.
- **Fix**: send.smart must source kind from the c.0 reader (or harden `isClaudeCode`/`process.find` to detect a claude DESCENDANT, not just the pane's foreground comm). task-05 cannot pass until this lands. Ties GAP-B to task-s2-c.0/g.4.

## GAP-C 🟡 MED — task-16 remote: no concrete send.verified path for a remote target
send.verified is **local-tmux only** (`$TMUX_CMD send-keys`/`capture-pane` = local; 0 ossh refs — g.6 MED). A remote-pane target passed to LOCAL send.verified hits a wrong/absent local pane and the (blank) capture false-rc0s. There is **no design** for how a remote send routes: it must **exec send.verified ON the remote host** (`ossh exec <host> "otmux send …"`, the c.0 self-similar pattern), which means `hiveMind.agent.send` must detect a remote target and ossh-exec — undesigned.
- **Fix**: design the remote-send route (agent.send detects remote host → ossh-exec the send there); until then task-16 is unprovable and GAP-A makes a local attempt silently wrong.

## GAP-D 🟢 LOW — task-08 text+trailing-Enter double-submits on a claude
`otmux send <pane> "text" Enter` (Case 2) does `send.smart "text"` **then** `send.raw Enter` unconditionally. On a CLAUDE target send.smart ALREADY submits (its own Enter) → the trailing raw Enter is a **redundant SECOND Enter** → submits an empty line, or SELECTS on an open picker. The awareness comment exists (otmux ~2026) but the code doesn't suppress it.
- **Fix**: for a claude target, suppress a trailing `Enter` after a smart-send that already committed (a trailing NON-Enter key — Tab/Down — is still legitimate). Non-claude/shell: the trailing Enter is harmless (one dispatch). Assert exactly-one-Enter (ties to the g.8/matrix one-Enter guard).

## Notes (not gaps, worth a line)
- **task-10 seam**: send.verified POSTS /command (opens the picker); the picker DRIVE (navigate/select/fail-safe) is task-s2-j `rewind.drive`. task-10 as "picker opens" is covered by the post; make the seam explicit so the case doesn't assume send.verified drives the picker.
- **task-13 race**: generating is detected ONCE before the Enter; a claude that STARTS generating between the idle-check and the Enter races the Escape-skip. Bounded (worst case a stray Escape into a just-started generation), but note it.

## Report-back
- Architect (coherence review 03-17): **DONE 2026-07-04** — 10/15 covered; 4 gaps: **A(HIGH)** verify rests on `capture` which is known-unreliable on bridged/remote → verify can silently lie (task-17, fix=reliable-read + harden capture); **B(MED)** task-05 send.smart kind still false-negatives bash-parent-claude (not wired to c.0/g.4) → real agent loses prefix+verify; **C(MED)** task-16 remote has no send.verified route (local-only; needs ossh-exec-on-remote); **D(LOW)** task-08 text+trailing-Enter double-submits on claude. +notes (task-10 post/drive seam, task-13 mid-send-generate race).
