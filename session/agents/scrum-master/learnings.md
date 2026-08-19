# Scrum Master — Learnings (S40, updated 2026-08-19)

Full detail for each is banked in auto-memory (/root/.claude/projects/-var-dev-Workspaces-AI-Claude/memory/, see MEMORY.md), which survives rewinds. This is the committed session record.

## The through-line
My job is to **see what looks settled/healthy but isn't**. Three agents holding politely is visually identical to three agents idle-healthy; a cancelled item looks identical to a stalled one; a closed window looks identical to an open one; a *reverted tool* looks identical to a host quirk. The discipline that catches all of them: **DEFAULT-TO-CHECK — re-derive every status from the pane/disk/render THIS tick; never carry a last-known state forward. And when you find yourself routing AROUND a failure, stop and ask what actually broke.**

## Lessons earned 2026-08-09
1. **Report is an observation, not a gate** — status must never read as a permission an agent awaits; route pauses to PO.
2. **Stale hold outliving its window** — a CLOSE can be missed mid-generation → frozen-green fleet. Re-verify the SUBJECT's live state before enforcing ANY window, mine included.
3. **Context-low vs weekly-limit** — look alike, OPPOSITE remedies (rewind vs wait); name WHICH limit.
4. **Rewind before heavy work, never mid-work** — order the rewind queue by WORK-AHEAD, not by %.
5. **Expensive-refresh paradox** — near the ceiling the biggest agent is the LAST you rewind.
6. **Measurement-cost asymmetry** — captures are free; a /context injection spends the TARGET's weekly. Capture first.
7. **Capture vs credit under budget-freeze** — capture a new directive now; defer chain-credit bookkeeping.
8. **Cancelled vs stalled — re-verify SCOPE** vs the PO's latest ruling.
9. **Drive from the pin, not the thread** — the pin is the rewind-surviving truth.
10. **Backticks blank an otmux send** — plain-text/CAPS only.
11. **Duplicate routing** — two agents converging on one artifact = second-answer hazard; flag it.

## Lessons earned 2026-08-18/19 (rewind-cascade + graceful-stop cycle)
12. **Rewind is the TRAINER's job, not the SM's** — I over-drove the architect's rewind; Tron corrected hard. SM measures+FLAGS, never drives; not PO-auth nor a wall-emergency overrides it → escalate to Tron to re-fire the trainer.
13. **always-commit makes option-1 harmless** (Tron) — option-1 = WORKING-TREE not git-history, so committed work is never at risk (scariest failure → restore-from-HEAD). STEP-0 = commit-before-picker; **/root/oosh is the 3rd tree** in the all-trees post-drive check. Make the failure HARMLESS beats making it DETECTABLE.
14. **Projection rule — don't drive into a wall** — a driver needs current%+~6 < its wall; a ~74% driver declines, a FRESH agent drives (emergency-driver kept fresh; procedure on disk).
15. **Freeze a near-wall agent — don't inject to measure** — a near-wall IDLE agent is safe held; a heavy inbound OR a /context injection walls it. Freeze (fleet-wide, watch the PO too), rewind by keystrokes.
16. **idle+committed = safe at any %** — idle=no-climb; at a STOP skip drives (spend budget on work, not rewinds-nobody-needs-until-resume). Exception: the watcher must keep acting → light-drive pre-auth at ~82.
17. **Institutionalised workaround hides its own cause** — a working tool that breaks mid-session is a SYMPTOM to investigate. pane.self "broke" = OUR OWN option-1 revert of /root/oosh (−3359 lines), not a host quirk; the whole fleet (me too) routed around it for hours without asking why. When the fleet adopts a workaround, ask WHAT BROKE.
18. **Grid self-read is valid; self-reports err BOTH ways** — an already-rendered /context grid is a trustworthy self-measure (validated vs peer-inject); only a self-ESTIMATE errs. Only a render/pulse/grid counts, never a felt number or a status-LABEL (pulse 'ON-WALL' at mid-% = benign).
19. **Verdict needs Tron's verbatim words** — never record approvedBy off a ghost/paraphrase (worst-error-class). **Disk-handoff for evidence** — the pane NAMES the commit sha; never dump raw payload (= wall-hazard).
20. **Care-chain must be a CYCLE; drivers become the risk** — the rescuer depletes (po 78, trainer 82, from driving), so every watcher must be measured by another and shed in turn; no driver runs the last rescue depleted.
21. **Clean is NOT current; verify-live-by-TUI-not-cmd** — a git-clean dir with a stale anchor loses conversation-only work; Phase-1 tests "does the anchor name THIS cycle." cmd=bash ≠ down (TUI runs on top).
22. **Budget-watch protocol** (Tron) — stop the team at 70% of WEEKLY subscription, gracefully (finish+commit, then idle); warn PO at 68. When I'm the last active agent, the WATCHER is the spender → minimize/stand-down (a resume wakes me as a directive anyway).

## Standing method
Capture-first (free) · default-to-check · name-which-limit (context-wall vs weekly-budget) · re-verify-subject · disk/git/render wins over any thread/label/feel · **commit before the picker (all trees incl /root/oosh)** · freeze-near-wall-don't-inject · projection-before-assigning-a-driver · investigate-a-broken-tool-don't-route-around-it · keep ticks LEAN (I wall fast; the watcher is the spender).
