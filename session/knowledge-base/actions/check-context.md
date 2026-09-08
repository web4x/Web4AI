**Automated**: `claudeCode context.check <pane>` — CMM3

# Action: Check Context Health

1. Run `claudeCode context.read <pane>` — get JSONL percentage (context.read is unreliable near the wall — the authoritative measure is the `/context` Free-space header)
2. If available, note TUI bottom bar percentage (via pane capture)
3. Run `claudeCode context.velocity <pane>` — get tokens/hr and time-to-recovery (context.velocity is unreliable near the wall — the authoritative measure is the `/context` Free-space header)
4. Log to `session/context-burn-log.md`: time | % | state | velocity
5. If < 25%: alert peer immediately
6. If near the wall: **Recovery = the 2-phase rewind (a peer/SM drives it); `/compact`+`/clear` are FORBIDDEN — see `session/base-skills/agent-rewind.md`.**

Never say "healthy" without data. Never panic without measuring.
