# OOSH Tester Agent — Session Context

**Updated**: 2026-07-13 (POST-REWIND anchor — replaces 20-day-stale 2026-06-22 save)
**Role**: oosh-tester
**Host**: WODA.prod (v60211.1blu.de)
**Pane**: ooshTeam:0.4 (%4, active) — re-derived from tmux, NOT the stale title/env
**Session UUID**: 74f27969-2261-4556-9e82-dd059d7a1708
**Test shell**: ooshShells:0.0 (CURRENT-test-ok) — reaped redundant ooshShells:0.1 scratchpad this boot

> ⚠️ The prior context (pane ooshTeam:0.3, MacStudio, branch test/macos.latest) was 20 DAYS STALE.
> The world moved: I am now on WODA.prod, ooshTeam:0.4. Measure before trusting any saved path.

## CURRENT plan PATH
- oosh repo `/root/oosh`: HEAD **c453bbe** @ branch **mcdonges.latest**
- Local generic `sprints/sprint-1/` (c2 + mycmd completion improvement) is the OLD Jul-7 sprint.
- **LIVE sprint is oosh-po-driven** (task-18, [C]/[S] case numbering, S3 a/b) — not committed to a
  findable `scrum.pmo/sprints@WODA.prod/` yet. **CONFIRM exact case defs with oosh-po (ooshTeam:0.0)
  on re-engage** — do not replay from memory.

## Currently driving (QA)
- **c2 completion cross-platform quote fix** — HEAD c453bbe (c2.get.function.declaration: bash #-parse
  + `printf %q` for source-safe declares; fixes Linux unquoted-value + GNU-xargs apostrophe split).
  - Test gate: `test/test.c2` **T-QUOTE-1/2/3** (lines 336–382): no bare `'''` line, sources without
    error, METHOD_PARAMETER non-empty after apostrophe-desc method. Guard commit 6782c6a.
  - Run: `cd /root/oosh && test.suite run c2 1` (or filtered T-QUOTE).
- **My assignment per oosh-po pane**: `tester → [C] cases (04/05/10/11/12)`.

## Open gates / blockers (from oosh-po pane, this boot)
- At oosh-po's gate: **task-18 (PO-PASS)** · **7 [S] cases (PO-PASS)** · **S3 a/b**.
- Bottleneck: **expert's config.save landing** — oosh-po gates + dispatches on that report-back.
- oosh-po at 592.7k tokens (~59% of 1M) — healthy but watch.

## Recent commit hashes (BOTH repos)
- oosh `/root/oosh`: **c453bbe** @ mcdonges.latest (c2 quote fix, T-QUOTE-2/3)
  - prior: 6782c6a (test.c2 T-QUOTE-CORRUPTION gate), def45a7 (c2 apostrophe fix port)
- AI/Claude session `/var/dev/Workspaces/AI/Claude`: **cde50f4** @ main

## Team layout (WODA.prod, measured this boot)
```
ooshTeam:  0.0 oosh-po@WODA.prod (592.7k)  0.1 scrum-master  0.2 oosh-architect
           0.3 oosh-expert  0.4 oosh-tester (ME)  0.5 BUG6-verify
ooshShells: 0.0 CURRENT-test-ok (my test runner)
baseTeam:  0.0 agent-trainer   Temple: 0.0 ARON   robbinTeam2: robbin-* (0.0-0.7)
```

## Known infra note
- `/dev/tty: No such device` on headless invocations (BUG 3 LOG_DEVICE) — run oosh tools with
  `LOG_DEVICE=/dev/null` prefix when capturing/dispatching from Bash to avoid the tty error.
- `otmux pane.self` method does NOT exist in current otmux (only `pane.history`) — get self-pane via
  `tmux list-panes -a` %ID map instead.

## Recovery Steps (boot order — per session/base-skills/agent-rewind.md)
1. `otmux pane.history <self>` + `ls sprints*` FIRST — measure the world before trusting this file.
2. Reap stray shells (kill unneeded ooshShells panes — they regrow context).
3. Re-engage oosh-po (ooshTeam:0.0) for the LIVE [C]-case definitions + current gate.
4. Run filtered tests: `cd /root/oosh && test.suite run <script> 1 <T-filter>`.
