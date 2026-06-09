# Claude Code Memory

## Core Principle
**Learning = maintaining a WODA-organized knowledge base of .md files with references.**
Not bullet points in one file. Structured topics, each W-O-D-A, cross-referenced.

## WODA Pattern
- **W**hat: Identity, goal, problem statement
- **O**verview: What I know, organized (failures, rules, constraints)
- **D**etails: Reference data, commands, file paths, protocols
- **A**ctions: Recovery steps, task lists, what to do next

## Key Files (claudeWoda session)
- `session/woda-kb.md` — WODA knowledge base (7 topics)
- `session/woda-scribe.learnings.md` — Scribe learnings (WODA format)
- `session/wodaScribe.context.md` — Session state
- `session/cmm.improvement.md` — CMM improvement pipeline
- `session/context-burn-log.md` — Context burn rate data

## Feedback
- [Never source OOSH scripts](feedback_no_source_oosh.md) — only env files may be sourced; use CLI invocation
- [Source user.env for PATH](feedback_source_user_env.md) — source ~/config/user.env to get homebrew bash 5 on macOS
- [Commit message style](feedback_commit_messages.md) — one-liners with task file reference, details in task file
- [PO delegates, never debugs](feedback_po_delegate_not_debug.md) — write bug reports, don't trace code internals
- [Delegate with report-back](feedback_delegate_report_back.md) — every directive must tell the agent to report completion to robbinTeam:0.0
- [CMM4: communicate via task refinement](feedback_cmm4_task_refinement.md) — refine the task file collaboratively until the spec is consistent enough to delegate; the file IS the channel, not chat
- [Route every requirement to req](feedback_route_every_requirement_to_req.md) — every Tron requirement → req for literal capture immediately; split multi-part directives into all their requirements
- [Shipping = version bump + sw.js bump](feedback_version_bump_ships_to_pwa.md) — a change is NOT shipped to Tron's PWA without BOTH package.json + sw.js CACHE_NAME bumped; PO/planner verify before testing-done
- [New routes → sw.js STATIC_SHELL](feedback_new_routes_in_static_shell.md) — every new SPA route/bundle goes into sw.js STATIC_SHELL in the same commit-set, or PWA serves stale bundle for that route even after the version+cache bump
- [QA is never the issue](feedback_qa_never_the_issue.md) — drive every dep chain to QA-state; never gate dev on Tron's QA sign-off; QA is HIS cadence, not a blocker — every new SPA route/bundle goes into sw.js STATIC_SHELL in the same commit-set, or PWA serves stale bundle for that route even after the version+cache bump
- [Every report → next action](feedback_every_report_to_next_action.md) — on EVERY inbound report: note + DERIVE the next 4-role action + ROUTE it same turn; continue until goal (req delivered + verified + Tron-QA'd), never stop after a report
- [Compact false-alarm + prevention](feedback_compact_false_alarm_and_prevention.md) — never tell an agent its context% (auto-mode self-/compacts); queued /compact text ≠ executed compact; don't relay another agent's claim as root cause without evidence
- [No output filtering](feedback_no_output_filtering.md) — NEVER use 2>/dev/null, | head, | tail, | grep on output; show raw unfiltered
- [Use expert shell](feedback_use_expert_shell.md) — tty-sensitive cmds (ssh login, OSC 52, brew prompts) go to paired expert-shell pane via otmux, not Bash tool
- [Expert does not test](feedback_expert_does_not_test.md) — tester owns test execution; expert REVIEWS test code, never runs tests or drives tester's shell
- [web4team pane layout](feedback_web4team_pane_layout.md) — 0.1=expert, 0.2=tester shell (don't touch), 0.3=expert shell, 0.4=tester
- [Web4 shell init](feedback_web4_shell_init.md) — must `bash --init-file source.env` from UpDown root for web4 commands on PATH
- [Version convention](feedback_version_convention.md) — never modify x.x.x.0 (prod); dev work on x.x.x.1+; new components start at x.x.x.0
- [Never compact agents](feedback_never_compact_agents.md) — agents own their context lifecycle; PO never compacts or /clears them; recovery = agent-trainer rewind
- [Coordinate team health](feedback_coordinate_team_health.md) — PO+SM+agent-trainer: proactive context-write + CMM4-recoverable rewind (never compact) until all delivered
- [Task file first](feedback_task_file_first.md) — WRITE task file with exact spec BEFORE sending otmux directives; never relay requirements via chat
- [Use sleep for wakeups](feedback_use_sleep_for_wakeup.md) — ScheduleWakeup doesn't fire; use `sleep N && echo` in background Bash
- [SM unblocks POs only](feedback_sm_po_only_unblock.md) — report non-PO blockers to PO for review, never unblock directly
- [TaskStop kills background shells](feedback_taskstop_background.md) — "N shells" in status bar = stale background tasks; use TaskStop to kill, never claim they can't be stopped
- [No background sleep monitors](feedback_no_background_sleep_monitors.md) — never spawn one sleep timer PER delegated task to poll agents; rely on self-reports + completion notifications. (Refines "use sleep for wakeups": a single resume-wakeup is OK, ~112 monitoring timers is not)

## Project
- [MacStudio workspace paths](project_macstudio_paths.md) — UpDown is at workspaces/UpDown/, not /var/dev/UpDown/

## Reference
- [RawBin traceability standard](reference_rawbin_traceability_standard.md) — scrum.pmo/standards/traceability-standard.md; UUID chain req→uc→puml→method→test; Web4Articles-derived

## Hard-Won Rules
- `otmux send` is unreliable — ALWAYS verify with pane.capture after
- Checklists/task lists ARE wisdom — read regularly, not just after compact
- Validate measurement tools BEFORE building systems on them (CMM4 theater lesson)
- ACT on stuck peer, don't just report — "standing by" = death
- READ permission prompt options before sending a number
- JSONL for trends, TUI % for compact decisions — they disagree, both useful
- NEVER ASSUME — ALWAYS MEASURE. assume = ass|u|me. Run `claudeCode context.read` before panicking about context %
