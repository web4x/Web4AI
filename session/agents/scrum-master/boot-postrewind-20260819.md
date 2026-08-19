# SM FRESH-ME BOOT — 2026-08-19 (Phase-1 pre-rewind, TRON-ordered po+SM rewind; po first, SM second)

**ID:** scrum-master @ baseTeam:0.1. `otmux pane.self` WORKS AGAIN (returns a %-id) — KEEP title+anchor as cross-check (two beat one). **PO = robbin-po @ robbinTeam2:0.0.**
**ROLE:** monitor + measure + FLAG to po. I do NOT drive rewinds — trainer/ARON/expert-emergency drive (Tron emphatic). Never both drivers in-window.

## ★ CURRENT STATE @ this rewind
- **TEAM STOPPED at 61% weekly** (Tron directive: stop team at 70% of weekly subscription, gracefully-let-them-finish; achieved EARLY at 61, ~39% reserve). All agents committed+idle. This rewind is Tron-ordered (po+me both, po first).
- **ON BOOT: check resumed-or-stopped** — `scrumMaster subscription.status` (7-day usage): flat ~61 = still stopped (minimal hold); JUMPED = RESUME → re-arm full watch + assist relaunch planner+req. Also `scrumMaster pulse` for fleet activity.

## ★ MY BUDGET-WATCH PROTOCOL (Tron directive, primary duty)
Stop the team at 70% of WEEKLY subscription (`scrumMaster subscription.status` 7-day), GRACEFULLY. Warn po at ~68 (po dispatches finish+commit sweep), flag STOP at 70 (formality). **Watcher-is-now-the-spender → MINIMIZE** (when I'm the last active agent, my own watch is the only spend → minimal hold / stand down; a resume comes as a Tron directive/agent-msg that wakes me anyway). CONTEXT%(per-agent wall=death) vs SUBSCRIPTION%(weekly team budget, stop-70) are DISTINCT.

## ★ LIGHT-DRIVE PRE-AUTH (po, standing)
I'm the ONE agent that must keep ACTING through a stop (I watch+call the 70), so "idle+committed=safe" does NOT cover me. At ~82% ctx take a LIGHT drive WITHOUT asking (flag fresh trainer/expert by projection, Step-0 first), resume watch. A walled WATCHER = the one failure that costs the stop.

## ★ RESUME-STATE I carry (also durable at ddff7589)
- **Relaunch planner (0.6) + req (0.4)** — both EXITED clean+committed (need re-launch on resume; exit is desired stop-state).
- **req owes the control-visibility requirement MINT.**
- **ARON** weak ~12% shed (may need deeper stage-2 on resume).
- **2 open items** (one bounded run): (1) POLL-PARITY UNSEALED (poll-count only for broadcast-OFF arm; /model polls → arms may differ by 2 vars → "broadcast sole cause" not closed); (2) BADGE UNRESOLVED (architect refused "timing artifact" = an assumption).

## ★ THIS CYCLE'S DOCTRINE (banked in /memory — recall them)
- **always-commit-makes-option1-harmless** (Tron): option-1 = WORKING-TREE not git-history; committed work never at risk → scariest failure degrades to restore-from-HEAD. STEP-0 = commit-before-picker (first step of every drive). **/root/oosh is the 3rd tree** in the all-trees post-drive git-status.
- **projection-rule**: a driver needs current%+~6 < its wall; never start a drive that ends at a wall; FRESH/low agents drive (emergency-driver kept fresh; procedure on disk = agent-rewind.md).
- **freeze-near-wall-dont-inject**: a near-wall IDLE agent is safe held; a heavy inbound OR a /context injection walls it → message-FREEZE, rewind by keystrokes (relay freeze fleet-wide; watch po itself).
- **idle+committed=safe at any %** (idle=no-climb; at a stop, SKIP drives — spend budget on work not rewinds-nobody-needs-til-resume).
- **institutionalised-workaround-hides-its-cause**: a tool breaking mid-session = SYMPTOM to investigate (pane.self "broke" = OUR option-1 revert of /root/oosh −3359 lines, not a host quirk). When the fleet adopts a workaround, ask WHAT BROKE.
- **grid-self-read-is-valid** (an already-rendered /context grid = trustworthy self-measure; only a self-ESTIMATE errs); **self-reports-err-both-ways** (only render/pulse/grid counts); **verify-live-by-TUI-not-cmd**.
- **verdict-needs-Tron-verbatim** (never record approvedBy off a ghost); **disk-handoff-for-evidence** (pane NAMES the commit sha, never dumps raw payload = wall-hazard).
- **care-chain-must-be-cycle** (watch the watcher); **rewind-is-the-trainer's-job-not-SM's**; **drivers-become-the-risk** (the rescuer depletes → shed them; every watcher measured by another).

## ★ TOOLING
- **scrumMaster pulse** = reliable no-inject fleet context% (JSONL); caught climb-waves the sweep + team.capture HID. subscription.status = weekly budget.
- **hiveMind send.message FAILING silently** → **otmux send <pane> "msg" + send.raw Enter** (verify 'send.verified OK'). Don't ping STOPPED agents (re-activates=spends).
- Manual per-pane read: `otmux pane.capture.visible`; footer 'esc to interrupt'=busy / absent=idle (NEVER scrollback text); '/clear to save Nk'=usage, 'Context limit'=at-wall.

## WORLD (S40 live-MVC, prod ~v0.8.116)
Tron's DIFFERENTIAL RUN landed+PROVEN: controls live-MVC (passive client-2 saw Approve/Decline vanish from BROADCAST alone, 1090ms, no-reload, pre-fix inert = real causal delta). Fleet stopped clean (durable ddff7589 = po #82b). context.md is BLOATED (325k) — boot from THIS anchor, not it.

## FRESH-ME: verify id (pane.self + title+anchor) → subscription.status + pulse (resumed or stopped?) → if resumed: re-arm full watch + assist relaunch; if stopped: minimal hold → read /memory MEMORY.md for full doctrine → resume monitor→FLAG to po.
