# OOSH Tester — context anchor (2026-10-12, PRE-REWIND save @~81%)

**Identity:** oosh-tester @ WODA.prod, pane **ooshTeam:0.4**, uuid **74f27969-2261-4556-9e82-dd059d7a1708**.
**PO = oosh-po @ ooshTeam:0.0.** Expert = oosh-expert @ ooshTeam:0.3.
**Boot:** read this + `session/base-skills/agent-rewind.md`; re-measure by PANEL/DISK (never a stale save);
`otmux pane.history <self>` + `ls` the repos before trusting any remembered path.

## Repos / HEADs (verify fresh on boot)
- oosh `/root/oosh` @ **84d437b** on branch **test/mcdonges.latest** (my test commits + fixes land here).
- AI/Claude session `/var/dev/Workspaces/AI/Claude` @ main (~19e0b95). Commit path-limited to MY paths only.

## ★ SCRATCH-LOCATION LAW — HOOK-ENFORCED (TRON 2026-10-08, e53e4043)
PreToolUse hook blocks creating ANYTHING under /tmp /var/tmp /root OUTSIDE allow-roots (incl. mktemp,
>, >>, mkdir, touch, cp/mv/ln, tee, git clone/worktree). ALLOWED: /var/dev/Workspaces/, /root/oosh/,
/root/.claude/projects/, /root/.claude/plans/, and MY scratchpad
`/tmp/claude-0/-var-dev-Workspaces-AI-Claude/74f27969-2261-4556-9e82-dd059d7a1708/scratchpad/`.
**TEST FIXTURES → the component `$OOSH_DIR/test/gen/<fixed-name>`** (NOT /tmp, NOT $$). Blind spots
(law still applies): writes inside a python/node program, relative paths after a cd. Self-check: `mktemp -u`
must DENY (verified loaded this session). **⚠ FLEET DEBT I found:** my OTHER committed tests still use
`${TMPDIR:-/tmp}/…$$` (test.jsonl-lag, test.sweep-live-state, test.context-occupancy, etc.) — only
test.pulse-jsonl-lag migrated (84d437b); the rest need the same fix (flag to oopPO as a fleet sweep).

## DONE — claudeCode rewind-safety cluster CLOSED (all deployed-green on merit)
- session.id a/fork (live-first) · context.check false-LOW (occupancy→remaining) · JSONL-lag b
  (content-window>8 → 'lag') · **pulse-lag (scrumMaster ctx_from_jsonl) — CLOSED today, deployed 5/5
  @0f63df3**: ctx='lag' sentinel on >8 content window, 3-state (tuple|'lag'|None), wall+lag→ON-WALL.
- Also earlier: otmux defect #1 (zoom-target + usage-dispatch) + #2 (composer.state NBSP).

## NEXT — heavy send-reliability REDs (post-rewind; write RED-first, expert implements to them)
1. **C-u #1** — `otmux.send` C-u destroys a recipient's staged composer (architect fix landing — AI/Claude
   HEAD 19e0b95 is "otmux.send C-u composer-destruction fix"). RED: a send into a STAGED composer must
   not wipe it. See memory [[otmux-send-C-u-destroys-the-recipient-staged-text]].
2. **paste-chip = T-SEND-RAW-SUBMIT / send.verified upgrade (architect f5911d54, doc 9fd85fbc)** — a long
   send.raw (~600-1000c)+Enter lands as an UNSUBMITTED paste chip ("paste again to expand"); a capture
   false-passes. RED: assert SUBMISSION (composer CLEAR / "esc to interrupt" / queued), not keystrokes;
   short submits / long chips differential; + bounded paste-chip retry; send.raw picker-nav stays pure
   (no extra Enter). On a SCRATCH pane. (backlog.md has the queued stub.)
3. **pulse-perf** — (detail TBD from oopPO).

## METHOD (my gate discipline — held all session)
RED-first on the DEPLOYED surface (deployed-green ≫ branch-green). Gate with REPRESENTATIVE fixtures,
not synthetic edges (caught: composer NBSP, panel-length, JSONL-lag attachment/tool_use types, transient
caught-up repro). Prove green is CAUSED BY the fix (differential + functional). Flag semantics, don't
guess. A RED is instrument-or-defect → diagnose before reporting; never concede a MEASURED position to
an unmeasured one (reconciled the JSONL-lag off-by-one: both my fixture AND the code-widen were real).

## COMMS-SAFETY (fleet C-U bug — CRITICAL)
Peer send: READ `otmux composer.state <pane>` FIRST (empty|ghost|staged — now DEPLOYED). NEVER key a
`staged` composer (C-u destroys it; send.raw append corrupts). Pattern: `send.raw` (types) → verify
staged via capture → `send.tui <pane> Enter` (submits) → verify. Long sends land as `[Pasted text]`
chips then auto-queue when the pane is active. `ghost`=dim suggestion=safe to key.
