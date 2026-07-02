[Back to Sprint 2 Planning](./planning.md)

# Task S2-C: registry / route / identity integrity
[task:uuid:e86af5f5-f8a4-48ee-a52d-7cd6c2534c2b]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [ ] creating test cases
  - [~] implementing (route auto-heal shipped; reconcile+audit+boot-id open)
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- down
  - [task-s2-c.1-route-autoheal.md](./task-s2-c.1-route-autoheal.md) — C.1 route auto-heal + fd/EMFILE root-cause
  - [task-s2-c.2-reconcile-after-fork.md](./task-s2-c.2-reconcile-after-fork.md) — C.2 adopt orphans + team.audit
  - [task-s2-c.3-boot-identity-per-host.md](./task-s2-c.3-boot-identity-per-host.md) — C.3 boot/identity resolution (OTR-11)

## Description
**Role: architect (design) → expert (impl) → tester (validate)**
One root family behind BUG10-adjacent chaos: registry/route/uuid drift under load. Fix so the controller's routing + identity are always TRUE.

## Open items
- [x] **C.1 route auto-heal** — `agent.send` re-resolves unknown-route from live + retries before queue (SHIPPED). Watch: does route=unknown-state recurrence STOP now the u20 malware (1001 sockets → EMFILE suspect) is gone? Confirm the fd-exhaustion source.
- [ ] **C.2 reconcile-after-fork + team.audit** — adopt raw-forked orphans (tty-match → registry.set → consistency.fix); `team.audit` flags ALL orphans (live-claude+empty-uuid/unknown-route) in one sweep. (architect designing.)
- [ ] **C.3 boot/identity resolution** — hook must resolve `role@host` from ground truth; never emit an "unknown" boot that clobbers a real agent (live artifact seen [session/agents/unknown/boot.md](../../../session/agents/unknown/boot.md)).

## Definition of Done
- route survives sustained RC-driving (no recurrence); unknown-route auto-heals, never silent-drops
- orphans adoptable + detectable via one audit; boot hook resolves role@host correctly
- tests: T-ROUTE-AUTOHEAL, T-RECONCILE-FORK

*Sprint 2 — Controller Reliability · task-s2-c*

---
## ✅ C.3 / OTR-11 boot-identity DESIGN done (architect `52bdb7e`, task-s2-c.3) — PO APPROVED
Root cause: the boot hook (`pre-compress.sh:L13`) is the LAST `$TMUX_PANE` holdout BUG7 missed → stale pane → falls to 'unknown' → clobbers shared `session/agents/unknown/boot.md` (the live artifact I flagged). Fix: anchor on `otmux pane.self`; resolve role@host from LIVE pane title (> registry/env cache); @host-aware dir pick (**auto-closes the per-host boot-resolution directive** from agent-dirs-per-host-split); FAIL-SAFE never writes the shared unknown sink (skip+warn / quarantine-unique) + retire `unknown/` as a target; shared `identity.resolve` + team.audit flags it (with C.2). Same live-is-truth family. **Expert impl + tester T-BOOT-IDENTITY.**
- **C-family status**: C.1 route auto-heal = SHIPPED; C.2 reconcile-after-fork = DESIGN done; C.3 boot-identity = DESIGN done. Expert impl of C.2+C.3 awaits the expert rewind (100%/saved ec981f3, Tron /rewind pending).

---
## ✅ C.0 shared live-reader — APPROVED as the DRY FOUNDATION (oosh-po, 2026-07-02)
Architect spotted the meta-DRY gap: parity/C.2/C.3 all say "use the shared reader / identity.resolve" but NONE specs it as ONE named primitive → risk the expert builds 3 divergent readers (the re-enumeration parity exists to kill). **APPROVED: architect designs `task-s2-c.0-live-reader`** = ONE canonical live-truth reader (proc-args → tuple `{pane,tty,role,uuid,kind,host}`) that parity + C.2 + C.3 ALL consume. Must handle LOCAL vs REMOTE sourcing (remoteOOSH/PF3 unreadable by local proc-args → `ossh-exec tree.detailed`). NB: parity already shipped `private.hiveMind.live.tupleset` — c.0 CANONICALIZES + extends that (add tty/host + remote), it's not from scratch. **Sequencing: c.0 is the foundation → C.2/C.3 impl consume it (expert builds ONE reader, not three).**

## ✅ T-RECONCILE-FORK RED delivered (tester, dev test/test.reconcile-fork) — scenario-first
4/4 FAIL by design, FULLY ISOLATED (temp HIVEMIND_SESSIONS/REGISTRY; live registry md5 UNCHANGED bc6f6673 — zero real-agent route disturbed; dynamic live-anchor Temple:0.0). FORKUUID/EMPTY-UUID (I2b skipped) · AUDIT-ORPHAN/DEAD-UUID (team.audit = Unknown method, not built). Each asserts healed-uuid==live-proc-args-truth → expert's I2b(via c.0 reader)+team.audit green them by construction. The OTR-3 red is ready.
