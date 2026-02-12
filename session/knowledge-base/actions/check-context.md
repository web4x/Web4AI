**Automated**: `claudeCode context.check <pane>` — CMM3

# Action: Check Context Health

1. Run `claudeCode context.read <pane>` — get JSONL percentage
2. If available, note TUI bottom bar percentage (via pane capture)
3. Run `claudeCode context.velocity <pane>` — get tokens/hr and time-to-compact
4. Log to `session/context-burn-log.md`: time | % | state | velocity
5. If < 25%: alert peer immediately
6. If < 10%: trigger seamless compact (see compact-peer.md)

Never say "healthy" without data. Never panic without measuring.
