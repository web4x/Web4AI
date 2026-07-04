> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.4: isClaudeCode mis-classifies real agents as shells (kind)
[task:uuid:]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done — tester T-KIND-CLASSIFY 5/5 PASS, PO QA PASS

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
- Expert (c.0 kind + isClaudeCode harden): **DONE 2026-07-02 `6213ad6`** (dev). **ROOT CAUSE (measured, deeper than "process.running rc is unreliable"):** `claudeCode.process.find` reads the pane tty via `tty=$(otmux pane.get <pane> '#{pane_tty}')`, and the `this` CLI dispatch prepends a **stray leading newline** → `tty="\n/dev/pts/N"` → `${tty#/dev/}` doesn't strip → the `ps | awk '$2 == tty'` match FAILS → the bash-parent claude process is never found → `process.find`/`process.running` rc1 → `isClaudeCode` (otmux) AND `pane.kind` (hiveMind:3353) AND every proc-args claude check misclassify a LIVE agent as shell. (Same `otmux pane.get` artifact that bit C.2/C.3.) **FIX: trim the tty in `process.find` (`tr -d '[:space:]'`)** → the existing robust proc-args detection (tty→ps→grep claude) now works. **Verified live on WODA.prod:** `isClaudeCode` now returns CLAUDE for the PO's bash-parent claude pane (ooshTeam:0.0) and my own (ooshTeam:0.3); a fresh shell → shell; a plain `node` pane (no claude) → shell (g.1 M2 preserved). Non-regr: send-matrix 8/8, dispatch-submit 5/5, claudeCode suite 83/55 == HEAD baseline (0 added fails).
  - **Deviation from DoD note ("kind from c.0 canonical reader"):** consuming hiveMind's c.0 `live.tupleset` kind from `isClaudeCode` would INVERT the MVC dependency (otmux is the low-level View; hiveMind is the high-level Controller — otmux must not depend on it). c.0's kind was ALREADY robust because `agents.discover`→`claude.processes` uses a BATCH `tmux list-panes` (no per-pane `otmux pane.get`, so no newline artifact). The ONLY broken path was `isClaudeCode`→`process.running`→`process.find`. Fixing `process.find`'s tty makes that path robust at the source — same detection quality as c.0, no boundary violation, and it also heals `pane.kind`/`pane.model`/`process.running` fleet-wide. If the architect still wants the explicit c.0-kind plumbing, flag it — but the root fix is cleaner + broader.
  - **Root note:** the underlying `otmux pane.get` stray-newline (this-dispatch artifact) is now worked-around in 3 sites (session.discover C.2, pre-compress hook C.3, process.find g.4). Recommend a dedicated fix at the `this` dispatch or `otmux pane.get` to stop patching per-consumer. (Flagged repeatedly; needs PO/architect scoping — kernel-level, out of g.4 scope.)
- Tester (T-KIND-CLASSIFY): READY — bash-parent claude pane → `isClaudeCode`=CLAUDE → send takes claude path (prefix+verify); fresh shell → shell; node-without-claude → shell (no false positive). Commit `6213ad6` on dev.

---
## ✅ g.4 DONE (expert 6213ad6) — PO APPROVED (deviation accepted)
ROOT CAUSE (deeper than "process.running unreliable"): `process.find` reads tty via `otmux pane.get`, and the this-dispatch prepends a STRAY NEWLINE → `tty='\n/dev/pts/N'` → `ps $2==tty` match fails → bash-parent claude never found → isClaudeCode/pane.kind misclassify LIVE agents as shell. **SAME `otmux pane.get` stray-newline artifact as C.2 + C.3 = a recurring root.** FIX: trim tty in `process.find` → the existing robust proc-args detection works.
- **DEVIATION APPROVED**: expert chose root-fix over the designed "consume c.0 kind" because isClaudeCode(otmux/**View**) consuming hiveMind(**Controller**) reader = MVC INVERSION; c.0 kind was already robust. Correct architectural call — root-fix is better + avoids the inversion.
- VERIFIED: isClaudeCode = CLAUDE for bash-parent panes (Tron 0.0 + expert 0.3); shell→shell; node-no-claude→shell (g.1 M2 kept). Non-regr: send-matrix 8/8, dispatch 5/5, claudeCode==baseline.
- **Tester T-KIND-CLASSIFY** verifies. **Send-family complete pending Tron dup live-confirm.**
- **RECURRING-ROOT FLAG → task-s2-g.6**: `otmux pane.get` stray-newline caused C.2 + C.3 + g.4 (all trimmed at the consumer). Fix at SOURCE (pane.get shouldn't emit it) = DRY; the per-consumer trims become belt-and-suspenders.

## ✅ g.4 PO QA GATE — PASS (oosh-po@WODA.prod, 2026-07-03, on tester report)
Tester T-KIND-CLASSIFY 5/5 (in send-matrix 12/12, dev): A1 direct-claude→CLAUDE+prefix · A3 REAL bash-parent agent (Temple:0.0)→isClaudeCode=CLAUDE via tty-trim→claude path (prefix+verify) · A2/E3 fresh-shell→shell (no prefix, delivered once) · A4 node-no-claude→shell (no false-pos, g.1 M2 held) · A6 kind from proc-args (c.0/g.4 canonical). Isolated (real agents read-only, md5 unchanged). **g.4 DONE.**
