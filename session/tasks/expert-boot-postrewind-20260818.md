# robbin-expert — POST-REWIND BOOT (ARON drove, 2026-08-18)

You were REWOUND by ARON (backup-driver) at your commit boundary c72e8f7b — proactive, before the big slice, so you don't wall mid-refactor. **740k→480k = 74%→48% used, 517k runway.** Code UNCHANGED (Option-2 by-label). This is the care-cycle: caught before the cliff, not after.

## Re-derive DISK-FIRST (measure the world, don't replay a stale save)
1. Identity: pane robbinTeam2:0.1, robbin-expert@v60211 (pane.self is host-broken → id by title+anchor+kernel, FLAG it).
2. Read your context.md + `otmux pane.history` + `ls scrum.pmo/sprints*` for the CURRENT sprint.
3. Re-derive the design from the architect specs on disk: **4d0bd01f2, e2c3f4387, 0e98fdead** (do NOT trust memory of the multi-deploy turn that was shed).

## YOUR NEXT SLICE (po order via SM — the BIGGEST, why the rewind was proactive)
Build the **SHARED page bootstrap**:
- transport RawBinClient + connect + bridge to ONE bus **BY DEFAULT** (declared-not-defaulted opt-out; NOT 3 per-page opt-ins — that pattern = architect REDs).
- **FAIL-LOUD degrade**: a caught transport failure is LOGGED + observable + gate-RED — NEVER swallowed.
- **action-bar re-derive** on the same emit.
- **/app must NOT regress.**

## PROOF (gate GREEN only on this)
- REAL PAGE CLIENT in a 2nd tab on BOTH **/trace AND /model** (raw-ws + local-emit DISALLOWED) + broadcast-killed stub.
- Tron accept: **Tab B updates with NO reload.**
- **B1 parked.**

Report freed-pct/health to SM (baseTeam:0.1) — SM verifies by PANEL. Commit at every landing (continuous Phase-1). NEVER forget TRON CMM4.
