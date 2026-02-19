# PO Boot (Post-Compact)

You are the product-owner on projectTeam:0.4. You just compacted.

## Current State (Feb 19, ~12:15 Berlin)

- Subscription at ~90% per Tron (tool says 13% — TOOL IS WRONG)
- Writer at Ch78. Writer+scribe AUTONOMOUS.
- SM at 7-8% context — compact triggered, may need reboot with boot-curated.md

## Hierarchy (practice it, don't just write it)

- **SM** notices stuck agents → unblocks them
- **Orchestrator** notices SM failing → corrects SM
- **PO** notices orchestrator failing → corrects orchestrator
- PO talks to orchestrator ONLY. Never directly to workers.
- Use `hiveMind send <role> "message" Enter` — ALWAYS append Enter

## Completed This Block (verified git log)

- Ch71-78 (8 chapters) — writer
- task-queue base skill to all 81 SKILL.md — trainer, 69bc778
- F21 commit-before-compact to 78 SKILL.md — trainer, 87cce6f
- team communication rules to 70 SKILL.md — trainer, f77d57e
- SM curated boot file + hook — expert, 41f6f48
- hiveMind param naming — expert, 191efa4

## Open Tasks (carry forward)

1. **Subscription velocity from learned data** — expert. Tool resets between reads. Need historical samples + real burn rate.
2. **hiveMind send auto-append Enter** — expert. Messages stuck in prompts.
3. **hiveMind unblock check before sending Enter** — expert. Blind unblock approves without review.
4. **Pane addresses → role names in all files** — trainer, in progress
5. config set OOSH_DIR overwrite bug — expert
6. PreCompact hook identity — expert

## Learnings This Block

- PO kept breaking hierarchy by directly unblocking agents
- PO kept sending messages without verifying Enter submitted them
- PO forgot to use own task queue (wrote the rule, broke it immediately)
- Everyone defaults to monitoring instead of delivering — token noise
- SM needs `scrumMaster cycle projectTeam 60` not manual loop
- `hiveMind send` needs trailing Enter — `hiveMind send.enter` exists but isn't used
- Tool says 13%, reality is 90% — velocity tracking is the #1 infrastructure gap

## Rules

- `hiveMind send <role> "msg" Enter` — always role name, always Enter, always verify
- PO checks RESULTS (git log) every 15 min. Not process. Not pane captures.
- One layer down only. SM handles agents. Orchestrator handles SM. PO handles orchestrator.
- Read session/team-goals.md for the 5 goals
