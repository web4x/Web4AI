# OOSH Expert Backlog

## URGENT POST-REWIND (still open after pre-rewind work)

- [x] **`hiveMind team.migrate <session> <host>` SHIPPED** — commit `dc0cc00`. Found pre-existing uncommitted implementation from earlier rewind cycle of this agent; added missing `protected.team.import` callee. NOT integration-tested with real remote — tester handoff needed.
- [ ] **Integration test team.migrate** — tester needs to migrate ooshTeam to a test remote, verify only that session lands, verify remote's other teams preserved.
- [ ] **git pull both repos** — workspace already up-to-date; ~/oosh dev was 1 commit ahead but not on my branch. Verify on next boot.

## ACTIVE — Sprint 1 in-flight

**Sprint 1 — State Correctness Architecture**
- Design: `scrum.pmo/sprints/sprint-1-state-correctness/sprint-1-design.md`
- Planning: `scrum.pmo/sprints/sprint-1-state-correctness/planning.md`

### Shipped 2026-05-15 → 2026-05-18 (this rewind block)

- [x] SC-C.8+C.9+C.10 (`654e9ac`) — team.created/destroyed/restored handlers — SC-C epic CLOSED (10 events × 25 handlers)
- [x] Tron P0 #1 (`af2f76b`) — send.prefix registry-only (drop HIVEMIND_ROLE env)
- [x] Tron P0 #2 (`3672559`) — send empty/whitespace no-op (prevent agent hallucination)
- [x] Tron P0 DRY (`1276e58`) — `this.isEmpty` kernel predicate, applied to 8 send paths
- [x] Tron P0 #3 (`6231b93`) — send.prefix uses TMUX_PANE (subprocess-safe self-pane)
- [x] SC-E.1 (`42b84c5`) — ingress audit findings (65 methods, 13 CRITICAL)
- [x] SC-E.2 P1 predicates (`1b759c5`) — this.isPaneTarget / isSessionName / isRoleName / isUuid / isPipeSafe
- [x] SC-E.2 P1 team+pane (`c1ecf3f`) — team.remove + registry.remove + agent.spawn
- [x] SC-E.2 P1 observer (`a7f5cb0`) — protected.session.renamed + panes.swapped + pane.moved
- [x] SC-E.2 P1 rename (`085f621`) — agent.rename
- [x] tronMonitor.fit (`fe82d9c`) — tiled-layout sizer (12 doc rows verified live)
- [x] docs symlinks (`b153f1d` in dev.claude) — oosh-architecture.md + context-schema.md
- [x] otmux.fit (`9ba871c`) — snap window to caller terminal
- [x] otmux size.unlock/lock/status aliases (`81789b2`) — shorter verbs, defaults to current session
- [x] otmux fast-path Tier 1+2 (`a68db7c`) — status() + tree() A+B+C → 40s→1.1s (37×)
- [x] otmux fast-path Tier 3 (`97b3020`) — tree.detailed() A+B+C+D

### Outstanding — expert P2/P3 (SC-E.2 continuation, awaits PO greenlight)

- [ ] **team.setup** / **team.setup.oosh** / **team.setup.full** — session regex (W-class, creates new tmux sessions from caller input)
- [ ] **team.switch** / **team.activate** — session regex; reject session that is neither in tmux nor registry
- [ ] **otmux.session.rename** — both args regex + pipe-safe BEFORE firing `protected.session.renamed` (the observer was hardened in `a7f5cb0` but its caller wasn't)
- [ ] **tronMonitor.add** — add allowlist regex on top of existing `__test_*` blocklist
- [ ] **tronMonitor.remove** — regex + pipe (idempotent, low risk but still write-class)
- [ ] **hiveMind.delegate** — role-name regex (constructs filesystem path for task file)
- [ ] **hiveMind.roles.list.uuids** — role regex (filesystem traversal risk if role contains `/`)
- [ ] **claudeCode.join.byID** / **fork.byID** — UUID regex (currently relies on Claude failing on invalid input)
- [ ] **claudeCode.join.byPane** / **fork.byPane** / **fork.to** — pane regex
- [ ] **SSH-host accepting methods** — `teams.migrate`, `team.pull`, `task.delegate`, `agent.restart.remote` — sshHost regex (command-injection-class concern). Need `this.isSshHost` predicate too.
- [ ] **otmux.kill** — session regex (destructive but only user-initiated)

Pattern: one commit per ingress class (team / pane / observer / send / remote) per the SC-E.2 P1 precedent.

### Outstanding — tester handoffs

- [ ] **SC-E.3 (tester)** — 3-vector reject per ingress for the 7 P1 fixes. Test stanzas:
  - (a) bad-regex (e.g. `1bad`, `a b`, special chars)
  - (b) pipe-in-name (`team|x`)
  - (c) ghost-identifier (session/pane/role doesn't exist)
  - Predicates testable in isolation: `this.isPaneTarget '%4' && echo yes`
- [ ] **SC-C.tests (tester)** — handler integration across all 10 events; verify each handler runs, idempotency under repeat emission, dispatch stability
- [ ] **SC-A.3 / SC-B.3 / SC-D.3 (tester)** — invariant fixtures + handler isolation + reconcile roundtrip (still pending from earlier sprint)

### Architect spec corrections (cosmetic, sent 2026-05-16)

- [ ] `docs/send-prefix-spec.md` row 12 (queue.drain) — wording fix: "Raw text stored; prefix applied at drain time via send.smart" (current "Text was prefixed when queued" is misleading)
- [ ] `docs/send-prefix-spec.md` broadcast row — "iterates send.message (→ agent.send)" (current "iterates agent.send" is true-in-effect but indirect)

## Open Bugs / Open epics

- [ ] **hiveMind protected.agents.discover internal cost** — 57s for 6 panes. Bottleneck on tree.detailed. Out of oosh-expert scope; SC-F territory (snapshot integrity) or new dedicated epic.
- [ ] **JSONL stdin fd3** — some reads fail with fd3 redirection
- [ ] **Fork project dir** — forked sessions may cd to wrong project directory
- [ ] **agent.restart pane safety** — ensure.pane should verify pane is empty before sending
- [ ] **tronMonitor multi-instance** — derive screen name + env file from monitorPane
- [ ] **agent.monitor → tronMonitor switch recursion** — mitigated via timeout (`f5bc1b8`); full fix queued

## Closed prior sprints — see context.md "Delivered" tables for cumulative history

Sprint 0 (lifecycle consolidation) — CLOSED.
Sprint 1 SC-A/B/C/D — CLOSED via earlier commits + this batch (SC-C closed today).
Sprint 1 SC-E P1 — CLOSED today.
Sprint 1 SC-E P2/P3 — pending.
Sprint 1 SC-F (snapshot integrity), SC-G (docs) — not yet started.
