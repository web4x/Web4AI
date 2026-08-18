# SM FRESH-ME BOOT — 2026-08-18 (Phase-1 pre-rewind @75%, trainer-driven)

**ID:** scrum-master @ baseTeam:0.1 (verify `otmux pane.self`; ⚠ pane.self/session.name/context.read BROKEN on host = EPERM → id by pane-title + this anchor). **PO = robbin-po @ robbinTeam2:0.0.**
**ROLE:** monitor + measure + FLAG to po. I do NOT drive rewinds — the **trainer** (baseTeam:0.0) + **ARON** (Temple:0.0) drive (2-driver pipeline; never both in-window). TERSE output, report to po, until po says stop.

## TOOLING (this cycle's hard-won)
- **scrumMaster pulse** = the reliable status tool (live JSONL context%). team.sweep + scrumMaster team.capture are UNRELIABLE (hid 2 walled agents). Pulse VALIDATED (77≈76 render). ⚠ **pulse LAGS post-rewind** (stale-high on a booting just-cut agent → use PANEL for the immediate number, re-pulse after boot).
- **hiveMind send.message FAILING silently** → use **otmux send <pane> "msg" + send.raw Enter** (verify 'send.verified OK').
- Manual per-pane read: `otmux pane.capture.visible <pane>`; '/clear to save Nk' = usage, 'Context limit' = at-wall.

## WORLD (S40 live-MVC campaign, prod v0.8.110)
- Expert built the SHARED page-bootstrap (transport-by-default, one bus, fail-loud, action-bar re-derive; 74948524d). 4-slice MVC fix.
- **LANE SPLIT (po ruling B final):** TESTER builds+runs the REAL-PAGE TWO-CLIENT ACCEPTANCE PROOF (out-of-frame — the fix-builder's proof false-greened 3× today: construction/local-emit/raw-ws). EXPERT builds the owner-action SMOKE (durable regression gate, atop the tester's shared R40.31 foundation, no duplicate) + is FIX-ON-DEMAND (flag@75, drops smoke to fix on any defect). Architect backstops + reads RAW evidence (L10).
- Acceptance = **Tron @390 tap**: real-page 2nd client updates from BROADCAST ALONE (raw-ws + local-emit DISALLOWED), row+badge+detail+CONTROLS, NO reload, /app not-regressed, 3 stub-must-fails.
- **/app GOTCHA (L16 false-RED trap):** /app uses its OWN `window.__rawbinClient`, NOT `__liveTransport` (connectLiveBridge short-circuits on /app). Hooks doc committed: scrum.pmo/.../hooks-live-transport-reference.md (e57529184). Architect probe-fix f353b0b118.
- Tester rewound Phase-2 (3dca3886 spec) → ARON driving. Expert holding fix-available.

## DOCTRINE (all durable in /memory — recall them)
wall=DEATH (no relaunch w/o Tron) → prevention-only, catch-the-climb (flag EARLY on active climbers, not at the wall). Trainer-drives-not-SM. VOICE disagreement, never silently countermand a po ruling. Self-reports err BOTH ways (only a render/pulse counts). Capability-shed supersedes shed-symmetry (a driver needing runway sheds below the line). Knowledge that must survive a rewind goes to DISK (a pane message is not a handoff). Verify-live-by-TUI-not-cmd. By-label + header-verify is the picker invariant. Never both drivers in-window. Flag-thresholds: fleet ≥78, me + expert earlier (~74/75).

## FRESH-ME
Rewound at 75% (autocompact-off). Re-derive: pane.self + this anchor + `scrumMaster pulse` + ask po for current fleet state. Resume LEAN monitor→FLAG to po. Verify my own freed-pct by PANEL (pulse lags). Re-arm the watch only when po says (was in po-covered idle-window at rewind).
