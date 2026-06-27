# Task: team restore + SELF-HEALING + impossible-to-recur (Tron 2026-06-27)

**Trigger (MEASURED, not assumed):** WODA.prod tmux server died because `otmux kill ooshTeam` (bash_history:1722, agent/PO signature) killed the LAST session → tmux auto-exits on no-sessions → ALL agents dropped, vanished from /rc. NOT OOM (box healthy). 29 JSONLs intact = recoverable.

## Three deliverables

### 1. RESTORE (in flight, oosh-po driving)
Re-fork both teams on WODA.prod from TRAINED JSONLs (measured by MAX line count — clones=tens of lines, trained=thousands):
- ooshTeam: oosh-po 29a1e1d1(8941L), oosh-architect 6df08923(2910L), oosh-expert a43c1b23(2656L), oosh-tester 74f27969(6543L)
- robbinTeam2: robbin-po 1751c918(25737L), robbin-expert a2ac40b0(16056L), robbin-skill-expert b6349aee(6858L), robbin-architect be728629(11644L), robbin-req f839a86b(7970L), robbin-tester f7db409b(12891L)
Each: fork → /rename role@WODA.prod → /rc → pane.lock → consistency.audit=0.

### 2. IMPOSSIBLE TO RECUR
- **KEEPALIVE ANCHOR (DONE live):** permanent `__keepalive` tmux session on WODA.prod → server can NEVER auto-exit when team sessions die. Make this STANDARD on every host (hiveMind ensures a keepalive session exists).
- **otmux kill footgun fix (otmux-expert):** `otmux kill <session>` must NOT take down the server when it's the last session. Refuse-or-warn ("this is the last session; killing it stops the tmux server — use `otmux kill <s> --keep`?"), OR auto-create keepalive before killing, OR detach-not-destroy. An agent killing its OWN session from inside must be guarded. NO `--flags` (oosh violation) — use a method/positional. Test: kill last session → server SURVIVES (keepalive holds).

### 3. SELF-HEALING (watchdog — team is a self-healing object)
Extends the constructor-contract principle to TEAMS: a team object always self-heals to "all agents alive."
- **hiveMind team watchdog**: external loop (in keepalive pane / bash, NOT a Claude agent — agents can't self-loop) that periodically checks each registered team session; if a session/agent is missing or dead, AUTO re-forks it from its latest TRAINED JSONL (max-line-count), renames role@host, /rc, registers. Idempotent.
- **teams.save snapshot** kept current (role→trained-uuid→pane) so restore is deterministic.
- On host tmux-server death: watchdog (or a systemd/cron keepalive) detects + rebuilds all teams from snapshot. Teams come back without human action.
- Reuse: teams.save/restore, session.resolve.uuid, the trained-JSONL selection (MAX line count, not newest — the clone trap I hit).

## Owners
- restore: oosh-po (now) · keepalive-standard + watchdog: hiveMind-expert · otmux kill-fix: otmux-expert · selection-by-max-lines + tests: tester. Drive on WODA.prod dev.

## Report-back
- restore (both teams live/@WODA.prod/rc/audit):
- keepalive-standard + watchdog:
- otmux kill-fix:
