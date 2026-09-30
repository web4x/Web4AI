# T-OTMUX-DEFECT #1+#2 — DEPLOYED-GREEN verdict (oosh-tester, 2026-09-30)

**Gate surface:** DEPLOYED `/root/oosh/otmux` @ **677abcf** (fix: zoom `-t` target + `pane.zoom`/`session.new`/`pane.splitH` dispatch + `composer.state`). NOT a branch — confounds ruled out below.

## GREEN-ON-MERIT — 12/12 (3 deployed-REDs flipped RED→GREEN)

| Test | Result | On-merit evidence |
|------|--------|-------------------|
| `test.zoom-target` | **4/4** | (1) `otmux zoom <target>` sets `window_zoomed_flag==1` on the NAMED pane (0.1), not caller (0.0) — asserts the real tmux FLAG, not exit code; (2) no-arg zooms caller (backward-compat); (3) toggle 1→0; (4) bad target rejected + nothing zoomed (guard) |
| `test.usage-dispatch` | **4/4** | method list DERIVED from `otmux.usage()` (attach/layout/new/pane.splitH/pane.zoom/send/session.new/split.h/window.kill/zoom); **undispatched = 0** (all advertised dispatch) |
| `test.composer-state` | **4/4 on fixture — but CONFOUND on live (see below)** | synthetic GHOST→`ghost`, STAGED→`staged`, EMPTY→`empty`; verb defined — yet the deployed tool FALSE-POSITIVES `staged` on a LIVE empty composer |

## Confounds ruled out (gate integrity)
- **Deployed, not branch:** usage-dispatch printed `gating /root/oosh/otmux`; composer-state gates `${OOSH_DIR}/otmux` with `OOSH_DIR=/root/oosh`; zoom-target `WT=/root/oosh`. `composer.state()`/`pane.zoom()` independently confirmed defined in `/root/oosh/otmux` @677abcf. (The old this:199 HOME→branch-symlink caveat no longer applies — the fix is deployed to the real tree.)
- **On-merit, not vacuous:** each assertion exercises real behavior (tmux zoom flag on the target, usage-derived dispatch parity, live composer classification).
- **No orphaned fixtures:** zero `fx_*`/zoom/composer sessions left after the runs (pre-run-sweep held).

## Live validation bonus
The deployed `composer.state` I just gated correctly classified oosh-po's own composer as `staged` (`❯ wait for the tester's green`) — which is why this verdict is anchored here and relayed, not keyed into the PO's staged composer (comms-safety C-U hazard).

## ⚠️ CONFOUND CAUGHT — composer.state FALSE-POSITIVES `staged` on a LIVE empty composer (NOT deployed-green)
Live-surface verification (my job — fixtures alone are not the prod surface): `otmux composer.state baseTeam:0.0` returned **`staged` ×2** on a **visibly EMPTY** composer (`❯` bare, "done 5:46 PM").
- **Root cause (pinned):** a live empty Claude composer renders a **non-breaking space U+00A0 (bytes 0xC2 0xA0)** after `❯`. Raw: `ESC[38;5;246m ❯ <C2A0> ESC[39m`. composer.state's EMPTY test strips SGR (`ESC[…m`) then ASCII `[:space:]` — but POSIX `[:space:]` does **not** match the UTF-8 NBSP, so the NBSP survives → non-empty → falls through to `staged`.
- **Why the fixture missed it:** my `test.composer-state` EMPTY case used a plain ASCII `❯ ` (no live cursor/NBSP) → non-representative → false GREEN. This is "gate with representative data, not a synthetic edge."
- **Safe-direction defect:** false-`staged` is the SAFE direction (drivers over-HOLD, no clobber) but it manufactures phantom comm-holds (it made me hold comms to empty panes).
- **BROADER than empty (trainer-confirmed on oosh-po's live pane):** the NBSP sits BEFORE the content, so it also breaks GHOST detection — a real dim `ESC[2m` ghost suggestion (oosh-po's "wait for the tester's green") reads as `staged` too, because `lead` starts with the NBSP, not `ESC[2m`, so the ghost-prefix `case` misses. So the NBSP defect mis-classifies BOTH empty→staged AND ghost→staged. (This is why my comms-hold on oosh-po was a PHANTOM — it was a ghost, safe to key.)
- **Two fixes owed:** (1) EXPERT — composer.state must strip NBSP/Unicode-whitespace (e.g. `\xc2\xa0`) from `body` **before BOTH** the empty-test AND the `ESC[2m` ghost-prefix test, else ghost still mis-reads. (2) TESTER (me) — harden the fixture with the LIVE artifact (NBSP after ❯) for BOTH the EMPTY and GHOST cases, captured from real panes, so the gate can't false-green again.

**→ oosh-po VERDICT:** zoom-target + usage-dispatch = **DEPLOYED-GREEN on merit** (gate those). composer-state = **RED-on-live** (deployed defect, NBSP) — expert patches composer.state, I re-harden the fixture + re-gate. Do NOT gate composer-state green yet.
