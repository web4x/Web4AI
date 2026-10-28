# OOSH Tester — context anchor (PRE-REWIND PHASE-1 bank, 2026-10-28 @~82% used by context.read own pane — STOPPED AT BOUNDARY, step 5 NOT started)

**Identity:** oosh-tester @ WODA.prod, pane **ooshTeam:0.3** (moved 10-28 from 0.4; 0.4 is now a bare shell), uuid **74f27969-2261-4556-9e82-dd059d7a1708**.
**Live layout 10-28:** oosh-po 0.0 · oosh-architect 0.1 · oosh-expert 0.2 · me 0.3. Trainer = baseTeam:1.0 (moved 10-28; baseTeam:0.0 = the SM). Address agents BY ROLE — resolve via `otmux pane.list` / `otmux tree` before every send, never a remembered pane (my phase-2 report misrouted to the SM this way).
**Boot (measure the world first):** reread this + `session/base-skills/agent-rewind.md`; `otmux pane.self` + `git -C /root/oosh log` + `ls`. Do NOT replay scrollback. **Before EVERY send: `scrumMaster rewind.list` as its OWN step, then `otmux composer.state <pane>`.**

## ★ CURRENT STATE — gate queue (PO order, 10-28)
**FIRST on every gate: `readlink -f /root/oosh` must end in `Once.sh/mcdonges.latest`** (at 14:09 it was silently repointed to Once.sh/dev = a tree with NONE of today's fixes; Tron: accident, restored). Deployed = test/mcdonges.latest @ cd1b0c80.
1. DONE — deployed re-gates on cd1b0c80: Rule-2 T-SWIPE-ROLE-LIVE 53/0 (was 48/5) + Rule-4 T-SWIPE-ACTIVE-NARROW 34/0 (was 20/14). Proof 5f409c8db.
2. DONE — creds decoys a9aec9ca: 4/0 (10/11 unscoped RED + decoy picked, scoped GREEN; controls 1/5 GREEN). Proof 52958b55e; instrument scratchpad/check-decoys.sh (sha256 only).
3. NEXT — Step 5 = oosh-expert/otmux-observer-rc @4e3bb84b (otmux only): observer failure WARNs (verb+args+rc+stderr), rc passthrough, healthy=no warn, no hiveMind on PATH -> rc0, + a panes.shifted SPLIT cell. Expert harness: /tmp/claude-0/-var-dev-Workspaces-AI-Claude/a43c1b23-7de6-4c75-8952-3e98b6ca43b6/scratchpad/verify-obs.sh (fake failing hiveMind on PATH).
4. Pulse-removal branch oosh-expert/remove-pulse = 6c4e3165 (pulse deleted, rewind.mark/unmark/list kept) + b2c024ff (swipe FULL role@host names, display only). Tasks: retire test.swipe-parity; repoint/retire test.pulse-jsonl-lag; fix test.session-discover-all cell 7; test.swipe-role-live cells 4/9 drop pulse copy, cells 1-3 expect role@host in swipe OUTPUT (unit U/9 still BARE); ADD bare-role-routing-unchanged cell (C8 prefix + resolve bare); no-@host title -> registry name. Gate: `scrumMaster pulse` refused (assert MESSAGE, OOSH unknown-verb exits rc0), sandboxed mark->swipe DURING-REWIND (agent rows only)->unmark clears, static: no caller of scrumMaster.pulse. test.swipe-active-narrow also uses pulse -> repoint.
5. test.no-python RED (design session/tasks/no-python-in-oosh.design.md d1fbf3729 + 1edecb65a + 2ce3cd6b2): grep python3/python -/python -c/-m json.tool over scripts+tests == 0; EXEMPT opy, osemvec (+ guard: every interpreter under OPY_VENVS, no bare python), otest (until node port), restore/. test.osemvec NOT exempt (L40/53/105 json.tool -> awk structural check; golden first). Invert test.scrumMaster.measure T22 to python3 ABSENT only (jq ALLOWED). Goldens: expert batch 1 at oosh-expert/no-python-goldens @f9289f9f test/fixtures/no-python/ (77; touch input before context.from.jsonl, 600s stale guard).
Also queued: drain-guard RED (expert oosh-expert/queue-drain-repoint @86341c2f, 8 cells; needs otmux pane.role from e94ed866 on PATH; forced rc!=0 mock; NEVER touch /root/config/hivemind.queue).

## Closed today (deployed-green, differential-proven; proofs session/tasks/T-*.proof.txt)
claudeCode validators 09e2cd71 33/0 (was 23/10) · hiveMind validators 74fa844d 21/0 (was 7/14) · Rules 1+3 a21b4d1b T-SWIPE-ROLE-LIVE 48/3 (was 18/33; only Rule-2 cells red) + swipe-parity 4/0 · standing gate T-STATIC-DEFINED-FUNCTIONS 8d9906b8 (fleet 70 -> 20 undefined calls; raw per-site list f1d211aac; architect reconciled).

## Repos / HEADs (DISK WINS)
- oosh `/root/oosh` test/mcdonges.latest @ **1088e0f3** (my tests: swipe-role-live, claudeCode-validators, static-defined-functions, hiveMind-validators, swipe-active-narrow). test/gen/ = untracked per-run scratch.
- AI/Claude main, my last a892bc6a2. PATH-LIMITED commits (`git commit -m .. -- <path>`): shared index — a peer once swept my staged file (0721c6555).

## METHOD
RED-first on DEPLOYED; green counts only with measured delta (only the fixed file changed, test file identical). Prove the instrument both ways: differential vs control trees (run from worktrees so OOSH filenames keep dispatching), every positive cell asserts the effect LANDED (no vacuous pass), whole-fixture render checks, in-pane steps pin the tree under test. Disclose blind spots + perf. Sandbox HOME/CONFIG_PATH/HIVEMIND_REGISTRY; sha256 live roles.env before==after. Fixture prefixes pre-swept.
