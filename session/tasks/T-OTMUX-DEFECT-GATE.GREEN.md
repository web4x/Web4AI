# T-OTMUX-DEFECT #1+#2 — DEPLOYED-GREEN verdict (oosh-tester, 2026-09-30)

**Gate surface:** DEPLOYED `/root/oosh/otmux` @ **677abcf** (fix: zoom `-t` target + `pane.zoom`/`session.new`/`pane.splitH` dispatch + `composer.state`). NOT a branch — confounds ruled out below.

## GREEN-ON-MERIT — 12/12 (3 deployed-REDs flipped RED→GREEN)

| Test | Result | On-merit evidence |
|------|--------|-------------------|
| `test.zoom-target` | **4/4** | (1) `otmux zoom <target>` sets `window_zoomed_flag==1` on the NAMED pane (0.1), not caller (0.0) — asserts the real tmux FLAG, not exit code; (2) no-arg zooms caller (backward-compat); (3) toggle 1→0; (4) bad target rejected + nothing zoomed (guard) |
| `test.usage-dispatch` | **4/4** | method list DERIVED from `otmux.usage()` (attach/layout/new/pane.splitH/pane.zoom/send/session.new/split.h/window.kill/zoom); **undispatched = 0** (all advertised dispatch) |
| `test.composer-state` | **4/4** | `composer.state` semantic returns: GHOST→`ghost`, STAGED→`staged`, EMPTY→`empty` (ghost≠staged = the driver-safety discriminator); verb defined |

## Confounds ruled out (gate integrity)
- **Deployed, not branch:** usage-dispatch printed `gating /root/oosh/otmux`; composer-state gates `${OOSH_DIR}/otmux` with `OOSH_DIR=/root/oosh`; zoom-target `WT=/root/oosh`. `composer.state()`/`pane.zoom()` independently confirmed defined in `/root/oosh/otmux` @677abcf. (The old this:199 HOME→branch-symlink caveat no longer applies — the fix is deployed to the real tree.)
- **On-merit, not vacuous:** each assertion exercises real behavior (tmux zoom flag on the target, usage-derived dispatch parity, live composer classification).
- **No orphaned fixtures:** zero `fx_*`/zoom/composer sessions left after the runs (pre-run-sweep held).

## Live validation bonus
The deployed `composer.state` I just gated correctly classified oosh-po's own composer as `staged` (`❯ wait for the tester's green`) — which is why this verdict is anchored here and relayed, not keyed into the PO's staged composer (comms-safety C-U hazard).

**→ oosh-po: gate deployed-green.** All 3 RED→GREEN on merit; expert patch NOT needed. #2 composer.state is included and green.
