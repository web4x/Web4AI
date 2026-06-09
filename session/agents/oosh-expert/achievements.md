# Achievements

## 2026-05-26 — Post-Sprint 1 bug-fix wave + CMM4 directive

SM established CMM4 communication directive: all work flows through `session/tasks/<task>.md`. Brief pane messages point to files; details live in files. Adopted immediately for all subsequent work.

**4 expert commits this day:**

- `82213a6` hiveMind agent.send — queue/deliver feedback visible at default log level. Bug appeared as "send to window 1 arrives wrong pane" — investigation showed window-number was a red herring; real bug was `info.log` gating queue feedback above default LOG_LEVEL. Operator silent-routing → "message lost" perception. 9+/2-, single-commit fix.
- `4338d2c` c2 apostrophe pipeline strip — single sed insertion in `c2.get.function.declaration` fixed Tab completion for 9 methods at once. Root cause: `line.format`'s xargs parser broke on `'` in doc comments (e.g. "caller's"), producing malformed `current.method.env` → completion fallback → filename garbage like "pletion on" from `.bashrc.bak.without.completion`. PO: "1 line fixed 9 methods. Nice."
- `da48c11` otmux layout.dynamic — restore current-window panes to dynamic sizing + tiled layout. 3 architect questions self-resolved via codebase study (size.unlock + size.lock.remove provide all primitives). 47+/0-, single method + completion.
- `3a4bfbc` sweep.detect scrolled-history catch — 29 lines added on the idle path. Wider 200-line capture scans for rate-limit/subscription-limit/api-error markers that scrolled past the 20-line visible window. Catches the recurring "agent quietly stuck on rate-limit, sweep sees IDLE" bug. New detail field `scrolled-history` gives observability.

## 2026-05-25 — Sprint 1 closure (8 commits this session)

| # | Commit | Task |
|---|--------|------|
| 1 | `1b2d59b` | SC-H.2 Gap A defer-probe pattern (sessions.env coverage race fix) |
| 2 | `aed6810` | D5 tronMonitor stale read-only client cleanup (5 wire sites) |
| 3 | `2a61072` | SC-F.1 snapshot version field + 4 reader gates |
| 4 | `c06eb80` | SC-F.2+F.3 snapshot row validation save+restore (bundled) |
| 5 | `317e0d7` | SC-E.2 hiveMind P2/P3 ingress + new `this.isSshHost` (9 sites) |
| 6 | `2b4e4c7` | SC-E.2 otmux+tronMonitor P2 (4 sites) |
| 7 | `5be0eeb` | SC-E.2 claudeCode P3 (5 sites) |
| 8 | `4af9e99` | SC-G docs — state-stores.md + invariants.md + architecture update |

Tester landed 40 tests across 4 confirmations: Gap A (`7a5e2bc` 8), D5 (`1427be6` 8), F.2/F.3 (`e3b223a` 10), SC-E.2 (`b951b52` 14). All Sprint 1 epics CLOSED.

## 2026-05-15 → 2026-05-18 — Sprint 1 mid-flight (16 commits)

Tron P0 prefix-correctness wave (4 commits), SC-C event handlers (1 commit closing the epic at 10 events × 25 handlers), SC-E ingress audit + P1 defense (4 commits), otmux fast-path 40s→1.1s (2 commits), tronMonitor.fit + otmux.fit + size aliases (3 commits), docs symlinks. Detailed in `boot.md` URGENT section and `context.md`.

## 2026-04-25 → 04-27 — Sprint 0 continuation

8 commits closing Sprint 0 expert work:
- C1 hiveMind cold-start restore (teams.save/restore composing B2 layout + 8-field schema + polling)
- F3 scrumMaster subscription API resilience (429/network/5xx → cache + stale flag)
- A1.2 view-leak fixes (raw tmux → otmux, pure parser extracted, duplicate method removed)
- B4.1 attach readonly + B4.2 window-size largest

Test results: claudeCode 125/201 (62%), hiveMind 337/376 (90%). No regressions.

## 2026-04-24 — Sprint 0 Lifecycle Consolidation (14 commits in one session)

**Critical fixes**: G1 per-session max_tokens detection (1M vs 200k), D1.4-D1.9 six tronMonitor bugs, B3.1 otmux pane.lock idempotent.

**New capabilities**: B2 otmux layout.save/restore, D1.10 tronMonitor recipe rewrite, D2.1/D2.2 hiveMind→tronMonitor observer events, F1 scrumMaster velocity time-series.

**Audits** (deferred fixes pending tester): A1.1/A1.2 68 claudeCode method classification, A2 12 portability tests, B1 5 otmux leak catalog, C1 9 cold-restart gaps, C3.2 25 sweep.detect fixtures.

## 2026-02-12 — Pane Border Headers (team milestone)

Implemented tmux pane-border-status feature. Panes show agent names in borders. Primary credit + congratulations from Tron and PO.
