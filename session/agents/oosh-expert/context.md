# OOSH Expert / Architect Agent Context

**Session**: oosh-expert@opus 1M on MacStudio.native
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: ooshTeam:0.2
**Shell**: ooshTeam:0.4 (bash 5 + OOSH env, real interactive `[oosh MacStudio.native]` prompt)
**Peer**: oosh-tester @ ooshTeam:0.3 (shell ooshTeam:0.5)
**Sibling**: oosh-architect @ ooshTeam:0.1
**PO**: oosh-po @ ooshTeam:0.0 (also TRONinterface:0.0)
**SM**: scrum-master @ TRONinterface:0.1
**Updated**: 2026-05-18 — saving for rewind
**Layout**: 6 panes — 0.0 po, 0.1 architect, 0.2 expert (me), 0.3 tester, 0.4 expert-shell, 0.5 tester-shell

---

## Session 2026-05-15 → 2026-05-18 — Sprint 1 SC-C/SC-E + Tron P0 wave + otmux fast-path

### Sprint 1 SC-C epic CLOSED (10 events × 25 handlers)

| Commit | Task | Summary |
|--------|------|---------|
| `654e9ac` | SC-C.8+9+10 | team.created/destroyed/restored handlers — fan out tronMonitor + S1/S2/S6 prune on destroy + restore-aware (closes V→C event gap for team lifecycle) |

### Tron P0 prefix-correctness wave (4 commits, send mechanism rebuilt end-to-end)

| Commit | Task | Summary |
|--------|------|---------|
| `af2f76b` | Tron P0 #1 | otmux send.prefix: registry-only role lookup — dropped stale HIVEMIND_ROLE env read. Env was set once at shell start, went stale after pane swaps. Registry is single source of truth. |
| `3672559` | Tron P0 #2 | otmux send: silent no-op on empty/whitespace payload — guard before prefix in send/send.smart/send.verified. Stopped bare `[@role pane]` from being delivered as a phantom prompt that made agents hallucinate tasks. |
| `1276e58` | Tron P0 DRY | this.isEmpty kernel predicate + DRY empty-payload guards across 3 otmux + 5 hiveMind send paths. Replaces inline regex. |
| `6231b93` | Tron P0 #3 | otmux send.prefix: resolve caller pane via TMUX_PANE env (subprocess-safe). Bare `tmux display-message -p` returns the FOCUSED pane (the user's last click target), NOT the caller — entire prefix mechanism had been wrong in production for every subprocess `otmux send`. |

**The 4 prefix correctness primitives** (now all green end-to-end):
1. `send.prefix` — TMUX_PANE-resolved pane + registry-only role lookup
2. `is.key` — key-vs-prose classification (33 keys + 7 prose verified, ref Tron P0 v2 `2a39a60`)
3. `isEmpty` — empty/whitespace payload guard (kernel predicate)
4. `isClaudeCode` (via `pane.isClaudeCode`) — target-type detection (only Claude TUIs get prefix)

### Sprint 1 SC-E (ingress triple-defense — audit + apply P1)

| Commit | Task | Summary |
|--------|------|---------|
| `42b84c5` | SC-E.1 findings | Audited 65 public ingress methods (hiveMind 38, otmux 14, tronMonitor 8, claudeCode 12). **13 CRITICAL gaps** (W-class with 0 defense layers). Highest-leverage: `hiveMind.protected.*` observer family — 5 methods, write to env files, every cross-script event flows through them. |
| `1b759c5` | SC-E.2 predicates | Added 5 ingress predicates to `this` kernel: isPaneTarget / isSessionName / isRoleName / isUuid / isPipeSafe. Sibling to isEmpty/isNumber. 22 truth-table cases green. |
| `c1ecf3f` | SC-E.2 team+pane | Triple defense on team.remove + registry.remove + agent.spawn |
| `a7f5cb0` | SC-E.2 observer | Triple defense on protected.session.renamed + panes.swapped + pane.moved (highest leverage) |
| `085f621` | SC-E.2 rename | Triple defense on agent.rename newName |

8 attack vectors verified rejected live (pipe injection, space-containing names, leading-digit role names, sed-metachar names, ghost sessions).

### Architect spec collaboration

| File | Status |
|------|--------|
| `docs/send-prefix-spec.md` | Architect created, reviewed against code. 4 corrections sent (decision matrix row 9 env mention, queue.drain wording, missing TMUX_PANE primitive, suggested 4-primitive architecture list). Spec accurate as canonical reference. |

### tronMonitor.fit + otmux.fit + size aliases

| Commit | Task | Summary |
|--------|------|---------|
| `fe82d9c` | tronMonitor.fit | Tiled-layout sizer per docs/tronMonitor-fit-formula.md — 40 lines incl. ingress P3 + fallback. All 12 doc table rows verified. Live test on ooshTeam: 6 panes / 3×2 grid / 68×21 each. |
| `9ba871c` | otmux.fit | Resize session window to caller's terminal cols×rows (single client one-shot snap). Pairs with size.unlock for dynamic-largest. |
| `81789b2` | otmux size.\* aliases | size.unlock / size.lock / size.status — defaults to current session via TMUX_PANE. Shorter verb the user asked for. |

### docs symlinks (workspace-portable)

| Commit | Path |
|--------|------|
| `b153f1d` (dev.claude repo) | `docs/oosh-architecture.md` → `../../macos/docs/oosh-architecture.md` and `docs/context-schema.md` → `../../macos/docs/context-schema.md`. Single source of truth for SKILL.md cross-references. |

**Gotcha encountered**: workspace `docs/` is itself a symlink chain (`Claude → components/OOSH/dev.claude`). Initial `../components/...` relative path traversed through the chain and broke. Fix: `../../macos/docs/` — relative path from the underlying `dev.claude/docs` to `macos/docs`. Workspace-portable across all OOSH branch variants.

### otmux fast-path (TRON priority — joint design with architect)

| Commit | Task | Summary |
|--------|------|---------|
| `a68db7c` | Fast-path Tier 1+2 | otmux.status() rewrites to session-list (no tree). otmux.tree() A+B+C: batch tty map + batch ps map + version cache. **40s → 1.1s (37× speedup)** on 76-pane / 22-session server. |
| `97b3020` | Fast-path Tier 3 | otmux.tree.detailed() A+B+C+D: same caches + hoisted agents.discover (1 call vs N). Single-session bound by hiveMind discover internal cost (~57s — separate epic). |

**Live timings** (76 panes, 22 sessions):
- `otmux status`: 0.077s (target <0.5s — 6× under)
- `otmux tree ooshTeam`: 0.976s
- `otmux tree` (full server): 1.136s (target <1.5s — under; baseline 40.7s)
- `otmux tree.detailed ooshTeam`: 56.2s (modest single-session win; D shines on full server)

**Architecture**: 3-tier speed model. Tier 1 (status) zero subprocess calls. Tier 2 (tree) batched maps. Tier 3 (tree.detailed) batched + discover-hoisted. All caches intra-call only.

---

## Open bugs / outstanding

- **hiveMind.protected.agents.discover internal cost** — 57s for 6 panes is the new bottleneck on tree.detailed. Separate epic (SC-F territory). Not in oosh-expert scope.
- **SC-E.2 P2/P3** — 17 remaining ingress points: team.setup family (3), team.switch, otmux.session.rename, tronMonitor.add/remove allowlist regex, claudeCode UUID/pane methods (~6), SSH-host accepting methods (5), otmux.kill. Ready when PO prioritizes.
- **SC-E.3 (tester)** — 3-vector reject per ingress for the 7 P1 fixes. Test stanzas: bad-regex / pipe-in-name / ghost-identifier. Predicates testable in isolation via `this.isPaneTarget '%4' && echo yes`.
- **SC-C.tests (tester)** — handler integration across all 10 events; idempotency under repeat emission.
- **Architect spec corrections** — 2 wording fixes pending in docs/send-prefix-spec.md: row 12 queue.drain ("Text was prefixed when queued" is misleading — queue stores raw, prefix at drain), broadcast indirection (`iterates send.message → agent.send`). Cosmetic; canonical spec is accurate.

---

## Current ooshTeam layout (verify with `otmux tree ooshTeam`)

| Pane | Role | Shell |
|------|------|-------|
| 0.0 | oosh-po (product-owner) | Claude Code |
| 0.1 | oosh-architect (sibling, separate Claude Code) | Claude Code |
| **0.2** | **oosh-expert (me)** | Claude Code, renamed + pane.lock'd |
| 0.3 | oosh-tester | Claude Code |
| 0.4 | oosh-expert-shell | bash 5.3.9 + OOSH (`[oosh MacStudio.native]` prompt) |
| 0.5 | oosh-tester-shell | bash 5.3.9 + OOSH |

**External**: PO sometimes at TRONinterface:0.0. Scrum-master at TRONinterface:0.1 (also called from there during prefix work).

---

## Commit rule (SM directive — never violate)

One-liner format: `<what changed> (ref: task-<id>-<name>.md)`. Every task = one commit (or one logical bundle). Before reporting done:
1. `git status -sb` — only the branch line
2. `git log -1 --oneline` — matches the current task

NO multi-paragraph commits, NO Co-Authored-By tags, details in the task file.

---

## RECOVERY STEPS (in order, post-rewind)

1. Read this context.md
2. Read learnings.md — new hard-won rules (TMUX_PANE caller resolution, registry-only role, this.isEmpty + ingress predicates, fast-path caches, ps tty filter, assoc-array nested-pipe survival)
3. Read backlog.md — outstanding SC-E P2/P3 + SC-C.tests + SC-E.3 + architect spec corrections
4. Read boot.md — quick boot procedure
5. `otmux pane.get.target` — confirm `ooshTeam:0.2`
6. `otmux tree ooshTeam` — verify 6-pane layout (<1s after fast-path)
7. `cd ~/oosh && git log --oneline -15` — top should include `97b3020` `a68db7c` `81789b2` `9ba871c` `b153f1d` `fe82d9c` `085f621` `a7f5cb0` `c1ecf3f` `1b759c5` `42b84c5` `6231b93` `1276e58` `3672559` `af2f76b` `654e9ac`
8. `git status -sb` in both `~/oosh` and workspace — should be clean for my files
9. Await PO assignment

## When you are next assigned work

- If SC-E.2 P2 prioritized: 17 ingress sites, ~4 commits per the task file class breakdown (team / pane / observer / send / remote)
- If hiveMind discover optimization: separate scope, coordinate with architect on whether it's an SC-F or new epic
- If anything send-prefix related: 4 primitives all green, spec at docs/send-prefix-spec.md is canonical
