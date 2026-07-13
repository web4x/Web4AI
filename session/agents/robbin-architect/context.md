# robbin-architect Context — ESSENCE (Save 2026-07-12)

## ▶ RESUME STATE (read first)
I am **robbin-architect @ robbinTeam2:0.3**, WODA.prod. **Code repo = /var/dev/Workspaces/web4x/Web4RawBin** (MOVED from 2cuGitHub/Web4RawBin — that path is GONE). Session repo = /var/dev/Workspaces/AI/Claude. Node18 = /root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node.
Team panes: 0.0 po, 0.1 expert, 0.2 skill-expert, 0.4 req, 0.5 tester, 0.6 planner. **oosh team = ooshTeam** (0.2 oosh-architect).
**⭐ Rules:** TRON #126 scenario-first-never-backfill. NEVER assume — MEASURE (full uuids; prefix collisions real). **STANDING RULE: report to PO (0.0) BEFORE going idle** — never silent-idle. **Command hygiene: OOSH wrappers ONLY (otmux, no raw tmux), simple direct commands (NO `2>/dev/null`, `| head`, `||`, compound pipes).**

## CURRENT (2026-07-13, post-rewind)
- **S30 R30.2/R30.3 RECONCILE COMPLETE + COMMITTED d88b80fe4.** Canonical R30.2=850a339d(UC 80cb8336->RbTraceTree->Impl d28ee95a), R30.3=6cd770df(UC 9095cd05->RbDetailDrawer->Impl 0267036c). My rewind-boot verify CAUGHT: (1) 2 Task nav dangled at deleted dup reqs/UCs (PO fixed fwd), (2) 4 req/UC .tasks[] BACK-edges dangled at deleted orphan Tasks 76e8683d/0ff8e4aa (PO fixed). Final 3-check GREEN (0 dangling / fwd+back nav / both chains derive). Committed 16 files surgically (excluded unrelated Room 8be52aa9/phone/content churn).
- **MARKER BLOCKER (awaiting PO call):** R30.2/R30.3 [impl] markers (d28ee95a/0267036c) NOT yet placed — the R30.2/R30.3 CODE is UNCOMMITTED EXPERT WIP (rb-trace-tree.ts nodeChildCount/eager-computeBadges + rb-detail-drawer.ts sprint-case in renderDetailForRef), R30.x comments but no markers. Recommended: expert 0.1 places markers + commits code+marker together (Impl desc says "Expert places"), then tester bridges Test. Flagged orphan Impl 7e43dda4 (computeBadges, no owner method) = minor cleanup.

## PRIOR (2026-07-12)
- **T27.5 (S28, current pin) = CHAIN-READY** (just committed). R27.5 req f48fbf5d, 9 ACs. UC 5ff15c57 audit.canonicalRefSlots -> REUSE Class TraceAudit bf626dad -> Method TraceAudit.refSlots a3b0bd66 -> Impl 87983907 [design-ahead]. Derive PASS. Design = design-notes/r27.5-canonical-ref-slot-registry.md: REF_SLOTS[unitType] {fwd/back/cross/data-tier} + EXCLUDE tokens (~500 auth-token false-pos). 4 AXES: (1) ref-integrity/dangling over ALL slots incl ownerIor back-edges, (2) node-well-formedness (missing-uuid/filename!=uuid), (3) one-class-per-file (server.ts allowlisted monolith), (4) marker-has-chain. + 2 chain-gate ACs (detect + delta-scoped enforce; R29.2 folded IN, superseded). Reachability seeds {Requirement,Sprint} roots, forward only. **Expert can build.**
- **T30.1 (S30, TRON PRIORITY) = CHAIN-READY.** UC30.1 e22113cd traceTree.currentSprintEagerLazy -> RbTraceTree 5a057914 (reuse, 1 unit) -> renderCurrentSprintEagerLazy -> Impl e649a695 [design-ahead]. Derive PASS. Shares R26.1 lazy-loader (crossRef R26.4+R26.1). Method spec: 2 top nodes (CurrentSprint + eager-lazy Sprints), eager sprint-nodes/lazy tasks-on-expand.
- **R27.8 DONE** (drawer lifecycle, tester r279 GREEN 58/327). X->minimize, close-clears-state, [minimized] visible peek, unconditional select->open PRESERVING open-state (Tron B). Lesson: "at least X = FLOOR not fixed".
- **Backlog designed+wired (design-ahead):** R29.3 ior:class:Server config unit (Class ServerConfig), R29.4 sprint-governance (TraceAudit.assertSprintAuthorized, tier-2 audit-anchor; +one-Sprint-per-number), S30 AgentMessage R30.1-4 (Class AgentMessage/AgentMailbox, async no-keystroke mailbox = fix for otmux staging pain).

## STANDING PDCA DISCIPLINE
measure-not-message · criteria-not-counts · gate-on-CONSERVATION (re-baselined to disk) · repair-scope=gate-scope · plan-gate+post-apply-reassert · verify with an INDEPENDENT tool/METHOD (raw-grep the ref, not the parsed slot you wrote) · full-uuids-never-8char-prefix · reuse-on-stable-identity (file/uuid, not name) · "at-least"=floor.

## OPEN
- User task PENDING: "each Class json traces to its puml + impl as an ior" — measured: 117 Class units, 76 have sourceFile(impl-ior), 0 have puml. Gap. Fold into R27.5 registry (Class ref-slots: sourceFile=impl + add puml slot).
- (D) legacy no-chain reqs (52; design-notes/legacy-no-chain-reqs-triage.md) — PO DEFERRED to Tron post-rewind.
- Federation T26.1/2/3 PDCA pending. R27.6/S28 dangling residual.
- Diagrams: scenario-chain .puml+.svg generated for 16 sprints (committed). plantuml render <dir> (OOSH wrapper, non-recursive; wraps odocker+seccomp).
