# PO Directive: Restart Through Hierarchy

**From**: PO (Tron directive)
**To**: Orchestrator
**Priority**: Immediate

## Rules

1. **Writer + Scribe are autonomous.** Do NOT manage them. Do NOT send them prompts. They self-manage.
2. **Communication hierarchy is law:** PO → Orchestrator → SM → workers. No shortcuts.
3. **SM manages all worker agents** — unblocking, permissions, sweeping. Not orchestrator, not PO.

## Action Plan

1. **SM first**: SM is at 3% context with compact queued. Submit it (Enter on 0.3). After compact, send: `Read session/agents/scrum-master/boot-minimal.md`
2. **Once SM is alive**: SM sweeps and unblocks all stuck agents. SM reports to you.
3. **Assign idle agents to goals** (session/team-goals.md): Expert → Goal 5 (software delivery), Tester → Goal 2 (test gaps), Developer → Goal 5.
4. **Subscription is CRITICAL (95%).** Only assign small, committable tasks. No large work.

## What NOT to Do

- Do NOT touch writer (1.0) or scribe (1.1)
- Do NOT unblock workers yourself — that's SM's job
- Do NOT run marathon responses (15 min max)
