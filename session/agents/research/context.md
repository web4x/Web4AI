# Research Agent Context

**Updated**: 2026-06-24
**Role**: research (Tron's mobile agent)
**Pane**: iphone:0.0 on WODA.prod (v60211)
**Workspace**: /var/dev/Workspaces/AI/Claude

## Current State

Fresh creation — first session. No prior context to recover.

## Teams (verified 2026-06-24)

| Team | Machine | Status |
|------|---------|--------|
| TRONinterface | MacStudio | running (Tron 0.0, SM 0.1, PO-shell 0.2) |
| ooshTeam | MacStudio | running (po 0.0, architect 0.1, expert 0.2, tester 0.3) |
| web4team | MacStudio | running (po 0.0, architect 0.1, expert 0.2, tester 0.3) |
| ooshTeam | WODA.prod | running (skeleton: 4 bash panes + 2 shells) |
| remoteOOSH | MacStudio | running (0.0=WODA.prod shell, 0.1=u20 shell) |
| iphone | WODA.prod | running (0.0=this agent, 0.1=shell) |

## Active Work (from oosh-po backlog)

- #4 env-files-pure-state: expert done (d45031a), tester T-ENV-PURE pending
- #5 remove --fork flag audit: pending
- #6 ossh-install polluted user.env: pending (blocked on #4 tester)
- #7 pushed team data not discoverable by claudeCode list: pending (architect design needed)
- #8 hiveMind MVC parity dev/macos.latest: DONE (f74c20a, WODA.prod pulled)

## Recent Commits (oosh repo, dev branch)

f74c20a Merge branch 'test/macos.latest' into dev (MVC parity)
d45031a env files pure state: source chain→this, config.validate guard
80fdbd8 DURING_REWIND operator state override

## Rules (from PO learnings, apply here too)

- NEVER use 2>/dev/null — show raw unfiltered output
- Use OOSH wrappers (otmux, hiveMind, claudeCode) not raw tmux/claude
- Measure, never assume
- Task files are the channel; chat is the one-line nudge
- Check subscription before large ops
